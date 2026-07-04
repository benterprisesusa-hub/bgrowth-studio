export interface StudioTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: 'live' | 'coming';
}
