import React from 'react';

// Responsive Grid Components for proper card arrangement

export const GridAuto = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
    {children}
  </div>
);

export const Grid2 = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${className}`}>
    {children}
  </div>
);

export const Grid3 = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
    {children}
  </div>
);

export const Grid4 = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
    {children}
  </div>
);

// Card wrapper with consistent styling
export const GridCard = ({ children, className = '', elevated = true }) => (
  <div className={`snx-card p-6 ${elevated ? 'snx-card-elevated h-full' : 'h-full'} ${className}`}>
    {children}
  </div>
);

// Stats Grid (4 columns on desktop, responsive below)
export const StatsGrid = ({ items }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {items.map((item) => (
      <div key={item.label} className="snx-stat snx-card-elevated h-full">
        <div className="snx-label">{item.label}</div>
        <div className="snx-stat-value mt-3">{item.value}</div>
        <p className="snx-stat-label mt-2">{item.meta || item.description}</p>
      </div>
    ))}
  </div>
);

// Question Cards Grid (2 columns on desktop)
export const QuestionCardsGrid = ({ questions, renderCard }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    {questions.map((question) => (
      <div key={question._id} className="snx-card snx-card-elevated snx-fade-in p-6">
        {renderCard(question)}
      </div>
    ))}
  </div>
);

// Feature Cards Grid (3 columns on desktop)
export const FeatureCardsGrid = ({ items, renderCard }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => (
      <div key={item.id || item._id} className="snx-card snx-card-elevated snx-fade-in p-6 h-full">
        {renderCard(item)}
      </div>
    ))}
  </div>
);
