import { motion } from "framer-motion";

const SectionLoader = ({ title = "Preparing your workspace", subtitle = "Loading the next experience..." }) => (
  <div className="snx-panel mx-auto flex max-w-xl items-center gap-4 px-6 py-5">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
      className="h-12 w-12 rounded-2xl border-4 border-brand-100 border-t-brand-500"
    />
    <div>
      <p className="text-base font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

export default SectionLoader;
