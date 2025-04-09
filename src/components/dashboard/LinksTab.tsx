
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import LinkCard from '@/components/dashboard/LinkCard';
import LinkForm from '@/components/dashboard/LinkForm';
import { Link } from '@/types';
import { Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LinksTabProps {
  links: Link[];
  isLoading: boolean;
  error?: string | null;
  onAdd: (data: { title: string; url: string }) => Promise<void>;
  onUpdate: (linkId: string, data: { title: string; url: string }) => Promise<boolean | void>;
  onDelete: (linkId: string) => Promise<boolean | void>;
  onReorder?: (links: Link[]) => Promise<boolean | void>;
  onRefresh?: () => void;
}

const LinksTab: React.FC<LinksTabProps> = ({
  links,
  isLoading,
  error,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  onRefresh
}) => {
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);

  const handleAddLink = async (data: { title: string; url: string }) => {
    await onAdd(data);
    setIsAddLinkDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Links</h2>
          <Button disabled>
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">My Links</h2>
          <Button onClick={() => setIsAddLinkDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
        
        <Alert variant={error.includes('Network') ? "warning" : "destructive"} className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>{error.includes('Network') ? "Connection Issue" : "Error"}</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
            {error.includes('Network') && onRefresh && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onRefresh}
                  className="flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry Now
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        {links.length > 0 ? (
          <div>
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-card rounded-lg border">
            <h3 className="text-lg font-medium mb-2">No links available</h3>
            <p className="text-muted-foreground mb-4">Add your first link or try refreshing</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setIsAddLinkDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
              {onRefresh && (
                <Button variant="outline" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Links</h2>
        <Button onClick={() => setIsAddLinkDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>
      
      {links.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-card rounded-lg border">
          <h3 className="text-lg font-medium mb-2">No links yet</h3>
          <p className="text-muted-foreground mb-4">Add your first link to get started</p>
          <Button onClick={() => setIsAddLinkDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Link</DialogTitle>
          </DialogHeader>
          <LinkForm onSubmit={handleAddLink} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinksTab;
