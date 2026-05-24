import { Navigate, Outlet, useLocation } from "react-router-dom";
import SectionLoader from "./ui/SectionLoader";

const ProtectedRoute = ({ user, authReady, children }) => {
  const location = useLocation();

  if (!authReady) {
    return <SectionLoader title="Verifying your session..." subtitle="Checking your SkillNexa access" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
