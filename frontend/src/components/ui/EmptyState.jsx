import { motion } from "framer-motion";

const EmptyState = ({ title, description, action, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`snx-panel-muted flex flex-col items-start gap-4 ${className}`.trim()}
  >
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm">
      <span className="text-xl">+</span>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="snx-subcopy max-w-2xl">{description}</p>
    </div>
    {action}
  </motion.div>
);

export default EmptyState;
