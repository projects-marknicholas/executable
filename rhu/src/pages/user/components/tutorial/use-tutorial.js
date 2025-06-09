// hooks/useTutorial.js
import { useState, useEffect } from 'react';

const useTutorial = (steps, localStorageKey) => {
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem(localStorageKey) !== 'false';
    if (isFirstVisit) {
      setRunTour(true);
      localStorage.setItem(localStorageKey, 'false');
    }
  }, [localStorageKey]);

  const startTour = () => {
    setRunTour(true);
    setTourStepIndex(0);
  };

  return { runTour, setRunTour, tourStepIndex, setTourStepIndex, startTour };
};

export default useTutorial;