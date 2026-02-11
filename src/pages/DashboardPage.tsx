import { 
  Briefcase, Globe, Building2, Rocket, 
  UserPlus, MessageSquare, FileCheck, AlertTriangle,
  Download, MessageCircle, UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECTS, CLIENTS, COMMENTS, DOCUMENTS, DOWNLOAD_RECORDS, USERS } from '@/data/mockData';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CHART_COLORS = {
  primary: 'hsl(358, 78%, 52%)',
  secondary: 'hsl(210, 80%, 55%)',
  tertiary: 'hsl(142, 60%, 50%)',
  quaternary: 'hsl(38, 92%, 50%)',
  fifth: 'hsl(280, 60%, 55%)',
};

const divisionData = [
  { name: 'Rolling Mills', value: 16, color: CHART_COLORS.primary },
  { name: 'Water Solutions', value: 11, color: CHART_COLORS.secondary },
  { name: 'Digitalization', value: 4, color: CHART_COLORS.tertiary },
];

const clientActivityData = [
  { name: 'Gerdau (Global)', projects: 8 },
  { name: 'Novelis Bay Minette', projects: 3 },
  { name: 'Big River Steel', projects: 2 },
  { name: 'Nucor Kingman', projects: 1 },
  { name: 'Celsa France', projects: 1 },
];

const geoData = [
  { name: 'USA', value: 19, color: CHART_COLORS.primary },
  { name: 'Brasil', value: 5, color: CHART_COLORS.secondary },
  { name: 'España', value: 4, color: CHART_COLORS.tertiary },
  { name: 'Francia', value: 2, color: CHART_COLORS.quaternary },
  { name: 'Nueva Zelanda', value: 1, color: CHART_COLORS.fifth },
];

const kpiCards = [
  { label: 'Total de Proyectos', value: '31', subtitle: 'Activos en el sistema', icon: Briefcase, accent: 'text-primary' },
  { label: 'Alcance Global', value: '5', subtitle: 'Países con presencia', icon: Globe, accent: 'text-[hsl(var(--file-dwg))]' },
  { label: 'Cartera de Clientes', value: '25', subtitle: 'Empresas interlocutoras', icon: Building2, accent: 'text-[hsl(var(--success))]' },
  { label: 'Proyectos 2025', value: '4', subtitle: 'Nuevas implementaciones', icon: Rocket, accent: 'text-[hsl(var(--warning))]' },
];

const operationalCards = [
  { label: 'Gestión de Accesos', value: '3', subtitle: 'Usuarios Cliente pendientes', icon: UserPlus, accent: 'text-[hsl(var(--warning))]' },
  { label: 'Interacción en Proyectos', value: '12', subtitle: 'Comentarios sin leer', icon: MessageSquare, accent: 'text-[hsl(var(--file-dwg))]' },
  { label: 'Salud Documental', value: '85%', subtitle: 'Archivos descargados', icon: FileCheck, accent: 'text-[hsl(var(--success))]' },
  { label: 'Alerta de Actualización', value: '2', subtitle: 'Proyectos sin novedades > 15 días', icon: AlertTriangle, accent: 'text-primary' },
];

const activityFeed = [
  { time: 'Hace 2 horas', text: 'Pacific Steel descargó "ZLD Solution Layout.pdf"', icon: Download },
  { time: 'Hace 5 horas', text: 'Celsa Nervacero comentó en el proyecto "Mill Pulse Implementation"', icon: MessageCircle },
  { time: 'Ayer', text: 'Nuevo usuario creado para Gerdau Cosigua por el Responsable', icon: UserCheck },
];

const CustomTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 shadow-lg text-sm">
        <p className="font-medium text-foreground">{payload[0].name || payload[0].payload.name}</p>
        <p className="text-muted-foreground">{payload[0].value} proyectos</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visión general de la actividad y métricas del portal</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-secondary ${kpi.accent}`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut Chart - Division */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Distribución por División</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={divisionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {divisionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {divisionData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Top Clients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top Clientes por Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={clientActivityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(0, 0%, 55%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(0, 0%, 55%)' }} width={120} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltipContent />} />
                <Bar dataKey="projects" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Geography */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Presencia Geográfica</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={geoData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {geoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {geoData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Cards + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Operational Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {operationalCards.map((card) => (
            <Card key={card.label}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-lg bg-secondary ${card.accent}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((event, i) => (
              <div key={i} className="flex gap-3">
                <div className="p-2 rounded-lg bg-secondary text-muted-foreground flex-shrink-0">
                  <event.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-foreground leading-snug">{event.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
