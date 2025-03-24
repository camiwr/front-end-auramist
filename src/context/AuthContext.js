import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/protected', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Usuário não autenticado');
        return res.json();
      })
      .then(data => setUser({ id: data.userId, role: data.role, name: data.userName }))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
