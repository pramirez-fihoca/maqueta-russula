import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DOCUMENTS, FOLDERS, PROJECTS, CLIENTS, COMMENTS, USERS, formatFileSize } from '@/data/mockData';
import { ArrowLeft, Download, FileText, Send, Heart, Reply, MoreHorizontal, Bold, Italic, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(COMMENTS);

  const doc = DOCUMENTS.find(d => d.id === id);
  if (!doc) return <div className="p-6 text-muted-foreground">Documento no encontrado</div>;

  const folder = FOLDERS.find(f => f.id === doc.folderId);
  const project = PROJECTS.find(p => p.id === folder?.projectId);
  const client = CLIENTS.find(c => c.id === project?.clientId);
  const uploader = USERS.find(u => u.id === doc.uploadedBy);
  const docComments = comments.filter(c => c.documentId === doc.id);
  const rootComments = docComments.filter(c => !c.parentId);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    const comment = {
      id: `cm-new-${Date.now()}`,
      documentId: doc.id,
      userId: user.id,
      parentId: null,
      text: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comentario agregado');
  };

  const getUserById = (userId: string) => USERS.find(u => u.id === userId);

  const renderComment = (comment: typeof COMMENTS[0], depth = 0) => {
    const author = getUserById(comment.userId);
    const replies = docComments.filter(c => c.parentId === comment.id);
    
    return (
      <div key={comment.id} className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''} animate-fade-in`}>
        <div className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold flex-shrink-0">
              {author?.name.charAt(0) || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">{author?.name}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed">{comment.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Reply className="w-3.5 h-3.5" />
                  Responder
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                  {comment.likes > 0 && comment.likes}
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {replies.map(r => renderComment(r, depth + 1))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in h-full flex flex-col lg:flex-row">
      {/* Document Info Panel */}
      <div className="lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border p-6 overflow-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al explorador
        </button>

        <div className="space-y-6">
          {/* File preview placeholder */}
          <div className="aspect-[4/3] bg-card rounded-xl border border-border flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">Vista previa no disponible</p>
            <p className="text-muted-foreground/60 text-xs mt-1">{doc.name}</p>
          </div>

          {/* File details */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h2 className="font-heading font-bold text-lg text-foreground">{doc.name}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
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
      </div>

      {/* Comments Panel */}
      <div className="lg:w-1/2 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-heading font-bold text-lg text-foreground">Comentarios ({docComments.length})</h3>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-0 divide-y divide-border">
          {rootComments.length > 0 ? (
            rootComments.map(c => renderComment(c))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No hay comentarios aún</p>
            </div>
          )}
        </div>

        {/* Comment input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 mb-2">
            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors"><Bold className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors"><Italic className="w-4 h-4" /></button>
            <button className="p-1.5 rounded hover:bg-secondary text-muted-foreground transition-colors"><List className="w-4 h-4" /></button>
            <span className="text-xs text-muted-foreground ml-2">Usa @nombre para mencionar</span>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[60px]"
              rows={2}
            />
            <Button onClick={handleAddComment} className="russula-gradient text-primary-foreground hover:opacity-90 self-end" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
