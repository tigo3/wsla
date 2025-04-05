
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { loginUser, logoutUser, registerUser } from '@/services/supabaseService';

// Extended user type that includes Supabase user fields and our custom fields
interface User {
  id: string;
  email: string;
  username?: string;
  displayName?: string;
  bio?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: { username?: string; displayName?: string; bio?: string; profileImage?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Set up auth state listener
  useEffect(() => {
    // First set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setIsAuthenticated(!!currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              // Fetch user profile data when authenticated
              const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();

              if (error) throw error;

              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                username: data?.username,
                displayName: data?.display_name,
                bio: data?.bio,
                profileImage: data?.profile_image,
                createdAt: data?.created_at,
                updatedAt: data?.updated_at
              });
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || ''
              });
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      
      if (currentSession?.user) {
        try {
          // Fetch user profile data when authenticated
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (error) throw error;

          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            username: data?.username,
            displayName: data?.display_name,
            bio: data?.bio,
            profileImage: data?.profile_image,
            createdAt: data?.created_at,
            updatedAt: data?.updated_at
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || ''
          });
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginUser(email, password);
      // Auth state listener will handle setting the user
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Failed to login. Please check your credentials.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, username: string, password: string) => {
    setIsLoading(true);
    try {
      await registerUser(email, username, password);
      // Auth state listener will handle setting the user
      // Note: The profile will be created automatically via database trigger
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      // Auth state listener will handle clearing the user
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout Failed',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: { username?: string; displayName?: string; bio?: string; profileImage?: string }) => {
    try {
      if (!user?.id) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          username: userData.username,
          display_name: userData.displayName,
          bio: userData.bio,
          profile_image: userData.profileImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state if successful
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          username: userData.username || prevUser.username,
          displayName: userData.displayName || prevUser.displayName,
          bio: userData.bio || prevUser.bio,
          profileImage: userData.profileImage || prevUser.profileImage,
          updatedAt: new Date().toISOString()
        };
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
