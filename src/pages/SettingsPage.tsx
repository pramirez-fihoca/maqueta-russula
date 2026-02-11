import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, BellOff, Globe, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [mentionNotifs, setMentionNotifs] = useState(true);

  return (
    <div className="p-6 animate-fade-in max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Configuración</h1>
      <p className="text-sm text-muted-foreground mb-6">Gestiona tus preferencias de notificación y cuenta</p>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Perfil</h3>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-primary mt-0.5">{user?.role === 'admin' ? 'Administrador' : user?.role === 'editor' ? 'Responsable' : 'Cliente'}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Nuevos documentos</p>
                  <p className="text-xs text-muted-foreground">Recibir email cuando se suban nuevos documentos</p>
                </div>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BellOff className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Menciones</p>
                  <p className="text-xs text-muted-foreground">Recibir email cuando te mencionen en comentarios</p>
                </div>
              </div>
              <Switch checked={mentionNotifs} onCheckedChange={setMentionNotifs} />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Seguridad</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Contraseña</p>
                <p className="text-xs text-muted-foreground">Última actualización hace 30 días</p>
              </div>
              <button className="ml-auto text-sm text-primary hover:underline" onClick={() => toast.info('Cambio de contraseña (simulado)')}>Cambiar</button>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Sesiones activas</p>
                <p className="text-xs text-muted-foreground">1 sesión activa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
