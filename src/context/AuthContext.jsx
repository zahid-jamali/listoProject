"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

function buildUserData(data = {}) {
  const userObj = data.user || data;
  return {
    name:
      userObj.name ||
      `${userObj.first_name || ""} ${userObj.last_name || ""}`.trim() ||
      undefined,
    email: userObj.email || undefined,
    plan: userObj.plan,
    subscription: userObj.subscription,
    permission: userObj.permission,
    verified: userObj.verified === true || userObj.verified === 1,
    must_set_password: Boolean(userObj.must_set_password),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      let storedToken = sessionStorage.getItem("token");

      // Fallback: read authToken or auth_user from cookie if sessionStorage is empty
      if (!storedToken && typeof document !== "undefined") {
        const match = document.cookie.match(/(?:^|; )(?:authToken|auth_user)=([^;]*)/);
        if (match) {
          storedToken = decodeURIComponent(match[1]);
          sessionStorage.setItem("token", storedToken);
        }
      }

      const storedUser = sessionStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : { token: storedToken });
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((data) => {
    const tokenVal = data.token;
    if (!tokenVal) return;

    const userData = buildUserData(data);
    sessionStorage.setItem("token", tokenVal);
    sessionStorage.setItem("user", JSON.stringify(userData));

    // Set browser cookies (both authToken for legacy Express backend and auth_user for frontend)
    if (typeof document !== "undefined") {
      document.cookie = `authToken=${encodeURIComponent(tokenVal)}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `auth_user=${encodeURIComponent(tokenVal)}; path=/; max-age=31536000; SameSite=Lax`;
    }

    setToken(tokenVal);
    setUser(userData);
  }, []);

  const updateUser = useCallback((partial = {}) => {
    setUser((prev) => {
      const next = {
        ...(prev || {}),
        ...partial,
      };
      if (partial.verified !== undefined) {
        next.verified =
          partial.verified === true || partial.verified === 1;
      }
      try {
        sessionStorage.setItem("user", JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Clear browser cookies
    if (typeof document !== "undefined") {
      document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "auth_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    setToken(null);
    setUser(null);
  }, []);

  const isLoggedIn = Boolean(token);
  const isVerified = Boolean(user?.verified);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isVerified,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
