import { createContext, useState } from 'react';
import { IUser } from '../types/interfaces';

export interface UserContextType {
  user: IUser | null;
  setUser: (user: IUser) => void;
  updateScore: (score: number) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<IUser | null>(null);

  const updateScore = (score: number) => {
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, score };
      }
      return prevUser;
    });
  };

  const ctxValue = {
    user,
    setUser,
    updateScore,
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
}
