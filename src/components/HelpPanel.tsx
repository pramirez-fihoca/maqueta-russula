import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building2,
  Briefcase,
  Folder,
  FileText,
  Upload,
  FolderPlus,
  ShieldCheck,
  Trash2,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  BarChart3,
  PieChart,
  History,
  Globe,
  Rocket,
  UserPlus,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   Shared UI primitives
───────────────────────────────────────────── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="w-1.5 h-5 rounded-full bg-primary flex-shrink-0" />
    <h2 className="text-base font-semibold text-foreground">{children}</h2>
  </div>
);

const ActionCard = ({
  icon: Icon,
  label,
  desc,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50">
    <div className={`w-8 h-8 rounded-md ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Dashboard guide content
───────────────────────────────────────────── */
const DashboardGuide = () => (
  <div className="px-7 py-6 space-y-9">
    {/* Intro */}
    <section>
      <SectionTitle>Introducción</SectionTitle>
      <p className="text-sm text-muted-foreground leading-relaxed">
        El <span className="text-foreground font-medium">Dashboard</span> ofrece una visión ejecutiva del estado global
        del portal: proyectos activos, presencia geográfica, salud documental e interacción con clientes, todo en tiempo
        real.
      </p>
    </section>

    {/* KPIs principales */}
    <section>
      <SectionTitle>Métricas Principales</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: Briefcase,
            label: "Total de Proyectos",
            desc: "Número de proyectos registrados y activos en el sistema, independientemente de su estado o división.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: Globe,
            label: "Alcance Global",
            desc: "Países en los que Russula tiene presencia activa con proyectos o clientes asignados.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: Building2,
            label: "Cartera de Clientes",
            desc: "Empresas interlocutoras con acceso o actividad en el portal durante el período actual.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: Rocket,
            label: "Proyectos 2025",
            desc: "Nuevas implementaciones iniciadas en el ejercicio en curso, útil para medir el ritmo de crecimiento.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* Gráficos */}
    <section>
      <SectionTitle>Análisis Visual</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: PieChart,
            label: "Distribución por División",
            desc: "Gráfico de anillo que muestra el reparto de proyectos entre Rolling Mills, Water Solutions y Digitalization.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: BarChart3,
            label: "Top Clientes por Actividad",
            desc: "Barras horizontales con los clientes que concentran más proyectos. Detecta rápidamente las cuentas estratégicas.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: Globe,
            label: "Presencia Geográfica",
            desc: "Distribución de proyectos por país. Refleja el peso relativo de cada mercado en la cartera global.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* KPIs operacionales */}
    <section>
      <SectionTitle>Indicadores Operacionales</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: UserPlus,
            label: "Gestión de Accesos",
            desc: "Usuarios Cliente pendientes de validación. Requieren acción del Administrador para activar su acceso.",
            iconBg: "bg-[hsl(var(--warning))]/10",
            iconColor: "text-[hsl(var(--warning))]",
          },
          {
            icon: MessageSquare,
            label: "Interacción en Proyectos",
            desc: "Comentarios no leídos en el foro técnico de cualquier nivel (cliente, proyecto o carpeta).",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: FileCheck,
            label: "Salud Documental",
            desc: "Porcentaje de archivos descargados al menos una vez. Un valor alto indica que los documentos llegan a los clientes.",
            iconBg: "bg-[hsl(var(--success))]/10",
            iconColor: "text-[hsl(var(--success))]",
          },
          {
            icon: AlertTriangle,
            label: "Alerta de Actualización",
            desc: "Proyectos sin actividad nueva en más de 15 días. Señal para revisar si hay entregas pendientes.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* Actividad Reciente */}
    <section>
      <SectionTitle>Actividad Reciente</SectionTitle>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Registro de eventos del portal</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          El feed muestra en tiempo real las últimas descargas, comentarios y altas de usuario. Es la fuente de verdad
          para auditar quién hace qué y cuándo dentro del portal.
        </p>
      </div>
    </section>

    <div className="pt-2 pb-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">Manual de Usuario · Russula Platform v1.0</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Explorer guide content (Capítulo 1)
───────────────────────────────────────────── */
const ExplorerGuide = () => (
  <div className="px-7 py-6 space-y-9">
    {/* Intro */}
    <section>
      <SectionTitle>Introducción</SectionTitle>
      <p className="text-sm text-muted-foreground leading-relaxed">
        El <span className="text-foreground font-medium">Explorador de Documentos</span> es el núcleo operativo de
        Russula. Desde aquí gestionas toda la documentación técnica de tus proyectos: subes planos, revisas versiones,
        compartes archivos con clientes y mantienes un registro ordenado de cada entrega.
      </p>
    </section>

    {/* Jerarquía */}
    <section>
      <SectionTitle>Jerarquía documental</SectionTitle>
      <div className="space-y-2">
        {[
          { icon: Building2, label: "Cliente", desc: "Empresa o entidad contratante" },
          { icon: Briefcase, label: "Proyecto", desc: "Encargo o contrato específico" },
          { icon: Folder, label: "Carpeta", desc: "Agrupación temática o de fase" },
          { icon: FileText, label: "Archivo", desc: "Documento, plano o entregable" },
        ].map((item, i, arr) => (
          <div key={item.label} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              {i < arr.length - 1 && <div className="w-px h-3 bg-border mt-1" />}
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            {i < arr.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground mt-2.5 ml-auto flex-shrink-0 opacity-40" />
            )}
          </div>
        ))}
      </div>
    </section>

    {/* Gestión documental */}
    <section>
      <SectionTitle>Gestión Documental</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: Upload,
            label: "Subir archivo",
            desc: "Carga planos, PDFs o cualquier documento al nivel actual.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: FolderPlus,
            label: "Crear carpeta",
            desc: "Organiza los documentos creando subcarpetas temáticas.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: ShieldCheck,
            label: "Descarga segura",
            desc: "Los archivos se sirven con enlace temporal cifrado.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: Trash2,
            label: "Eliminar",
            desc: "Solo administradores pueden eliminar archivos o carpetas.",
            iconBg: "bg-destructive/10",
            iconColor: "text-destructive",
          },
        ].map((action) => (
          <ActionCard key={action.label} {...action} />
        ))}
      </div>
    </section>

    {/* Foro Técnico */}
    <section>
      <SectionTitle>Foro Técnico</SectionTitle>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Notas contextuales por nivel</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Cada cliente, proyecto y carpeta tiene su propio hilo de comentarios. Las notas quedan ancladas al nivel en
          que se crean, lo que permite mantener conversaciones técnicas organizadas sin perder el contexto del documento
          o fase de obra.
        </p>
      </div>
    </section>

    <div className="pt-2 pb-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">
        Manual de Usuario · Capítulo 1 · Russula Platform v1.0
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const HelpPanel = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isDashboard = pathname === "/dashboard";
  const isExplorer = pathname.startsWith("/dashboard/explorer") || pathname.startsWith("/dashboard/document");

  const title = isDashboard ? "Guía del Dashboard" : isExplorer ? "Explorador de documentos" : "Manual de Usuario";

  const subtitle = isDashboard
    ? "Métricas y análisis"
    : isExplorer
      ? "Navegación y Gestión Documental"
      : "Ayuda contextual";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="Ayuda">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-7 pt-7 pb-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{subtitle}</p>
              <SheetTitle className="text-xl font-bold text-foreground leading-tight">{title}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        {/* Content with fade transition */}
        <ScrollArea className="flex-1">
          <div key={pathname} className="animate-fade-in">
            {isDashboard && <DashboardGuide />}
            {isExplorer && <ExplorerGuide />}
            {!isDashboard && !isExplorer && (
              <div className="px-7 py-6 text-sm text-muted-foreground">
                Navega a una sección del portal para ver la ayuda contextual correspondiente.
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HelpPanel;
