import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError('Credenciales inválidas. Intente con un email de la lista de usuarios demo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative red shape */}
      <div className="absolute top-0 right-0 w-96 h-96 russula-gradient rounded-bl-[200px] opacity-80" />
      <div className="absolute bottom-0 left-0 w-64 h-64 russula-gradient rounded-tr-[120px] opacity-40" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 russula-gradient rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-sm">R</span>
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">RUSSULA</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-2">Portal de Clientes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full russula-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Iniciar Sesión
            </Button>

            <button type="button" className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          </form>

          {/* Demo users */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Usuarios demo (cualquier contraseña):</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>carlos@russula.com</span>
                <span className="text-primary font-medium">Admin</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>maria@russula.com</span>
                <span className="text-warning font-medium">Editor</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>john@steelcorp.com</span>
                <span className="text-success font-medium">Cliente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
