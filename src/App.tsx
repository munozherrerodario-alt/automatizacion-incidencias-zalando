/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { LayoutDashboard, PlusCircle, History, ShieldAlert } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { IncidentForm } from "./components/IncidentForm";
import { TicketList } from "./components/TicketList";
import { Ticket } from "./types";

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({ total: 0, autoResolved: 0, humanReview: 0, error: 0 });

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const handleNewTicket = () => {
    fetchTickets();
    fetchStats();
    toast.success("Incidencia procesada con éxito");
  };

  return (
    <div className="min-h-screen bg-zalando-bg text-zalando-black font-sans selection:bg-zalando-orange/20">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zalando-black rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-black/10 transition-transform hover:scale-105">
              <span className="text-xl">Z</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gradient">Zalando Logistics</h1>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] -mt-0.5">AI Automation Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">IA Guard Activo</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 ring-zalando-orange/20 transition-all">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Tabs defaultValue="dashboard" className="space-y-10">
          <div className="flex justify-center">
            <TabsList className="bg-white/50 backdrop-blur-sm border border-gray-200/60 p-1.5 h-14 rounded-2xl shadow-sm">
              <TabsTrigger value="dashboard" className="flex items-center gap-2.5 px-8 rounded-xl data-[state=active]:bg-zalando-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300">
                <LayoutDashboard size={18} /> 
                <span className="font-semibold text-sm">Panel Control</span>
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-2.5 px-8 rounded-xl data-[state=active]:bg-zalando-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300">
                <PlusCircle size={18} /> 
                <span className="font-semibold text-sm">Nueva Incidencia</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2.5 px-8 rounded-xl data-[state=active]:bg-zalando-black data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300">
                <History size={18} /> 
                <span className="font-semibold text-sm">Historial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="dashboard" className="focus-visible:outline-none">
              <Dashboard stats={stats} tickets={tickets.slice(0, 5)} />
            </TabsContent>

            <TabsContent value="new" className="focus-visible:outline-none">
              <IncidentForm onProcessed={handleNewTicket} />
            </TabsContent>

            <TabsContent value="history" className="focus-visible:outline-none">
              <TicketList tickets={tickets} />
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

