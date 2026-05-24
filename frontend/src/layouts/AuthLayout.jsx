import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="app-shell app-shell-auth">
    <main className="auth-content snx-main-shell">
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
