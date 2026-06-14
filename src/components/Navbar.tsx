/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Menu, X, Compass, Home, Award, Briefcase, FileText, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Accueil', route: 'home', icon: Home },
    { label: 'Biens', route: 'annonces', icon: Compass },
    { label: 'Services BTP', route: 'services', icon: Briefcase },
    { label: 'À Propos', route: 'a-propos', icon: Award },
    { label: 'Blog', route: 'blog', icon: FileText },
    { label: 'Contact', route: 'contact', icon: Phone },
  ];

  const handleNavClick = (route: string) => {
    navigateTo(route);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-immo-border transition-all duration-300 shadow-xs" id="immo-header">
      {/* Top Banner Ribbon */}
      <div className="bg-immo-primary text-white text-[11px] font-sans font-semibold py-2 px-4 text-center tracking-wide shadow-xs" id="dev-banner">
        ImmoDakar · "Votre bien, entre de bonnes mains" · Agence Yoff : Réponse garantie en moins de 2 heures
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo Brand matching brand identity precisely */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavClick('home')} id="navbar-logo">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight font-serif text-immo-text-dark flex items-center gap-1">
              Immo<span className="text-immo-primary-light font-sans font-extrabold italic">Dakar</span>
            </span>
            <div className="hidden md:flex flex-col ml-3 pl-3 border-l border-immo-border">
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#2d6a3f] uppercase">Immobilier</span>
              <span className="text-[9px] font-sans text-immo-text-muted uppercase tracking-widest">&amp; BTP Sénégal</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex space-x-1 xl:space-x-2 items-center">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route || 
                               (link.route === 'annonces' && currentRoute === 'annonce-detail') ||
                               (link.route === 'blog' && currentRoute === 'article-detail');
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:text-immo-primary ${
                    isActive 
                      ? 'text-immo-primary border-b-2 border-immo-primary rounded-none' 
                      : 'text-immo-text-body hover:bg-immo-bg-light/45'
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Single CTA Button Call To Action */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={() => handleNavClick('contact')}
              className="px-6 h-[38px] bg-immo-primary hover:bg-immo-primary-light text-white font-sans font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-xs active:scale-95 flex items-center"
            >
              Nous contacter
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-immo-bg-light rounded-xl text-immo-text-body hover:text-immo-primary transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-immo-border animate-fade-in" id="mobile-menu">
          <div className="px-4 pt-3 pb-6 space-y-2 sm:px-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route || 
                               (link.route === 'annonces' && currentRoute === 'annonce-detail') ||
                               (link.route === 'blog' && currentRoute === 'article-detail');
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-immo-primary-faint text-immo-primary font-bold' 
                      : 'text-immo-text-body hover:bg-immo-bg-light'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-immo-border px-2">
              <button
                onClick={() => handleNavClick('contact')}
                className="w-full h-11 bg-immo-primary hover:bg-immo-primary-light text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-xs"
              >
                Nous contacter
              </button>
            </div>
            
          </div>
        </div>
      )}
    </header>
  );
};
