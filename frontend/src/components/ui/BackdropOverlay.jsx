export const BackdropOverlay = ({ isOpen, onClose, className = '' }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  
  return (
    <div
      className={`snx-backdrop-blur fixed inset-0 z-40 ${className}`}
      onClick={onClose}
      role="presentation"
      aria-hidden="true"
    />
  );
};

export const DepthLayer = ({ children, level = 1 }) => (
  <div className="snx-card-elevated relative" style={{ zIndex: level }}>
    {children}
  </div>
);
