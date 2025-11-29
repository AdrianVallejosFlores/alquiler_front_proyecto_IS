"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserProfile = {
  name?: string;
  email?: string;
  picture?: string;
  clienteId?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  processOAuthCallback: (accessToken: string, clienteId: string, profile: Partial<UserProfile>) => void;
  getCurrentToken: (clienteId: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const t = localStorage.getItem("googleAccessToken");
        const cid = localStorage.getItem("auth_clienteId");
        const name = localStorage.getItem("auth_name");
        const email = localStorage.getItem("auth_email");
        const picture = localStorage.getItem("auth_picture");
        if (t) setToken(t);
        if (cid || name || email || picture) {
          setUser({ clienteId: cid ?? undefined, name: name ?? undefined, email: email ?? undefined, picture: picture ?? undefined });
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const processOAuthCallback = (t: string, clienteId: string, profile?: Partial<UserProfile>) => {
    setToken(t);
    const newUser = { clienteId, ...profile } as UserProfile;
    setUser(newUser);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("googleAccessToken", t);
        localStorage.setItem("auth_clienteId", clienteId);
        if (profile?.name) localStorage.setItem("auth_name", profile.name);
        if (profile?.email) localStorage.setItem("auth_email", profile.email);
        if (profile?.picture) localStorage.setItem("auth_picture", profile.picture);
      }
    } catch (e) {
      // ignore
    }
  };

  const getCurrentToken = async (clienteId: string): Promise<string | null> => {
    try {
      const res = await fetch(`http://localhost:5000/api/devcode/auth/current-token?clienteId=${clienteId}`);
      const data = await res.json();
      if (data.accessToken) {
        setToken(data.accessToken);
        localStorage.setItem("googleAccessToken", data.accessToken);
        return data.accessToken;
      }
    } catch (e) {
      console.error("Error getting current token:", e);
    }
    return null;
  };

  const signOut = async () => {
    try {
      const clienteId = localStorage.getItem("auth_clienteId");
      if (clienteId) {
        await fetch("http://localhost:5000/api/devcode/auth/sign-out", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clienteId }),
        });
      }
    } catch (e) {
      console.error("Error signing out:", e);
    }
    setUser(null);
    setToken(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("googleAccessToken");
        localStorage.removeItem("auth_clienteId");
        localStorage.removeItem("auth_name");
        localStorage.removeItem("auth_email");
        localStorage.removeItem("auth_picture");
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signOut, processOAuthCallback, getCurrentToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthProvider;
