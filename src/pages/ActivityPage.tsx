import { useState } from 'react';
import { DOWNLOAD_RECORDS, DOCUMENTS, USERS, FOLDERS, PROJECTS, CLIENTS } from '@/data/mockData';
import { Download, Filter, FileDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ActivityPage = () => {
  const [filterUser, setFilterUser] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [search, setSearch] = useState('');

  const enrichedRecords = DOWNLOAD_RECORDS.map(record => {
    const doc = DOCUMENTS.find(d => d.id === record.documentId);
    const user = USERS.find(u => u.id === record.userId);
    const folder = FOLDERS.find(f => f.id === doc?.folderId);
    const project = PROJECTS.find(p => p.id === folder?.projectId);
    const client = CLIENTS.find(c => c.id === project?.clientId);
    return { ...record, doc, user, project, client };
  }).sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime());

  let filtered = enrichedRecords;
  if (filterUser !== 'all') filtered = filtered.filter(r => r.userId === filterUser);
  if (filterProject !== 'all') filtered = filtered.filter(r => r.project?.id === filterProject);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => r.doc?.name.toLowerCase().includes(q) || r.user?.name.toLowerCase().includes(q));
  }

  const uniqueUsers = [...new Set(DOWNLOAD_RECORDS.map(r => r.userId))].map(id => USERS.find(u => u.id === id)!);
  const uniqueProjects = PROJECTS;

  // Stats
  const totalDownloads = DOWNLOAD_RECORDS.length;
  const uniqueDownloaders = new Set(DOWNLOAD_RECORDS.map(r => r.userId)).size;
  const mostDownloaded = DOCUMENTS.reduce((acc, doc) => {
    const count = DOWNLOAD_RECORDS.filter(r => r.documentId === doc.id).length;
    return count > acc.count ? { doc, count } : acc;
  }, { doc: DOCUMENTS[0], count: 0 });

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Descargas</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{totalDownloads}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Usuarios Activos</p>
          <p className="text-3xl font-heading font-bold text-foreground mt-1">{uniqueDownloaders}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Doc. Más Descargado</p>
          <p className="text-sm font-medium text-foreground mt-1 truncate">{mostDownloaded.doc.name}</p>
          <p className="text-xs text-primary">{mostDownloaded.count} descargas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border text-foreground" />
        </div>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
            <SelectValue placeholder="Usuario" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los usuarios</SelectItem>
            {uniqueUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
            <SelectValue placeholder="Proyecto" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos los proyectos</SelectItem>
            {uniqueProjects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
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
              {filtered.map(record => (
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
                    <p className="text-sm text-muted-foreground">{new Date(record.downloadedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      <Download className="w-3 h-3" />
                      Descarga
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
