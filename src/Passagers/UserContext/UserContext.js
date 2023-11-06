// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [donneer, setDonneer] = useState('');

  return (
    <UserContext.Provider value={{ donneer, setDonneer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
