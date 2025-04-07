
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types';

interface DashboardWelcomeProps {
  user: {
    id: string;
    username?: string;
    displayName?: string;
    email: string;
  };
  linkCount: number;
  totalClicks: number;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ 
  user, 
  linkCount = 0,
  totalClicks = 0
}) => {
  // Get current time to show appropriate greeting
  const hours = new Date().getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="mb-6 border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">
          {greeting}, {user?.displayName || user?.username || 'there'}!
        </CardTitle>
        <CardDescription>
          Here's an overview of your link page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Links</p>
            <p className="text-2xl font-bold">{linkCount}</p>
          </div>
          <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Total Clicks</p>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </div>
          <div className="sm:block hidden rounded-lg bg-white p-3 shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-lg font-medium truncate">{user?.username || "Not set"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardWelcome;
