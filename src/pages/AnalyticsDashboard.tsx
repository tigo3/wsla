
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import VisitsChart from '@/components/analytics/VisitsChart';
import LinkClicksTable from '@/components/analytics/LinkClicksTable';
import { Link, Analytics } from '@/types';
import { getLinks, getAnalytics, initializeMockData } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardHeader />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Calculate total clicks across all links
  const totalClicks = links.reduce((total, link) => total + link.clicks, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-8">Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.totalVisits}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalClicks}</div>
            </CardContent>
          </Card>
          
          <Card>
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
          <VisitsChart analytics={analytics} />
          <LinkClicksTable links={links} />
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
