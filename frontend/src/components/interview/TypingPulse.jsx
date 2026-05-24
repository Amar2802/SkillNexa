import { motion } from "framer-motion";

const TypingPulse = ({ text = "Generating your interview..." }) => (
  <div className="rounded-3xl border border-brand-100 bg-brand-50 p-5">
    <p className="text-sm font-semibold text-brand-700">{text}</p>
    <div className="mt-3 flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1, delay: index * 0.18 }}
          className="h-2.5 w-2.5 rounded-full bg-brand-500"
        />
      ))}
    </div>
  </div>
);

export default TypingPulse;
