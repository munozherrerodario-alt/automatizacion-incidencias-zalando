import { GoogleGenAI, Type } from "@google/genai";
import { IncidentExtraction } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function extractIncidentData(message: string): Promise<IncidentExtraction> {
  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Analyze this customer message and extract logistics incident data: "${message}"` }]
      }
    ],
    config: {
      systemInstruction: "Eres un experto asistente de logística para Zalando. Extrae datos estructurados de los mensajes de los clientes. Si no se encuentra un ID de pedido, establécelo como nulo. Si se solicitan varias acciones, resúmelas. La urgencia debe basarse en el sentimiento y el contenido. Devuelve ÚNICAMENTE el objeto JSON. Responde siempre en español.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orderId: { type: Type.STRING, description: "Formato ORD-XXX o similar" },
          type: { 
            type: Type.STRING, 
            enum: ["delivery_failed", "return_request", "resend_request", "info_request", "other"] 
          },
          actionRequested: { type: Type.STRING },
          urgency: { 
            type: Type.STRING, 
            enum: ["low", "medium", "high", "critical"] 
          },
          summary: { type: Type.STRING },
          isAmbiguous: { type: Type.BOOLEAN }
        },
        required: ["type", "actionRequested", "urgency", "summary", "isAmbiguous"]
      }
    }
  });

  const text = response.text || "{}";
  // Clean potential markdown
  const cleanJson = text.replace(/```json\n?|```/g, "").trim();
  const result = JSON.parse(cleanJson);
  return result as IncidentExtraction;
}

export async function generateAutoResponse(extraction: IncidentExtraction, orderStatus: string | null): Promise<string> {
  const response = await getAi().models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Genera una respuesta educada y útil para un cliente basada en esta extracción: ${JSON.stringify(extraction)}. Estado del pedido: ${orderStatus || 'Desconocido'}` }]
      }
    ],
    config: {
      systemInstruction: "Eres un agente de atención al cliente de Zalando. Sé profesional, empático y claro. Si se conoce el estado del pedido, menciónalo. Si se necesita más información, pídela educadamente. Responde siempre en español.",
    }
  });

  return response.text || "Gracias por contactarnos. Estamos revisando su caso.";
}
