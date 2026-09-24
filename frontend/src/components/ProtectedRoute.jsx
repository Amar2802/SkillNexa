import { Navigate, Outlet, useLocation } from "react-router-dom";
import SkillNexaLogo from "./SkillNexaLogo";
import SectionLoader from "./ui/SectionLoader";

const ProtectedRoute = ({ user, authReady, authStatus, children }) => {
  const location = useLocation();

  const isRestoring = authStatus === "restoring" || (!authReady && !user);

  if (isRestoring) {
    return (
      <div className="snx-page-loader-wrap min-h-[60vh]">
        <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-loader" />
        <SectionLoader title="Restoring your session..." subtitle="Opening your protected workspace" />
      </div>
    );
  }

  if (!user || authStatus === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
