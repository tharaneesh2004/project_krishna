import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Collections from './components/Collections';
import Features from './components/Features';
import Story from './components/Story';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <Features />
        <Story />
      </main>
      <Footer />
    </>
  );
}

export default App;
