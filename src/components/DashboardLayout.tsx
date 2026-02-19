import { ReactNode } from "react";
import russulaLogo from "@/assets/russula-logo.png";
import russulaLogoLight from "@/assets/russula-logo-light.png";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation, Link } from "react-router-dom";
import { FolderOpen, Activity, Users, LogOut, Menu, X, LayoutDashboard, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import HelpPanel from "@/components/HelpPanel";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
{ label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", roles: ["admin", "editor"] },
{ label: "Explorador", icon: FolderOpen, path: "/dashboard/explorer", roles: ["admin", "editor", "client"] },
{ label: "Actividad", icon: Activity, path: "/dashboard/activity", roles: ["admin"] },
{ label: "Usuarios", icon: Users, path: "/dashboard/users", roles: ["admin", "editor"] }
//{ label: 'Configuración', icon: Settings, path: '/dashboard/settings', roles: ['admin', 'editor', 'client'] },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const filteredNav = navItems.filter((item) => item.roles.includes(user!.role));

  const roleLabel =
  user!.role === "admin" ? "Administrador" : user!.role === "editor" ? "Responsable" : user!.company || "Cliente";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 flex-shrink-0 z-20">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-foreground transition-colors">

          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <img src={theme === "dark" ? russulaLogo : russulaLogoLight} alt="Russula" className="h-7" />

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground">

            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <HelpPanel />
          <div className="text-right hidden sm:block">
            <p className="font-medium text-foreground text-base">{user!.name}</p>
            <p className="text-muted-foreground text-sm">{roleLabel}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {user!.name.charAt(0)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              logout();
            }}
            className="text-muted-foreground hover:text-foreground">

            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-56" : "w-0 overflow-hidden"} sidebar-transition border-r border-border bg-card flex-shrink-0 flex flex-col`}>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {filteredNav.map((item) => {
              const isActive =
              location.pathname === item.path ||
              item.path === "/dashboard/explorer" && location.pathname.startsWith("/dashboard/document");
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ?
                  "bg-primary/10 text-primary font-medium" :
                  "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
                  }>

                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>);

            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>);

};

export default DashboardLayout;