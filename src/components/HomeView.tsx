/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { db } from '../lib/supabase/client';
import { Annonce } from '../types';
import { Search, MapPin, Home, ArrowRight, Star, Quote, ShieldCheck, Building2, Eye, Heart, Phone } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [featuredAnnonces, setFeaturedAnnonces] = useState<Annonce[]>([]);
  const [transaction, setTransaction] = useState<'vente' | 'location'>('vente');
  const [typeBien, setTypeBien] = useState<string>('tous');
  const [quartier, setQuartier] = useState<string>('tous');
  const [loading, setLoading] = useState<boolean>(true);

  // States for search values
  const uniqueQuartiers = ['Almadies', 'Fann Résidence', 'Mermoz', 'Ngor', 'Plateau', 'Diamniadio'];

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const all = await db.getAnnonces();
        // Take up to 6 published elements as featured
        setFeaturedAnnonces(all.filter(a => a.statut === 'publié').slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('annonces', {
      transaction,
      typeBien,
      quartier
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="animate-fade-in" id="home-view-container">
      
      {/* 1. HERO SECTION (1.2fr / 0.8fr Split Grid) */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100" id="hero-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column Content */}
          <div className="lg:col-span-7 px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col justify-center z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-immo-primary-faint border border-immo-border text-immo-primary mb-5 uppercase tracking-widest max-w-max font-sans">
              <Home size={12} />
              <span>VOTRE BIEN, ENTRE DE BONNES MAINS</span>
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-immo-text-dark mb-6 leading-tight">
              Votre bien, <br className="hidden sm:inline" />
              <span className="text-immo-primary-light font-sans italic font-normal">entre de bonnes mains.</span>
            </h1>
            
            <p className="text-immo-text-body text-base sm:text-lg mb-6 max-w-xl leading-relaxed font-sans">
              Propriétaires, locataires, diaspora — nous gérons votre bien à Dakar avec rigueur et transparence. Contrats signés. Locataires vérifiés. Loyer reversé sous 48h.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button 
                onClick={() => navigateTo('contact')}
                className="px-6 py-3 bg-immo-primary hover:bg-[#1a3f25] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              >
                Confier mon bien
              </button>
              <button 
                onClick={() => navigateTo('annonces')}
                className="px-6 py-3 bg-white hover:bg-gray-50 border border-immo-border text-immo-primary font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              >
                Chercher un logement
              </button>
            </div>
            
            {/* Geometric Balanced Search Bar */}
            <form onSubmit={handleSearchSubmit} className="bg-white p-2.5 rounded-2xl border border-immo-border shadow-xl max-w-2xl flex flex-col sm:flex-row gap-2 mb-8" id="hero-search-engine">
              
              {/* Filter 1: Transaction */}
              <div className="flex-1 px-4 py-2 border-r border-immo-border last:border-0 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-immo-text-muted uppercase tracking-widest mb-1">Transaction</span>
                <select 
                  value={transaction}
                  onChange={(e) => setTransaction(e.target.value as 'vente' | 'location')}
                  className="font-bold text-xs font-sans text-immo-primary focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="vente">Achat / Vente</option>
                  <option value="location font-sans">Location</option>
                </select>
              </div>

              {/* Filter 2: Type */}
              <div className="flex-1 px-4 py-2 border-r border-immo-border last:border-0 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-immo-text-muted uppercase tracking-widest mb-1">Type de Bien</span>
                <select 
                  value={typeBien}
                  onChange={(e) => setTypeBien(e.target.value)}
                  className="font-bold text-xs font-sans text-immo-primary focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="tous font-sans">Tous les types</option>
                  <option value="villa font-sans">Villa de Luxe</option>
                  <option value="appartement font-sans">Appartement</option>
                  <option value="terrain font-sans">Terrain</option>
                  <option value="bureau font-sans">Bureau</option>
                </select>
              </div>

              {/* Filter 3: Quartiers */}
              <div className="flex-1 px-4 py-2 flex flex-col justify-center sm:mr-2">
                <span className="text-[10px] font-bold text-immo-text-muted uppercase tracking-widest mb-1">Quartier</span>
                <select 
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  className="font-bold text-xs font-sans text-immo-primary focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="tous font-sans">Tous les quartiers</option>
                  {uniqueQuartiers.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* CTA Rechercher */}
              <button 
                type="submit" 
                className="bg-immo-primary hover:bg-immo-primary-light transition-colors text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs group"
              >
                <Search size={16} />
                <span>Rechercher</span>
              </button>
            </form>

            {/* Search form bottom spacer */}
            <div className="mb-4" />

          </div>

          {/* Right Column Content - Beautiful geometric mask representation */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-0 bg-slate-100" id="hero-visual-side">
            <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-transparent lg:from-white lg:via-white/20 lg:to-transparent z-10 pointer-events-none" />
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200')" }}
            />
            {/* Embedded elegant stamp */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm py-3 px-5 border border-white/20 rounded-xl z-20 shadow-lg text-center hidden sm:block">
              <span className="text-[10px] font-bold text-immo-primary uppercase tracking-widest block font-mono">Conseiller Direct WA</span>
              <span className="text-sm font-bold font-serif text-immo-text-dark block font-serif">Moustapha Diop</span>
              <span className="text-[10px] text-immo-primary font-mono font-bold">+221 78 660 65 45</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS BAR (Premium Solid Horizontal Strip) */}
      <section className="bg-immo-primary text-white py-10 sm:py-12 shadow-md relative animate-fade-in" id="stats-ribbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            <div className="flex flex-col justify-center p-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-sans text-immo-primary-pale block font-sans">Moins de 2h</span>
              <span className="text-[10px] sm:text-xs text-gray-200 uppercase tracking-widest mt-1 block font-mono">Temps de Réponse</span>
            </div>
            
            <div className="flex flex-col justify-center p-2 pt-4 lg:pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-sans text-immo-primary-pale block font-sans">Officielle</span>
              <span className="text-[10px] sm:text-xs text-gray-200 uppercase tracking-widest mt-1 block font-mono">Structure déclarée &amp; enregistrée</span>
            </div>
            
            <div className="flex flex-col justify-center p-2 pt-4 lg:pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-sans text-immo-primary-pale block font-serif">100% écrits</span>
              <span className="text-[10px] sm:text-xs text-gray-200 uppercase tracking-widest mt-1 block font-mono">Mandats &amp; contrats signés</span>
            </div>
            
            <div className="flex flex-col justify-center p-2 pt-4 lg:pt-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-sans text-immo-primary-pale block font-sans">6j/7</span>
              <span className="text-[10px] sm:text-xs text-gray-200 uppercase tracking-widest mt-1 block font-mono">Présence hebdomadaire de notre équipe</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES GRID (6 elements) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24" id="featured-properties-section">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-6 border-b border-immo-border">
          <div>
            <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2">Exclusivités de l'agence</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark">Annonces en Vedette</h2>
          </div>
          <button 
            onClick={() => navigateTo('annonces')}
            className="text-sm font-bold text-immo-primary hover:text-immo-primary-light transition-colors border-b-2 border-immo-primary hover:border-immo-primary-light pb-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-immo-primary mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Chargement du catalogue immobilier...</p>
          </div>
        ) : featuredAnnonces.length === 0 ? (
          <div className="bg-slate-50 border border-gray-100 rounded-xl p-10 text-center">
            <p className="text-gray-500 font-medium">Aucun bien publié actuellement.</p>
            <button onClick={() => navigateTo('annonces')} className="text-immo-secondary mt-2 underline">Visiter le catalogue</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredAnnonces.map((annonce) => (
              <div 
                key={annonce.id} 
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group cursor-pointer"
                onClick={() => navigateTo('annonce-detail', { slug: annonce.slug })}
              >
                {/* Property Visual Head */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={annonce.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'} 
                    alt={annonce.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                    <span className={`px-3 py-1 text-[10px] font-bold text-white rounded-[4px] uppercase tracking-wider shadow-xs ${
                      annonce.transaction === 'vente' ? 'bg-immo-primary-light' : 'bg-immo-primary'
                    }`}>
                      À {annonce.transaction === 'vente' ? 'Vendre' : 'Louer'}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-bold text-immo-primary bg-white/95 rounded-[4px] uppercase tracking-wider shadow-xs">
                      {annonce.type_bien}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 text-xs font-bold text-immo-primary py-1 px-3 rounded-[4px]">
                    {annonce.quartier}
                  </div>
                </div>

                {/* Property Meta Body */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold font-mono text-immo-primary-light block mb-1">REFERENCE #00{annonce.id.replace(/\D/g, '') || '91'}</span>
                    <h3 className="font-serif text-lg font-bold text-immo-text-dark mb-1 leading-tight line-clamp-1 group-hover:text-immo-primary transition-colors">
                      {annonce.titre}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 font-sans mb-4 leading-relaxed">
                      {annonce.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xl font-bold font-sans text-immo-primary mb-3">
                      {formatPrice(annonce.prix)}
                      {annonce.transaction === 'location' && <span className="text-xs text-gray-400 font-normal"> / mois</span>}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <div className="flex gap-1 items-center">
                        <Home size={13} className="text-immo-primary" />
                        <span>{annonce.surface} m²</span>
                      </div>
                      {annonce.chambres > 0 && (
                        <span>• {annonce.chambres} Chambres</span>
                      )}
                      {annonce.salles_de_bain > 0 && (
                        <span>• {annonce.salles_de_bain} Sdb</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="px-5 py-3.5 bg-gray-50 hover:bg-slate-100/55 transition-colors border-t border-gray-100 flex justify-between items-center text-xs font-bold text-immo-primary">
                  <span>Consulter la fiche</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200 text-immo-primary-light" />
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. POURQUOI IMMODAKAR */}
      <section className="bg-[#f4f8f5]/60 py-16 sm:py-24 border-t border-b border-immo-border" id="why-immodakar-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2 font-mono">Une agence engagée</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark">Une agence qui assume sa différence.</h2>
            <div className="w-16 h-1 bg-immo-primary mx-auto mt-4" />
            <p className="text-sm text-gray-500 mt-4 font-sans max-w-xl mx-auto leading-relaxed">
              Nous ne vous promettons pas des décennies d'expérience. Nous vous promettons mieux : une agence réactive, sérieuse et présente, qui traite votre bien comme le sien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-immo-border shadow-xs">
              <span className="text-3xl font-serif text-immo-primary font-bold block mb-4">01</span>
              <h3 className="text-lg font-bold font-serif text-immo-text-dark mb-2">Réactivité</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Chaque demande reçoit une réponse en moins de 2 heures. Pas de messagerie automatique, pas de silence radio. Vous écrivez — on répond.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-immo-border shadow-xs">
              <span className="text-3xl font-serif text-immo-primary font-bold block mb-4">02</span>
              <h3 className="text-lg font-bold font-serif text-immo-text-dark mb-2">Sérieux</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Agence officielle, contrats signés, locataires vérifiés, artisans contrôlés. Chaque étape est documentée et tracée. Rien n'est laissé au hasard.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-immo-border shadow-xs">
              <span className="text-3xl font-serif text-immo-primary font-bold block mb-4">03</span>
              <h3 className="text-lg font-bold font-serif text-immo-text-dark mb-2">Proximité</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Une équipe basée à Yoff, un interlocuteur direct qui connaît votre dossier. Pas de standard anonyme — une vraie relation de confiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NOS SERVICES (APERÇU) */}
      <section className="bg-slate-900 text-white py-16 sm:py-24" id="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-immo-primary-pale uppercase tracking-widest block mb-2 font-mono">Solutions clés en main</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white">Tout ce dont votre bien a besoin, au même endroit.</h2>
            <div className="w-16 h-1 bg-immo-primary-pale mx-auto mt-4" />
            <p className="text-sm text-gray-400 mt-4 font-sans max-w-xl mx-auto leading-relaxed">
              De la mise en location à la gestion, de la recherche de logement à la construction supervisée — ImmoDakar couvre tous vos besoins immobiliers et BTP à Dakar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Mise en location", desc: "Sérénité (Xell Bu Dall)" },
              { title: "Gestion locative", desc: "Toppatóo" },
              { title: "Service diaspora", desc: "Sa Kër Ci Sa Loxo" },
              { title: "Recherche de logement", desc: "Kër Bu Wér" },
              { title: "État des lieux", desc: "Firndé" },
              { title: "Remise en état", desc: "Defar Bu Wér" },
              { title: "Courtage vente", desc: "Jaay Bu Wér" },
              { title: "Courtage achat", desc: "Jënd Bu Wér" }
            ].map((srv, idx) => (
              <div 
                key={idx} 
                onClick={() => navigateTo('services')}
                className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 flex flex-col justify-between h-full hover:border-immo-primary-pale transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-2xl font-serif text-immo-primary-pale block mb-3 font-semibold">0{idx + 1}</span>
                  <h3 className="text-base font-bold font-serif text-white mb-2 group-hover:text-immo-primary-pale transition-colors">{srv.title}</h3>
                  <p className="text-[11px] text-gray-400 font-sans tracking-wide">
                    Offre : <span className="font-semibold text-white">{srv.desc}</span>
                  </p>
                </div>
                <span className="text-[11px] font-bold text-immo-primary-pale hover:text-white mt-4 flex items-center gap-1">
                  En savoir plus <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOCUS DIASPORA */}
      <section className="bg-white py-16 sm:py-24 border-b border-immo-border" id="diaspora-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block font-mono">Bailleurs à distance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark leading-tight">
              Votre maison dans votre main, <br />
              <span className="text-immo-primary-light font-sans italic font-normal">où que vous soyez.</span>
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-sans">
              Vous êtes à Paris, Madrid ou New York ? Votre bien à Dakar ne peut pas attendre votre retour. Nous le surveillons, le gérons et vous prouvons chaque mois qu'il est en ordre — sans que vous ayez à demander.
            </p>
            <button 
              onClick={() => navigateTo('services')}
              className="px-6 py-3 bg-immo-primary hover:bg-[#1a3f25] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Découvrir le service diaspora
            </button>
          </div>

          <div className="lg:col-span-5 relative h-80 rounded-3xl overflow-hidden border border-immo-border shadow-md bg-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800" 
              alt="ImmoDakar Diaspora"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6 text-white font-sans">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block font-mono">Preuve visuelle mensuelle</span>
                <span className="font-serif font-bold text-sm">Votre bien sous contrôle, où que vous soyez</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMMENT ÇA MARCHE */}
      <section className="bg-[#f4f8f5]/30 py-16 sm:py-24 border-b border-immo-border" id="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2 font-mono">Processus simple</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark">Simple, clair, sans surprise.</h2>
            <div className="w-16 h-1 bg-immo-primary mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "Étape 1", title: "Vous nous contactez", desc: "Par WhatsApp, téléphone ou email. On vous répond en moins de 2 heures." },
              { step: "Étape 2", title: "On évalue votre besoin", desc: "Visite, estimation, conseil. On vous explique exactement ce qu'on peut faire et combien ça coûte." },
              { step: "Étape 3", title: "On signe", desc: "Un mandat clair qui définit nos engagements et les vôtres. Tout est écrit, rien n'est caché." },
              { step: "Étape 4", title: "On agit", desc: "On exécute. On vous tient informé. Vous ne découvrez jamais rien — vous validez tout." }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white p-6 rounded-2xl border border-immo-border shadow-xs">
                <span className="inline-block px-2.5 py-1 rounded bg-[#f4f8f5] text-immo-primary text-[10px] font-bold uppercase tracking-wider mb-4 font-mono">{item.step}</span>
                <h3 className="text-base font-bold font-serif text-immo-text-dark mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SECTION CONTACT (BAS DE PAGE ACCUEIL) */}
      <section className="bg-white py-16 sm:py-24" id="home-contact-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block font-mono">Contact direct</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark">Parlons de votre projet.</h2>
          <p className="text-sm text-gray-500 leading-relaxed font-sans max-w-xl mx-auto">
            Une question ? Un bien à confier ? Un logement à trouver ? Écrivez-nous maintenant — réponse garantie en moins de 2 heures.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 max-w-2xl mx-auto text-left font-sans text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
              <span className="font-bold text-immo-primary block mb-1">WhatsApp</span>
              <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-immo-primary font-bold">+221 78 660 65 45</a>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
              <span className="font-bold text-immo-primary block mb-1">Email</span>
              <a href="mailto:contact@immodakar.com" className="text-gray-600 hover:text-immo-primary font-bold">contact@immodakar.com</a>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-100 text-center">
              <span className="font-bold text-immo-primary block mb-1">Adresse</span>
              <span className="text-gray-600 font-bold block">Rond Point Yoff, Dakar</span>
            </div>
          </div>

          <div className="pt-6">
            <a 
              href="https://wa.me/221786606545" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25d366] hover:bg-[#20ba5a] text-white font-sans font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Phone size={16} />
              <span>Écrire sur WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
