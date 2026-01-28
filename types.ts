
export type ProgressStatus = 'todo' | 'in-progress' | 'done';

export interface User {
  id: string;
  username: string;
  password: string; // Not: Gerçek uygulamalarda şifreler hash'lenmelidir.
}

export interface ProgressStep {
  id: string;
  text: string;
  note: string;
  isCompleted: boolean;
  status: ProgressStatus;
  startDate?: string;
  dueDate?: string;
}

export interface Resource {
  id: string;
  name: string;
  note: string;
  price: string;
  links: string[];
}

export interface Workspace {
  id: string;
  userId: string; // Sahibi
  collaborators: string[]; // İşbirliği yapan kullanıcı ID'leri
  inviteCode?: string; // Paylaşım kodu
  title: string;
  summary: string;
  progressSteps: ProgressStep[];
  resources: Resource[];
  createdAt: number;
  lastModified: number;
}

export type ViewMode = 'list' | 'detail';
