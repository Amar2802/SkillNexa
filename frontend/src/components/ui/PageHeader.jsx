import { motion } from "framer-motion";

const PageHeader = ({ kicker, title, description, actions, aside, className = "" }) => (
  <motion.section
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={`snx-panel relative overflow-hidden !p-5 sm:!p-6 ${className}`.trim()}
  >
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1),transparent_32%),radial-gradient(circle_at_left,rgba(139,92,246,0.08),transparent_28%)]" />
    <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="space-y-3">
        {kicker ? <span className="snx-kicker">{kicker}</span> : null}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-custom-900 sm:text-3xl dark:text-white">{title}</h1>
          {description ? <p className="snx-subcopy max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {aside ? <div className="relative min-w-[200px]">{aside}</div> : null}
    </div>
  </motion.section>
);

export default PageHeader;
