import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useAuthSession = ({ setLoadingApp, setAppError }) => {
  const { user, authReady, authLoading } = useAuth();

  useEffect(() => {
    setLoadingApp(authLoading);
    if (authReady) {
      setAppError("");
    }
  }, [authLoading, authReady, setAppError, setLoadingApp]);

  return { user, authReady };
};
