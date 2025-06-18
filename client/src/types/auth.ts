export interface User {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  isLoading: boolean;
}
