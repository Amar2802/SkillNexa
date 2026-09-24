import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { clearApiSession, registerAuthHandlers } from "../services/api";
import {
  clearAuthSession,
  getRememberMePreference,
  getStoredUser,
  setAuthSession,
  setAuthNotice
} from "../utils/authStorage";
import { hasFeatureAccess } from "../utils/subscription";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [profile, setProfile] = useState(() => getStoredUser());
  
  // Explicit auth states: 'restoring' | 'authenticated' | 'unauthenticated'
  const [authStatus, setAuthStatus] = useState(() => (getStoredUser() ? "authenticated" : "restoring"));
  const [authReady, setAuthReady] = useState(() => Boolean(getStoredUser()));
  const [authLoading, setAuthLoading] = useState(false);

  const applyAuth = useCallback((session) => {
    const safeUser = session?.user || null;
    setAuthSession({
      accessToken: session?.accessToken || "",
      user: safeUser,
      rememberMe: session?.rememberMe ?? getRememberMePreference()
    });
    setUser(safeUser);
    setProfile(safeUser);
    setAuthStatus(safeUser ? "authenticated" : "unauthenticated");
    setAuthReady(true);
  }, []);

  const hydrateAuth = useCallback((nextUser) => {
    setAuthSession({ user: nextUser });
    setUser(nextUser);
    setProfile(nextUser);
    setAuthStatus(nextUser ? "authenticated" : "unauthenticated");
    setAuthReady(true);
  }, []);

  const clearSessionState = useCallback(() => {
    clearApiSession();
    clearAuthSession();
    setUser(null);
    setProfile(null);
    setAuthStatus("unauthenticated");
    setAuthReady(true);
  }, []);

  const logout = useCallback(async ({ silent = false } = {}) => {
    try {
      await authService.logout();
    } catch {
      // The local session should still be cleared even if the server logout call fails.
    } finally {
      clearSessionState();
      if (!silent) {
        setAuthNotice("You have been logged out.");
      }
    }
  }, [clearSessionState]);

  const restoreSession = useCallback(async () => {
    try {
      setAuthLoading(true);
      const session = await authService.restoreSession();
      applyAuth({ ...session, rememberMe: getRememberMePreference() });
      return session;
    } catch (error) {
      if (error?.response?.status === 401) {
        clearSessionState();
      } else {
        // Network timeout / server waking up: retain cached state if available
        setAuthStatus(getStoredUser() ? "authenticated" : "unauthenticated");
        setAuthReady(true);
      }
      throw error;
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuth, clearSessionState]);

  const login = useCallback(async (payload) => {
    setAuthLoading(true);
    try {
      const session = await authService.login(payload);
      applyAuth({ ...session, rememberMe: payload?.rememberMe ?? true });
      return session;
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuth]);

  const signup = useCallback(async (payload) => {
    setAuthLoading(true);
    try {
      const session = await authService.signup(payload);
      applyAuth({ ...session, rememberMe: payload?.rememberMe ?? true });
      return session;
    } finally {
      setAuthLoading(false);
    }
  }, [applyAuth]);

  const hasAccess = useCallback((featureKey) => {
    return hasFeatureAccess(user, featureKey);
  }, [user]);

  useEffect(() => {
    registerAuthHandlers({
      onAuthRefresh: (session) => {
        if (session?.user) {
          setAuthSession({ accessToken: session.accessToken || "", user: session.user });
          setUser(session.user);
          setProfile(session.user);
          setAuthStatus("authenticated");
          setAuthReady(true);
        }
      },
      onAuthFailure: (error) => {
        if (error?.response?.status === 401) {
          clearSessionState();
        }
      }
    });

    return () => {
      registerAuthHandlers({});
    };
  }, [clearSessionState]);

  // Background silent authentication restoration on app boot
  useEffect(() => {
    let active = true;
    const bootstrapAuth = async () => {
      try {
        const session = await authService.restoreSession();
        if (!active) return;
        applyAuth({ ...session, rememberMe: getRememberMePreference() });
      } catch (error) {
        if (!active) return;
        if (error?.response?.status === 401) {
          clearSessionState();
        } else {
          setAuthStatus(getStoredUser() ? "authenticated" : "unauthenticated");
          setAuthReady(true);
        }
      }
    };

    void bootstrapAuth();

    return () => {
      active = false;
    };
  }, [applyAuth, clearSessionState]);

  const value = useMemo(() => ({
    user,
    setUser,
    profile,
    setProfile,
    authStatus,
    authReady,
    authLoading,
    applyAuth,
    hydrateAuth,
    login,
    signup,
    logout,
    restoreSession,
    hasAccess
  }), [applyAuth, authLoading, authReady, authStatus, hydrateAuth, login, logout, profile, restoreSession, signup, user, hasAccess]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
