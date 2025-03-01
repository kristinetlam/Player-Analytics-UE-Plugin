// components/Header.jsx
import React from 'react';
import './HeaderStyles.css'; // Assuming you will write your CSS here

function Header() {
  return (
    <div className="header">
      <div className="header-titles">
        <h1>Player Analytics Dashboard</h1>
        <div className="header-subtitle">
          <span>Overview</span>
          <span>Player Location</span>
          <span>Interaction Activity</span>
          <span>Specs</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
