import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = ({ variant = 'switch' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Simple Switch Toggle
  if (variant === 'switch') {
    return (
      <button
        className={`theme-toggle-switch ${isDark ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="toggle-track">
          <span className="toggle-icons">
            <Sun className="sun-icon" size={14} />
            <Moon className="moon-icon" size={14} />
          </span>
          <span className="toggle-thumb"></span>
        </span>
      </button>
    );
  }

  // Button Toggle
  if (variant === 'button') {
    return (
      <button
        className={`theme-toggle-button ${isDark ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="icon-wrapper">
          <Sun className={`sun-icon ${isDark ? 'hidden' : 'visible'}`} size={20} />
          <Moon className={`moon-icon ${isDark ? 'visible' : 'hidden'}`} size={20} />
        </span>
        <span className="theme-label">{isDark ? 'Dark' : 'Light'}</span>
      </button>
    );
  }

  // Icon Only Toggle
  if (variant === 'icon') {
    return (
      <button
        className={`theme-toggle-icon ${isDark ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="icon-container">
          <Sun className={`sun-icon ${isDark ? 'rotate-out' : 'rotate-in'}`} size={22} />
          <Moon className={`moon-icon ${isDark ? 'rotate-in' : 'rotate-out'}`} size={22} />
        </div>
      </button>
    );
  }

  // Animated Toggle (Default)
  return (
    <button
      className={`theme-toggle-animated ${isDark ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${isDark ? 'Dark' : 'Light'} Mode - Click to toggle`}
    >
      <div className="toggle-scene">
        {/* Sun */}
        <div className={`celestial sun ${isDark ? 'set' : 'rise'}`}>
          <Sun size={24} />
          <div className="rays">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="ray" style={{ '--i': i }}></span>
            ))}
          </div>
        </div>
        
        {/* Moon */}
        <div className={`celestial moon ${isDark ? 'rise' : 'set'}`}>
          <Moon size={22} />
          <div className="stars">
            {[...Array(3)].map((_, i) => (
              <span key={i} className="star" style={{ '--i': i }}>✦</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;