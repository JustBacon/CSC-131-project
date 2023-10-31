import React from 'react';
import { useEffect, useState } from "react";
import { auth } from '../configuration/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const adminUID = "JpOR5ShTBRf4x7zUTr8u8j5VR8Z2";
  const orgAUID = "";
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    } catch (err) {
        console.error(err);
    }
};

  const logoutButton = () => {
    logout();
    navigate("/login");
  }

  const authValue = {
    email: [email, setEmail],
    password: [password, setPassword],
    user: [user, setUser],
    logoutButton: logoutButton,
  }
  return (
    <div>
      <AuthContext.Provider value={authValue}>
        {children}
      </AuthContext.Provider>
    </div>
  )
};

