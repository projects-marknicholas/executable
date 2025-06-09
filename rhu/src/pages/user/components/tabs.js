import { useState, useEffect } from 'react';

// Components
import { AnimatedContainer } from '../../../animations/animated-container';
import Individual from './individual';
import Family from './family';
import Institution from './institution';
import Types from './types';
import Symptoms from './symptoms';
import Hotlines from './hotlines';
import Reports from './reports';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('Register');
  const [selectedType, setSelectedType] = useState(null); // Initially null, no category selected
  const [isCategorySelected, setIsCategorySelected] = useState(false); // Track if a category is selected

  // Retrieve the userCategory from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user')); // Parse user data
    const storedCategory = userData?.category; // Access category safely
    if (storedCategory) {
      setSelectedType(storedCategory); // Set the selectedType based on localStorage
      setIsCategorySelected(true); // Mark category as selected
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = (type) => {
    setSelectedType(type);
    setIsCategorySelected(true); // Mark category as selected
    localStorage.setItem('user', JSON.stringify({ category: type })); // Save category to localStorage
  };

  return (
    <div className='tabs'>
      <div className='tabs-indict'>
        <div
          className={activeTab === 'Register' ? 'active' : ''}
          onClick={() => setActiveTab('Register')}
        >
          Register
        </div>
        <div
          className={activeTab === 'Report Symptoms' ? 'active' : ''}
          onClick={() => setActiveTab('Report Symptoms')}
        >
          Symptoms
        </div>
        <div
          className={activeTab === 'Hotlines' ? 'active' : ''}
          onClick={() => setActiveTab('Hotlines')}
        >
          Hotlines
        </div>
        <div
          className={activeTab === 'Reports' ? 'active' : ''}
          onClick={() => setActiveTab('Reports')}
        >
          Reports
        </div>
      </div>
      <div className="tab-content">
        <AnimatedContainer animationKey={activeTab}>
          {activeTab === 'Register' && (
            <div className="tab-pane">
              {!isCategorySelected ? (
                <form className='reg-form'>
                  <h3>Registration Type</h3>
                  <Types
                    selectedType={selectedType}
                    setSelectedType={handleCategorySelect} 
                  />
                </form>
              ) : (
                <AnimatedContainer animationKey={selectedType} className="type-content">
                  {selectedType === 'Individual' && <Individual />}
                  {selectedType === 'Family' && <Family />}
                  {selectedType === 'Institution' && <Institution />}
                  {selectedType === 'Reports' && <Reports />}
                </AnimatedContainer>
              )}
            </div>
          )}
          {activeTab === 'Report Symptoms' && <Symptoms />}
          {activeTab === 'Hotlines' && <Hotlines />}
          {activeTab === 'Reports' && <Reports />}
        </AnimatedContainer>
      </div>
    </div>
  );
};
