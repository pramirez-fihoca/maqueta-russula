import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
} from "lucide-react";

const HelpPanel = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          title="Ayuda"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] p-0 flex flex-col">
        {/* Header del panel */}
        <SheetHeader className="px-7 pt-7 pb-5 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Manual de Usuario</p>
              <SheetTitle className="text-xl font-bold text-foreground leading-tight">
                Capítulo 1
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-7 py-6 space-y-9">

            {/* Sección 1: Introducción */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-primary flex-shrink-0" />
                <h2 className="text-base font-semibold text-foreground">Introducción</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El <span className="text-foreground font-medium">Explorador de Documentos</span> es el núcleo operativo de Russula. Desde aquí gestionas toda la documentación técnica de tus proyectos: subes planos, revisas versiones, compartes archivos con clientes y mantienes un registro ordenado de cada entrega.
              </p>
            </section>

            {/* Sección 2: Jerarquía */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-5 rounded-full bg-primary flex-shrink-0" />
                <h2 className="text-base font-semibold text-foreground">Jerarquía documental</h2>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Building2, label: "Cliente", desc: "Empresa o entidad contratante", color: "text-primary" },
                  { icon: Briefcase, label: "Proyecto", desc: "Encargo o contrato específico", color: "text-primary" },
                  { icon: Folder, label: "Carpeta", desc: "Agrupación temática o de fase", color: "text-primary" },
                  { icon: FileText, label: "Archivo", desc: "Documento, plano o entregable", color: "text-primary" },
                ].map((item, i, arr) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      {i < arr.length - 1 && (
                        <div className="w-px h-3 bg-border mt-1" />
                      )}
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

            {/* Sección 3: Gestión Documental */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-5 rounded-full bg-primary flex-shrink-0" />
                <h2 className="text-base font-semibold text-foreground">Gestión Documental</h2>
              </div>
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
                  <div
                    key={action.label}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50"
                  >
                    <div className={`w-8 h-8 rounded-md ${action.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <action.icon className={`w-4 h-4 ${action.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{action.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 4: Foro Técnico */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-5 rounded-full bg-primary flex-shrink-0" />
                <h2 className="text-base font-semibold text-foreground">Foro Técnico</h2>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-primary">Notas contextuales por nivel</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cada cliente, proyecto y carpeta tiene su propio hilo de comentarios. Las notas quedan ancladas al nivel en que se crean, lo que permite mantener conversaciones técnicas organizadas sin perder el contexto del documento o fase de obra.
                </p>
              </div>
            </section>

            {/* Footer informativo */}
            <div className="pt-2 pb-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Manual de Usuario · Russula Platform v1.0
              </p>
            </div>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HelpPanel;
