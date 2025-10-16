export interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  name: string;
  photoURL?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}
