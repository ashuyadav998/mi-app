// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    return storedLoginStatus === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    }
  }, [isLoggedIn, currentUser]);

  // **Usuario por defecto para pruebas**
  const DEFAULT_USER = { username: 'admin@gmail.com', password: 'admin' };

  useEffect(() => {
    // Comprueba si ya existe el usuario por defecto
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const defaultUserExists = users.some(user => user.username === DEFAULT_USER.username);

    // Si no existe, lo añade a localStorage
    if (!defaultUserExists) {
      users.push(DEFAULT_USER);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Usuario por defecto creado para pruebas:', DEFAULT_USER.username);
    }
  }, []);

  const register = (username, password) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      console.error('El nombre de usuario ya existe.');
      return false;
    }
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    console.log('Usuario registrado y logueado:', username);
    return true;
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(
      user => user.username === username && user.password === password
    );

    if (foundUser) {
      setIsLoggedIn(true);
      setCurrentUser(foundUser);
      console.log('Usuario logueado:', username);
      return true;
    } else {
      console.error('Credenciales inválidas.');
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    console.log('Sesión cerrada.');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};