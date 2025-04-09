
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the home page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold gradient-text">Wsla</h1>
        <p className="text-gray-700">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default Index;
