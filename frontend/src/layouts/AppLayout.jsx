import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = ({ user, profile, logout, appError }) => (
  <div className="snx-app-shell min-h-screen">
    <Navbar user={user} profile={profile} logout={logout} />
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pb-8 pt-4 md:pl-[280px] md:pt-[88px]"
    >
      <div className="snx-container space-y-6">
        {appError ? (
          <div
            className="rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
            role="alert"
          >
            {appError}
          </div>
        ) : null}
        <Outlet />
      </div>
    </motion.main>
  </div>
);

export default AppLayout;
