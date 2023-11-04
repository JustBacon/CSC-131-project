import React from 'react';
import { useEffect, useState } from "react";
import { auth } from '../configuration/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('');

  const navigate = useNavigate();

  const adminUID = "JpOR5ShTBRf4x7zUTr8u8j5VR8Z2";
  const orgAUID = "";


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        let userRole = '';
        if (user.email) {
          if (/admin/.test(user.email)) {
            userRole = 'admin';
            console.log('admin');
          } else if ((user.email.indexOf('-orgA@') !== -1)) {
            userRole = 'orgA';
            console.log('orgA');
          } else if (/orgB/.test(user.email)) {
            userRole = 'orgB';
            console.log('orgB');
          } else {
            userRole = 'genericUser';
          }
        } else {
          userRole = 'genericUser';
        }
        setUserRole(userRole);
      }
      else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [userRole, user]);

  const logout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUserRole('');
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
    userRole: [userRole, setUserRole],
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

