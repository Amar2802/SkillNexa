// Accessibility utilities for keyboard nav, ARIA labels, focus management

export const useKeyboardNav = (items, onSelect) => {
  const [index, setIndex] = React.useState(0);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex(i => (i + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex(i => (i - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      onSelect?.(items[index]);
    }
  };

  return { index, handleKeyDown };
};

// Skip to main content link
export const SkipToMain = () => (
  <a href="#main-content" className="snx-focus-ring absolute -top-12 left-4 z-50 rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:top-4">
    Skip to main content
  </a>
);

// Focus visible wrapper
export const A11yButton = ({ children, ...props }) => (
  <button {...props} className={`snx-focus-ring ${props.className || ''}`}>
    {children}
  </button>
);
