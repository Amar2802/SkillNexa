import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { authService } from "../services/authService";
import { clearApiSession, registerAuthHandlers } from "../services/api";
import {
  clearAuthSession,
  getRememberMePreference,
  getStoredUser,
  setAuthSession,
  setAuthNotice
} from "../utils/authStorage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [profile, setProfile] = useState(() => getStoredUser());
  const [authReady, setAuthReady] = useState(() => Boolean(getStoredUser()));
  const [authLoading, setAuthLoading] = useState(false);
  const bootstrapStartedRef = useRef(false);

  const applyAuth = useCallback((session) => {
    const safeUser = session?.user || null;
    setAuthSession({
      accessToken: session?.accessToken || "",
      user: safeUser,
      rememberMe: session?.rememberMe ?? getRememberMePreference()
    });
    setUser(safeUser);
    setProfile(safeUser);
    setAuthReady(true);
  }, []);

  const hydrateAuth = useCallback((nextUser) => {
    setAuthSession({ user: nextUser });
    setUser(nextUser);
    setProfile(nextUser);
    setAuthReady(true);
  }, []);

  const clearSessionState = useCallback(() => {
    clearApiSession();
    clearAuthSession();
    setUser(null);
    setProfile(null);
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
      }
      throw error;
    } finally {
      setAuthLoading(false);
      setAuthReady(true);
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

  useEffect(() => {
    registerAuthHandlers({
      onAuthRefresh: (session) => {
        if (session?.user) {
          setAuthSession({ accessToken: session.accessToken || "", user: session.user });
          setUser(session.user);
          setProfile(session.user);
          setAuthReady(true);
        }
      },
      onAuthFailure: () => {
        clearSessionState();
      }
    });

    return () => {
      registerAuthHandlers({});
    };
  }, [clearSessionState]);

  useEffect(() => {
    if (bootstrapStartedRef.current) return;
    bootstrapStartedRef.current = true;

    let active = true;
    const bootstrapAuth = async () => {
      try {
        setAuthLoading(true);
        const session = await authService.restoreSession();
        if (!active) return;
        applyAuth({ ...session, rememberMe: getRememberMePreference() });
      } catch (error) {
        if (!active) return;
        if (error?.response?.status === 401) {
          clearSessionState();
        }
      } finally {
        if (active) {
          setAuthLoading(false);
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
    authReady,
    authLoading,
    applyAuth,
    hydrateAuth,
    login,
    signup,
    logout,
    restoreSession
  }), [applyAuth, authLoading, authReady, hydrateAuth, login, logout, profile, restoreSession, signup, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
