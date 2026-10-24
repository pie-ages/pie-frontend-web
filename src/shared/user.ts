export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string | null;
  role?: 'COMPANY' | 'ADMIN';
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE';
}
