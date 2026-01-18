import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default LoadingPage;