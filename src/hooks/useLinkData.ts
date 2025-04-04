
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from '@/types';

export function useLinkData(userId: string | undefined) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchLinks = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('order_number', { ascending: true });

      if (error) throw error;

      // Transform from Supabase format to our app's format
      const formattedLinks: Link[] = data?.map(link => ({
        id: link.id,
        userId: link.user_id,
        title: link.title,
        url: link.url,
        order: link.order_number,
        clicks: link.clicks,
        createdAt: link.created_at,
        updatedAt: link.updated_at
      })) || [];

      setLinks(formattedLinks);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: 'Error',
        description: 'Failed to load links. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = async (title: string, url: string) => {
    if (!userId) return null;
    
    try {
      // Get the highest order number
      const maxOrderQuery = await supabase
        .from('links')
        .select('order_number')
        .eq('user_id', userId)
        .order('order_number', { ascending: false })
        .limit(1);

      if (maxOrderQuery.error) throw maxOrderQuery.error;
      
      const nextOrder = maxOrderQuery.data.length > 0 
        ? (maxOrderQuery.data[0]?.order_number + 1) 
        : 0;

      const { data, error } = await supabase
        .from('links')
        .insert([
          { 
            user_id: userId, 
            title, 
            url, 
            order_number: nextOrder 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newLink: Link = {
          id: data.id,
          userId: data.user_id,
          title: data.title,
          url: data.url,
          order: data.order_number,
          clicks: data.clicks,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };

        setLinks([...links, newLink]);
        return newLink;
      }
      return null;
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

  const updateLink = async (linkId: string, data: { title?: string; url?: string }) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ 
          title: data.title,
          url: data.url,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setLinks(links.map(link => 
        link.id === linkId 
          ? { ...link, ...data, updatedAt: new Date().toISOString() } 
          : link
      ));

      return true;
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

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setLinks(links.filter(link => link.id !== linkId));
      return true;
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
    try {
      // First update the local state for immediate UI response
      setLinks(reorderedLinks);

      // Prepare the batch updates for Supabase
      const updates = reorderedLinks.map((link, index) => ({
        id: link.id,
        order_number: index
      }));

      // Update each link with its new order
      for (const update of updates) {
        const { error } = await supabase
          .from('links')
          .update({ order_number: update.order_number })
          .eq('id', update.id)
          .eq('user_id', userId);

        if (error) throw error;
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

  const recordLinkClick = async (linkId: string) => {
    try {
      // Record the click in the database
      await supabase
        .from('link_clicks')
        .insert([{ link_id: linkId }]);
        
      // The increment_link_clicks trigger will automatically update the clicks count
    } catch (error) {
      console.error('Error recording link click:', error);
      // Don't show a toast error to the user for this operation
    }
  };

  return {
    links,
    isLoading,
    fetchLinks,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    recordLinkClick
  };
}
