
import { supabase } from '@/integrations/supabase/client';
import { Link, Profile, SocialLink } from '@/types';

// === AUTH FUNCTIONS ===
export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const registerUser = async (email: string, username: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    }
  });
  
  if (error) throw error;
  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

// === PROFILE FUNCTIONS ===
export const getProfileByUsername = async (username: string) => {
  // Get the user profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError) throw profileError;

  // Get the user's profile settings
  const { data: settingsData, error: settingsError } = await supabase
    .from('profile_settings')
    .select('*')
    .eq('user_id', profileData.id)
    .single();

  if (settingsError) throw settingsError;

  // Get the user's social links
  const { data: socialData, error: socialError } = await supabase
    .from('social_links')
    .select('*')
    .eq('user_id', profileData.id);

  if (socialError) throw socialError;

  // Get the user's links
  const { data: linksData, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profileData.id)
    .order('order_number', { ascending: true });

  if (linksError) throw linksError;

  // Format the social links
  const socialLinks: SocialLink[] = socialData.map(link => ({
    platform: link.platform,
    url: link.url
  }));

  // Format the links
  const links: Link[] = linksData.map(link => ({
    id: link.id,
    userId: link.user_id,
    title: link.title,
    url: link.url,
    order: link.order_number,
    clicks: link.clicks,
    createdAt: link.created_at,
    updatedAt: link.updated_at
  }));

  // Return the formatted profile data
  return {
    profile: {
      id: profileData.id,
      userId: profileData.id,
      theme: settingsData.theme,
      backgroundColor: settingsData.background_color,
      backgroundImage: settingsData.background_image,
      buttonStyle: settingsData.button_style,
      fontStyle: settingsData.font_style,
      socialLinks,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at
    },
    userData: {
      id: profileData.id,
      username: profileData.username,
      displayName: profileData.display_name,
      bio: profileData.bio,
      profileImage: profileData.profile_image,
      createdAt: profileData.created_at,
      updatedAt: profileData.updated_at
    },
    links
  };
};

export const updateProfileSettings = async (
  userId: string, 
  settings: { 
    theme?: string; 
    buttonStyle?: string; 
    fontStyle?: string;
    backgroundColor?: string;
    backgroundImage?: string;
  }
) => {
  const { error } = await supabase
    .from('profile_settings')
    .update({
      theme: settings.theme,
      button_style: settings.buttonStyle,
      font_style: settings.fontStyle,
      background_color: settings.backgroundColor,
      background_image: settings.backgroundImage,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) throw error;
  return true;
};

// === LINK FUNCTIONS ===
export const getUserLinks = async (userId: string) => {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('order_number', { ascending: true });

  if (error) throw error;

  return data.map(link => ({
    id: link.id,
    userId: link.user_id,
    title: link.title,
    url: link.url,
    order: link.order_number,
    clicks: link.clicks,
    createdAt: link.created_at,
    updatedAt: link.updated_at
  }));
};

export const createLink = async (userId: string, title: string, url: string) => {
  // Get the highest order number
  const { data: orderData, error: orderError } = await supabase
    .from('links')
    .select('order_number')
    .eq('user_id', userId)
    .order('order_number', { ascending: false })
    .limit(1);

  if (orderError) throw orderError;
  
  const nextOrder = orderData.length > 0 ? (orderData[0]?.order_number + 1) : 0;

  const { data, error } = await supabase
    .from('links')
    .insert([{ 
      user_id: userId, 
      title, 
      url, 
      order_number: nextOrder 
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    url: data.url,
    order: data.order_number,
    clicks: data.clicks,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

export const updateLink = async (linkId: string, userId: string, data: { title?: string; url?: string }) => {
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
  return true;
};

export const deleteLink = async (linkId: string, userId: string) => {
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', linkId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
};

export const recordLinkClick = async (linkId: string) => {
  await supabase
    .from('link_clicks')
    .insert([{ link_id: linkId }]);
};
