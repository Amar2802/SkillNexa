import { motion } from "framer-motion";

const SectionLoader = ({ title = "Preparing your workspace", subtitle = "Loading the next experience..." }) => (
  <div className="snx-loader-card">
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
