/** User - chuẩn BE: id, email, fullName, role, phone?, status? */
export interface User {
  id?: number;
  _id?: string;
  email: string;
  fullName: string;
  full_name?: string;
  role?: string;
  phone?: string;
  status?: string;
  avatarUrl?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}
