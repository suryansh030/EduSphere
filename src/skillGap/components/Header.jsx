import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { Bell, User, Settings } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { theme, isDark } = useTheme();

  return (
    <header className="main-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <Link to="/">
            <h1 className="logo-text">
              <span className="logo-icon">💼</span>
              SkillMatch
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/jobs" className="nav-link">Jobs</Link>
          <Link to="/candidates" className="nav-link">Candidates</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
        </nav>

        {/* Right side actions */}
        <div className="header-actions">
          {/* Theme Toggle - Choose one variant */}
          <ThemeToggle variant="switch" />
          {/* Other variants: "button", "icon", or "animated" (default) */}
          
          {/* Notifications */}
          <button className="header-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* Settings */}
          <button className="header-icon-btn" title="Settings">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <button className="header-profile-btn">
            <img 
              src="/avatar-placeholder.png" 
              alt="Profile" 
              className="profile-avatar"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;