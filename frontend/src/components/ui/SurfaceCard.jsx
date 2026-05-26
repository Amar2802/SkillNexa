const SurfaceCard = ({ children, className = "", strong = false }) => (
  <div className={`${strong ? "snx-panel" : "snx-panel-muted"} ${className}`.trim()}>
    {children}
  </div>
);

export default SurfaceCard;
