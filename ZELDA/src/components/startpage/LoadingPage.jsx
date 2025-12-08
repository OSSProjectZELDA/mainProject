import React from 'react';
import './LoadingPage.css'; // We'll create this CSS file next

const LoadingPage = ({ onLoadingComplete }) => {
  // Simulate a loading process
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000); // Simulate 3 seconds of loading

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="loading-page">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingPage;
