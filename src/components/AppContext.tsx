/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { db } from '../lib/supabase/client';

interface AppContextType {
  currentRoute: string;
  routeParams: any;
  currentUser: Profile | null;
  navigateTo: (route: string, params?: any) => void;
  loginAs: (role: UserRole) => Promise<void>;
  registerClient: (fullName: string, phone: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  dbUpdateTrigger: number;
  triggerDbUpdate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbUpdateTrigger, setDbUpdateTrigger] = useState<number>(0);

  // Sync state on mount and keep updated
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await db.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error('Erreur de chargement de l\'utilisateur:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();

    // Listen to simulated DB updates
    const handleDbUpdate = () => {
      setDbUpdateTrigger(prev => prev + 1);
      db.getCurrentUser().then(user => setCurrentUser(user));
    };

    window.addEventListener('immodakar_db_update', handleDbUpdate);
    window.addEventListener('hashchange', handleHashChange);

    // Initial routing setup from hash if exists
    parseHashRoute();

    return () => {
      window.removeEventListener('immodakar_db_update', handleDbUpdate);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const triggerDbUpdate = () => {
    setDbUpdateTrigger(prev => prev + 1);
  };

  // Convert hash path #annonces to application routes for smooth bookmarking & refresh
  const parseHashRoute = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      setCurrentRoute('home');
      return;
    }

    if (hash.startsWith('annonces/')) {
      const slug = hash.replace('annonces/', '');
      setCurrentRoute('annonce-detail');
      setRouteParams({ slug });
    } else if (hash.startsWith('blog/')) {
      const slug = hash.replace('blog/', '');
      setCurrentRoute('article-detail');
      setRouteParams({ slug });
    } else {
      setCurrentRoute(hash);
    }
  };

  const handleHashChange = () => {
    parseHashRoute();
  };

  const navigateTo = (route: string, params: any = {}) => {
    setRouteParams(params);
    setCurrentRoute(route);
    
    // Smooth scroll to top on page transitions
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash for standard browser compatibility
    if (route === 'home') {
      window.location.hash = '';
    } else if (route === 'annonce-detail' && params.slug) {
      window.location.hash = `annonces/${params.slug}`;
    } else if (route === 'article-detail' && params.slug) {
      window.location.hash = `blog/${params.slug}`;
    } else {
      window.location.hash = route;
    }
  };

  const loginAs = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const user = await db.login('user@immodakar.sn', role);
      setCurrentUser(user);
      // Redirect to correct dashboard based on role
      if (role === 'client') {
        navigateTo('client-dashboard');
      } else {
        navigateTo('admin-dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (fullName: string, phone: string, email: string) => {
    setIsLoading(true);
    try {
      const user = await db.register(fullName, phone, email);
      setCurrentUser(user);
      navigateTo('client-dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await db.logout();
      setCurrentUser(null);
      navigateTo('home');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeParams,
        currentUser,
        navigateTo,
        loginAs,
        registerClient,
        logout,
        isLoading,
        dbUpdateTrigger,
        triggerDbUpdate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp doit être utilisé au sein d’un AppProvider');
  }
  return context;
};
