import { useState } from 'react';
import { USERS, CLIENTS, PROJECTS, User } from '@/data/mockData';
import { UserPlus, Pencil, Trash2, X, Check, Shield, Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'client' as User['role'], company: '' });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const openCreate = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', role: 'client', company: '' });
    setSelectedPermissions([]);
    setShowDialog(true);
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, company: user.company || '' });
    setSelectedPermissions([]);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, ...formData } : u));
      toast.success('Usuario actualizado');
    } else {
      const newUser: User = { id: `u-new-${Date.now()}`, ...formData };
      setUsers([...users, newUser]);
      toast.success('Usuario creado');
    }
    setShowDialog(false);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Usuario eliminado');
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <span className="inline-flex items-center gap-1 text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full"><Shield className="w-3 h-3" />Admin</span>;
      case 'editor': return <span className="inline-flex items-center gap-1 text-xs bg-warning/15 text-warning px-2 py-0.5 rounded-full"><Edit3 className="w-3 h-3" />Responsable</span>;
      default: return <span className="inline-flex items-center gap-1 text-xs bg-success/15 text-success px-2 py-0.5 rounded-full"><Eye className="w-3 h-3" />Cliente</span>;
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra usuarios y permisos de acceso</p>
        </div>
        <Button className="russula-gradient text-primary-foreground hover:opacity-90" onClick={openCreate}>
          <UserPlus className="w-4 h-4 mr-1.5" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Usuario</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Rol</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Empresa</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                      {u.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-sm text-muted-foreground">{u.email}</span>
                </td>
                <td className="px-4 py-3">{getRoleBadge(u.role)}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {u.role === 'client' ? CLIENTS.find(c => c.name === u.company)?.name || u.company : u.company}
                  </span>
                  {u.role === 'client' && u.company && (
                    <span className="block text-xs text-muted-foreground/60">Cliente</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(u)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-card border-border text-foreground max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Rol</label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v as User['role'] })}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="editor">Responsable</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Empresa</label>
                <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="bg-secondary border-border" />
              </div>
            </div>

            {/* Permissions tree */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Permisos de Acceso</label>
              <div className="bg-secondary rounded-lg p-3 max-h-48 overflow-auto space-y-2">
                {(() => {
                  const visibleClients = formData.role === 'client' && formData.company
                    ? CLIENTS.filter(c => c.name === formData.company)
                    : CLIENTS;
                  return visibleClients.map(client => (
                    <div key={client.id}>
                      <div className="flex items-center gap-2">
                        <Checkbox id={client.id} checked={selectedPermissions.includes(client.id)} onCheckedChange={() => togglePermission(client.id)} />
                        <label htmlFor={client.id} className="text-sm font-medium text-foreground cursor-pointer">{client.name}</label>
                      </div>
                      <div className="ml-6 mt-1 space-y-1">
                        {PROJECTS.filter(p => p.clientId === client.id).map(project => (
                          <div key={project.id} className="flex items-center gap-2">
                            <Checkbox id={project.id} checked={selectedPermissions.includes(project.id)} onCheckedChange={() => togglePermission(project.id)} />
                            <label htmlFor={project.id} className="text-sm text-muted-foreground cursor-pointer">{project.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
                {formData.role === 'client' && !formData.company && (
                  <p className="text-xs text-muted-foreground italic">Introduce el nombre de la empresa para ver sus proyectos</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="border-border text-foreground hover:bg-secondary">Cancelar</Button>
              <Button onClick={handleSave} className="russula-gradient text-primary-foreground hover:opacity-90">
                {editUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
