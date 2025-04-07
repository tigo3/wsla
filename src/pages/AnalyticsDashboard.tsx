
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import VisitsChart from '@/components/analytics/VisitsChart';
import LinkClicksTable from '@/components/analytics/LinkClicksTable';
import { Link, Analytics } from '@/types';
import { getLinks, getAnalytics, initializeMockData } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AnalyticsDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [links, setLinks] = useState<Link[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          initializeMockData(user.id);
          
          const userLinks = getLinks(user.id);
          const userAnalytics = getAnalytics(user.id);
          
          setLinks(userLinks);
          setAnalytics(userAnalytics);
        } catch (error) {
          console.error('Error loading analytics:', error);
          toast({
            title: 'Error',
            description: 'Failed to load analytics data',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAnalyticsData();
  }, [user, toast]);

  if (isLoading || !user || !analytics) {
    return (
      <DashboardLayout>
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2.5"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate total clicks across all links
  const totalClicks = links.reduce((total, link) => total + link.clicks, 0);

  return (
    <DashboardLayout>
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Analytics Overview</h2>
          <p className="text-muted-foreground">Track your page performance and link engagement</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalVisits}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalClicks}</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Click-Through Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.totalVisits > 0 
                  ? `${((totalClicks / analytics.totalVisits) * 100).toFixed(1)}%` 
                  : '0%'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm p-2">
            <VisitsChart analytics={analytics} />
          </Card>
          <Card className="shadow-sm p-2">
            <LinkClicksTable links={links} />
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default AnalyticsDashboard;
