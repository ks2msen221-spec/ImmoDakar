/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './components/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AnnoncesView } from './components/AnnoncesView';
import { AnnonceDetailView } from './components/AnnonceDetailView';
import { ServicesView } from './components/ServicesView';
import { AProposView } from './components/AProposView';
import { BlogView } from './components/BlogView';
import { ArticleDetailView } from './components/ArticleDetailView';
import { ContactView } from './components/ContactView';
import { AdminDashboardView } from './components/AdminDashboardView';

const AppContent: React.FC = () => {
  const { currentRoute } = useApp();

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView />;
      case 'annonces':
        return <AnnoncesView />;
      case 'annonce-detail':
        return <AnnonceDetailView />;
      case 'services':
        return <ServicesView />;
      case 'a-propos':
        return <AProposView />;
      case 'blog':
        return <BlogView />;
      case 'article-detail':
        return <ArticleDetailView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
      case 'admin-dashboard':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800" id="immo-app-layout">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-grow">
        {renderRoute()}
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
