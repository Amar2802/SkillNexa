import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = ({ user, profile, logout, appError }) => (
  <div className="app-shell app-shell-user">
    <Navbar user={user} profile={profile} logout={logout} />
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="app-content snx-main-shell"
    >
      {appError ? (
        <div className="container-fluid py-3 snx-page-shell">
          <div className="alert alert-warning mb-0">{appError}</div>
        </div>
      ) : null}
      <Outlet />
    </motion.main>
  </div>
);

export default AppLayout;
