import { Navigate, Outlet, useLocation } from "react-router-dom";
import SkillNexaLogo from "./SkillNexaLogo";
import SectionLoader from "./ui/SectionLoader";

const ProtectedRoute = ({ user, authReady, children }) => {
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="snx-page-loader-wrap">
        <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-loader" />
        <SectionLoader title="Verifying your session..." subtitle="Checking your SkillNexa access" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
