
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ExternalLink, LogOut, BarChart, Home } from 'lucide-react';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <h1 className="text-xl font-bold gradient-text">Linkly</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-1" />
              Links
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/analytics">
              <BarChart className="h-4 w-4 mr-1" />
              Analytics
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild>
            <a href={`/${user?.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Page
            </a>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
