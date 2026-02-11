export type UserRole = 'admin' | 'editor' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  company?: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  address: string;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
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
  documentId: string;
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
  { id: 'u2', name: 'María López', email: 'maria@russula.com', role: 'editor', company: 'Russula' },
  { id: 'u3', name: 'John Smith', email: 'john@steelcorp.com', role: 'client', company: 'Steel Corp' },
  { id: 'u4', name: 'Anna Mueller', email: 'anna@metalworks.de', role: 'client', company: 'Metalworks SA' },
  { id: 'u5', name: 'Roberto Silva', email: 'roberto@ironind.com', role: 'client', company: 'Iron Industries' },
  { id: 'u6', name: 'Laura Fernández', email: 'laura@russula.com', role: 'editor', company: 'Russula' },
  { id: 'u7', name: 'David Chen', email: 'david@steelcorp.com', role: 'client', company: 'Steel Corp' },
  { id: 'u8', name: 'Sophie Bernard', email: 'sophie@metalworks.de', role: 'client', company: 'Metalworks SA' },
];

export const CLIENTS: Client[] = [
  { id: 'c1', name: 'Steel Corp', description: 'Major steel producer in North America', address: '1200 Steel Avenue, Pittsburgh, PA 15201, USA', createdAt: '2024-01-15' },
  { id: 'c2', name: 'Metalworks SA', description: 'European steel manufacturing company', address: 'Industriestraße 45, 40210 Düsseldorf, Germany', createdAt: '2024-03-20' },
  { id: 'c3', name: 'Iron Industries', description: 'South American iron and steel producer', address: 'Av. Paulista 1578, São Paulo, SP 01310-200, Brazil', createdAt: '2024-06-10' },
];

export const PROJECTS: Project[] = [
  { id: 'p1', clientId: 'c1', name: 'Hot Rolling Mill Upgrade', description: 'Modernization of HRM line', createdAt: '2024-02-01' },
  { id: 'p2', clientId: 'c1', name: 'Water Treatment Plant', description: 'New WTP installation', createdAt: '2024-04-15' },
  { id: 'p3', clientId: 'c2', name: 'Cold Rolling Mill', description: 'New CRM facility', createdAt: '2024-05-01' },
  { id: 'p4', clientId: 'c2', name: 'Furnace Automation', description: 'EAF automation system', createdAt: '2024-07-20' },
  { id: 'p5', clientId: 'c3', name: 'Meltshop Upgrade', description: 'Complete meltshop modernization', createdAt: '2024-08-01' },
  { id: 'p6', clientId: 'c3', name: 'Environmental Systems', description: 'Emissions control system', createdAt: '2024-09-15' },
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
];

export const COMMENTS: Comment[] = [
  { id: 'cm1', documentId: 'd1', userId: 'u3', parentId: null, text: 'The general layout looks good. Can we get an updated version with the new conveyor positions?', createdAt: '2024-03-02T10:30:00', likes: 2 },
  { id: 'cm2', documentId: 'd1', userId: 'u2', parentId: 'cm1', text: '@John Smith Sure, we will update the layout by next week. The new conveyor positions are being finalized.', createdAt: '2024-03-02T14:15:00', likes: 1 },
  { id: 'cm3', documentId: 'd1', userId: 'u1', parentId: null, text: 'Please review the safety clearances in section 3. We need to ensure compliance with the latest standards.', createdAt: '2024-03-03T09:00:00', likes: 0 },
  { id: 'cm4', documentId: 'd4', userId: 'u3', parentId: null, text: 'Version 2.1 addresses all our previous comments. Approved from our side.', createdAt: '2024-02-25T16:00:00', likes: 3 },
  { id: 'cm5', documentId: 'd4', userId: 'u7', parentId: null, text: 'Excellent work on the technical specifications. Our engineering team has reviewed and we have no further comments.', createdAt: '2024-02-26T11:30:00', likes: 2 },
  { id: 'cm6', documentId: 'd8', userId: 'u4', parentId: null, text: 'We need to discuss the rolling force calculations in section 4.2. Can we schedule a meeting?', createdAt: '2024-06-20T08:45:00', likes: 1 },
  { id: 'cm7', documentId: 'd8', userId: 'u2', parentId: 'cm6', text: '@Anna Mueller Absolutely. I will send a meeting invite for next Tuesday. @Laura Fernández please join as well.', createdAt: '2024-06-20T10:00:00', likes: 0 },
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
