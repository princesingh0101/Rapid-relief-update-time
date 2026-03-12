import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStore: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Administrator',
  email: 'admin@rapidrelief.com',
  phone: '9999999999',
  role: 'admin',
  addresses: [],
  password: 'Prince@123'
};

const MOCK_STORE: User = {
  id: 'store-1',
  name: 'HealthPlus Pharmacy',
  email: 'store@rapidrelief.com',
  phone: '8888888888',
  role: 'store',
  addresses: [
    {
      id: 'addr-store-1',
      type: 'Work',
      street: '45, MG Road',
      city: 'Bangalore',
      zip: '560001'
    }
  ],
  password: 'Store@123'
};

const MOCK_USER: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  role: 'user',
  addresses: [
    {
      id: 'addr-1',
      type: 'Home',
      street: '123, Green Park, Indiranagar',
      city: 'Bangalore',
      zip: '560038'
    }
  ],
  password: 'password'
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Load users from local storage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('rapid_users');
    let currentUsers: User[] = [];

    if (storedUsers) {
      currentUsers = JSON.parse(storedUsers);
      
      // Ensure MOCK_STORE is in the list and has the correct password
      const storeIdx = currentUsers.findIndex(u => u.email === MOCK_STORE.email);
      if (storeIdx === -1) {
        currentUsers.push(MOCK_STORE);
      } else if (currentUsers[storeIdx].password !== MOCK_STORE.password) {
        currentUsers[storeIdx] = MOCK_STORE;
      }

      // Ensure MOCK_ADMIN is also up to date
      const adminIdx = currentUsers.findIndex(u => u.email === MOCK_ADMIN.email);
      if (adminIdx === -1) {
        currentUsers.push(MOCK_ADMIN);
      } else if (currentUsers[adminIdx].password !== MOCK_ADMIN.password) {
        currentUsers[adminIdx] = MOCK_ADMIN;
      }

      setUsers(currentUsers);
      localStorage.setItem('rapid_users', JSON.stringify(currentUsers));
    } else {
      // Initialize with mock users if empty
      const initialUsers = [MOCK_ADMIN, MOCK_STORE, MOCK_USER];
      setUsers(initialUsers);
      localStorage.setItem('rapid_users', JSON.stringify(initialUsers));
    }

    const storedSession = localStorage.getItem('rapid_session');
    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      // Sync session user with updated credentials if needed
      if (sessionUser.email === MOCK_STORE.email && sessionUser.password !== MOCK_STORE.password) {
        sessionUser.password = MOCK_STORE.password;
        localStorage.setItem('rapid_session', JSON.stringify(sessionUser));
      }
      setUser(sessionUser);
    }
    
    // Simulate initial loading check
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Search in our users list
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      // Password comparison (simple string comparison for mock)
      if (password && foundUser.password && foundUser.password !== password) {
         // Special master password for admin if needed, but let's stick to credentials
         return false;
      }
      
      setUser(foundUser);
      localStorage.setItem('rapid_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, phone: string, password?: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role: 'user',
      addresses: [],
      password
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('rapid_users', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem('rapid_session', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rapid_session');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('rapid_session', JSON.stringify(updatedUser));

    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('rapid_users', JSON.stringify(updatedUsers));
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddress: Address = { ...addressData, id: Date.now().toString() };
    const updatedAddresses = [...user.addresses, newAddress];
    updateProfile({ addresses: updatedAddresses });
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter(a => a.id !== id);
    updateProfile({ addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      signup,
      logout, 
      updateProfile,
      addAddress,
      removeAddress,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isStore: user?.role === 'store'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};