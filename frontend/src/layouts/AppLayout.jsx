import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = ({ user, profile, logout, appError }) => (
  <div className="snx-app-shell min-h-screen">
    <Navbar user={user} profile={profile} logout={logout} />
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pb-12 pt-20 md:pl-[240px] md:pt-28"
    >
      <div className="snx-container-md mx-auto space-y-8">
        {appError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50/80 px-6 py-4 text-sm font-medium text-rose-900 shadow-sm" role="alert">
            {appError}
          </div>
        ) : null}
        <Outlet />
      </div>
    </motion.main>
  </div>
);

export default AppLayout;
