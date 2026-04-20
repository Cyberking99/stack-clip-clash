import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  address: string;
  balance: number;
}

interface StacksContextType {
  userData: UserData | null;
  isLoading: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const StacksContext = createContext<StacksContextType | undefined>(undefined);

const STORAGE_KEY = '@clipclash_user_session';

export const StacksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const savedSession = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedSession) {
          setUserData(JSON.parse(savedSession));
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const connectWallet = async () => {
    // Mock wallet connection for MVP
    const mockUser: UserData = {
      address: 'SP2P3Y7804D789X4Y' + Math.floor(Math.random() * 1000),
      balance: 1000,
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      setUserData(mockUser);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUserData(null);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  return (
    <StacksContext.Provider value={{ userData, isLoading, connectWallet, disconnectWallet }}>
      {children}
    </StacksContext.Provider>
  );
};

export const useStacks = () => {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
};
