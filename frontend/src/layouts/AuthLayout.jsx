import { Link, Outlet } from "react-router-dom";
import SkillNexaLogo from "../components/SkillNexaLogo";

const AuthLayout = () => (
  <div className="app-shell app-shell-auth">
    <header className="snx-auth-shell-header">
      <Link to="/login" className="text-decoration-none">
        <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-auth" />
      </Link>
    </header>
    <main className="auth-content snx-main-shell">
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
