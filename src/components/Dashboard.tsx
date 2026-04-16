import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "../types";
import { CheckCircle2, AlertCircle, Clock, BarChart3, History } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  stats: { total: number; autoResolved: number; humanReview: number; error: number };
  tickets: Ticket[];
}

export function Dashboard({ stats, tickets }: DashboardProps) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Incidencias", value: stats.total, icon: BarChart3, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
          { label: "Auto-Resueltas", value: stats.autoResolved, icon: CheckCircle2, color: "bg-green-50 text-green-600", border: "border-green-100" },
          { label: "Revisión Humana", value: stats.humanReview, icon: Clock, color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
          { label: "Errores", value: stats.error, icon: AlertCircle, color: "bg-red-50 text-red-600", border: "border-red-100" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 zalando-card flex flex-col gap-4 relative overflow-hidden group`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`} />
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.color} ${stat.border} border shadow-sm`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 font-mono">{stat.label}</span>
            </div>
            <div className="text-4xl font-bold tracking-tighter font-display relative z-10">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 zalando-card overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-100 bg-gray-50/30 px-8 py-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-zalando-orange/10 rounded-lg">
                  <History size={20} className="text-zalando-orange" />
                </div>
                Actividad Reciente
              </CardTitle>
              <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest bg-white border-gray-200">
                Tiempo Real
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <History size={32} className="opacity-20" />
                  </div>
                  <p className="font-medium">Sin actividad reciente</p>
                </div>
              ) : (
                tickets.map((ticket, i) => (
                  <motion.div 
                    key={ticket.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between px-8 py-6 hover:bg-gray-50/80 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-1.5 h-12 rounded-full transition-all group-hover:scale-y-110 ${
                        ticket.status === 'auto_resolved' ? 'bg-green-500' : 
                        ticket.status === 'human_review' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div className="space-y-1.5">
                        <div className="font-bold text-base group-hover:text-zalando-orange transition-colors line-clamp-1">{ticket.extraction.summary}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-3 font-mono uppercase tracking-wider">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{ticket.id}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      ticket.status === 'auto_resolved' ? 'default' : 
                      ticket.status === 'human_review' ? 'secondary' : 'destructive'
                    } className="rounded-full px-4 py-1 text-[10px] uppercase tracking-widest font-bold shadow-sm">
                      {ticket.status === 'auto_resolved' ? 'Auto Resuelto' : 
                       ticket.status === 'human_review' ? 'Revisión Humana' : 'Error'}
                    </Badge>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-10">
          <Card className="border-none shadow-2xl bg-zalando-black text-white rounded-[2.5rem] overflow-hidden relative orange-glow">
            <div className="absolute top-0 right-0 w-48 h-48 bg-zalando-orange opacity-20 blur-[80px] rounded-full -mr-24 -mt-24 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 opacity-10 blur-[60px] rounded-full -ml-16 -mb-16" />
            <CardHeader className="relative z-10 px-8 pt-10 pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">Eficiencia IA</CardTitle>
              <p className="text-xs text-gray-400 font-medium">Rendimiento del motor Gemini 2.0</p>
            </CardHeader>
            <CardContent className="space-y-10 px-8 pb-12 relative z-10">
              <div className="flex flex-col items-center py-6">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-800"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364}
                      initial={{ strokeDashoffset: 364 }}
                      animate={{ strokeDashoffset: 364 - (364 * (stats.total > 0 ? stats.autoResolved / stats.total : 0)) }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="text-zalando-orange"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold tracking-tighter font-display">
                      {stats.total > 0 ? Math.round((stats.autoResolved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-6">Tasa de Automatización</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Ahorro Tiempo</div>
                  <div className="text-xl font-bold text-zalando-orange">124h</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Precisión</div>
                  <div className="text-xl font-bold text-blue-400">99.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="zalando-card overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-gray-50">
              <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Log de Automatización</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                {tickets.filter(t => t.status === 'auto_resolved').slice(0, 2).map((t, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 hover:bg-green-50/40 transition-colors">
                    <div className="p-1.5 bg-green-100 rounded-lg shrink-0">
                      <CheckCircle2 size={14} className="text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">
                        {t.extraction.type === 'return_request' ? 'Reembolso Procesado' : 'Info de Seguimiento Enviada'} para <span className="font-bold">{t.orderId}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono tracking-wider">{new Date(t.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {tickets.filter(t => t.status === 'human_review').slice(0, 1).map((t, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 hover:bg-orange-50/40 transition-colors">
                    <div className="p-1.5 bg-orange-100 rounded-lg shrink-0">
                      <Clock size={14} className="text-orange-600" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-800 leading-relaxed font-medium">
                        Escalada a Agente Humano: <span className="text-orange-700">{t.reasonForReview}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono tracking-wider">{new Date(t.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
