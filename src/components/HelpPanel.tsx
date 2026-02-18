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
  Download,
  Eye,
  FileDown,
  Filter,
  CalendarDays,
  ShieldAlert,
  HardHat,
  User,
  Key,
  ArrowRight,
  FolderOpen,
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
   Activity guide content
───────────────────────────────────────────── */
const ActivityGuide = () => (
  <div className="px-7 py-6 space-y-9">
    {/* Intro */}
    <section>
      <SectionTitle>Introducción</SectionTitle>
      <p className="text-sm text-muted-foreground leading-relaxed">
        El <span className="text-foreground font-medium">Panel de Actividad</span> es el registro de auditoría completo
        del portal. Consolida en una sola vista todas las acciones realizadas por usuarios: descargas, subidas,
        visualizaciones y comentarios, con fecha, hora y contexto del documento.
      </p>
    </section>

    {/* Stats */}
    <section>
      <SectionTitle>Indicadores de Actividad</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: History,
            label: "Total Actividades",
            desc: "Suma de todas las acciones registradas en el sistema, independientemente del tipo o usuario.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: Download,
            label: "Descargas",
            desc: "Número de veces que un usuario ha descargado un documento. Indica el nivel de consumo documental.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: Upload,
            label: "Subidas",
            desc: "Documentos cargados al portal. Refleja el ritmo de publicación de contenido técnico.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
          {
            icon: MessageSquare,
            label: "Comentarios",
            desc: "Interacciones del foro técnico registradas como actividad. Mide el engagement en los proyectos.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* Tipos de acción */}
    <section>
      <SectionTitle>Tipos de Acción</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: Download,
            label: "Descarga",
            desc: "Un usuario ha descargado un archivo del portal de forma segura.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: Upload,
            label: "Subida",
            desc: "Un administrador o editor ha publicado un nuevo documento en el explorador.",
            iconBg: "bg-green-500/10",
            iconColor: "text-green-500",
          },
          {
            icon: Eye,
            label: "Visualización",
            desc: "El usuario abrió un documento para previsualizarlo sin descargarlo.",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-400",
          },
          {
            icon: MessageSquare,
            label: "Comentario",
            desc: "Se publicó una nota en el foro técnico de un proyecto o carpeta.",
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-400",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* Filtros */}
    <section>
      <SectionTitle>Filtros y Búsqueda</SectionTitle>
      <div className="space-y-3">
        {[
          {
            icon: Filter,
            label: "Filtros combinables",
            desc: "Filtra simultáneamente por usuario, proyecto, tipo de acción o rango de fechas para aislar cualquier evento.",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            icon: CalendarDays,
            label: "Rango de fechas",
            desc: "Selecciona un período concreto (Desde / Hasta) para auditar la actividad en un intervalo específico.",
            iconBg: "bg-muted",
            iconColor: "text-foreground",
          },
        ].map((item) => (
          <ActionCard key={item.label} {...item} />
        ))}
      </div>
    </section>

    {/* Exportar */}
    <section>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
        <div className="flex items-center gap-2 mb-2">
          <FileDown className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-primary">Exportar CSV</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Descarga el registro completo en formato CSV para análisis externo, auditorías o reportes a dirección.
          El botón de exportación respeta los filtros activos en el momento de la descarga.
        </p>
      </div>
    </section>

    <div className="pt-2 pb-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">
        Manual de Usuario · Panel de Actividad · Russula Platform v1.0
      </p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Users guide content
───────────────────────────────────────────── */
const UsersGuide = () => (
  <div className="px-7 py-6 space-y-9">
    {/* Intro */}
    <section>
      <SectionTitle>Gestión de Accesos y Seguridad</SectionTitle>
      <p className="text-sm text-muted-foreground leading-relaxed">
        El portal de Russula implementa un modelo de permisos basado en{" "}
        <span className="text-foreground font-medium">tres perfiles</span> que definen qué puede ver y hacer cada
        usuario. Asigna el perfil correcto para garantizar la seguridad documental y la trazabilidad de accesos.
      </p>
    </section>

    {/* Perfiles */}
    <section>
      <SectionTitle>Perfiles de Usuario</SectionTitle>
      <div className="space-y-3">
        {/* Admin */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Administrador Russula</p>
              <p className="text-xs text-primary font-medium">Control total del sistema</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Acceso irrestricto a todos los módulos. Gestiona clientes, crea y elimina proyectos, administra todos los
            usuarios y puede auditar cualquier actividad del portal.
          </p>
        </div>

        {/* Responsable */}
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <HardHat className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Ingeniero Russula</p>
              <p className="text-xs text-muted-foreground font-medium">Perfil operativo técnico</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Puede subir planos y documentos, crear carpetas y participar en el Foro Técnico de cualquier proyecto. No
            puede crear clientes ni eliminar usuarios de otros perfiles.
          </p>
        </div>

        {/* Cliente */}
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Cliente Externo</p>
              <p className="text-xs text-muted-foreground font-medium">Acceso restringido por invitación</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Solo puede visualizar y descargar documentación de los proyectos a los que ha sido invitado explícitamente.
            No tiene acceso a otros clientes ni proyectos.
          </p>
        </div>
      </div>
    </section>

    {/* Acciones de gestión */}
    <section>
      <SectionTitle>Guía de Acciones</SectionTitle>
      <div className="space-y-3">
        <ActionCard
          icon={UserPlus}
          label="Dar de alta un colaborador"
          desc="Introduce el email, selecciona el perfil y vincula al usuario con los proyectos o empresas correspondientes. Recibirá un email de activación automático."
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <ActionCard
          icon={Key}
          label="Reseteo de contraseña / Active Directory"
          desc="Puedes resetear la contraseña manualmente desde el panel de usuario. Si la infraestructura lo permite, la vinculación con Active Directory elimina la gestión de credenciales propias."
          iconBg="bg-muted"
          iconColor="text-foreground"
        />
      </div>
    </section>

    {/* Flujo de acceso */}
    <section>
      <SectionTitle>Flujo de Acceso</SectionTitle>
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-xs text-muted-foreground mb-3">De la invitación al documento en tres pasos:</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { icon: UserPlus, label: "Usuario creado" },
            { icon: Briefcase, label: "Asignado a Proyecto" },
            { icon: FolderOpen, label: "Accede a Documentación" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center leading-tight w-14">{step.label}</p>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-3 h-3 text-primary/50 mb-3 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </section>

    <div className="pt-2 pb-4 border-t border-border">
      <p className="text-xs text-muted-foreground text-center">
        Manual de Usuario · Gestión de Accesos · Russula Platform v1.0
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
  const isActivity = pathname.startsWith("/dashboard/activity");
  const isUsers = pathname.startsWith("/dashboard/users");

  const title = isDashboard
    ? "Guía del Dashboard"
    : isExplorer
      ? "Explorador de documentos"
      : isActivity
        ? "Panel de Actividad"
        : isUsers
          ? "Gestión de Accesos y Seguridad"
          : "Manual de Usuario";

  const subtitle = isDashboard
    ? "Métricas y análisis"
    : isExplorer
      ? "Navegación y Gestión Documental"
      : isActivity
        ? "Registro de auditoría y trazabilidad"
        : isUsers
          ? "Perfiles, permisos y altas de usuario"
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
            {isActivity && <ActivityGuide />}
            {isUsers && <UsersGuide />}
            {!isDashboard && !isExplorer && !isActivity && !isUsers && (
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
