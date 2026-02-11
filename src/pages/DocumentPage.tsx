import { useParams, useNavigate } from 'react-router-dom';
import { DOCUMENTS, FOLDERS, PROJECTS, CLIENTS, USERS, formatFileSize } from '@/data/mockData';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const doc = DOCUMENTS.find(d => d.id === id);
  if (!doc) return <div className="p-6 text-muted-foreground">Documento no encontrado</div>;

  const folder = FOLDERS.find(f => f.id === doc.folderId);
  const project = PROJECTS.find(p => p.id === folder?.projectId);
  const client = CLIENTS.find(c => c.id === project?.clientId);
  const uploader = USERS.find(u => u.id === doc.uploadedBy);

  return (
    <div className="p-6 animate-fade-in max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver al explorador
      </button>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          <h2 className="font-heading font-bold text-lg text-foreground">{doc.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tamaño</span>
            <p className="text-foreground font-medium">{formatFileSize(doc.size)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Fecha</span>
            <p className="text-foreground font-medium">{doc.uploadedAt}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Subido por</span>
            <p className="text-foreground font-medium">{uploader?.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Ubicación</span>
            <p className="text-foreground font-medium">{client?.name} / {project?.name}</p>
          </div>
        </div>

        <Button className="w-full russula-gradient text-primary-foreground hover:opacity-90 mt-2" onClick={() => toast.success(`Descargando ${doc.name}...`)}>
          <Download className="w-4 h-4 mr-2" />
          Descargar Documento
        </Button>
      </div>
    </div>
  );
};

export default DocumentPage;
