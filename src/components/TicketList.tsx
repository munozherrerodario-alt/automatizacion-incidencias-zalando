import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "../types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const [search, setSearch] = useState("");

  const filtered = tickets.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.orderId?.toLowerCase().includes(search.toLowerCase()) ||
    t.extraction.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="zalando-card overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50/30 border-b border-gray-100 px-8 py-8 gap-6">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Historial de Incidencias</CardTitle>
          <CardDescription className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
            {filtered.length} registros encontrados en el sistema
          </CardDescription>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-zalando-orange transition-colors" />
          <Input 
            placeholder="Buscar por ID, pedido o resumen..." 
            className="pl-12 bg-white border-gray-200 rounded-2xl h-12 text-sm focus:ring-zalando-orange/20 transition-all shadow-sm" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[650px]">
          <Table>
            <TableHeader className="bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-8 h-14">ID Ticket</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 h-14">Pedido</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 h-14">Tipo</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 h-14">Estado</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 h-14">Urgencia</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pr-8 h-14 text-right">Creado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-32 text-gray-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-gray-50 rounded-full">
                        <Search size={40} className="opacity-20" />
                      </div>
                      <p className="font-semibold text-lg">No se encontraron incidencias</p>
                      <p className="text-sm max-w-xs">Intenta ajustar los términos de búsqueda o revisa los filtros aplicados.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((ticket, i) => (
                  <TableRow key={ticket.id} className="group cursor-pointer hover:bg-gray-50/50 transition-all border-b border-gray-50">
                    <TableCell className="font-mono text-[11px] pl-8 text-gray-400 group-hover:text-zalando-orange transition-colors font-bold">{ticket.id}</TableCell>
                    <TableCell className="font-bold font-display text-base">{ticket.orderId || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] uppercase tracking-tighter font-bold border-gray-200 bg-white shadow-sm">
                        {ticket.extraction.type === 'delivery_failed' ? 'Entrega Fallida' :
                         ticket.extraction.type === 'return_request' ? 'Devolución' :
                         ticket.extraction.type === 'resend_request' ? 'Reenvío' :
                         ticket.extraction.type === 'info_request' ? 'Información' : 'Otro'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        ticket.status === 'auto_resolved' ? 'default' : 
                        ticket.status === 'human_review' ? 'secondary' : 'destructive'
                      } className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold shadow-sm">
                        {ticket.status === 'auto_resolved' ? 'Auto Resuelto' : 
                         ticket.status === 'human_review' ? 'Revisión Humana' : 'Error'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${
                          ticket.extraction.urgency === 'critical' ? 'bg-red-500 animate-pulse' :
                          ticket.extraction.urgency === 'high' ? 'bg-orange-500' :
                          ticket.extraction.urgency === 'medium' ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${
                          ticket.extraction.urgency === 'critical' ? 'text-red-600' :
                          ticket.extraction.urgency === 'high' ? 'text-orange-600' :
                          'text-gray-500'
                        }`}>
                          {ticket.extraction.urgency === 'critical' ? 'Crítica' :
                           ticket.extraction.urgency === 'high' ? 'Alta' :
                           ticket.extraction.urgency === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-400 font-mono pr-8 text-right font-medium">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
