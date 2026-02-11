import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CLIENTS, PROJECTS, FOLDERS, DOCUMENTS, formatFileSize, Client } from '@/data/mockData';
import { 
  Folder, FileText, ChevronRight, Upload, FolderPlus, Search, 
  Download, Trash2, ArrowLeft, File, MessageSquare, Plus, Building2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type BreadcrumbItem = { id: string; name: string; type: 'root' | 'client' | 'project' | 'folder' };

const ExplorerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'Clientes', type: 'root' }
  ]);
  const [search, setSearch] = useState('');
  const [localClients, setLocalClients] = useState<Client[]>(CLIENTS);
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDesc, setNewClientDesc] = useState('');

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
  let folders: { id: string; name: string; type: 'client' | 'project' | 'folder'; date: string }[] = [];
  let documents: typeof DOCUMENTS = [];

  const handleCreateClient = () => {
    if (!newClientName.trim()) return;
    const newClient: Client = {
      id: `c${Date.now()}`,
      name: newClientName.trim(),
      description: newClientDesc.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLocalClients([...localClients, newClient]);
    setNewClientName('');
    setNewClientDesc('');
    setShowNewClient(false);
    toast.success(`Cliente "${newClient.name}" creado correctamente`);
  };

  if (currentLevel.type === 'root') {
    folders = localClients.map(c => ({ id: c.id, name: c.name, type: 'client' as const, date: c.createdAt }));
  } else if (currentLevel.type === 'client') {
    folders = PROJECTS.filter(p => p.clientId === currentLevel.id).map(p => ({ id: p.id, name: p.name, type: 'project' as const, date: p.createdAt }));
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

  const getFileTypeIcon = (name: string) => {
    if (name.endsWith('.pdf')) return <div className="w-9 h-9 rounded bg-primary/20 flex items-center justify-center"><span className="text-primary text-xs font-bold">PDF</span></div>;
    if (name.endsWith('.dwg')) return <div className="w-9 h-9 rounded bg-file-dwg/20 flex items-center justify-center"><span className="text-file-dwg text-xs font-bold">DWG</span></div>;
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) return <div className="w-9 h-9 rounded bg-file-xls/20 flex items-center justify-center"><span className="text-file-xls text-xs font-bold">XLS</span></div>;
    if (name.endsWith('.zip')) return <div className="w-9 h-9 rounded bg-file-zip/20 flex items-center justify-center"><span className="text-file-zip text-xs font-bold">ZIP</span></div>;
    return <div className="w-9 h-9 rounded bg-muted flex items-center justify-center"><File className="w-4 h-4 text-muted-foreground" /></div>;
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Explorador de Documentos</h1>
          <p className="text-sm text-muted-foreground mt-1">Navega por la estructura de Clientes y Proyectos</p>
        </div>
        {canUpload && currentLevel.type === 'root' && (
          <Button size="sm" className="russula-gradient text-primary-foreground hover:opacity-90" onClick={() => setShowNewClient(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Nuevo Cliente
          </Button>
        )}
        {canUpload && currentLevel.type !== 'root' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-secondary" onClick={() => toast.success('Carpeta creada (simulado)')}>
              <FolderPlus className="w-4 h-4 mr-1.5" />
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
      <div className="space-y-1">
        {/* Back button */}
        {breadcrumb.length > 1 && (
          <button
            onClick={() => setBreadcrumb(breadcrumb.slice(0, -1))}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver</span>
          </button>
        )}

        {/* Folders */}
        {folders.map(folder => (
          <button
            key={folder.id}
            onClick={() => openItem({ id: folder.id, name: folder.name, type: folder.type })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors group"
          >
            <div className="w-9 h-9 rounded bg-primary/15 flex items-center justify-center">
              <Folder className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{folder.name}</p>
              <p className="text-xs text-muted-foreground">{folder.date}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}

        {/* Documents */}
        {documents.map(doc => (
          <div
            key={doc.id}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors group"
          >
            {getFileTypeIcon(doc.name)}
            <button 
              className="flex-1 text-left"
              onClick={() => navigate(`/dashboard/document/${doc.id}`)}
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{doc.uploadedAt} · {formatFileSize(doc.size)}</p>
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/dashboard/document/${doc.id}`)}>
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => toast.success(`Descargando ${doc.name}...`)}>
                <Download className="w-4 h-4" />
              </Button>
              {canDelete && (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => toast.success(`Documento eliminado (simulado)`)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewClient(false)}>Cancelar</Button>
            <Button className="russula-gradient text-primary-foreground hover:opacity-90" onClick={handleCreateClient} disabled={!newClientName.trim()}>Crear Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExplorerPage;
