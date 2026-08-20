import React from 'react';
import './Features.css';

const featuresData = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#b8935a" strokeWidth="1.5">
        <rect x="8" y="8" width="32" height="32" rx="2"/>
        <path d="M16 20 Q24 12 32 20 Q24 28 16 20Z"/>
        <circle cx="24" cy="20" r="3"/>
        <line x1="16" y1="36" x2="32" y2="36"/>
        <line x1="20" y1="40" x2="28" y2="40"/>
      </svg>
    ),
    title: 'Handwoven & Authentic',
    description: 'Crafted by skilled artisans with generations of expertise.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#b8935a" strokeWidth="1.5">
        <rect x="6" y="14" width="16" height="24" rx="2"/>
        <rect x="26" y="10" width="16" height="28" rx="2"/>
        <path d="M10 18h8M10 22h8M10 26h8"/>
        <path d="M30 14h8M30 18h8M30 22h8"/>
        <circle cx="14" cy="32" r="2"/>
        <circle cx="34" cy="32" r="2"/>
      </svg>
    ),
    title: 'Curated Collections',
    description: 'Thoughtfully curated Sarees for every occasion and personality.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#b8935a" strokeWidth="1.5">
        <rect x="8" y="16" width="32" height="22" rx="3"/>
        <path d="M12 16V12a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v4"/>
        <circle cx="24" cy="27" r="4"/>
        <path d="M20 27h-6M28 27h6"/>
      </svg>
    ),
    title: 'Pan-India Delivery',
    description: 'Delivered with care, securely to your doorstep.',
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#b8935a" strokeWidth="1.5">
        <rect x="10" y="10" width="28" height="28" rx="3"/>
        <rect x="14" y="14" width="20" height="20" rx="1"/>
        <path d="M20 8v4M28 8v4"/>
        <path d="M24 18v8l4 4"/>
        <circle cx="24" cy="24" r="2" fill="#b8935a"/>
      </svg>
    ),
    title: 'Luxury Gift Packaging',
    description: 'Every saree comes in our signature luxury packaging.',
  },
];

const Features = () => {
  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
