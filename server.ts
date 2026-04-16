import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { Ticket, Order, IncidentExtraction } from "./src/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const orders: Order[] = [
    { id: "ORD-123", customerName: "Juan Pérez", customerEmail: "juan@example.com", status: "shipped", amount: 45.99, isVIP: false, items: ["Zapatillas", "Calcetines"] },
    { id: "ORD-456", customerName: "Juana García", customerEmail: "juana@example.com", status: "delivered", amount: 150.00, isVIP: true, items: ["Abrigo de Invierno"] },
    { id: "ORD-789", customerName: "Roberto Moreno", customerEmail: "roberto@example.com", status: "returned", amount: 20.00, isVIP: false, items: ["Camiseta"] },
    { id: "ORD-101", customerName: "Alicia Verde", customerEmail: "alicia@example.com", status: "shipped", amount: 89.50, isVIP: false, items: ["Vaqueros", "Cinturón"] },
    { id: "ORD-202", customerName: "Carlos David", customerEmail: "carlos@example.com", status: "processing", amount: 250.00, isVIP: true, items: ["Reloj de Lujo"] },
    { id: "ORD-303", customerName: "Diana Príncipe", customerEmail: "diana@example.com", status: "delivered", amount: 12.00, isVIP: false, items: ["Pinzas para el pelo"] },
  ];

  const tickets: Ticket[] = [
    {
      id: "TCK-1001",
      orderId: "ORD-123",
      customerEmail: "juan@example.com",
      originalMessage: "Mi pedido ORD-123 no ha llegado todavía. Ha pasado una semana.",
      extraction: {
        orderId: "ORD-123",
        type: "delivery_failed",
        actionRequested: "Consultar estado",
        urgency: "medium",
        summary: "Cliente informa de retraso en la entrega de ORD-123.",
        isAmbiguous: false
      },
      status: "auto_resolved",
      priority: "medium",
      tags: ["delivery_failed", "medium"],
      autoResponse: "Hola Juan, hemos comprobado tu pedido ORD-123 y está actualmente en tránsito. Deberías recibirlo en un plazo de 2 días hábiles.",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "TCK-1002",
      orderId: "ORD-456",
      customerEmail: "juana@example.com",
      originalMessage: "Quiero devolver el abrigo de invierno de ORD-456. Es demasiado grande.",
      extraction: {
        orderId: "ORD-456",
        type: "return_request",
        actionRequested: "Devolución / Reembolso",
        urgency: "low",
        summary: "Solicitud de devolución por problemas de talla en ORD-456.",
        isAmbiguous: false
      },
      status: "human_review",
      priority: "high",
      tags: ["return_request", "low"],
      reasonForReview: "Cliente VIP - requiere trato personalizado.",
      autoResponse: null,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: "TCK-1003",
      orderId: "ORD-999",
      customerEmail: "desconocido@example.com",
      originalMessage: "¿Dónde está mi paquete ORD-999??",
      extraction: {
        orderId: "ORD-999",
        type: "info_request",
        actionRequested: "Info de seguimiento",
        urgency: "high",
        summary: "Consulta de seguimiento para pedido inexistente ORD-999.",
        isAmbiguous: false
      },
      status: "error",
      priority: "medium",
      tags: ["info_request", "high"],
      reasonForReview: "ID de pedido proporcionado pero no encontrado en el sistema.",
      autoResponse: null,
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
    },
    {
      id: "TCK-1004",
      orderId: "ORD-202",
      customerEmail: "carlos@example.com",
      originalMessage: "URGENTE: ¡Necesito cambiar la dirección de envío de ORD-202 inmediatamente!",
      extraction: {
        orderId: "ORD-202",
        type: "other",
        actionRequested: "Cambio de dirección",
        urgency: "critical",
        summary: "Solicitud crítica de cambio de dirección para pedido de alto valor ORD-202.",
        isAmbiguous: false
      },
      status: "human_review",
      priority: "high",
      tags: ["other", "critical"],
      reasonForReview: "Pedido de alto valor (>100€).",
      autoResponse: null,
      createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ];

  // API Routes
  app.get("/api/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  app.get("/api/tickets", (req, res) => {
    res.json(tickets);
  });

  app.post("/api/tickets", (req, res) => {
    const ticket: Ticket = {
      ...req.body,
      id: `TCK-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString()
    };
    tickets.push(ticket);
    res.status(201).json(ticket);
  });

  app.get("/api/stats", (req, res) => {
    const stats = {
      total: tickets.length,
      autoResolved: tickets.filter(t => t.status === "auto_resolved").length,
      humanReview: tickets.filter(t => t.status === "human_review").length,
      error: tickets.filter(t => t.status === "error").length,
    };
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
