// Interface cho User từ JWT token
export interface User {
  id: string;
  email?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  role: string; // ADMIN, USER (từ realm_access.roles)
  scope: string; // openid profile email
  sub: string; // subject từ JWT
  exp: number; // expiration time
  iat: number; // issued at
  jti: string; // JWT ID
  iss: string; // issuer
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface cho User Profile đầy đủ (từ API)
export interface UserProfile extends User {
  address?: string;
  dateOfBirth?: string;
  avatar?: string;
  bankAccounts?: BankAccount[];
}

// Interface cho Bank Account
export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: 'SAVINGS' | 'CHECKING' | 'CREDIT';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface cho Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Interface cho Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface cho Register Request
export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}
