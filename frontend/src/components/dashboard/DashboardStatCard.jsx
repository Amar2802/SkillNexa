import { motion } from "framer-motion";

const DashboardStatCard = ({ label, value, caption, accent = "from-brand-500 to-brand-600" }) => (
  <motion.div whileHover={{ y: -4 }} className="snx-stat-card">
    <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-r ${accent} px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white`}>
      {label}
    </div>
    <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{caption}</p>
  </motion.div>
);

export default DashboardStatCard;
