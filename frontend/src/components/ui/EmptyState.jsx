import { motion } from "framer-motion";

const EmptyState = ({ 
  title, 
  description, 
  action, 
  icon = "📭",
  className = "" 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`snx-empty-state ${className}`.trim()}
    role="status"
    aria-label={title}
  >
    <div className="snx-empty-state-icon">{icon}</div>
    <h3 className="snx-empty-state-title">{title}</h3>
    <p className="snx-empty-state-description">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);

export default EmptyState;
