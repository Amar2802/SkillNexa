import { motion } from "framer-motion";
import SkillNexaLogo from "../SkillNexaLogo";

const SectionLoader = ({ title = "Preparing your workspace", subtitle = "Loading the next experience...", showLogo = false }) => (
  <div className="flex min-h-[220px] items-center justify-center">
    <div className="snx-panel-muted flex w-full max-w-md flex-col items-center gap-5 text-center">
      {showLogo ? <SkillNexaLogo showTagline /> : null}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="relative h-14 w-14"
      >
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-500 border-r-accent-500" />
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        <p className="snx-subcopy">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default SectionLoader;
