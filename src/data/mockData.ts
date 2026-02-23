export type UserRole = 'admin' | 'editor' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
  assignedClients?: string[];
}

export interface Client {
  id: string;
  name: string;
  description: string;
  address: string;
  createdAt: string;
}

export type ProjectType = 'rolling-mills' | 'water-solutions' | 'digitalization';

export type ProjectStatus = 'active' | 'archived';

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  createdAt: string;
}

export interface Folder {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  createdAt: string;
}

export interface Document {
  id: string;
  folderId: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  parentId: string | null;
  text: string;
  createdAt: string;
  likes: number;
}

export interface DownloadRecord {
  id: string;
  documentId: string;
  userId: string;
  downloadedAt: string;
}

export interface AccessPermission {
  id: string;
  userId: string;
  clientId?: string;
  projectId?: string;
  folderId?: string;
}

export const USERS: User[] = [
  { id: 'u1', name: 'Carlos García', email: 'carlos@russula.com', role: 'admin', company: 'Russula' },
  { id: 'u2', name: 'María López', email: 'maria@russula.com', role: 'editor', company: 'Russula', assignedClients: ['c1', 'c2', 'c3', 'c5', 'c8'] },
  { id: 'u3', name: 'John Smith', email: 'john@nucor.com', role: 'client', company: 'Nucor Kingman' },
  { id: 'u4', name: 'Anna Mueller', email: 'anna@celsa.com', role: 'client', company: 'Celsa France' },
  { id: 'u5', name: 'Roberto Silva', email: 'roberto@gerdau.com', role: 'client', company: 'Gerdau Riograndense' },
  { id: 'u6', name: 'Laura Fernández', email: 'laura@russula.com', role: 'editor', company: 'Russula', assignedClients: ['c4', 'c6', 'c7', 'c9', 'c10', 'c11'] },
  { id: 'u7', name: 'David Chen', email: 'david@bigriver.com', role: 'client', company: 'Big River Steel' },
  { id: 'u8', name: 'Sophie Bernard', email: 'sophie@novelis.com', role: 'client', company: 'Novelis Bay Minette' },
];

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Nucor Kingman', description: 'Steel producer in Kingman, AZ', address: 'Kingman, AZ, USA', createdAt: '2023-01-10' },
  { id: 'c2', name: 'Celsa France', description: 'European steel manufacturer', address: 'Bayonne, France', createdAt: '2025-01-15' },
  { id: 'c3', name: 'Big River Steel', description: 'Steel producer in Arkansas', address: 'Osceola, AR, USA', createdAt: '2024-02-01' },
  { id: 'c4', name: 'Nucor Memphis', description: 'Nucor facility in Memphis', address: 'Memphis, TN, USA', createdAt: '2024-03-01' },
  { id: 'c5', name: 'Novelis Bay Minette', description: 'Novelis rolling and recycling facility', address: 'Bay Minette, AL, USA', createdAt: '2024-01-20' },
  { id: 'c6', name: 'Gerdau Riograndense', description: 'Gerdau facility in Brazil', address: 'Sapucaia do Sul, RS, Brazil', createdAt: '2024-04-01' },
  { id: 'c7', name: 'Gerdau Cosigua', description: 'Gerdau facility in Rio de Janeiro', address: 'Rio de Janeiro, RJ, Brazil', createdAt: '2024-05-01' },
  { id: 'c8', name: 'Celsa GSW', description: 'Celsa Group steel works', address: 'Cardiff, UK', createdAt: '2023-06-01' },
  { id: 'c9', name: 'Gerdau Corsa', description: 'Gerdau Corsa facility', address: 'Saltillo, Mexico', createdAt: '2023-03-01' },
  { id: 'c10', name: 'Gerdau Petersburg', description: 'Gerdau facility in Petersburg', address: 'Petersburg, VA, USA', createdAt: '2023-04-01' },
  { id: 'c11', name: 'Laminoirs des Landes', description: 'French rolling mill', address: 'Tarnos, France', createdAt: '2024-06-01' },
  { id: 'c12', name: 'Gerdau Cartersville', description: 'Gerdau facility in Cartersville', address: 'Cartersville, GA, USA', createdAt: '2024-07-01' },
  { id: 'c13', name: 'Celsa Nervacero', description: 'Celsa Group Nervacero plant', address: 'Bilbao, Spain', createdAt: '2023-08-01' },
  { id: 'c14', name: 'ArcelorMittal Calvert', description: 'ArcelorMittal facility in Calvert', address: 'Calvert, AL, USA', createdAt: '2025-01-01' },
  { id: 'c15', name: 'Liberty Steel & Wire', description: 'Liberty Steel wire division', address: 'Peoria, IL, USA', createdAt: '2023-09-01' },
  { id: 'c16', name: 'CMC Steel Florida', description: 'CMC Steel facility in Florida', address: 'Jacksonville, FL, USA', createdAt: '2024-08-01' },
  { id: 'c17', name: 'CSN Volta Redonda', description: 'CSN facility in Volta Redonda', address: 'Volta Redonda, RJ, Brazil', createdAt: '2023-10-01' },
  { id: 'c18', name: 'Nucor Nebraska', description: 'Nucor facility in Nebraska', address: 'Norfolk, NE, USA', createdAt: '2024-09-01' },
  { id: 'c19', name: 'Nucor Kankakee', description: 'Nucor facility in Kankakee', address: 'Kankakee, IL, USA', createdAt: '2024-10-01' },
  { id: 'c20', name: 'Hydnum Steel', description: 'Hydnum Steel facility', address: 'Guadalajara, Spain', createdAt: '2023-11-01' },
  { id: 'c21', name: 'Nucor Jewett', description: 'Nucor facility in Jewett', address: 'Jewett, TX, USA', createdAt: '2023-05-01' },
  { id: 'c22', name: 'Nucor Gallatin', description: 'Nucor facility in Gallatin', address: 'Ghent, KY, USA', createdAt: '2024-11-01' },
  { id: 'c23', name: 'Acerinox Roldan', description: 'Acerinox Roldan facility', address: 'Ponferrada, Spain', createdAt: '2024-06-15' },
  { id: 'c24', name: 'Nucor West Virginia', description: 'Nucor facility in West Virginia', address: 'Ravenswood, WV, USA', createdAt: '2023-07-01' },
  { id: 'c25', name: 'PACIFIC STEEL', description: 'Pacific Steel manufacturer', address: 'Christchurch, New Zealand', createdAt: '2025-02-01' },
];

export const PROJECTS: Project[] = [
  { id: 'p1', clientId: 'c1', name: 'Bar finishing mill upgrade', description: 'Bar finishing mill upgrade', type: 'rolling-mills', status: 'active', createdAt: '2023-01-15' },
  { id: 'p2', clientId: 'c2', name: 'Break Down Mill Stands A & B', description: 'Break Down Mill Stands A & B', type: 'rolling-mills', status: 'active', createdAt: '2025-02-01' },
  { id: 'p3', clientId: 'c3', name: 'CCL Waste Water System', description: 'CCL Waste Water System', type: 'water-solutions', status: 'active', createdAt: '2024-03-01' },
  { id: 'p4', clientId: 'c4', name: 'Cooling Bed Drives Upgrade', description: 'Cooling Bed Drives Upgrade', type: 'rolling-mills', status: 'archived', createdAt: '2024-04-01' },
  { id: 'p5', clientId: 'c5', name: 'Cooling Water Systems for Novelis', description: 'Cooling Water Systems for Novelis', type: 'water-solutions', status: 'active', createdAt: '2024-05-01' },
  { id: 'p6', clientId: 'c6', name: 'CV sensor and Shear 1 control', description: 'CV sensor and Shear 1 control', type: 'digitalization', status: 'active', createdAt: '2024-06-01' },
  { id: 'p7', clientId: 'c7', name: 'CV Sensors (Shear Cut)', description: 'CV Sensors (Shear Cut)', type: 'digitalization', status: 'active', createdAt: '2024-07-01' },
  { id: 'p8', clientId: 'c8', name: 'Drives upgrade', description: 'Drives upgrade', type: 'rolling-mills', status: 'archived', createdAt: '2023-06-15' },
  { id: 'p9', clientId: 'c9', name: 'Drives upgrade', description: 'Drives upgrade', type: 'rolling-mills', status: 'active', createdAt: '2023-03-15' },
  { id: 'p10', clientId: 'c10', name: 'Drives upgrade for saws', description: 'Drives upgrade for saws', type: 'rolling-mills', status: 'archived', createdAt: '2023-04-15' },
  { id: 'p11', clientId: 'c7', name: 'Electrical & Automation Upgrade', description: 'Electrical & Automation Upgrade', type: 'rolling-mills', status: 'active', createdAt: '2024-08-01' },
  { id: 'p12', clientId: 'c5', name: 'Furnace Cooling System', description: 'Furnace Cooling System', type: 'water-solutions', status: 'active', createdAt: '2025-01-15' },
  { id: 'p13', clientId: 'c11', name: 'MakeUp Iron Removal System', description: 'MakeUp Iron Removal System', type: 'water-solutions', status: 'active', createdAt: '2024-06-15' },
  { id: 'p14', clientId: 'c12', name: 'Mill Control Upgrade', description: 'Mill Control Upgrade', type: 'rolling-mills', status: 'active', createdAt: '2024-07-15' },
  { id: 'p15', clientId: 'c12', name: 'Mill Drives Upgrade Phase 1', description: 'Mill Drives Upgrade Phase 1', type: 'rolling-mills', status: 'active', createdAt: '2024-08-15' },
  { id: 'p16', clientId: 'c13', name: 'Mill Pulse® MES Implementation', description: 'Mill Pulse MES Implementation', type: 'digitalization', status: 'active', createdAt: '2023-08-15' },
  { id: 'p17', clientId: 'c14', name: 'NGO Water Facility', description: 'NGO Water Facility', type: 'water-solutions', status: 'active', createdAt: '2025-01-20' },
  { id: 'p18', clientId: 'c15', name: 'Production improvement Mill Pulse®', description: 'Production improvement Mill Pulse', type: 'digitalization', status: 'archived', createdAt: '2023-09-15' },
  { id: 'p19', clientId: 'c5', name: 'Reverse osmosis water system', description: 'Reverse osmosis water system', type: 'water-solutions', status: 'active', createdAt: '2024-09-01' },
  { id: 'p20', clientId: 'c16', name: 'Rod Block Drives Upgrade', description: 'Rod Block Drives Upgrade', type: 'rolling-mills', status: 'active', createdAt: '2024-08-20' },
  { id: 'p21', clientId: 'c17', name: 'Slab caster automation & drives', description: 'Slab caster automation & drives', type: 'rolling-mills', status: 'active', createdAt: '2023-10-15' },
  { id: 'p22', clientId: 'c18', name: 'Stacker Upgrade', description: 'Stacker Upgrade', type: 'rolling-mills', status: 'active', createdAt: '2024-09-15' },
  { id: 'p23', clientId: 'c6', name: 'Stands Mill Drives Upgrade', description: 'Stands Mill Drives Upgrade', type: 'rolling-mills', status: 'active', createdAt: '2024-10-01' },
  { id: 'p24', clientId: 'c19', name: 'Structural Mill Automation', description: 'Structural Mill Automation', type: 'rolling-mills', status: 'active', createdAt: '2024-10-15' },
  { id: 'p25', clientId: 'c20', name: 'Sustainable production solutions', description: 'Sustainable production solutions', type: 'water-solutions', status: 'active', createdAt: '2023-11-15' },
  { id: 'p26', clientId: 'c21', name: 'TX2 drives upgrade', description: 'TX2 drives upgrade', type: 'rolling-mills', status: 'active', createdAt: '2023-05-15' },
  { id: 'p27', clientId: 'c3', name: 'Waste Water Expansion DAF', description: 'Waste Water Expansion DAF', type: 'water-solutions', status: 'active', createdAt: '2024-11-01' },
  { id: 'p28', clientId: 'c22', name: 'Water System Automation Upgrade', description: 'Water System Automation Upgrade', type: 'water-solutions', status: 'active', createdAt: '2024-11-15' },
  { id: 'p29', clientId: 'c23', name: 'Water System Bar and Section Mill', description: 'Water System Bar and Section Mill', type: 'rolling-mills', status: 'active', createdAt: '2024-06-20' },
  { id: 'p30', clientId: 'c24', name: 'Water treatment plant', description: 'Water treatment plant', type: 'water-solutions', status: 'active', createdAt: '2023-07-15' },
  { id: 'p31', clientId: 'c25', name: 'ZLD Solution for New Micromill', description: 'ZLD Solution for New Micromill', type: 'water-solutions', status: 'active', createdAt: '2025-02-10' },
];

export const FOLDERS: Folder[] = [
  { id: 'f1', projectId: 'p1', parentId: null, name: 'Engineering Drawings', createdAt: '2024-02-05' },
  { id: 'f2', projectId: 'p1', parentId: null, name: 'Technical Specs', createdAt: '2024-02-05' },
  { id: 'f3', projectId: 'p1', parentId: 'f1', name: 'Mechanical', createdAt: '2024-02-10' },
  { id: 'f4', projectId: 'p1', parentId: 'f1', name: 'Electrical', createdAt: '2024-02-10' },
  { id: 'f5', projectId: 'p2', parentId: null, name: 'Design Documents', createdAt: '2024-04-20' },
  { id: 'f6', projectId: 'p2', parentId: null, name: 'Reports', createdAt: '2024-04-20' },
  { id: 'f7', projectId: 'p3', parentId: null, name: 'Specifications', createdAt: '2024-05-05' },
  { id: 'f8', projectId: 'p3', parentId: null, name: 'Manuals', createdAt: '2024-05-05' },
  { id: 'f9', projectId: 'p4', parentId: null, name: 'PLC Programs', createdAt: '2024-07-25' },
  { id: 'f10', projectId: 'p5', parentId: null, name: 'Project Plans', createdAt: '2024-08-05' },
  { id: 'f11', projectId: 'p6', parentId: null, name: 'Environmental Reports', createdAt: '2024-09-20' },
];

export const DOCUMENTS: Document[] = [
  { id: 'd1', folderId: 'f3', name: 'HRM-MECH-001-General-Layout.pdf', type: 'application/pdf', size: 2450000, uploadedBy: 'u2', uploadedAt: '2024-03-01' },
  { id: 'd2', folderId: 'f3', name: 'HRM-MECH-002-Roll-Assembly.dwg', type: 'application/dwg', size: 8900000, uploadedBy: 'u2', uploadedAt: '2024-03-05' },
  { id: 'd3', folderId: 'f4', name: 'HRM-ELEC-001-Single-Line-Diagram.pdf', type: 'application/pdf', size: 1200000, uploadedBy: 'u6', uploadedAt: '2024-03-10' },
  { id: 'd4', folderId: 'f2', name: 'Technical-Specification-HRM-v2.1.pdf', type: 'application/pdf', size: 5600000, uploadedBy: 'u1', uploadedAt: '2024-02-20' },
  { id: 'd5', folderId: 'f2', name: 'Material-List-HRM.xlsx', type: 'application/xlsx', size: 340000, uploadedBy: 'u2', uploadedAt: '2024-03-15' },
  { id: 'd6', folderId: 'f5', name: 'WTP-Design-Basis.pdf', type: 'application/pdf', size: 3200000, uploadedBy: 'u2', uploadedAt: '2024-05-01' },
  { id: 'd7', folderId: 'f6', name: 'Water-Quality-Report-Q3.pdf', type: 'application/pdf', size: 1800000, uploadedBy: 'u6', uploadedAt: '2024-09-30' },
  { id: 'd8', folderId: 'f7', name: 'CRM-Specification-Rev3.pdf', type: 'application/pdf', size: 4100000, uploadedBy: 'u2', uploadedAt: '2024-06-15' },
  { id: 'd9', folderId: 'f8', name: 'Operation-Manual-CRM.pdf', type: 'application/pdf', size: 12000000, uploadedBy: 'u6', uploadedAt: '2024-08-01' },
  { id: 'd10', folderId: 'f9', name: 'PLC-Program-Furnace-v1.0.zip', type: 'application/zip', size: 25000000, uploadedBy: 'u2', uploadedAt: '2024-08-15' },
  { id: 'd11', folderId: 'f10', name: 'Meltshop-Project-Plan.pdf', type: 'application/pdf', size: 2100000, uploadedBy: 'u1', uploadedAt: '2024-08-10' },
  { id: 'd12', folderId: 'f11', name: 'Emissions-Assessment-2024.pdf', type: 'application/pdf', size: 3400000, uploadedBy: 'u6', uploadedAt: '2024-10-01' },
  // Documentos subidos por clientes externos
  { id: 'd13', folderId: 'f2', name: 'Nucor-Site-Conditions-Report.pdf', type: 'application/pdf', size: 1850000, uploadedBy: 'u3', uploadedAt: '2024-03-20' },
  { id: 'd14', folderId: 'f3', name: 'Nucor-Foundation-Drawings-Rev1.dwg', type: 'application/dwg', size: 6700000, uploadedBy: 'u3', uploadedAt: '2024-04-02' },
  { id: 'd15', folderId: 'f5', name: 'Celsa-Mill-Stand-Inspection.pdf', type: 'application/pdf', size: 2900000, uploadedBy: 'u4', uploadedAt: '2024-05-10' },
  { id: 'd16', folderId: 'f6', name: 'Celsa-Quality-Cert-Acero-Q2.xlsx', type: 'application/xlsx', size: 520000, uploadedBy: 'u4', uploadedAt: '2024-07-15' },
  { id: 'd17', folderId: 'f7', name: 'BigRiver-Water-Analysis-Lab.pdf', type: 'application/pdf', size: 1400000, uploadedBy: 'u7', uploadedAt: '2024-06-20' },
  { id: 'd18', folderId: 'f8', name: 'BigRiver-Existing-PID-Diagrams.pdf', type: 'application/pdf', size: 4800000, uploadedBy: 'u7', uploadedAt: '2024-07-05' },
  { id: 'd19', folderId: 'f10', name: 'Novelis-Cooling-Requirements.pdf', type: 'application/pdf', size: 2200000, uploadedBy: 'u8', uploadedAt: '2024-08-20' },
  { id: 'd20', folderId: 'f10', name: 'Novelis-Plant-Layout-Existing.dwg', type: 'application/dwg', size: 9500000, uploadedBy: 'u8', uploadedAt: '2024-09-01' },
  { id: 'd21', folderId: 'f11', name: 'Gerdau-Environmental-Baseline.pdf', type: 'application/pdf', size: 3100000, uploadedBy: 'u5', uploadedAt: '2024-09-25' },
  { id: 'd22', folderId: 'f9', name: 'Nucor-PLC-IO-List-Furnace.xlsx', type: 'application/xlsx', size: 780000, uploadedBy: 'u3', uploadedAt: '2024-08-28' },
];

export const COMMENTS: Comment[] = [
  { id: 'cm1', projectId: 'p1', userId: 'u3', parentId: null, text: 'El layout general tiene buena pinta. ¿Podemos obtener una versión actualizada con las nuevas posiciones del transportador?', createdAt: '2024-03-02T10:30:00', likes: 2 },
  { id: 'cm2', projectId: 'p1', userId: 'u2', parentId: 'cm1', text: '@John Smith Claro, actualizaremos el layout la próxima semana. Las nuevas posiciones del transportador se están finalizando.', createdAt: '2024-03-02T14:15:00', likes: 1 },
  { id: 'cm3', projectId: 'p1', userId: 'u1', parentId: null, text: 'Por favor revisar las distancias de seguridad en la sección 3. Necesitamos asegurar el cumplimiento con la normativa vigente.', createdAt: '2024-03-03T09:00:00', likes: 0 },
  { id: 'cm4', projectId: 'p1', userId: 'u2', parentId: null, text: '📎 Se ha subido un nuevo archivo: "General-Layout-Rev2.1.pdf". @John Smith por favor revísalo cuando puedas.', createdAt: '2024-03-04T08:00:00', likes: 1 },
  { id: 'cm5', projectId: 'p1', userId: 'u3', parentId: null, text: 'La versión 2.1 resuelve todos nuestros comentarios anteriores. Aprobado por nuestra parte.', createdAt: '2024-03-05T16:00:00', likes: 3 },
  { id: 'cm6', projectId: 'p3', userId: 'u7', parentId: null, text: 'Excelente trabajo con las especificaciones técnicas. Nuestro equipo de ingeniería las ha revisado y no tenemos más comentarios.', createdAt: '2024-02-26T11:30:00', likes: 2 },
  { id: 'cm7', projectId: 'p3', userId: 'u2', parentId: null, text: '📎 Se ha subido un nuevo archivo: "CCL-WaterSystem-Specs-v2.pdf". @David Chen revisa la sección 5 de tratamiento de aguas residuales.', createdAt: '2024-03-01T09:00:00', likes: 0 },
  { id: 'cm8', projectId: 'p2', userId: 'u4', parentId: null, text: 'Necesitamos revisar los cálculos de fuerza de laminación en la sección 4.2. ¿Podemos agendar una reunión?', createdAt: '2024-06-20T08:45:00', likes: 1 },
  { id: 'cm9', projectId: 'p2', userId: 'u2', parentId: 'cm8', text: '@Anna Mueller Por supuesto. Enviaré una invitación para el próximo martes. @Laura Fernández únete también por favor.', createdAt: '2024-06-20T10:00:00', likes: 0 },
  { id: 'cm10', projectId: 'p2', userId: 'u6', parentId: null, text: '📎 Se ha subido un nuevo archivo: "CRM-RollingForce-Calcs-Rev3.xlsx". @Anna Mueller aquí están los cálculos actualizados que solicitaste.', createdAt: '2024-06-22T11:30:00', likes: 2 },
];

export const DOWNLOAD_RECORDS: DownloadRecord[] = [
  { id: 'dr1', documentId: 'd1', userId: 'u3', downloadedAt: '2024-03-02T09:15:00' },
  { id: 'dr2', documentId: 'd4', userId: 'u3', downloadedAt: '2024-02-21T14:30:00' },
  { id: 'dr3', documentId: 'd4', userId: 'u7', downloadedAt: '2024-02-22T10:00:00' },
  { id: 'dr4', documentId: 'd1', userId: 'u7', downloadedAt: '2024-03-04T16:45:00' },
  { id: 'dr5', documentId: 'd8', userId: 'u4', downloadedAt: '2024-06-16T08:30:00' },
  { id: 'dr6', documentId: 'd9', userId: 'u4', downloadedAt: '2024-08-02T11:20:00' },
  { id: 'dr7', documentId: 'd8', userId: 'u8', downloadedAt: '2024-06-18T15:00:00' },
  { id: 'dr8', documentId: 'd11', userId: 'u5', downloadedAt: '2024-08-12T09:00:00' },
  { id: 'dr9', documentId: 'd12', userId: 'u5', downloadedAt: '2024-10-02T13:30:00' },
  { id: 'dr10', documentId: 'd6', userId: 'u3', downloadedAt: '2024-05-03T10:15:00' },
  { id: 'dr11', documentId: 'd2', userId: 'u3', downloadedAt: '2024-03-06T14:00:00' },
  { id: 'dr12', documentId: 'd3', userId: 'u7', downloadedAt: '2024-03-12T09:45:00' },
  { id: 'dr13', documentId: 'd5', userId: 'u3', downloadedAt: '2024-03-16T11:30:00' },
  { id: 'dr14', documentId: 'd10', userId: 'u4', downloadedAt: '2024-08-20T16:00:00' },
  { id: 'dr15', documentId: 'd7', userId: 'u3', downloadedAt: '2024-10-01T08:00:00' },
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

export function getFileIcon(type: string): string {
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('dwg')) return 'dwg';
  if (type.includes('xlsx') || type.includes('xls')) return 'xls';
  if (type.includes('doc')) return 'doc';
  if (type.includes('zip')) return 'zip';
  if (type.includes('image')) return 'img';
  return 'file';
}
