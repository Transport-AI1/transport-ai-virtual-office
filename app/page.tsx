"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Office3D = dynamic(() => import("../components/office-3d"), { ssr: false });
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, BriefcaseBusiness, Building2, Box,
  Check, CheckCircle2, ChevronDown, CircleHelp, ClipboardList, Command,
  Compass, FileText, LayoutDashboard, Menu, MessageSquare, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Target, Users, Wallet, X, Zap, BrainCircuit, Send, LoaderCircle, Download,
} from "lucide-react";

type Agent = {
  id: number; name: string; role: string; department: string; initials: string;
  color: string; tint: string; status: "Disponible" | "En espera" | "Revisión";
  description: string; workload: string;
};

type Task = { id: number | string; title: string; owner: string; priority: "Alta" | "Media" | "Baja"; done: boolean; status?: "Pendiente" | "Trabajando" | "Revisión" | "Error" | "Completada"; result?: string; updatedAt?: string };
type ClientStatus = "Prospecto" | "Contactado" | "Interesado" | "Propuesta enviada" | "Cliente" | "Descartado";
type Client = { id: string; company: string; contact: string; status: ClientStatus; nextAction: string; createdAt: string };

const initialAgents: Agent[] = [
  { id: 1, name: "Director de operaciones", role: "COO · Coordinación", department: "Dirección", initials: "DO", color: "#77d8d0", tint: "rgba(98,213,208,.13)", status: "Disponible", description: "Coordina equipos, prioridades y ejecución.", workload: "Supervisión general" },
  { id: 2, name: "Director comercial", role: "Ventas · Desarrollo", department: "Comercial", initials: "DC", color: "#e5bd78", tint: "rgba(229,189,120,.13)", status: "Disponible", description: "Prospección, oportunidades y propuestas.", workload: "Pipeline comercial" },
  { id: 3, name: "Marketing", role: "Marca · Comunicación", department: "Marketing", initials: "MK", color: "#c59af0", tint: "rgba(197,154,240,.13)", status: "En espera", description: "Contenido, campañas y posicionamiento.", workload: "Estrategia de marca" },
  { id: 4, name: "Relaciones comerciales", role: "Cuentas · Seguimiento", department: "Clientes", initials: "RC", color: "#86b8ed", tint: "rgba(134,184,237,.13)", status: "Disponible", description: "Relación con clientes y seguimiento.", workload: "Cartera de clientes" },
  { id: 5, name: "Ingeniero de software", role: "Desarrollo · Sistemas", department: "Tecnología", initials: "IS", color: "#71c6a2", tint: "rgba(113,198,162,.13)", status: "Disponible", description: "Webs, aplicaciones, APIs y automatizaciones.", workload: "Desarrollo de producto" },
  { id: 6, name: "Diseñador creativo", role: "Diseño · Experiencia", department: "Creatividad", initials: "DI", color: "#ed9bb5", tint: "rgba(237,155,181,.13)", status: "En espera", description: "Identidad visual, interfaces y presentaciones.", workload: "Dirección creativa" },
  { id: 7, name: "Analista de investigación", role: "Mercado · Inteligencia", department: "Investigación", initials: "AI", color: "#8bc7d8", tint: "rgba(139,199,216,.13)", status: "Disponible", description: "Análisis de mercado y competencia.", workload: "Inteligencia de mercado" },
  { id: 8, name: "Administración y finanzas", role: "Finanzas · Control", department: "Administración", initials: "AF", color: "#d8c17e", tint: "rgba(216,193,126,.13)", status: "Revisión", description: "Presupuestos, facturas y control económico.", workload: "Control financiero" },
  { id: 9, name: "Seguridad y calidad", role: "Auditoría · Protección", department: "Seguridad", initials: "SQ", color: "#a6b4c8", tint: "rgba(166,180,200,.13)", status: "Disponible", description: "Revisión de calidad, permisos y riesgos.", workload: "Control de calidad" },
];

const initialTasks: Task[] = [
  { id: 1, title: "Revisar oportunidades comerciales abiertas", owner: "Director comercial", priority: "Alta", done: false },
  { id: 2, title: "Preparar propuesta de agente para apartamentos", owner: "Relaciones comerciales", priority: "Alta", done: false },
  { id: 3, title: "Revisar experiencia de la web corporativa", owner: "Diseñador creativo", priority: "Media", done: true },
  { id: 4, title: "Analizar integraciones del sector hotelero", owner: "Analista de investigación", priority: "Media", done: false },
];

const navGroups = [
  { label: "CENTRO DE MANDO", items: [
    { id: "overview", label: "Resumen general", icon: LayoutDashboard },
    { id: "office3d", label: "Oficina 3D", icon: Box },
    { id: "director", label: "Director de operaciones", icon: Compass },
    { id: "agents", label: "Equipo de agentes", icon: Users },
    { id: "tasks", label: "Tareas y operaciones", icon: ClipboardList },
    { id: "projects", label: "Proyectos", icon: BriefcaseBusiness },
  ]},
  { label: "GESTIÓN", items: [
    { id: "clients", label: "Clientes y relaciones", icon: MessageSquare },
    { id: "documents", label: "Documentos", icon: FileText },
    { id: "finance", label: "Finanzas", icon: Wallet },
  ]},
];

function StatusPill({ status }: { status: Agent["status"] }) {
  const cls = status === "Disponible" ? "pill-ready" : status === "Revisión" ? "pill-review" : "pill-idle";
  return <span className={`pill ${cls}`}><span className="dot" />{status}</span>;
}

export default function Home() {
  const [active, setActive] = useState("office3d");
  const [agents, setAgents] = useState(initialAgents);
  const [tasks, setTasks] = useState(initialTasks);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientCompany, setClientCompany] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientStatus, setClientStatus] = useState<ClientStatus>("Prospecto");
  const [clientNextAction, setClientNextAction] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOwner, setTaskOwner] = useState(initialAgents[0].name);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("Panel de control local · Los agentes aún no ejecutan acciones autónomas");
  const [directorBrief, setDirectorBrief] = useState("");
  const [directorPlan, setDirectorPlan] = useState("");
  const [directorTruncated, setDirectorTruncated] = useState(false);
  const [directorError, setDirectorError] = useState("");
  const [directorModel, setDirectorModel] = useState("");
  const [directorLoading, setDirectorLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState("Sin comprobar");
  const [checkingModel, setCheckingModel] = useState(false);
  const [storageReady, setStorageReady] = useState(false);\n  const [autopilotEnabled, setAutopilotEnabled] = useState(false);\n  const [autopilotRunning, setAutopilotRunning] = useState(false);\n  const [expandedTask, setExpandedTask] = useState<number | string | null>(null);\n  const runnerBusy = useRef(false);

  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("transport-ai-dashboard-tasks");
      const savedAgents = localStorage.getItem("transport-ai-dashboard-agents");
      const savedClients = localStorage.getItem("transport-ai-dashboard-clients");\n      setAutopilotEnabled(localStorage.getItem("transport-ai-autopilot") === "true");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedAgents) setAgents(JSON.parse(savedAgents));
      if (savedClients) setClients(JSON.parse(savedClients));
    } catch {
      setNotice("No se pudieron recuperar algunos datos guardados en este navegador.");
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("transport-ai-dashboard-tasks", JSON.stringify(tasks));
    localStorage.setItem("transport-ai-dashboard-agents", JSON.stringify(agents));
    localStorage.setItem("transport-ai-dashboard-clients", JSON.stringify(clients));
  }, [tasks, agents, clients, storageReady]);

  useEffect(() => {\n    if (storageReady) localStorage.setItem("transport-ai-autopilot", String(autopilotEnabled));\n  }, [autopilotEnabled, storageReady]);\n\n  useEffect(() => {\n    if (!autopilotEnabled || !storageReady || runnerBusy.current) return;\n    const nextTask = tasks.find((task) => !task.done && (task.status || "Pendiente") === "Pendiente");\n    if (!nextTask) return;\n    const timer = window.setTimeout(async () => {\n      runnerBusy.current = true;\n      setAutopilotRunning(true);\n      setNotice("Un agente está trabajando: " + nextTask.owner);\n      setTasks((current) => current.map((task) => task.id === nextTask.id ? { ...task, status: "Trabajando", updatedAt: new Date().toISOString() } : task));\n      try {\n        const response = await fetch("/api/execute-task", {\n          method: "POST", headers: { "Content-Type": "application/json" },\n          body: JSON.stringify({ owner: nextTask.owner, title: nextTask.title })\n        });\n        const data = await response.json();\n        if (!response.ok) throw new Error(data.error || "No se pudo ejecutar la tarea.");\n        setTasks((current) => current.map((task) => task.id === nextTask.id ? { ...task, status: "Revisión", result: data.result, updatedAt: new Date().toISOString() } : task));\n        setNotice(nextTask.owner + " ha terminado un entregable. Está pendiente de tu revisión.");\n      } catch (error) {\n        setTasks((current) => current.map((task) => task.id === nextTask.id ? { ...task, status: "Error", result: error instanceof Error ? error.message : "Error de ejecución", updatedAt: new Date().toISOString() } : task));\n        setNotice("Un agente no ha podido completar su tarea. Revisa el error en la bandeja.");\n      } finally {\n        runnerBusy.current = false;\n        setAutopilotRunning(false);\n      }\n    }, 1200);\n    return () => window.clearTimeout(timer);\n  }, [autopilotEnabled, autopilotRunning, storageReady, tasks]);\n\n  const completed = tasks.filter((task) => task.done).length;
  const filteredAgents = useMemo(() => agents.filter((agent) =>
    `${agent.name} ${agent.role} ${agent.department}`.toLowerCase().includes(search.toLowerCase())
  ), [agents, search]);

  function toggleTask(id: number | string) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function addTask() {
    if (!taskTitle.trim()) return;
    setTasks((current) => [{ id: Date.now(), title: taskTitle.trim(), owner: taskOwner, priority: "Media", done: false, status: "Pendiente" }, ...current]);
    setTaskTitle("");
    setShowTaskForm(false);
    setNotice("Tarea añadida al panel. Pendiente de ejecución y aprobación.");
  }

  function exportBackup() {
    try {
      const backup = {
        product: "Transport AI Virtual Office",
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        data: {
          tasks: localStorage.getItem("transport-ai-dashboard-tasks"),
          agents: localStorage.getItem("transport-ai-dashboard-agents"),
          clients: localStorage.getItem("transport-ai-dashboard-clients"),
          conversations: localStorage.getItem("transport-ai-office-chat")
        }
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transport-ai-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setNotice("Copia de seguridad descargada correctamente.");
    } catch {
      setNotice("No se ha podido crear la copia de seguridad de este navegador.");
    }
  }

  function addClient() {
    if (!clientCompany.trim()) return;
    setClients((current) => [{
      id: crypto.randomUUID(),
      company: clientCompany.trim(),
      contact: clientContact.trim(),
      status: clientStatus,
      nextAction: clientNextAction.trim(),
      createdAt: new Date().toISOString()
    }, ...current]);
    setClientCompany("");
    setClientContact("");
    setClientStatus("Prospecto");
    setClientNextAction("");
    setShowClientForm(false);
    setNotice("Contacto añadido al CRM local.");
  }

  function toggleAgent(id: number) {
    setAgents((current) => current.map((agent) => agent.id === id
      ? { ...agent, status: agent.status === "En espera" ? "Disponible" : "En espera" }
      : agent));
  }

  const pageTitle = navGroups.flatMap((group) => group.items).find((item) => item.id === active)?.label ?? "Resumen general";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="flex items-center gap-3 px-2">
          <div className="brand-mark"><Command size={20} strokeWidth={2.5} /></div>
          <div>
            <div className="text-[14px] font-semibold tracking-tight text-white">TRANSPORT <span style={{ color: "#72d9d2" }}>AI</span></div>
            <div className="text-[9px] tracking-[.2em] text-slate-500 mt-1">VIRTUAL OFFICE</div>
          </div>
          <button className="ml-auto text-slate-500 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú"><X size={18} /></button>
        </div>

        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="nav-label">{group.label}</div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`}
                  onClick={() => { setActive(item.id); setMobileOpen(false); }}>
                  <Icon size={16} strokeWidth={1.8} /><span>{item.label}</span>
                  {item.id === "tasks" && <span className="ml-auto text-[10px] text-slate-500">{tasks.filter(t => !t.done).length}</span>}
                </button>;
              })}
            </div>
          </div>
        ))}

        <div className="mt-auto">
          <div className="panel p-3 mb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-200"><ShieldCheck size={14} style={{ color: "#72d9d2" }} /> Entorno privado</div>
            <p className="text-[10px] leading-relaxed text-slate-500 mt-2">Espacio interno de trabajo. Las acciones externas requerirán tu aprobación.</p>
          </div>
          <button className={`nav-item ${active === "settings" ? "active" : ""}`} onClick={() => { setActive("settings"); setMobileOpen(false); }}><Settings2 size={16} />Configuración</button>
          <div className="mt-4 border-t pt-4 flex items-center gap-3" style={{ borderColor: "var(--line)" }}>
            <div className="avatar" style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(98,213,208,.13)", color: "#8ce3dc", fontSize: 11 }}>TA</div>
            <div className="min-w-0"><div className="text-xs font-semibold text-slate-200">Dirección</div><div className="text-[10px] text-slate-500">Administrador principal</div></div>
            <ChevronDown size={14} className="ml-auto text-slate-600" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="flex items-center gap-3 min-w-0">
            <button className="mobile-menu ghost-button !p-2" onClick={() => setMobileOpen(true)} aria-label="Abrir menú"><Menu size={17} /></button>
            <div className="text-xs text-slate-500 hidden sm:block">Transport AI <span className="mx-2 text-slate-700">/</span> <span className="text-slate-300">{pageTitle}</span></div>
            <div className="text-xs text-slate-300 sm:hidden">{pageTitle}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />Sistema local</div>
            <button className="ghost-button !p-2 relative" aria-label="Notificaciones" onClick={() => setNotice("No tienes notificaciones nuevas.")}><Bell size={16} /><span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-teal-300" /></button>
            <div className="avatar !w-8 !h-8 !rounded-full text-[10px]" style={{ background: "#1c3940", color: "#9ce9e1" }}>TA</div>
          </div>
        </header>

        <div className="content">
          {active === "office3d" && <Office3D />}
          {active === "settings" && (
            <>
              <div className="mb-7"><div className="eyebrow">Preferencias y protección</div><h1 className="page-title">Configuración</h1><p className="subtle">Administra tus datos locales y consulta cómo está conectada la oficina virtual.</p></div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <section className="panel p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-teal-300" />Copia de seguridad</div>
                  <p className="text-xs leading-relaxed text-slate-400 mt-3">Las tareas, los perfiles y las conversaciones se guardan en el almacenamiento de este navegador. Descarga una copia para conservarlos si cambias de equipo o limpias los datos del navegador.</p>
                  <button className="action-button mt-5" onClick={exportBackup}><Download size={15} />Descargar copia de seguridad</button>
                  <p className="text-[10px] text-slate-600 mt-3">El archivo contiene los datos guardados en este navegador. Guárdalo en un lugar privado.</p>
                </section>
                <section className="panel p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold"><BrainCircuit size={16} className="text-teal-300" />Motor de inteligencia artificial</div>
                  <p className="text-xs leading-relaxed text-slate-400 mt-3">La oficina utiliza un servidor local compatible con la API de OpenAI. Puedes mantener GPT4All o sustituirlo por llama.cpp sin cambiar la lógica de los agentes.</p>
                  <div className="mt-4 rounded-lg p-3 text-[11px] text-slate-300" style={{ background: "rgba(255,255,255,.025)", border: "1px solid var(--line)" }}>
                    <div className="text-slate-500 mb-1">Dirección predeterminada</div>
                    <code>http://127.0.0.1:4891/v1</code>
                    <div className="text-slate-500 mt-3 mb-1">Variables opcionales</div>
                    <code>LOCAL_LLM_BASE_URL</code><br /><code>LOCAL_LLM_MODEL</code>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-3">La configuración avanzada está documentada en docs/AGENT_SYSTEM.md. No compartas el puerto local en Internet.</p>
                  <button className="ghost-button mt-4" onClick={() => setActive("director")}><Activity size={14} />Ir al Director y comprobar conexión</button>
                </section>
                <section className="panel p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={16} className="text-teal-300" />Privacidad y permisos</div>
                  <p className="text-xs leading-relaxed text-slate-400 mt-3">Los agentes preparan análisis y entregables. No tienen permisos automáticos para enviar mensajes, realizar pagos, publicar contenido o modificar sistemas externos. Las acciones externas requieren integraciones y aprobación humana.</p>
                </section>
              </div>
            </>
          )}


          {active === "overview" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
                <div><div className="eyebrow">Centro de dirección</div><h1 className="page-title">Buenos días. Este es tu centro de mando.</h1><p className="subtle">Supervisa el equipo, organiza el trabajo y mantén el control de Transport AI.</p></div>
                <button className="action-button" onClick={() => { setActive("tasks"); setShowTaskForm(true); }}><Plus size={15} />Nueva tarea</button>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
                <div className="panel stat-card"><div className="flex justify-between"><span className="stat-label">Agentes configurados</span><Users size={16} className="text-teal-300" /></div><div className="stat-value">09 <span className="text-xs font-normal text-slate-500">/ 09</span></div><div className="text-[10px] text-slate-500 mt-1">Equipo inicial completo</div></div>
                <div className="panel stat-card"><div className="flex justify-between"><span className="stat-label">Tareas pendientes</span><ClipboardList size={16} className="text-amber-300" /></div><div className="stat-value">{tasks.length - completed}<span className="text-xs font-normal text-slate-500"> activas</span></div><div className="text-[10px] text-slate-500 mt-1">Organizadas en el panel</div></div>
                <div className="panel stat-card"><div className="flex justify-between"><span className="stat-label">Tareas completadas</span><CheckCircle2 size={16} className="text-emerald-300" /></div><div className="stat-value">{completed.toString().padStart(2, "0")}</div><div className="text-[10px] text-slate-500 mt-1">Marcadas manualmente</div></div>
                <div className="panel stat-card"><div className="flex justify-between"><span className="stat-label">Contactos comerciales</span><Users size={16} className="text-violet-300" /></div><div className="stat-value">{clients.length.toString().padStart(2, "0")}</div><div className="text-[10px] text-slate-500 mt-1">Registrados en el CRM local</div></div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4 mb-5">
                <section className="panel p-5">
                  <div className="flex items-center justify-between mb-5"><div><div className="text-sm font-semibold">Equipo de trabajo</div><div className="text-[11px] text-slate-500 mt-1">Los nueve perfiles de tu oficina virtual</div></div><button className="ghost-button" onClick={() => setActive("agents")}>Ver equipo <ArrowUpRight size={13} /></button></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {agents.slice(0, 4).map((agent) => <div key={agent.id} className="flex items-center gap-3 rounded-xl p-3 border" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,.015)" }}>
                      <div className="avatar" style={{ color: agent.color, background: agent.tint }}>{agent.initials}</div>
                      <div className="min-w-0 flex-1"><div className="text-xs font-semibold truncate">{agent.name}</div><div className="text-[10px] text-slate-500 mt-1">{agent.department}</div></div>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: agent.status === "En espera" ? "#778494" : agent.status === "Revisión" ? "#d9b66f" : "#6ed2a3" }} />
                    </div>)}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500"><span>4 de 9 perfiles destacados</span><span>Equipo inicial · 9 roles</span></div>
                </section>

                <section className="panel p-5">
                  <div className="flex items-center justify-between mb-5"><div><div className="text-sm font-semibold">Actividad del sistema</div><div className="text-[11px] text-slate-500 mt-1">Estado del espacio de trabajo</div></div><Activity size={16} className="text-teal-300" /></div>
                  <div className="activity-line"><span className="activity-dot" /><div className="text-xs text-slate-200">Oficina virtual inicializada</div><div className="text-[10px] text-slate-500 mt-1">Panel de dirección disponible</div></div>
                  <div className="activity-line"><span className="activity-dot" /><div className="text-xs text-slate-200">9 perfiles de agente creados</div><div className="text-[10px] text-slate-500 mt-1">Departamentos y responsabilidades definidos</div></div>
                  <div className="activity-line"><span className="activity-dot" /><div className="text-xs text-slate-200">Control humano activado</div><div className="text-[10px] text-slate-500 mt-1">Sin acciones externas automáticas</div></div>
                  <div className="mt-4 rounded-lg p-3 text-[10px] leading-relaxed text-slate-400" style={{ background: "rgba(98,213,208,.055)", border: "1px solid rgba(98,213,208,.1)" }}><Sparkles size={13} className="inline mr-2 text-teal-300" />El motor de IA local puede conectarse desde los despachos y el Director de operaciones.</div>
                </section>
              </div>

              <section className="panel p-5">
                <div className="flex items-center justify-between mb-2"><div><div className="text-sm font-semibold">Prioridades del equipo</div><div className="text-[11px] text-slate-500 mt-1">Seguimiento manual de las tareas principales</div></div><button className="ghost-button" onClick={() => setActive("tasks")}>Todas las tareas <ArrowUpRight size={13} /></button></div>
                {tasks.slice(0, 3).map((task) => <div className="task-row" key={task.id}><input className="task-check" type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><div className="min-w-0 flex-1"><div className={`text-xs ${task.done ? "line-through text-slate-600" : "text-slate-200"}`}>{task.title}</div><div className="text-[10px] text-slate-500 mt-1">{task.owner}</div></div><span className={`pill ${task.priority === "Alta" ? "pill-review" : "pill-idle"}`}>{task.priority}</span></div>)}
              </section>
            </>
          )}

          {active === "director" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div><div className="eyebrow">Agente coordinador · COO</div><h1 className="page-title">Director de operaciones</h1><p className="subtle">Convierte tus objetivos en planes de trabajo y distribuye responsabilidades entre los nueve especialistas.</p></div>
                <div className="flex flex-wrap items-center gap-2"><span className="pill pill-idle"><span className="dot" />{modelStatus}</span><button className="ghost-button" disabled={checkingModel} onClick={async () => {
                  setCheckingModel(true); setModelStatus("Comprobando conexión...");
                  try {
                    const response = await fetch("/api/health", { cache: "no-store" });
                    const data = await response.json();
                    if (!response.ok || !data.ok) throw new Error(data.error || "No se pudo comprobar el servidor local.");
                    const available = data.modelAvailable ? "Modelo disponible" : "Modelo no encontrado";
                    setModelStatus("Conectado · " + available);
                    setNotice("Servidor local conectado. Modelos detectados: " + (data.models || []).join(", "));
                  } catch (error) {
                    setModelStatus(error instanceof Error ? error.message : "Sin conexión");
                  } finally { setCheckingModel(false); }
                }}>{checkingModel ? <LoaderCircle size={14} className="animate-spin" /> : <Activity size={14} />}Comprobar conexión</button></div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_.65fr] gap-4">
                <section className="panel p-5">
                  <div className="flex items-center gap-3 mb-4"><div className="avatar" style={{ background: "rgba(98,213,208,.13)", color: "#77d8d0" }}><BrainCircuit size={20} /></div><div><div className="text-sm font-semibold">Sala de planificación</div><div className="text-[10px] text-slate-500 mt-1">Describe el objetivo o problema que debe organizar</div></div></div>
                  <textarea className="input-dark min-h-[160px] resize-y leading-relaxed" placeholder="Ejemplo: Quiero conseguir tres clientes de hoteles o apartamentos turísticos. Organiza un plan comercial de dos semanas, sin gastar dinero, y reparte el trabajo entre los agentes..." value={directorBrief} onChange={e => setDirectorBrief(e.target.value)} maxLength={8000} />
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3"><span className="text-[10px] text-slate-500">{directorBrief.length}/8000 caracteres · El encargo se procesa en tu equipo</span><button className="action-button" disabled={directorLoading || !directorBrief.trim()} onClick={async () => {
                    setDirectorLoading(true); setDirectorError(""); setDirectorPlan(""); setDirectorModel(""); setDirectorTruncated(false);
                    try {
                      const response = await fetch("/api/director", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brief: directorBrief }) });
                      const data = await response.json();
                      if (!response.ok) throw new Error(data.error || "No se pudo generar el plan.");
                      setDirectorPlan(data.plan); setDirectorModel(data.model || "Modelo local"); setDirectorTruncated(Boolean(data.truncated)); setNotice("El Director de Operaciones ha preparado un plan para revisar.");
                    } catch (error) {
                      setDirectorError(error instanceof Error ? error.message : "Ha ocurrido un error.");
                    } finally { setDirectorLoading(false); }
                  }}>{directorLoading ? <><LoaderCircle size={15} className="animate-spin" />Preparando plan...</> : <><Send size={14} />Preparar plan de trabajo</>}</button></div>
                  {directorError && <div className="mt-4 rounded-lg p-3 text-xs leading-relaxed text-amber-200" style={{ background: "rgba(218,171,85,.08)", border: "1px solid rgba(218,171,85,.2)" }}>{directorError}<div className="text-[10px] text-amber-100/60 mt-2">Comprueba que el motor local esté iniciado y que su API compatible con OpenAI esté activa. Consulta docs/AGENT_SYSTEM.md.</div></div>}
                  {directorPlan && <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--line)" }}><div className="flex flex-wrap items-center justify-between gap-2 mb-3"><div className="text-sm font-semibold flex items-center gap-2"><CheckCircle2 size={15} className="text-teal-300" />Plan preparado</div><span className="text-[10px] text-slate-500">{directorModel}</span></div><pre className="whitespace-pre-wrap font-sans text-xs leading-7 text-slate-300">{directorPlan}</pre><div className="mt-4 text-[10px] text-slate-500">Propuesta generada por IA local. Revisa y aprueba las tareas antes de ejecutarlas.</div>{directorTruncated && <div className="mt-3 rounded-lg p-3 text-xs text-amber-200" style={{ background: "rgba(218,171,85,.08)", border: "1px solid rgba(218,171,85,.2)" }}>La respuesta ha alcanzado el límite de generación y puede estar incompleta. Puedes pedir al Director que continúe o que resuma el plan.</div>}</div>}
                </section>
                <div className="space-y-4">
                  <section className="panel p-5"><div className="text-sm font-semibold mb-3">Responsabilidades</div><div className="space-y-3 text-xs text-slate-400"><div className="flex gap-2"><Check size={14} className="text-teal-300 shrink-0" />Entender objetivos y detectar datos que faltan</div><div className="flex gap-2"><Check size={14} className="text-teal-300 shrink-0" />Dividir el trabajo en tareas concretas</div><div className="flex gap-2"><Check size={14} className="text-teal-300 shrink-0" />Asignar responsables entre los ocho especialistas</div><div className="flex gap-2"><Check size={14} className="text-teal-300 shrink-0" />Detectar dependencias, riesgos y costes</div><div className="flex gap-2"><Check size={14} className="text-teal-300 shrink-0" />Entregar un plan para aprobación</div></div></section>
                  <section className="panel p-5"><div className="flex items-center gap-2 text-sm font-semibold mb-2"><ShieldCheck size={15} className="text-teal-300" />Control y privacidad</div><p className="text-xs text-slate-500 leading-relaxed">El modelo se ejecuta en tu ordenador mediante un servidor local compatible. No se envían encargos a una API externa. El Director no contacta clientes, no publica, no compra ni despliega nada.</p></section>
                  <section className="panel p-5"><div className="text-sm font-semibold mb-2">Activación del modelo</div><p className="text-xs text-slate-500 leading-relaxed">Esta función necesita un servidor local de IA activo y un modelo cargado. La guía de instalación está en <span className="text-teal-300">docs/AGENT_SYSTEM.md</span>. No se ha activado ningún servicio de pago.</p></section>
                </div>
              </div>
            </>
          )}

          {active === "agents" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-7"><div><div className="eyebrow">Estructura organizativa</div><h1 className="page-title">Equipo de agentes</h1><p className="subtle">Nueve perfiles especializados, cada uno con una responsabilidad definida.</p></div><div className="text-xs text-slate-500">09 perfiles · 6 departamentos</div></div>
              <div className="relative mb-5 max-w-sm"><Search size={15} className="absolute left-3 top-3 text-slate-500" /><input className="input-dark pl-9" placeholder="Buscar agente o departamento..." value={search} onChange={e => setSearch(e.target.value)} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredAgents.map(agent => <article key={agent.id} className="panel agent-card">
                  <div className="flex items-start justify-between"><div className="avatar" style={{ color: agent.color, background: agent.tint, width: 48, height: 48, fontSize: 13 }}>{agent.initials}</div><StatusPill status={agent.status} /></div>
                  <div className="mt-4"><div className="text-sm font-semibold">{agent.name}</div><div className="text-[10px] mt-1" style={{ color: agent.color }}>{agent.role}</div><p className="text-xs text-slate-500 leading-relaxed mt-3 min-h-[38px]">{agent.description}</p></div>
                  <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--line)" }}><span className="text-[10px] text-slate-500">{agent.workload}</span><button className="ghost-button !py-1.5 !px-2.5" onClick={() => toggleAgent(agent.id)}>{agent.status === "En espera" ? "Activar perfil" : "Poner en espera"}</button></div>
                </article>)}
              </div>
              {filteredAgents.length === 0 && <div className="panel p-8 text-center text-sm text-slate-500">No se han encontrado agentes con esa búsqueda.</div>}
            </>
          )}

          {active === "tasks" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-7"><div><div className="eyebrow">Planificación y ejecución autónoma</div><h1 className="page-title">Tareas y operaciones</h1><p className="subtle">Los especialistas ejecutan tareas y preparan entregables para tu aprobación.</p></div><button className="action-button" onClick={() => setShowTaskForm(v => !v)}><Plus size={15} />Crear tarea</button></div>\n              <section className="panel p-5 mb-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="flex items-center gap-2 text-sm font-semibold"><BrainCircuit size={16} className="text-teal-300" />Modo de trabajo autónomo</div><p className="text-xs text-slate-500 mt-2 max-w-2xl">Cuando está activado, la oficina entrega las tareas pendientes al especialista correspondiente, guarda su resultado y lo deja para revisión. Solo procesa una tarea cada vez.</p><p className="text-[10px] text-slate-600 mt-2">Requiere esta página abierta y GPT4All con el modelo cargado. No envía mensajes ni realiza acciones externas.</p></div><button className={autopilotEnabled ? "action-button" : "ghost-button"} onClick={() => setAutopilotEnabled(value => !value)}>{autopilotEnabled ? "Pausar agentes" : "Activar trabajo autónomo"}</button></div><div className="flex flex-wrap gap-3 mt-4 text-[11px]"><span className="pill pill-ready"><span className="dot" />{autopilotEnabled ? (autopilotRunning ? "Agente trabajando" : "Autopiloto activo") : "Autopiloto pausado"}</span><span className="pill pill-idle">{tasks.filter(task => !task.done && (task.status || "Pendiente") === "Pendiente").length} en cola</span><span className="pill pill-review">{tasks.filter(task => task.status === "Revisión").length} para revisar</span></div></section>
              {showTaskForm && <div className="panel p-5 mb-5"><div className="text-sm font-semibold mb-4">Nueva tarea</div><div className="grid grid-cols-1 md:grid-cols-[1fr_260px_auto] gap-3"><input className="input-dark" placeholder="Describe qué hay que hacer..." value={taskTitle} onChange={e => setTaskTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} /><select className="input-dark" value={taskOwner} onChange={e => setTaskOwner(e.target.value)}>{agents.map(agent => <option key={agent.id}>{agent.name}</option>)}</select><button className="action-button" onClick={addTask}>Añadir tarea</button></div></div>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5"><div className="panel p-4"><div className="text-[11px] text-slate-500">Total de tareas</div><div className="text-2xl font-semibold mt-2">{tasks.length}</div></div><div className="panel p-4"><div className="text-[11px] text-slate-500">Pendientes</div><div className="text-2xl font-semibold mt-2">{tasks.length - completed}</div></div><div className="panel p-4"><div className="text-[11px] text-slate-500">Completadas</div><div className="text-2xl font-semibold mt-2">{completed}</div></div></div>
              <section className="panel p-5"><div className="text-sm font-semibold mb-2">Bandeja de trabajo</div>{tasks.map(task => <article className="py-4 border-b last:border-0" style={{ borderColor: "var(--line)" }} key={task.id}><div className="flex items-start gap-3"><input className="task-check mt-1" type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} /><div className="flex-1 min-w-0"><div className={`text-xs ${task.done ? "line-through text-slate-600" : "text-slate-200"}`}>{task.title}</div><div className="text-[10px] text-slate-500 mt-1">{task.owner} · {task.priority}</div></div><span className={`pill ${task.status === "Error" ? "pill-review" : task.status === "Revisión" ? "pill-review" : task.done ? "pill-ready" : "pill-idle"}`}>{task.done ? "Completada" : task.status || "Pendiente"}</span></div>{task.result && <div className="mt-3 ml-7"><button className="text-[11px] text-teal-300 hover:text-teal-200" onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>{expandedTask === task.id ? "Ocultar entregable" : task.status === "Error" ? "Ver error" : "Ver entregable"}</button>{expandedTask === task.id && <div className="mt-2 rounded-lg p-4 text-xs leading-6 text-slate-300 whitespace-pre-wrap" style={{ background: "rgba(0,0,0,.2)", border: "1px solid var(--line)" }}>{task.result}</div>}</div>}{task.status === "Revisión" && <div className="flex justify-end gap-2 mt-3"><button className="ghost-button !py-1.5" onClick={() => retryTask(task.id)}>Solicitar otra versión</button><button className="action-button !py-1.5" onClick={() => approveTask(task.id)}>Aprobar y completar</button></div>}{task.status === "Error" && <div className="flex justify-end mt-3"><button className="ghost-button !py-1.5" onClick={() => retryTask(task.id)}>Reintentar tarea</button></div>}</article>)}{tasks.length === 0 && <p className="text-xs text-slate-500 py-6">Todavía no hay tareas. Crea la primera para empezar.</p>}</section>
            </>
          )}

          {active === "clients" && (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
                <div><div className="eyebrow">Relaciones comerciales · CRM local</div><h1 className="page-title">Clientes y oportunidades</h1><p className="subtle">Organiza prospectos, contactos y próximos seguimientos sin depender de un CRM de pago.</p></div>
                <button className="action-button" onClick={() => setShowClientForm(value => !value)}><Plus size={15} />Añadir contacto</button>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
                <div className="panel stat-card"><div className="stat-label">Contactos</div><div className="stat-value">{clients.length}</div></div>
                <div className="panel stat-card"><div className="stat-label">Prospectos</div><div className="stat-value">{clients.filter(client => client.status === "Prospecto").length}</div></div>
                <div className="panel stat-card"><div className="stat-label">Propuestas enviadas</div><div className="stat-value">{clients.filter(client => client.status === "Propuesta enviada").length}</div></div>
                <div className="panel stat-card"><div className="stat-label">Clientes</div><div className="stat-value">{clients.filter(client => client.status === "Cliente").length}</div></div>
              </div>
              {showClientForm && <section className="panel p-5 mb-5">
                <div className="text-sm font-semibold mb-4">Nuevo contacto comercial</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input className="input-dark" placeholder="Empresa *" value={clientCompany} onChange={event => setClientCompany(event.target.value)} />
                  <input className="input-dark" placeholder="Persona de contacto (opcional)" value={clientContact} onChange={event => setClientContact(event.target.value)} />
                  <select className="input-dark" value={clientStatus} onChange={event => setClientStatus(event.target.value as ClientStatus)}>
                    {(["Prospecto", "Contactado", "Interesado", "Propuesta enviada", "Cliente", "Descartado"] as ClientStatus[]).map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <input className="input-dark" placeholder="Próxima acción (ej. llamar el jueves)" value={clientNextAction} onChange={event => setClientNextAction(event.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-4"><button className="ghost-button" onClick={() => setShowClientForm(false)}>Cancelar</button><button className="action-button" disabled={!clientCompany.trim()} onClick={addClient}>Guardar contacto</button></div>
              </section>}
              <section className="panel p-5">
                <div className="flex items-center justify-between mb-3"><div className="text-sm font-semibold">Pipeline comercial</div><span className="text-[10px] text-slate-500">Guardado en este navegador</span></div>
                {clients.length === 0 ? <div className="py-10 text-center"><Users size={25} className="mx-auto text-slate-600 mb-3" /><div className="text-sm text-slate-300">Todavía no hay contactos</div><p className="text-xs text-slate-500 mt-2">Añade empresas con las que estés hablando y registra el siguiente paso.</p></div> :
                  clients.map(client => <article key={client.id} className="task-row flex-wrap gap-3">
                    <div className="min-w-0 flex-1"><div className="text-sm font-semibold text-slate-200">{client.company}</div>{client.contact && <div className="text-[10px] text-slate-500 mt-1">{client.contact}</div>}<input className="input-dark !mt-2 !py-2 text-xs" aria-label={"Próxima acción de " + client.company} placeholder="Próxima acción o fecha de seguimiento..." value={client.nextAction} onChange={event => setClients(current => current.map(item => item.id === client.id ? { ...item, nextAction: event.target.value } : item))} /></div>
                    <select className="input-dark !w-auto !min-w-[150px] !py-2 text-[11px]" aria-label={"Estado de " + client.company} value={client.status} onChange={event => setClients(current => current.map(item => item.id === client.id ? { ...item, status: event.target.value as ClientStatus } : item))}>
                      {(["Prospecto", "Contactado", "Interesado", "Propuesta enviada", "Cliente", "Descartado"] as ClientStatus[]).map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </article>)
                }
              </section>
            </>
          )}

          {["projects", "documents", "finance"].includes(active) && (
            <div className="max-w-2xl"><div className="eyebrow">Módulo de gestión</div><h1 className="page-title">{pageTitle}</h1><p className="subtle mb-7">Este espacio forma parte de la estructura de la oficina virtual.</p><div className="panel p-7"><div className="brand-mark mb-5"><Building2 size={19} /></div><div className="text-base font-semibold">Módulo preparado para su desarrollo</div><p className="subtle mt-2 max-w-lg">La estructura está creada. En la siguiente fase conectaremos este apartado con datos reales y herramientas de trabajo, manteniendo el control y la aprobación final en tus manos.</p><div className="mt-5 flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={14} className="text-teal-300" />Sin conexiones externas ni costes activados</div></div></div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-600"><span>TRANSPORT AI · VIRTUAL OFFICE · v0.1.0</span><span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{notice}</span></div>
        </div>
      </main>
    </div>
  );
}
