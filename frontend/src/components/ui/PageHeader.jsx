import { motion } from "framer-motion";

const PageHeader = ({ kicker, title, description, actions, aside, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.38, ease: "easeOut" }}
    className={`snx-panel relative overflow-hidden ${className}`.trim()}
  >
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_left,rgba(20,184,166,0.14),transparent_24%)]" />
    <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-center">
      <div className="space-y-5">
        {kicker ? <span className="snx-kicker">{kicker}</span> : null}
        <div className="space-y-3">
          <h1 className="snx-display text-balance text-3xl sm:text-4xl xl:text-5xl">{title}</h1>
          {description ? <p className="snx-subcopy max-w-3xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {aside ? <div className="relative">{aside}</div> : null}
    </div>
  </motion.section>
);

export default PageHeader;
