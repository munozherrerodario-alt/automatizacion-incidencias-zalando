import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { extractIncidentData, generateAutoResponse } from "../lib/gemini";
import { Ticket, Order, TicketStatus } from "../types";
import { Loader2, Send, ShieldCheck, UserCheck, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface IncidentFormProps {
  onProcessed: () => void;
}

export function IncidentForm({ onProcessed }: IncidentFormProps) {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<Partial<Ticket> | null>(null);

  const processIncident = async () => {
    if (!message.trim()) return;
    setIsProcessing(true);
    setPreview(null);

    try {
      const extraction = await extractIncidentData(message);
      let order: Order | null = null;
      if (extraction.orderId) {
        const res = await fetch(`/api/orders/${extraction.orderId}`);
        if (res.ok) order = await res.json();
      }

      let status: TicketStatus = "auto_resolved";
      let reasonForReview = "";

      if (!order && extraction.orderId) {
        status = "error";
        reasonForReview = "ID de pedido proporcionado pero no encontrado en el sistema.";
      } else if (!extraction.orderId) {
        status = "human_review";
        reasonForReview = "Falta el ID de pedido.";
      } else if (order?.isVIP) {
        status = "human_review";
        reasonForReview = "Cliente VIP - requiere trato personalizado.";
      } else if (order && order.amount > 100) {
        status = "human_review";
        reasonForReview = "Pedido de alto valor (>100€).";
      } else if (extraction.isAmbiguous) {
        status = "human_review";
        reasonForReview = "IA detectó ambigüedad en la solicitud.";
      }

      let autoResponse = null;
      if (status === "auto_resolved") {
        autoResponse = await generateAutoResponse(extraction, order?.status || null);
      }

      const newTicket: Partial<Ticket> = {
        orderId: extraction.orderId,
        customerEmail: order?.customerEmail || "desconocido@ejemplo.com",
        originalMessage: message,
        extraction,
        status,
        priority: extraction.urgency === 'critical' || extraction.urgency === 'high' ? 'high' : 'medium',
        tags: [extraction.type, extraction.urgency],
        autoResponse,
        reasonForReview: reasonForReview || undefined
      };

      setPreview(newTicket);
    } catch (error) {
      console.error("Procesamiento fallido", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmTicket = async () => {
    if (!preview) return;
    try {
      await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preview)
      });
      setMessage("");
      setPreview(null);
      onProcessed();
    } catch (error) {
      console.error("Error al guardar el ticket", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <div className="lg:col-span-5 space-y-8">
        <Card className="zalando-card overflow-hidden">
          <CardHeader className="px-8 pt-8 pb-4">
            <CardTitle className="text-2xl font-bold">Entrada de Datos</CardTitle>
            <CardDescription className="text-sm font-medium text-gray-500">
              Analiza mensajes de clientes en segundos con IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Simulaciones Rápidas</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Normal", msg: "Mi pedido ORD-123 no ha llegado todavía. Me gustaría un reembolso por favor.", color: "hover:border-green-500 hover:text-green-600" },
                  { label: "VIP", msg: "Quiero devolver el abrigo de invierno del pedido ORD-456. Es demasiado grande.", color: "hover:border-purple-500 hover:text-purple-600" },
                  { label: "Error", msg: "¿Dónde está mi paquete ORD-999??", color: "hover:border-red-500 hover:text-red-600" }
                ].map((sim) => (
                  <button 
                    key={sim.label}
                    onClick={() => setMessage(sim.msg)}
                    className={`px-4 py-2 rounded-xl border border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider transition-all ${sim.color} hover:bg-white hover:shadow-sm`}
                  >
                    {sim.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Mensaje del Cliente</label>
              <Textarea 
                placeholder="Pega aquí el contenido del email o chat..."
                className="min-h-[280px] resize-none border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-zalando-orange/20 rounded-2xl transition-all text-sm leading-relaxed p-6 shadow-inner"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <Button 
              className="w-full bg-zalando-black hover:bg-black h-16 text-lg rounded-2xl font-bold transition-all btn-zalando shadow-2xl shadow-black/20"
              onClick={processIncident}
              disabled={isProcessing || !message.trim()}
            >
              {isProcessing ? (
                <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analizando...</>
              ) : (
                <><Send className="mr-3 h-6 w-6" /> Procesar con Gemini</>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-7 h-full">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full"
            >
              <Card className="zalando-card overflow-hidden h-full flex flex-col">
                <div className={`h-2 ${
                  preview.status === 'auto_resolved' ? 'bg-green-500' : 
                  preview.status === 'human_review' ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                
                <CardHeader className="px-10 py-8 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">Análisis de IA</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="bg-white text-[10px] font-bold uppercase tracking-widest px-3">
                          {preview.extraction?.type === 'delivery_failed' ? 'Entrega Fallida' :
                           preview.extraction?.type === 'return_request' ? 'Devolución' :
                           preview.extraction?.type === 'resend_request' ? 'Reenvío' :
                           preview.extraction?.type === 'info_request' ? 'Información' : 'Otro'}
                        </Badge>
                        <Badge variant={preview.extraction?.urgency === 'critical' ? 'destructive' : 'secondary'} className="text-[10px] font-bold uppercase tracking-widest px-3">
                          Urgencia: {preview.extraction?.urgency}
                        </Badge>
                      </div>
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm border ${
                      preview.status === 'auto_resolved' ? 'bg-green-50 border-green-100 text-green-600' : 
                      preview.status === 'human_review' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-red-50 border-red-100 text-red-600'
                    }`}>
                      {preview.status === 'auto_resolved' ? <ShieldCheck size={32} /> : 
                       preview.status === 'human_review' ? <UserCheck size={32} /> : <AlertTriangle size={32} />}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-10 py-10 space-y-10 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">ID de Pedido</label>
                      <div className="text-2xl font-bold font-display">{preview.orderId || "No detectado"}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Acción Sugerida</label>
                      <div className="text-lg font-semibold text-gray-700">{preview.extraction?.actionRequested}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Resumen Ejecutivo</label>
                    <p className="text-lg text-gray-800 leading-relaxed font-medium italic">"{preview.extraction?.summary}"</p>
                  </div>

                  {preview.reasonForReview && (
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl flex gap-4 items-start">
                      <AlertTriangle size={20} className="text-orange-600 shrink-0 mt-1" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-orange-800">Escalado Requerido</span>
                        <p className="text-sm text-orange-900 font-medium">{preview.reasonForReview}</p>
                      </div>
                    </div>
                  )}

                  {preview.autoResponse && (
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Respuesta Generada</label>
                      <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative group">
                        <div className="absolute top-0 left-8 -mt-3 bg-white px-3 py-1 rounded-full border border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">Draft Email</div>
                        <p className="text-gray-600 leading-relaxed italic text-base">"{preview.autoResponse}"</p>
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100">
                  <Button 
                    className="w-full bg-zalando-orange hover:bg-[#e55a1e] h-16 rounded-2xl font-bold text-xl shadow-xl shadow-zalando-orange/20 btn-zalando"
                    onClick={confirmTicket}
                  >
                    Ejecutar Acción y Crear Ticket
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-gray-200 rounded-[3rem] bg-white/50">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 animate-bounce transition-all">
                <Zap size={48} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400">Motor de IA en espera</h3>
              <p className="text-sm text-gray-400 max-w-[300px] mt-4 leading-relaxed">
                Introduce una incidencia a la izquierda para que Gemini analice el caso y proponga una solución.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
