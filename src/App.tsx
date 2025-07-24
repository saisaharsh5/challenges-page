import React from 'react';
import { ThunderstormBackground } from './components/ThunderstormBackground';
import { LandingPage } from './components/LandingPage';

function App() {
  return (
    <ThunderstormBackground>
      <LandingPage />
    </ThunderstormBackground>
  );
}

export default App;