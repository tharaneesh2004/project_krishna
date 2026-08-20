import React from 'react';
import './Story.css';

const Story = () => {
  return (
    <section className="story" id="about">
      <div className="story-bg">
        <div className="story-pattern"></div>
      </div>
      <div className="story-content">
        <div className="story-text">
          <p className="story-lead">More than a saree,</p>
          <h2><em>it's an emotion.</em></h2>
          <p className="story-description">
            At Vastraa, we celebrate the six yards of grace
            that connect tradition with today.
          </p>
          <a href="#" className="btn btn-primary">Discover The Story</a>
        </div>
      </div>
    </section>
  );
};

export default Story;
