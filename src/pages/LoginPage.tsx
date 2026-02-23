import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { USERS } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import russulaLogo from '@/assets/russula-logo.png';
import russulaLogoLight from '@/assets/russula-logo-light.png';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msLoading, setMsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleMicrosoftLogin = () => {
    setMsLoading(true);
    setTimeout(() => {
      login('carlos@russula.com', '');
      navigate('/dashboard');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(email, password)) {
      const foundUser = USERS.find(u => u.email === email);
      navigate(foundUser?.role === 'client' ? '/dashboard/explorer' : '/dashboard');
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
            <div className="flex items-center justify-center mb-2">
              <img src={theme === 'dark' ? russulaLogo : russulaLogoLight} alt="Russula" className="h-9" />
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

          {/* Microsoft SSO divider */}
          <div className="flex items-center gap-3 my-5">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">o continuar con</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleMicrosoftLogin}
            disabled={msLoading}
            className="w-full h-11 bg-card border-border hover:bg-muted transition-colors font-medium text-foreground"
          >
            {msLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando...</span>
              </>
            ) : (
              <>
                {/* Microsoft logo – 4 colored squares */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21" className="shrink-0">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <span>Acceder con cuenta de Russula</span>
              </>
            )}
          </Button>

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
                <span className="text-warning font-medium">Responsable</span>
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
