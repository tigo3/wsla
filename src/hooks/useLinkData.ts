
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@/types';
import { 
  createLink, 
  deleteLink, 
  getUserLinks, 
  recordLinkClick, 
  updateLink 
} from '@/services/supabaseService';

export function useLinkData(userId: string | undefined) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLinks = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const fetchedLinks = await getUserLinks(userId);
      setLinks(fetchedLinks);
    } catch (error) {
      console.error('Error fetching links:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load links. Please try again.';
      
      setError('Network connection issue. Unable to fetch your links at this time.');
      
      // Only show toast for non-network errors as network errors are displayed in the UI
      if (!errorMessage.includes('Failed to fetch')) {
        toast({
          title: 'Error',
          description: 'Failed to load links. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Retry mechanism for network errors
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    
    if (error && error.includes('Network connection')) {
      retryTimeout = setTimeout(() => {
        fetchLinks();
      }, 5000); // Retry after 5 seconds
    }
    
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [error]);

  const addLink = async (title: string, url: string) => {
    if (!userId) return null;
    
    try {
      const newLink = await createLink(userId, title, url);
      setLinks([...links, newLink]);
      return newLink;
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: 'Error',
        description: 'Failed to add link. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateLinkData = async (linkId: string, data: { title?: string; url?: string }) => {
    if (!userId) return false;
    
    try {
      const success = await updateLink(linkId, userId, data);
      
      if (success) {
        // Update local state
        setLinks(links.map(link => 
          link.id === linkId 
            ? { ...link, ...data, updatedAt: new Date().toISOString() } 
            : link
        ));
      }
      
      return success;
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: 'Error',
        description: 'Failed to update link. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeLinkData = async (linkId: string) => {
    if (!userId) return false;
    
    try {
      const success = await deleteLink(linkId, userId);
      
      if (success) {
        // Update local state
        setLinks(links.filter(link => link.id !== linkId));
      }
      
      return success;
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete link. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const reorderLinks = async (reorderedLinks: Link[]) => {
    if (!userId) return false;
    
    try {
      // First update the local state for immediate UI response
      setLinks(reorderedLinks);

      // Prepare the batch updates for each link
      for (let i = 0; i < reorderedLinks.length; i++) {
        const link = reorderedLinks[i];
        await updateLink(link.id, userId, { 
          title: link.title, 
          url: link.url 
        });
      }

      return true;
    } catch (error) {
      console.error('Error reordering links:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder links. Please try again.',
        variant: 'destructive',
      });
      
      // If there was an error, re-fetch the links to restore the correct order
      fetchLinks();
      return false;
    }
  };

  const trackLinkClick = async (linkId: string) => {
    try {
      await recordLinkClick(linkId);
    } catch (error) {
      console.error('Error recording link click:', error);
      // Don't show a toast error to the user for this operation
    }
  };

  return {
    links,
    isLoading,
    error,
    fetchLinks,
    addLink,
    updateLink: updateLinkData,
    deleteLink: removeLinkData,
    reorderLinks,
    recordLinkClick: trackLinkClick
  };
}
