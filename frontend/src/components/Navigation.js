import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, ShoppingBag, MessageSquare, LogOut, ArrowLeftRight } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <ArrowLeftRight size={24} />
          <span>SlotSwapper</span>
        </div>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
            <ShoppingBag size={18} />
            <span>Marketplace</span>
          </Link>
          <Link to="/requests" className={`nav-link ${isActive('/requests') ? 'active' : ''}`}>
            <MessageSquare size={18} />
            <span>Requests</span>
          </Link>
        </div>
        
        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;