export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  birth_date: string; // Ahora es obligatoria, no puede ser null
  created_at: string; 
  role: string; 
}

