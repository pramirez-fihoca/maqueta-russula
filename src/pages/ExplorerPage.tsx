import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CLIENTS, PROJECTS, FOLDERS, DOCUMENTS, formatFileSize, Client, Project, ProjectType } from '@/data/mockData';
import { 
  Folder, FileText, ChevronRight, Upload, FolderPlus, Search, 
  Download, Trash2, ArrowLeft, File, MessageSquare, Plus, Building2, Briefcase,
  Droplets, BarChart3, Globe
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const PROJECT_TYPES: { value: ProjectType; label: string; icon: React.ReactNode }[] = [
  { value: 'rolling-mills', label: 'Rolling Mills', icon: <BarChart3 className="w-4 h-4" /> },
  { value: 'water-solutions', label: 'Water Solutions', icon: <Droplets className="w-4 h-4" /> },
  { value: 'digitalization', label: 'Digitalization', icon: <Globe className="w-4 h-4" /> },
];

const getProjectTypeIcon = (type?: ProjectType) => {
  switch (type) {
    case 'water-solutions': return <Droplets className="w-4 h-4 text-primary" />;
    case 'rolling-mills': return <BarChart3 className="w-4 h-4 text-primary" />;
    case 'digitalization': return <Globe className="w-4 h-4 text-primary" />;
    default: return <Briefcase className="w-4 h-4 text-primary" />;
  }
};

type BreadcrumbItem = { id: string; name: string; type: 'root' | 'client' | 'project' | 'folder' };

const ExplorerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Find the client associated with this user (for client role)
  const isClientRole = user?.role === 'client';
  const userClient = isClientRole ? CLIENTS.find(c => c.name === user?.company) : null;

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>(() => {
    if (isClientRole && userClient) {
      return [
        { id: userClient.id, name: 'Proyectos', type: 'client' }
      ];
    }
    return [{ id: 'root', name: 'Clientes', type: 'root' }];
  });
  const [search, setSearch] = useState('');
  const [localClients, setLocalClients] = useState<Client[]>(CLIENTS);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDesc, setNewClientDesc] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectType, setNewProjectType] = useState<ProjectType | ''>('');
  const [newProjectDate, setNewProjectDate] = useState<Date>();
  const [localProjects, setLocalProjects] = useState<Project[]>(PROJECTS);

  const currentLevel = breadcrumb[breadcrumb.length - 1];
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';
  const canUpload = isAdmin || isEditor;
  const canDelete = isAdmin;

  const navigateTo = (item: BreadcrumbItem) => {
    const idx = breadcrumb.findIndex(b => b.id === item.id);
    if (idx >= 0) setBreadcrumb(breadcrumb.slice(0, idx + 1));
  };

  const openItem = (item: BreadcrumbItem) => {
    setBreadcrumb([...breadcrumb, item]);
  };

  // Determine content based on current level
  let folders: { id: string; name: string; type: 'client' | 'project' | 'folder'; date: string; projectType?: ProjectType; description?: string; projectCount?: number }[] = [];
  let documents: typeof DOCUMENTS = [];

  const handleCreateClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: newClientName.trim(),
      description: newClientDesc.trim(),
      address: newClientAddress.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLocalClients([...localClients, newClient]);
    setNewClientName('');
    setNewClientDesc('');
    setNewClientAddress('');
    setShowNewClient(false);
    toast.success(`Cliente "${newClient.name}" creado correctamente`);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !newProjectType || !newProjectDate) return;
    const newProject: Project = {
      id: `p${Date.now()}`,
      clientId: currentLevel.id,
      name: newProjectName.trim(),
      description: '',
      type: newProjectType as ProjectType,
      createdAt: format(newProjectDate, 'yyyy-MM-dd'),
    };
    setLocalProjects([...localProjects, newProject]);
    setNewProjectName('');
    setNewProjectType('');
    setNewProjectDate(undefined);
    setShowNewProject(false);
    toast.success(`Proyecto "${newProject.name}" creado correctamente`);
  };

  if (currentLevel.type === 'root') {
    folders = localClients.map(c => {
      const projectCount = localProjects.filter(p => p.clientId === c.id).length;
      return { id: c.id, name: c.name, type: 'client' as const, date: c.createdAt, description: c.description, projectCount };
    });
  } else if (currentLevel.type === 'client') {
    folders = localProjects.filter(p => p.clientId === currentLevel.id).map(p => ({ id: p.id, name: p.name, type: 'project' as const, date: p.createdAt, projectType: p.type, description: p.description }));
  } else if (currentLevel.type === 'project') {
    folders = FOLDERS.filter(f => f.projectId === currentLevel.id && !f.parentId).map(f => ({ id: f.id, name: f.name, type: 'folder' as const, date: f.createdAt }));
    documents = DOCUMENTS.filter(d => {
      const folder = FOLDERS.find(f => f.id === d.folderId);
      return folder?.projectId === currentLevel.id && !folder.parentId;
    });
  } else if (currentLevel.type === 'folder') {
    folders = FOLDERS.filter(f => f.parentId === currentLevel.id).map(f => ({ id: f.id, name: f.name, type: 'folder' as const, date: f.createdAt }));
    documents = DOCUMENTS.filter(d => d.folderId === currentLevel.id);
  }

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    folders = folders.filter(f => f.name.toLowerCase().includes(q));
    documents = documents.filter(d => d.name.toLowerCase().includes(q));
  }

  const getFileTypeLabel = (name: string) => {
    if (name.endsWith('.pdf')) return 'Documento PDF';
    if (name.endsWith('.dwg')) return 'Archivo DWG';
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'Hoja de cálculo Excel';
    if (name.endsWith('.zip')) return 'Carpeta comprimida (zip)';
    if (name.endsWith('.doc') || name.endsWith('.docx')) return 'Documento Word';
    return 'Archivo';
  };

  const getFileTypeIcon = (name: string) => {
    if (name.endsWith('.pdf')) return <div className="w-5 h-5 rounded flex items-center justify-center"><span className="text-primary text-[10px] font-bold">PDF</span></div>;
    if (name.endsWith('.dwg')) return <div className="w-5 h-5 rounded flex items-center justify-center"><span className="text-file-dwg text-[10px] font-bold">DWG</span></div>;
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return <div className="w-5 h-5 rounded flex items-center justify-center"><span className="text-file-xls text-[10px] font-bold">XLS</span></div>;
    if (name.endsWith('.zip')) return <div className="w-5 h-5 rounded flex items-center justify-center"><span className="text-file-zip text-[10px] font-bold">ZIP</span></div>;
    return <File className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {isClientRole ? 'Explorador de Proyectos' : 'Explorador de Documentos'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isClientRole ? 'Navega por tus proyectos y documentación' : 'Navega por la estructura de Clientes y Proyectos'}
          </p>
        </div>
        {canUpload && currentLevel.type === 'root' && (
          <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => setShowNewClient(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Cliente
          </Button>
        )}
        {canUpload && currentLevel.type === 'client' && (
          <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => setShowNewProject(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Proyecto
          </Button>
        )}
        {canUpload && (currentLevel.type === 'project' || currentLevel.type === 'folder') && (
          <div className="flex gap-2">
            <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => toast.success('Carpeta creada (simulado)')}>
              <Plus className="w-4 h-4 mr-1.5" />
              Nueva Carpeta
            </Button>
            <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => toast.success('Archivo subido (simulado)')}>
              <Upload className="w-4 h-4 mr-1.5" />
              Subir Archivo
            </Button>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4 text-sm flex-wrap">
        {breadcrumb.map((item, i) => (
          <div key={item.id} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            <button
              onClick={() => navigateTo(item)}
              className={`hover:text-primary transition-colors ${
                i === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Content */}
      <div>
        {/* Back button */}
        {breadcrumb.length > 1 && (
          <button
            onClick={() => setBreadcrumb(breadcrumb.slice(0, -1))}
            className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg hover:bg-secondary transition-colors text-muted-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        )}

        {/* Card grid for clients and projects */}
        {(currentLevel.type === 'root' || currentLevel.type === 'client') && folders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => openItem({ id: folder.id, name: folder.name, type: folder.type })}
                className="group relative flex flex-col gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-left"
              >
                {/* Icon + Type badge */}
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    folder.type === 'client' ? "bg-primary/10" :
                    folder.projectType === 'water-solutions' ? "bg-blue-500/10" :
                    folder.projectType === 'digitalization' ? "bg-emerald-500/10" :
                    "bg-orange-500/10"
                  )}>
                    {folder.type === 'client' ? (
                      <Building2 className="w-5 h-5 text-primary" />
                    ) : folder.projectType === 'water-solutions' ? (
                      <Droplets className="w-5 h-5 text-blue-500" />
                    ) : folder.projectType === 'digitalization' ? (
                      <Globe className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                    )}
                  </div>
                  {folder.type === 'project' && folder.projectType && (
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      folder.projectType === 'water-solutions' ? "bg-blue-500/10 text-blue-500" :
                      folder.projectType === 'digitalization' ? "bg-emerald-500/10 text-emerald-500" :
                      "bg-orange-500/10 text-orange-500"
                    )}>
                      {PROJECT_TYPES.find(pt => pt.value === folder.projectType)?.label}
                    </span>
                  )}
                  {canDelete && folder.type === 'client' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocalClients(localClients.filter(c => c.id !== folder.id));
                        toast.success(`Cliente "${folder.name}" eliminado`);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                {/* Name */}
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{folder.name}</p>
                  {folder.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{folder.description}</p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                  <span className="text-[11px] text-muted-foreground">{folder.date}</span>
                  {folder.type === 'client' && folder.projectCount !== undefined && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {folder.projectCount} {folder.projectCount === 1 ? 'proyecto' : 'proyectos'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Windows Explorer-style table for folders and documents inside projects */}
        {(currentLevel.type === 'project' || currentLevel.type === 'folder') && (folders.length > 0 || documents.length > 0) && (
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_180px_200px_100px] gap-0 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="px-4 py-2.5">Nombre</div>
              <div className="px-4 py-2.5">Fecha de modificación</div>
              <div className="px-4 py-2.5">Tipo</div>
              <div className="px-4 py-2.5 text-right">Tamaño</div>
            </div>

            {/* Folder rows */}
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => openItem({ id: folder.id, name: folder.name, type: folder.type })}
                className="w-full grid grid-cols-[1fr_180px_200px_100px] gap-0 items-center hover:bg-secondary/60 transition-colors group border-b border-border/50 last:border-b-0"
              >
                <div className="px-4 py-2.5 flex items-center gap-2.5 text-left">
                  <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{folder.name}</span>
                </div>
                <div className="px-4 py-2.5 text-sm text-muted-foreground">{folder.date}</div>
                <div className="px-4 py-2.5 text-sm text-muted-foreground">Carpeta de archivos</div>
                <div className="px-4 py-2.5 text-sm text-muted-foreground text-right">—</div>
              </button>
            ))}

            {/* Document rows */}
            {documents.map(doc => (
              <div
                key={doc.id}
                className="w-full grid grid-cols-[1fr_180px_200px_100px] gap-0 items-center hover:bg-secondary/60 transition-colors group border-b border-border/50 last:border-b-0"
              >
                <button
                  onClick={() => navigate(`/dashboard/document/${doc.id}`)}
                  className="px-4 py-2.5 flex items-center gap-2.5 text-left"
                >
                  {getFileTypeIcon(doc.name)}
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{doc.name}</span>
                </button>
                <div className="px-4 py-2.5 text-sm text-muted-foreground">{doc.uploadedAt}</div>
                <div className="px-4 py-2.5 text-sm text-muted-foreground">{getFileTypeLabel(doc.name)}</div>
                <div className="px-4 py-2.5 text-sm text-muted-foreground text-right">{formatFileSize(doc.size)}</div>
              </div>
            ))}
          </div>
        )}

        {folders.length === 0 && documents.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <FolderPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No hay contenido en esta carpeta</p>
          </div>
        )}
      </div>

      {/* Dialog Nuevo Cliente */}
      <Dialog open={showNewClient} onOpenChange={setShowNewClient}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Nuevo Cliente
            </DialogTitle>
            <DialogDescription>Crea un nuevo cliente para organizar sus proyectos y documentación.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nombre del Cliente</Label>
              <Input id="client-name" placeholder="Ej: Steel Corp" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-desc">Descripción</Label>
              <Textarea id="client-desc" placeholder="Breve descripción del cliente..." value={newClientDesc} onChange={e => setNewClientDesc(e.target.value)} className="bg-background border-border resize-none" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-address">Dirección</Label>
              <Input id="client-address" placeholder="Ej: Av. Principal 123, Ciudad, País" value={newClientAddress} onChange={e => setNewClientAddress(e.target.value)} className="bg-background border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClient(false)}>Cancelar</Button>
            <Button className="russula-gradient text-primary-foreground hover:opacity-90" onClick={handleCreateClient} disabled={!newClientName.trim()}>Crear Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nuevo Proyecto */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Nuevo Proyecto
            </DialogTitle>
            <DialogDescription>Crea un nuevo proyecto dentro de este cliente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Nombre del Proyecto</Label>
              <Input id="project-name" placeholder="Ej: Hot Rolling Mill Upgrade" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Proyecto</Label>
              <Select value={newProjectType} onValueChange={(v) => setNewProjectType(v as ProjectType)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map(pt => (
                    <SelectItem key={pt.value} value={pt.value}>
                      <span className="flex items-center gap-2">{pt.icon} {pt.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fecha del Proyecto</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background border-border", !newProjectDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newProjectDate ? format(newProjectDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={newProjectDate} onSelect={setNewProjectDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProject(false)}>Cancelar</Button>
            <Button className="russula-gradient text-primary-foreground hover:opacity-90" onClick={handleCreateProject} disabled={!newProjectName.trim() || !newProjectType || !newProjectDate}>Crear Proyecto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExplorerPage;
