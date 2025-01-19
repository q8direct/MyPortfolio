export interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  is_admin?: boolean;
}