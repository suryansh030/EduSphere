import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ProfileForm from './components/ProfileForm';
import AnalysisView from './components/AnalysisView';
import ThemeToggle from './components/ThemeToggle';
import './SkillGapApp.css';

function SkillGapApp() {
  const [step, setStep] = useState('form'); // 'form' or 'analysis'
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePortfolio = async (formData) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/generate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate portfolio');
      }

      const data = await response.json();
      setPortfolioData(data);
      setStep('analysis');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('form');
    setPortfolioData(null);
  };

  return (
    <ThemeProvider>
      {/* ✅ Wrapper that matches .skill-gap-root in CSS */}
      <div className="skill-gap-root">
        <div className="app">
          {/* Theme Toggle Button - Fixed Position */}
          <div className="theme-toggle-container">
            <ThemeToggle variant="switch" />
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Analyzing your profile and generating portfolio...</p>
              <p className="loading-subtext">This may take 30-60 seconds</p>
            </div>
          )}
          
          {step === 'form' && (
            <ProfileForm onSubmit={handleGeneratePortfolio} />
          )}
          
          {step === 'analysis' && portfolioData && (
            <AnalysisView data={portfolioData} onBack={handleBack} />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default SkillGapApp;