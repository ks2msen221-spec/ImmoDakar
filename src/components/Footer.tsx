/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from './AppContext';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Facebook, Instagram, Linkedin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleLinkClick = (route: string) => {
    navigateTo(route);
  };

  return (
    <footer className="bg-immo-dark text-white border-t border-slate-800" id="immo-footer">
      
      {/* Upper footer section with value statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
        
        {/* Brand details */}
        <div className="flex flex-col space-y-4" id="footer-col-about">
          <span className="text-2xl font-bold font-serif text-white tracking-tight flex items-center gap-1 cursor-pointer" onClick={() => handleLinkClick('home')}>
            Immo<span className="text-immo-primary-light font-sans font-extrabold italic">Dakar</span>
          </span>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">
            Agence immobilière et BTP à Yoff, Dakar. Votre bien, entre de bonnes mains.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-immo-primary-light rounded-full transition-colors text-white hover:scale-105 transform" aria-label="WhatsApp direct">
              <Phone size={16} />
            </a>
            <a href="mailto:contact@immodakar.com" className="p-2 bg-slate-800 hover:bg-immo-primary-light rounded-full transition-colors text-white hover:scale-105 transform" aria-label="Email link">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Navigation Quicklinks */}
        <div className="flex flex-col space-y-4" id="footer-col-links">
          <h3 className="text-sm font-bold uppercase tracking-wider text-immo-primary-pale">Notre Agence</h3>
          <ul className="space-y-2.5 text-sm text-gray-300">
            {['home', 'annonces', 'services', 'a-propos', 'blog', 'contact'].map((route) => {
              const labels: Record<string, string> = {
                home: 'Accueil principal',
                annonces: 'Catalogue de biens',
                services: 'Services BTP & Immobilier',
                'a-propos': 'Qui sommes-nous ?',
                blog: 'Actualités & Blog',
                contact: 'Nous faire signe'
              };
              return (
                <li key={route}>
                  <button 
                    onClick={() => handleLinkClick(route)}
                    className="hover:text-immo-primary-light hover:translate-x-1 duration-150 transition-all flex items-center gap-1.5 cursor-pointer text-left py-0.5"
                  >
                    <ArrowUpRight size={13} className="text-immo-primary-light" />
                    {labels[route]}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Our Services highlights */}
        <div className="flex flex-col space-y-4" id="footer-col-services">
          <h3 className="text-sm font-bold uppercase tracking-wider text-immo-primary-pale font-sans">Secteurs Spécialisés</h3>
          <ul className="space-y-2.5 text-sm text-gray-300 font-sans">
            <li>
              <button onClick={() => handleLinkClick('services')} className="hover:text-gray-100 text-left cursor-pointer">
                • Vente &amp; Mise en location (commission : 1 mois)
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('services')} className="hover:text-gray-100 text-left cursor-pointer">
                • Gestion locative mensuelle (frais de gestion: 5%)
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('services')} className="hover:text-gray-100 text-left cursor-pointer">
                • Location saisonnière meublée
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('services')} className="hover:text-gray-100 text-left cursor-pointer">
                • Coordination de chantiers BTP
              </button>
            </li>
            <li>
              <button onClick={() => handleLinkClick('services')} className="hover:text-gray-100 text-left cursor-pointer">
                • Supervision &amp; Rapport de chantier Diaspora
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info list */}
        <div className="flex flex-col space-y-4" id="footer-col-contact">
          <h3 className="text-sm font-bold uppercase tracking-wider text-immo-primary-pale">ImmoDakar - Bureau Yoff</h3>
          <ul className="space-y-3.5 text-sm text-gray-300">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-immo-primary-light mt-1 flex-shrink-0" />
              <span>Rond Point Yoff, Dakar</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-immo-primary-light flex-shrink-0" />
              <div className="flex flex-col">
                <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="hover:text-immo-primary-light transition-colors font-bold flex items-center gap-1">
                  <span>+221 78 660 65 45</span>
                  <span className="text-[10px] bg-green-600 px-1.5 py-0.2 rounded-full text-white font-mono">WhatsApp</span>
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-immo-primary-light flex-shrink-0" />
              <a href="mailto:contact@immodakar.com" className="hover:text-immo-primary-light transition-colors">contact@immodakar.com</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={16} className="text-immo-primary-light mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p>Réponse garantie en moins de 2 heures</p>
                <p>Lundi au samedi, 8h30 — 18h00</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Footer Bottom copyright elements */}
      <div className="bg-slate-950/80 py-6 border-t border-slate-900" id="footer-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© 2026 ImmoDakar — GIE Keur Sokhna Maimouna Mbacké. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#terms" className="hover:text-gray-200">Conditions</a>
            <span className="text-slate-800">|</span>
            <a href="#privacy" className="hover:text-gray-200 flex items-center gap-1">
              <ShieldCheck size={12} className="text-immo-primary-light" /> Charte de Confidentialité
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
};
