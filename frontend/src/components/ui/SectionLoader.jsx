import { motion } from "framer-motion";
import SkillNexaLogo from "../SkillNexaLogo";

const SectionLoader = ({ title = "Preparing your workspace", subtitle = "Loading the next experience...", showLogo = false }) => (
  <div className="snx-loader-card">
    {showLogo ? <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-loader" /> : null}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
      className="snx-loader-ring"
    />
    <div>
      <h3 className="snx-loader-title">{title}</h3>
      <p className="snx-loader-subtitle mb-0">{subtitle}</p>
    </div>
  </div>
);

export default SectionLoader;
