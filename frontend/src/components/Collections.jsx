import React from 'react';
import './Collections.css';

const collectionsData = [
  {
    title: 'Silk Sarees',
    description: 'Luxurious. Elegant. Eternal.',
    gradient: 'linear-gradient(135deg, #8B6914 0%, #D4A843 50%, #8B6914 100%)',
  },
  {
    title: 'Kanchipuram Collection',
    description: 'Tradition that never fades.',
    gradient: 'linear-gradient(135deg, #8B1A1A 0%, #CD3333 50%, #8B1A1A 100%)',
  },
  {
    title: 'Bridal Edit',
    description: 'For your most precious day.',
    gradient: 'linear-gradient(135deg, #722F37 0%, #C41E3A 50%, #722F37 100%)',
  },
  {
    title: 'Festive Collection',
    description: 'Celebrate in timeless style.',
    gradient: 'linear-gradient(135deg, #1B4D3E 0%, #2E8B57 50%, #1B4D3E 100%)',
  },
];

const Collections = () => {
  return (
    <section className="collections" id="collections">
      <div className="container">
        <div className="collections-header">
          <span className="section-label">OUR COLLECTIONS</span>
          <h2 className="section-title">Draped in Heritage. Woven with Love.</h2>
        </div>
        <div className="collections-grid">
          {collectionsData.map((item, index) => (
            <div className="collection-card" key={index}>
              <div className="collection-image" style={{ background: item.gradient }}>
                <div className="collection-image-pattern">
                  <svg viewBox="0 0 200 300" fill="none">
                    <defs>
                      <pattern id={`pattern-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L40 20 L20 40 L0 20Z" stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="200" height="300" fill={`url(#pattern-${index})`}/>
                    <circle cx="100" cy="150" r="50" stroke="rgba(255,255,255,0.2)" fill="none" strokeWidth="0.5"/>
                    <circle cx="100" cy="150" r="35" stroke="rgba(255,255,255,0.15)" fill="none" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>
              <div className="collection-info">
                <div className="collection-ornament">
                  <svg width="30" height="12" viewBox="0 0 30 12" fill="none">
                    <path d="M0 6 Q7.5 0 15 6 Q22.5 12 30 6" stroke="#b8935a" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a href="#" className="collection-link">EXPLORE &gt;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
