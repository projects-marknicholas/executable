import React from 'react';
import Joyride from 'react-joyride';
import { ACTIONS, EVENTS, STATUS } from 'react-joyride';

const TutorialGuide = ({ run, setRun, steps, stepIndex, setStepIndex }) => {
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      continuous={true}
      scrollToFirstStep={true}
      showSkipButton={true}
      showProgress={true}
      styles={{
        options: {
          primaryColor: '#0339A8',
          textColor: '#333',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#fff',
        },
        tooltip: {
          fontSize: '16px',
        },
        buttonNext: {
          backgroundColor: '#0339A8',
        },
        buttonBack: {
          color: '#0339A8',
        },
      }}
    />
  );
};

export default TutorialGuide;