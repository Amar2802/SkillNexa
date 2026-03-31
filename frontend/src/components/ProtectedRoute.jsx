import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, needsSetup = false, allowOnboarding = false, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsSetup && !allowOnboarding) {
    return <Navigate to="/setup-preferences" replace />;
  }

  return children;
};

export default ProtectedRoute;
