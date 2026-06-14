/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { db } from '../lib/supabase/client';
import { Annonce, TypeBien, TypeTransaction } from '../types';
import { Search, MapPin, Space, Home, Ruler, BedDouble, Bath, Heart, Eye, Sliders, ChevronDown, CheckCheck } from 'lucide-react';

export const AnnoncesView: React.FC = () => {
  const { navigateTo, currentUser, routeParams, triggerDbUpdate } = useApp();
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Advanced Filter state variables
  const [transaction, setTransaction] = useState<TypeTransaction | 'tous'>(routeParams?.transaction || 'tous');
  const [typeBien, setTypeBien] = useState<string>(routeParams?.typeBien || 'tous');
  const [quartier, setQuartier] = useState<string>(routeParams?.quartier || 'tous');
  const [budgetMax, setBudgetMax] = useState<string>('');
  const [surfaceMin, setSurfaceMin] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [favoritedMap, setFavoritedMap] = useState<Record<string, boolean>>({});

  // Unique values for dropdowns
  const uniqueQuartiers = ['Almadies', 'Fann Résidence', 'Mermoz', 'Ngor', 'Plateau', 'Diamniadio'];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const all = await db.getAnnonces();
        const publishedOnly = all.filter(a => a.statut === 'publié');
        setAnnonces(publishedOnly);
        
        // Sync favorite states if user is logged in
        if (currentUser) {
          const favList = await db.getFavoris(currentUser.id);
          const favMap: Record<string, boolean> = {};
          favList.forEach((f: any) => {
            favMap[f.annonce_id] = true;
          });
          setFavoritedMap(favMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUser, routeParams]);

  // Apply filters in effect
  useEffect(() => {
    let result = [...annonces];

    if (transaction !== 'tous') {
      result = result.filter(a => a.transaction === transaction);
    }
    if (typeBien !== 'tous') {
      result = result.filter(a => a.type_bien === typeBien);
    }
    if (quartier !== 'tous') {
      result = result.filter(a => a.quartier?.toLowerCase() === quartier.toLowerCase());
    }
    if (budgetMax.trim() !== '') {
      result = result.filter(a => a.prix <= Number(budgetMax));
    }
    if (surfaceMin.trim() !== '') {
      result = result.filter(a => a.surface >= Number(surfaceMin));
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.titre.toLowerCase().includes(q) || 
        a.description?.toLowerCase().includes(q) ||
        a.quartier?.toLowerCase().includes(q)
      );
    }

    setFilteredAnnonces(result);
  }, [annonces, transaction, typeBien, quartier, budgetMax, surfaceMin, searchQuery]);

  const toggleFavorite = async (e: React.MouseEvent, annonceId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    try {
      const active = await db.toggleFavori(currentUser.id, annonceId);
      setFavoritedMap(prev => ({
        ...prev,
        [annonceId]: active
      }));
      triggerDbUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setTransaction('tous');
    setTypeBien('tous');
    setQuartier('tous');
    setBudgetMax('');
    setSurfaceMin('');
    setSearchQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="catalogue-annonces">
      
      {/* Title block */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2 font-mono">Notre sélection certifiée</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark font-serif">Biens Immobiliers Disponibles</h1>
        <p className="text-sm text-gray-500 mt-2 font-sans max-w-xl">
          Découvrez des propriétés vérifiées avec titres fonciers enregistrés, situées dans les plus beaux lotissements de la presqu'île de Dakar.
        </p>
      </div>

      {/* Advanced Filter Control Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl mb-12" id="advanced-filter-panel">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 text-immo-primary font-bold text-sm">
          <Sliders size={16} className="text-immo-primary" />
          <span>Filtres de recherche avancée</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans">
          
          {/* 1. Search Query */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Mot-clé</label>
            <input 
              type="text" 
              placeholder="Ex: Piscine, Moderne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-semibold text-gray-800"
            />
          </div>

          {/* 2. Transaction */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Transaction</label>
            <select 
              value={transaction}
              onChange={(e) => setTransaction(e.target.value as TypeTransaction | 'tous')}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-bold text-gray-800 cursor-pointer"
            >
              <option value="tous">Tous types</option>
              <option value="vente">À Vendre</option>
              <option value="location">À Louer</option>
            </select>
          </div>

          {/* 3. Type de Bien */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Type de bien</label>
            <select 
              value={typeBien}
              onChange={(e) => setTypeBien(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-bold text-gray-800 cursor-pointer"
            >
              <option value="tous">Tous types</option>
              <option value="appartement">Appartement</option>
              <option value="villa">Villa de Luxe</option>
              <option value="terrain">Terrain</option>
              <option value="bureau">Bureau</option>
              <option value="local_commercial">Local Commercial</option>
              <option value="maison">Maison individuelle</option>
            </select>
          </div>

          {/* 4. Quartier */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Quartier</label>
            <select 
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-bold text-gray-800 cursor-pointer"
            >
              <option value="tous">Tous quartiers</option>
              {uniqueQuartiers.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>

          {/* 5. Budget Max */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Budget Max (FCFA)</label>
            <input 
              type="number" 
              placeholder="Ex: 5000000"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-semibold text-gray-800"
            />
          </div>

          {/* 6. Surface Min */}
          <div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-1 font-sans">Surface Min (m²)</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Ex: 100"
                value={surfaceMin}
                onChange={(e) => setSurfaceMin(e.target.value)}
                className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary font-sans font-semibold text-gray-800 flex-grow"
              />
              <button 
                onClick={handleResetFilters}
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 font-bold transition-all text-xs cursor-pointer"
                title="Réinitialiser"
              >
                Reset
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Catalog View Grid */}
      {loading ? (
        <div className="text-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-immo-primary mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Synchronisation des annonces avec ImmoDakar DB...</p>
        </div>
      ) : filteredAnnonces.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 text-gray-400 flex items-center justify-center mx-auto mb-4 border border-gray-100">
            <Sliders size={28} />
          </div>
          <p className="text-base font-bold text-immo-primary mb-1">Aucun bien ne correspond à ces critères</p>
          <p className="text-xs text-gray-400 mb-6 font-sans max-w-sm mx-auto">
            Essayez d'ajuster vos budgets limites, d'enlever les filtres de quartiers ou de modifier votre texte de recherche.
          </p>
          <button 
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-immo-primary hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Afficher tous les biens
          </button>
        </div>
      ) : (
        <div>
          {/* Sub results found info */}
          <div className="flex justify-between items-center mb-6 text-xs text-gray-400 font-sans" id="search-statistics-bar">
            <span>
              <strong>{filteredAnnonces.length}</strong> {filteredAnnonces.length > 1 ? 'biens trouvés' : 'bien trouvé'}
            </span>
            <span className="flex items-center gap-1">
              <CheckCheck size={12} className="text-immo-secondary" /> Données synchronisées
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAnnonces.map((annonce) => {
              const isFav = favoritedMap[annonce.id] || false;
              return (
                <div 
                  key={annonce.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group cursor-pointer relative"
                  onClick={() => navigateTo('annonce-detail', { slug: annonce.slug })}
                >
                  {/* Photo Main wrapper */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-50">
                    <img 
                      src={annonce.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400'} 
                      alt={annonce.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Double Badges */}
                    <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                      <span className={`px-3 py-1 text-[10px] font-bold text-white rounded-[4px] uppercase tracking-wider ${
                        annonce.transaction === 'vente' ? 'bg-immo-secondary' : 'bg-immo-primary'
                      }`}>
                        À {annonce.transaction === 'vente' ? 'Vendre' : 'Louer'}
                      </span>
                      <span className="px-3 py-1 text-[10px] font-bold text-immo-primary bg-white/95 rounded-[4px] uppercase tracking-wider">
                        {annonce.type_bien}
                      </span>
                    </div>

                    {/* Neighborhood tag */}
                    <div className="absolute bottom-4 right-4 bg-white/95 text-xs font-bold text-immo-primary py-1 px-3 rounded-[4px]">
                      {annonce.quartier}
                    </div>

                    {/* Guard Favorite Button client persistence */}
                    <button 
                      onClick={(e) => toggleFavorite(e, annonce.id)}
                      className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
                        isFav 
                          ? 'bg-red-50 text-immo-error scale-110 shadow-sm' 
                          : 'bg-white/80 hover:bg-white text-gray-500'
                      }`}
                      title={isFav ? "Retirer des favoris" : "Sauvegarder l'annonce"}
                    >
                      <Heart size={16} fill={isFav ? "#E74C3C" : "transparent"} />
                    </button>
                  </div>

                  {/* Body description */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-immo-secondary block mb-1">EXCLUSION REFERENCE : #00{annonce.id.replace(/\D/g, '') || '45'}</span>
                      <h3 className="font-serif text-lg font-bold text-immo-dark mb-1 leading-tight line-clamp-1 group-hover:text-immo-secondary transition-colors">
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

                      {/* Technical specifications */}
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <div className="flex gap-1 items-center">
                          <Home size={13} className="text-immo-secondary" />
                          <span>{annonce.surface} m²</span>
                        </div>
                        {annonce.chambres > 0 && (
                          <span>{annonce.chambres} Chambres</span>
                        )}
                        {annonce.salles_de_bain > 0 && (
                          <span>{annonce.salles_de_bain} Sdb</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Deep link card footer */}
                  <div className="px-5 py-3.5 bg-gray-50 group-hover:bg-slate-100/55 transition-colors border-t border-gray-100 flex justify-between items-center text-xs font-bold text-immo-primary">
                    <span>Accéder aux caractéristiques complètes</span>
                    <Search size={14} className="group-hover:translate-x-1 transition-transform text-immo-secondary" />
                  </div>

                </div>
              );
            })}
          </div>

          {/* Simple Pagination Footer details */}
          <div className="mt-12 text-center" id="pagination-panel">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-lg">
              Page 1 sur 1
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
