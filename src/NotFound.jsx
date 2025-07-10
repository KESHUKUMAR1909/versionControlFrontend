import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const containerStyle = {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Segoe UI, sans-serif',
  };

  const headingStyle = {
    fontSize: '48px',
    color: '#e74c3c',
  };

  const paragraphStyle = {
    fontSize: '20px',
    color: '#555',
    margin: '20px 0',
  };

  const linkStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
  };

  const hoverStyle = {
    backgroundColor: '#2980b9',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404 - Page Not Found</h1>
      <p style={paragraphStyle}>Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        style={linkStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = hoverStyle.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = linkStyle.backgroundColor)}
      >
        🔙 Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
