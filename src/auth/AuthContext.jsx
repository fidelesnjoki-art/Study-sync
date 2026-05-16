
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  auth,
  googleProvider,
} from "../firebase/firebase";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const AuthContext =
  createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const adminEmail =
    "admin@gmail.com";

  const register =
    (email, password) => {

      return createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    };

  const login =
    (email, password) => {

      return signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    };

  const googleLogin =
    () => {

      return signInWithPopup(
        auth,
        googleProvider
      );
    };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);

          setLoading(false);
        }
      );

    return unsubscribe;

  }, []);

  const isAdmin =
    user?.email === adminEmail;

  const value = {
    user,
    loading,
    register,
    login,
    googleLogin,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}