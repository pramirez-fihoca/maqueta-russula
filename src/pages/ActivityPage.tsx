import { useState, useMemo } from 'react';
import { DOWNLOAD_RECORDS, DOCUMENTS, USERS, FOLDERS, PROJECTS, CLIENTS, COMMENTS } from '@/data/mockData';
import { Download, FileDown, Search, Upload, Eye, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type ActionType = 'download' | 'upload' | 'view' | 'comment';

interface ActivityRecord {
  id: string;
  userId: string;
  documentId: string;
  action: ActionType;
  dateTime: string;
}

const ITEMS_PER_PAGE = 10;

const ActivityPage = () => {
  const { user: authUser } = useAuth();
  const [filterUser, setFilterUser] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Determine which client IDs this user can see
  const visibleClientIds = useMemo(() => {
    if (!authUser) return [];
    if (authUser.role === 'admin') return null; // null = all
    if (authUser.role === 'editor') return authUser.assignedClients || [];
    // client: find the client matching their company
    const userClient = CLIENTS.find(c => c.name === authUser.company);
    return userClient ? [userClient.id] : [];
  }, [authUser]);

  // Build unified activity records from all sources
  const allRecords: ActivityRecord[] = useMemo(() => {
    const records: ActivityRecord[] = [];

    // Downloads
    DOWNLOAD_RECORDS.forEach(r => {
      records.push({ id: `dl-${r.id}`, userId: r.userId, documentId: r.documentId, action: 'download', dateTime: r.downloadedAt });
    });

    // Uploads (from documents metadata)
    DOCUMENTS.forEach(d => {
      records.push({ id: `up-${d.id}`, userId: d.uploadedBy, documentId: d.id, action: 'upload', dateTime: `${d.uploadedAt}T09:00:00` });
    });

    // Views (simulated — some users viewed without downloading)
    const viewData = [
      { id: 'vw1', userId: 'u3', documentId: 'd1', dateTime: '2024-03-02T09:00:00' },
      { id: 'vw2', userId: 'u7', documentId: 'd4', dateTime: '2024-02-22T09:30:00' },
      { id: 'vw3', userId: 'u4', documentId: 'd8', dateTime: '2024-06-16T08:00:00' },
      { id: 'vw4', userId: 'u5', documentId: 'd11', dateTime: '2024-08-11T14:00:00' },
      { id: 'vw5', userId: 'u3', documentId: 'd6', dateTime: '2024-05-02T16:30:00' },
      { id: 'vw6', userId: 'u8', documentId: 'd9', dateTime: '2024-08-01T10:00:00' },
      { id: 'vw7', userId: 'u4', documentId: 'd10', dateTime: '2024-08-19T11:45:00' },
      { id: 'vw8', userId: 'u5', documentId: 'd12', dateTime: '2024-10-01T12:00:00' },
    ];
    viewData.forEach(v => {
      records.push({ id: `vw-${v.id}`, userId: v.userId, documentId: v.documentId, action: 'view', dateTime: v.dateTime });
    });

    // Comments
    COMMENTS.forEach(c => {
      const project = PROJECTS.find(p => p.id === c.projectId);
      // Find any document in this project for activity linking
      const projectFolders = FOLDERS.filter(f => f.projectId === c.projectId);
      const projectDoc = DOCUMENTS.find(d => projectFolders.some(f => f.id === d.folderId));
      records.push({ id: `cm-${c.id}`, userId: c.userId, documentId: projectDoc?.id || '', action: 'comment', dateTime: c.createdAt });
    });

    return records.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, []);

  const enriched = useMemo(() => allRecords.map(record => {
    const doc = DOCUMENTS.find(d => d.id === record.documentId);
    const user = USERS.find(u => u.id === record.userId);
    const folder = FOLDERS.find(f => f.id === doc?.folderId);
    const project = PROJECTS.find(p => p.id === folder?.projectId);
    const client = CLIENTS.find(c => c.id === project?.clientId);
    return { ...record, doc, user, project, client };
  }), [allRecords]);

  // Filter by role visibility first
  const roleFiltered = useMemo(() => {
    if (visibleClientIds === null) return enriched; // admin sees all
    return enriched.filter(r => r.client && visibleClientIds.includes(r.client.id));
  }, [enriched, visibleClientIds]);

  // Visible projects for the filter dropdown
  const visibleProjects = useMemo(() => {
    if (visibleClientIds === null) return PROJECTS;
    return PROJECTS.filter(p => visibleClientIds.includes(p.clientId));
  }, [visibleClientIds]);

  let filtered = roleFiltered;
  if (filterUser !== 'all') filtered = filtered.filter(r => r.userId === filterUser);
  if (filterProject !== 'all') filtered = filtered.filter(r => r.project?.id === filterProject);
  if (filterAction !== 'all') filtered = filtered.filter(r => r.action === filterAction);
  if (filterDateFrom) filtered = filtered.filter(r => r.dateTime >= filterDateFrom);
  if (filterDateTo) filtered = filtered.filter(r => r.dateTime <= `${filterDateTo}T23:59:59`);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.doc?.name.toLowerCase().includes(q) || r.user?.name.toLowerCase().includes(q));
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRecords = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  const resetPage = (setter: (v: string) => void) => (v: string) => { setter(v); setCurrentPage(1); };

  const uniqueUsers = [...new Map(USERS.map(u => [u.id, u])).values()];

  // Stats
  const totalActions = roleFiltered.length;
  const totalDownloads = roleFiltered.filter(r => r.action === 'download').length;
  const totalUploads = roleFiltered.filter(r => r.action === 'upload').length;
  const totalComments = roleFiltered.filter(r => r.action === 'comment').length;

  const actionConfig: Record<ActionType, { label: string; icon: typeof Download; colorClass: string }> = {
    download: { label: 'Descarga', icon: Download, colorClass: 'bg-primary/10 text-primary' },
    upload: { label: 'Subida', icon: Upload, colorClass: 'bg-file-xls/10 text-file-xls' },
    view: { label: 'Visualización', icon: Eye, colorClass: 'bg-blue-500/10 text-blue-400' },
    comment: { label: 'Comentario', icon: MessageSquare, colorClass: 'bg-amber-500/10 text-amber-400' },
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Panel de Actividad</h1>
          <p className="text-sm text-muted-foreground mt-1">Seguimiento de descargas y actividad del portal</p>
        </div>
        <Button variant="outline" className="border-border text-foreground hover:bg-secondary" onClick={() => toast.success('Reporte exportado (simulado)')}>
          <FileDown className="w-4 h-4 mr-1.5" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Actividades</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalActions}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Descargas</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalDownloads}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Subidas</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalUploads}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Comentarios</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalComments}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-10 bg-card border-border text-foreground" />
        </div>
        <Select value={filterUser} onValueChange={resetPage(setFilterUser)}>
          <SelectTrigger className="w-[170px] bg-card border-border text-foreground">
            <SelectValue placeholder="Usuario" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los usuarios</SelectItem>
            {uniqueUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={resetPage(setFilterProject)}>
          <SelectTrigger className="w-[170px] bg-card border-border text-foreground">
            <SelectValue placeholder="Proyecto" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {visibleProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={resetPage(setFilterAction)}>
          <SelectTrigger className="w-[170px] bg-card border-border text-foreground">
            <SelectValue placeholder="Acción" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todas las acciones</SelectItem>
            <SelectItem value="download">Descarga</SelectItem>
            <SelectItem value="upload">Subida</SelectItem>
            <SelectItem value="view">Visualización</SelectItem>
            <SelectItem value="comment">Comentario</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Desde</label>
            <Input type="date" value={filterDateFrom} onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className="w-[150px] bg-card border-border text-foreground text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Hasta</label>
            <Input type="date" value={filterDateTo} onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className="w-[150px] bg-card border-border text-foreground text-sm" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Usuario</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Documento</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Proyecto</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Fecha/Hora</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedRecords.map(record => {
                const config = actionConfig[record.action];
                const Icon = config.icon;
                return (
                  <tr key={record.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                          {record.user?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{record.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{record.user?.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-foreground truncate max-w-[200px]">{record.doc?.name}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-sm text-muted-foreground">{record.project?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">{new Date(record.dateTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${config.colorClass}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    No se encontraron registros con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Mostrando {(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length} registros
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === safePage ? 'default' : 'ghost'}
                  size="icon"
                  className={`h-8 w-8 text-xs ${page === safePage ? 'russula-gradient text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
