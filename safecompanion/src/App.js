import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Calculator from './components/Calculator';
import MainApp from './components/MainApp';

function App() {
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = () => setUnlocked(true);
  const handleLock = () => {
    setUnlocked(false);
    // Quick exit: replace browser history so back button doesn't reveal app
    window.history.replaceState(null, '', '/');
  };

  if (!unlocked) {
    return <Calculator onUnlock={handleUnlock} />;
  }

  return (
    <Router>
      <MainApp onExit={handleLock} />
    </Router>
  );
}

export default App;