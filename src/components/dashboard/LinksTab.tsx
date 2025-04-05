
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import LinkCard from '@/components/dashboard/LinkCard';
import LinkForm from '@/components/dashboard/LinkForm';
import { Link } from '@/types';
import { Plus } from 'lucide-react';

interface LinksTabProps {
  links: Link[];
  isLoading: boolean;
  onAdd: (data: { title: string; url: string }) => Promise<void>;
  onUpdate: (linkId: string, data: { title: string; url: string }) => Promise<boolean | void>;
  onDelete: (linkId: string) => Promise<boolean | void>;
  onReorder?: (links: Link[]) => Promise<boolean | void>;
}

const LinksTab: React.FC<LinksTabProps> = ({
  links,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  onReorder
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
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium mb-2">No links yet</h3>
          <p className="text-muted-foreground mb-4">Add your first link to get started</p>
          <Button onClick={() => setIsAddLinkDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Link
          </Button>
        </div>
      ) : (
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
