import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = ({ user, profile, logout, appError }) => (
  <div className="snx-app-shell min-h-screen">
    <Navbar user={user} profile={profile} logout={logout} />
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="pb-10 pt-6 md:pl-[332px] md:pt-28"
    >
      <div className="snx-container space-y-6">
        {appError ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50/90 px-5 py-4 text-sm font-medium text-amber-900 shadow-sm">
            {appError}
          </div>
        ) : null}
        <Outlet />
      </div>
    </motion.main>
  </div>
);

export default AppLayout;
