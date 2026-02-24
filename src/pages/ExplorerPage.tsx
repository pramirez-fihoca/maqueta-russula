import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CLIENTS, PROJECTS, FOLDERS, DOCUMENTS, COMMENTS, USERS, formatFileSize, Client, Project, ProjectType, ProjectStatus } from '@/data/mockData';
import {
  Folder, FileText, ChevronRight, Upload, FolderPlus, Search,
  Download, Trash2, ArrowLeft, File, MessageSquare, Plus, Building2, Briefcase,
  Droplets, BarChart3, Globe, Send, Heart, Reply, MoreHorizontal, Archive, FileArchive } from
'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from
'@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from
'@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

const PROJECT_TYPES: {value: ProjectType;label: string;icon: React.ReactNode;}[] = [
{ value: 'rolling-mills', label: 'Rolling Mills', icon: <BarChart3 className="w-4 h-4" /> },
{ value: 'water-solutions', label: 'Water Solutions', icon: <Droplets className="w-4 h-4" /> },
{ value: 'digitalization', label: 'Digitalization', icon: <Globe className="w-4 h-4" /> }];


const getProjectTypeIcon = (type?: ProjectType) => {
  switch (type) {
    case 'water-solutions':return <Droplets className="w-4 h-4 text-primary" />;
    case 'rolling-mills':return <BarChart3 className="w-4 h-4 text-primary" />;
    case 'digitalization':return <Globe className="w-4 h-4 text-primary" />;
    default:return <Briefcase className="w-4 h-4 text-primary" />;
  }
};

type BreadcrumbItem = {id: string;name: string;type: 'root' | 'client' | 'project' | 'folder';};

const ExplorerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isClientRole = user?.role === 'client';
  const userClient = isClientRole ? CLIENTS.find((c) => c.name === user?.company) : null;

  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>(() => {
    if (isClientRole && userClient) {
      return [{ id: userClient.id, name: 'Proyectos', type: 'client' }];
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
  const [comments, setComments] = useState(COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'archived' | 'all'>('active');
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [archiveConfirmText, setArchiveConfirmText] = useState('');
  const [activateTarget, setActivateTarget] = useState<string | null>(null);

  const currentLevel = breadcrumb[breadcrumb.length - 1];
  const isAdmin = user?.role === 'admin';
  const isEditor = user?.role === 'editor';
  const canUpload = isAdmin || isEditor || isClientRole;
  const canDelete = isAdmin;

  const navigateTo = (item: BreadcrumbItem) => {
    const idx = breadcrumb.findIndex((b) => b.id === item.id);
    if (idx >= 0) setBreadcrumb(breadcrumb.slice(0, idx + 1));
  };

  const openItem = (item: BreadcrumbItem) => {
    setBreadcrumb([...breadcrumb, item]);
  };

  let folders: {id: string;name: string;type: 'client' | 'project' | 'folder';date: string;projectType?: ProjectType;projectStatus?: ProjectStatus;description?: string;projectCount?: number;}[] = [];
  let documents: typeof DOCUMENTS = [];

  const handleCreateClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: newClientName.trim(),
      description: newClientDesc.trim(),
      address: newClientAddress.trim(),
      createdAt: new Date().toISOString().split('T')[0]
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
      status: 'active',
      createdAt: format(newProjectDate, 'yyyy-MM-dd')
    };
    setLocalProjects([...localProjects, newProject]);
    setNewProjectName('');
    setNewProjectType('');
    setNewProjectDate(undefined);
    setShowNewProject(false);
    toast.success(`Proyecto "${newProject.name}" creado correctamente`);
  };

  const handleArchiveProject = () => {
    if (!archiveTarget) return;
    setLocalProjects(localProjects.map((p) => p.id === archiveTarget ? { ...p, status: 'archived' as ProjectStatus } : p));
    const project = localProjects.find((p) => p.id === archiveTarget);
    setArchiveTarget(null);
    setArchiveConfirmText('');
    toast.success(`Proyecto "${project?.name}" archivado correctamente`);
  };

  const handleActivateProject = () => {
    if (!activateTarget) return;
    setLocalProjects(localProjects.map((p) => p.id === activateTarget ? { ...p, status: 'active' as ProjectStatus } : p));
    const project = localProjects.find((p) => p.id === activateTarget);
    setActivateTarget(null);
    toast.success(`Proyecto "${project?.name}" activado correctamente`);
  };

  if (currentLevel.type === 'root') {
    let visibleClients = localClients;
    if (isEditor && user?.assignedClients) {
      visibleClients = localClients.filter((c) => user.assignedClients!.includes(c.id));
    }
    folders = visibleClients.map((c) => {
      const projectCount = localProjects.filter((p) => p.clientId === c.id).length;
      return { id: c.id, name: c.name, type: 'client' as const, date: c.createdAt, description: c.description, projectCount };
    });
  } else if (currentLevel.type === 'client') {
    let clientProjects = localProjects.filter((p) => p.clientId === currentLevel.id);
    // Apply status filter (admin only)
    if (isAdmin && statusFilter !== 'all') {
      clientProjects = clientProjects.filter((p) => p.status === statusFilter);
    } else if (!isAdmin) {
      // Non-admin users only see active projects
      clientProjects = clientProjects.filter((p) => p.status === 'active');
    }
    folders = clientProjects.map((p) => ({ id: p.id, name: p.name, type: 'project' as const, date: p.createdAt, projectType: p.type, projectStatus: p.status, description: p.description }));
  } else if (currentLevel.type === 'project') {
    folders = FOLDERS.filter((f) => f.projectId === currentLevel.id && !f.parentId).map((f) => ({ id: f.id, name: f.name, type: 'folder' as const, date: f.createdAt }));
    documents = DOCUMENTS.filter((d) => {
      const folder = FOLDERS.find((f) => f.id === d.folderId);
      return folder?.projectId === currentLevel.id && !folder.parentId;
    });
  } else if (currentLevel.type === 'folder') {
    folders = FOLDERS.filter((f) => f.parentId === currentLevel.id).map((f) => ({ id: f.id, name: f.name, type: 'folder' as const, date: f.createdAt }));
    documents = DOCUMENTS.filter((d) => d.folderId === currentLevel.id);
  }

  if (search) {
    const q = search.toLowerCase();
    folders = folders.filter((f) => f.name.toLowerCase().includes(q));
    documents = documents.filter((d) => d.name.toLowerCase().includes(q));
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

  const projectBreadcrumb = breadcrumb.find((b) => b.type === 'project');
  const showComments = (currentLevel.type === 'project' || currentLevel.type === 'folder') && !!projectBreadcrumb || currentLevel.type === 'project';

  // Check if current project is archived
  const currentProjectData = currentLevel.type === 'project' ? localProjects.find((p) => p.id === currentLevel.id) : null;
  const isCurrentProjectArchived = currentProjectData?.status === 'archived';

  // Shared folder/document list content
  const FolderContent = () =>
  <>
      {breadcrumb.length > 1 &&
    <button
      onClick={() => setBreadcrumb(breadcrumb.slice(0, -1))}
      className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg hover:bg-secondary transition-colors text-muted-foreground text-sm">

          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
    }

      {/* Card grid for clients and projects */}
      {(currentLevel.type === 'root' || currentLevel.type === 'client') && folders.length > 0 &&
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => {
        const isArchived = folder.projectStatus === 'archived';
        return (
          <button
            key={folder.id}
            onClick={() => openItem({ id: folder.id, name: folder.name, type: folder.type })}
            className={cn(
              "group relative flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 text-left",
              isArchived ?
              "border-border/50 bg-muted/40 opacity-70 hover:opacity-90 hover:border-border" :
              "border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            )}>

              <div className="flex items-start justify-between">
                <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isArchived ? "bg-muted" :
                folder.type === 'client' ? "bg-primary/10" :
                folder.projectType === 'water-solutions' ? "bg-blue-500/10" :
                folder.projectType === 'digitalization' ? "bg-emerald-500/10" :
                "bg-orange-500/10"
              )}>
                  {folder.type === 'client' ?
                <Building2 className="w-5 h-5 text-primary" /> :
                isArchived ?
                <Archive className="w-5 h-5 text-muted-foreground" /> :
                folder.projectType === 'water-solutions' ?
                <Droplets className="w-5 h-5 text-blue-500" /> :
                folder.projectType === 'digitalization' ?
                <Globe className="w-5 h-5 text-emerald-500" /> :

                <BarChart3 className="w-5 h-5 text-orange-500" />
                }
                </div>
                <div className="flex items-center gap-1.5">
                  {folder.type === 'project' && folder.projectStatus === 'archived' &&
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      Archivado
                    </span>
                }
                  {folder.type === 'project' && folder.projectType &&
                <span className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                  isArchived ? "bg-muted text-muted-foreground" :
                  folder.projectType === 'water-solutions' ? "bg-blue-500/10 text-blue-500" :
                  folder.projectType === 'digitalization' ? "bg-emerald-500/10 text-emerald-500" :
                  "bg-orange-500/10 text-orange-500"
                )}>
                        {PROJECT_TYPES.find((pt) => pt.value === folder.projectType)?.label}
                      </span>
                }
                  {isAdmin && folder.type === 'project' && folder.projectStatus === 'active' &&
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-warning opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setArchiveTarget(folder.id);
                  }}>
                      <Archive className="w-3.5 h-3.5" />
                    </Button>
                }
                </div>
                {canDelete && folder.type === 'client' &&
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalClients(localClients.filter((c) => c.id !== folder.id));
                  toast.success(`Cliente "${folder.name}" eliminado`);
                }}>

                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
              }
              </div>
              <div>
                <p className={cn(
                "text-sm font-semibold transition-colors line-clamp-1",
                isArchived ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
              )}>{folder.name}</p>
                {folder.description &&
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{folder.description}</p>
              }
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                <span className="text-[11px] text-muted-foreground">{folder.date}</span>
                {folder.type === 'client' && folder.projectCount !== undefined &&
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {folder.projectCount} {folder.projectCount === 1 ? 'proyecto' : 'proyectos'}
                  </span>
              }
                {folder.type === 'project' && folder.projectStatus === 'archived' &&
              <Button
                size="sm"
                className="russula-gradient text-primary-foreground hover:opacity-90"
                onClick={(e) => {
                  e.stopPropagation();
                  const projectDocs = DOCUMENTS.filter((d) => {
                    const f = FOLDERS.find((fl) => fl.id === d.folderId);
                    return f?.projectId === folder.id;
                  });
                  const totalSize = projectDocs.reduce((acc, d) => acc + d.size, 0);
                  const isLarge = totalSize > 50 * 1024 * 1024;
                  toast.info('Generando archivo comprimido...');
                  if (isLarge) {
                    setTimeout(() => {
                      toast.warning('Esta operación puede tardar unos minutos debido al volumen de planos y vídeos');
                    }, 800);
                  }
                  setTimeout(() => {
                    toast.success(`Descarga iniciada: ${folder.name}.zip`);
                  }, isLarge ? 2000 : 1200);
                }}>
                    <FileArchive className="w-3.5 h-3.5" />
                    Descargar ZIP
                  </Button>
              }
              </div>
            </button>);

      })}
        </div>
    }

      {/* Windows Explorer-style table for folders and documents inside projects */}
      {(currentLevel.type === 'project' || currentLevel.type === 'folder') && (folders.length > 0 || documents.length > 0) &&
    <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="grid grid-cols-[1fr_110px_100px_120px_70px] gap-0 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="px-3 py-2.5">Nombre</div>
            <div className="px-3 py-2.5">Fecha</div>
            <div className="px-3 py-2.5">Tipo</div>
            <div className="px-3 py-2.5">Subido por</div>
            <div className="px-3 py-2.5 text-right">Tamaño</div>
          </div>

          {folders.map((folder) =>
      <button
        key={folder.id}
        onClick={() => openItem({ id: folder.id, name: folder.name, type: folder.type })}
        className="w-full grid grid-cols-[1fr_110px_100px_120px_70px] gap-0 items-start text-left hover:bg-secondary/60 transition-colors group border-b border-border/50 last:border-b-0">

              <div className="px-3 py-2.5 flex items-center gap-2 text-left min-w-0">
                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{folder.name}</span>
              </div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground text-left">{folder.date}</div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground text-left truncate">Carpeta</div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground text-left">—</div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground text-right">—</div>
            </button>
      )}

          {documents.map((doc) => {
        const uploader = USERS.find((u) => u.id === doc.uploadedBy);
        return (
          <div
            key={doc.id}
            className="w-full grid grid-cols-[1fr_110px_100px_120px_70px] gap-0 items-start hover:bg-secondary/60 transition-colors group border-b border-border/50 last:border-b-0">

              <button
              onClick={() => navigate(`/dashboard/document/${doc.id}`)}
              className="px-3 py-2.5 flex items-center gap-2 text-left min-w-0">

                {getFileTypeIcon(doc.name)}
                <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate">{doc.name}</span>
              </button>
              <div className="px-3 py-2.5 text-xs text-muted-foreground">{doc.uploadedAt}</div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground truncate">{getFileTypeLabel(doc.name)}</div>
              <div className="px-3 py-2 min-w-0">
                {uploader && <>
                  <span className="text-xs text-muted-foreground truncate block">{uploader.name}</span>
                  <span className={cn("inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium truncate", uploader.company === 'Russula' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground')}>{uploader.company}</span>
                </>}
              </div>
              <div className="px-3 py-2.5 text-xs text-muted-foreground text-right">{formatFileSize(doc.size)}</div>
            </div>);

      })}
        </div>
    }

      {folders.length === 0 && documents.length === 0 &&
    <div className="text-center py-16 text-muted-foreground">
          <FolderPlus className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No hay contenido en esta carpeta</p>
        </div>
    }
    </>;


  // Comments panel content
  const CommentsPanel = () => {
    const projectId = currentLevel.type === 'project' ? currentLevel.id : projectBreadcrumb!.id;
    const projectComments = comments.filter((c) => c.projectId === projectId);
    const rootComments = projectComments.filter((c) => !c.parentId);

    const handleAddComment = () => {
      if (!newComment.trim() || !user) return;
      const comment = {
        id: `cm-new-${Date.now()}`,
        projectId,
        userId: user.id,
        parentId: null,
        text: newComment,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comentario agregado');
    };

    const renderComment = (comment: typeof COMMENTS[0], depth = 0) => {
      const author = USERS.find((u) => u.id === comment.userId);
      const replies = projectComments.filter((c) => c.parentId === comment.id);
      return (
        <div key={comment.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-border pl-3' : ''}`}>
          <div className="py-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                {author?.name.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-foreground text-sm">{author?.name}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                </div>
                <p className="text-foreground/90 leading-relaxed text-sm">{comment.text}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                    <Reply className="w-3 h-3" />
                    Responder
                  </button>
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="w-3 h-3" />
                    {comment.likes > 0 && comment.likes}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {replies.map((r) => renderComment(r, depth + 1))}
        </div>);

    };

    return (
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
        <div className="p-3 border-b border-border">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2 text-base">
            <MessageSquare className="w-4 h-4 text-primary" />
            Comentarios ({projectComments.length})
          </h3>
        </div>
        <div className="flex-1 overflow-auto p-3 divide-y divide-border">
          {rootComments.length > 0 ?
          rootComments.map((c) => renderComment(c)) :

          <div className="text-center py-6 text-muted-foreground text-xs">
              No hay comentarios aún
            </div>
          }
        </div>
        <div className="p-3 border-t border-border">
          <div className="flex gap-2">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[50px] text-xs"
              rows={2} />

            <Button onClick={handleAddComment} className="russula-gradient text-primary-foreground hover:opacity-90 self-end" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>);

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
        <div className="flex items-center gap-2">
          {/* Archive project button when inside a project (admin only) */}
          {isAdmin && currentLevel.type === 'project' && currentProjectData?.status === 'active' &&
          <Button
            size="sm"
            variant="outline"
            className="border-warning/50 text-warning hover:bg-warning/10"
            onClick={() => setArchiveTarget(currentLevel.id)}>
              <Archive className="w-4 h-4 mr-1.5" />
              Archivar Proyecto
            </Button>
          }
          {isAdmin && currentLevel.type === 'root' &&
          <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => setShowNewClient(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo Cliente
            </Button>
          }
          {canUpload && currentLevel.type === 'client' &&
          <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => setShowNewProject(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Nuevo Proyecto
            </Button>
          }
          {canUpload && (currentLevel.type === 'project' || currentLevel.type === 'folder') && !isCurrentProjectArchived &&
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
          }
          {isAdmin && currentLevel.type === 'project' && isCurrentProjectArchived &&
          <Button
            size="sm"
            variant="outline"
            className="border-success/50 text-success hover:bg-success/10"
            onClick={() => setActivateTarget(currentLevel.id)}>
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Activar Proyecto
            </Button>
          }
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4 text-sm flex-wrap">
        {breadcrumb.map((item, i) =>
        <div key={item.id} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            <button
            onClick={() => navigateTo(item)}
            className={`hover:text-primary transition-colors ${
            i === breadcrumb.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`
            }>

              {item.name}
            </button>
          </div>
        )}
      </div>

      {/* Search + Status filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground" />
        </div>
        {isAdmin && currentLevel.type === 'client' &&
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'active' | 'archived' | 'all')}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="archived">Archivados</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>
        }
      </div>

      {/* Content + Comments layout */}
      {showComments ?
      <ResizablePanelGroup direction="horizontal" className="min-h-[400px]">
          <ResizablePanel defaultSize={65} minSize={30}>
            <div className="h-full pr-2 overflow-auto">
              <FolderContent />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="mx-1" />

          <ResizablePanel defaultSize={35} minSize={20}>
            <div className="h-full pl-2">
              <CommentsPanel />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup> :

      <FolderContent />
      }

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
              <Input id="client-name" placeholder="Ej: Steel Corp" value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-desc">Descripción</Label>
              <Textarea id="client-desc" placeholder="Breve descripción del cliente..." value={newClientDesc} onChange={(e) => setNewClientDesc(e.target.value)} className="bg-background border-border resize-none" rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-address">Dirección</Label>
              <Input id="client-address" placeholder="Ej: Av. Principal 123, Ciudad, País" value={newClientAddress} onChange={(e) => setNewClientAddress(e.target.value)} className="bg-background border-border" />
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
              <Input id="project-name" placeholder="Ej: Hot Rolling Mill Upgrade" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Proyecto</Label>
              <Select value={newProjectType} onValueChange={(v) => setNewProjectType(v as ProjectType)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((pt) =>
                  <SelectItem key={pt.value} value={pt.value}>
                      <span className="flex items-center gap-2">{pt.icon} {pt.label}</span>
                    </SelectItem>
                  )}
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

      {/* AlertDialog Archivar Proyecto */}
      <AlertDialog open={!!archiveTarget} onOpenChange={(open) => {if (!open) {setArchiveTarget(null);setArchiveConfirmText('');}}}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2 text-foreground">
              <Archive className="w-5 h-5 text-warning" />
              Archivar Proyecto
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground leading-relaxed">
              Al archivar este proyecto, toda la documentación asociada <strong className="text-foreground">dejará de estar visible para el cliente</strong>. El proyecto se moverá al histórico y solo será accesible desde el filtro «Archivados».
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-2">
            <Label className="text-sm text-muted-foreground">Por seguridad, escriba <strong className="text-foreground">ARCHIVAR</strong> para confirmar</Label>
            <Input
              value={archiveConfirmText}
              onChange={(e) => setArchiveConfirmText(e.target.value)}
              placeholder="ARCHIVAR"
              className={cn(
                "bg-background border-border",
                archiveConfirmText === 'ARCHIVAR' && "border-warning ring-1 ring-warning"
              )} />

          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchiveProject}
              disabled={archiveConfirmText !== 'ARCHIVAR'}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold disabled:opacity-50 disabled:pointer-events-none">
              Confirmar Archivado
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog Activar Proyecto */}
      <AlertDialog open={!!activateTarget} onOpenChange={(open) => !open && setActivateTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-success" />
              Activar Proyecto
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Estás a punto de desarchivar el proyecto <strong className="text-foreground">{localProjects.find((p) => p.id === activateTarget)?.name}</strong>.</p>
                <ul className="space-y-2 text-sm">
                  <li><strong className="text-foreground">Visibilidad:</strong> El proyecto volverá a aparecer en el Explorador de Clientes de forma inmediata.</li>
                  <li><strong className="text-foreground">Acceso:</strong> Todos los usuarios y clientes asignados recuperarán sus permisos de visualización y descarga.</li>
                  <li><strong className="text-foreground">Sincronización:</strong> Se reactivarán las notificaciones y el Foro Técnico asociado a este proyecto.</li>
                </ul>
                <p>¿Deseas devolver este proyecto al estado Activo?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primary text-primary hover:bg-primary/10 hover:text-primary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateProject}
              className="bg-success text-primary-foreground hover:bg-success/90 font-semibold">
              Activar Proyecto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>);

};

export default ExplorerPage;