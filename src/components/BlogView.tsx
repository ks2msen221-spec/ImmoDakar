/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { db } from '../lib/supabase/client';
import { Article } from '../types';
import { Search, Calendar, User, Eye, ArrowRight, Grid, Paperclip, Star } from 'lucide-react';

export const BlogView: React.FC = () => {
  const { navigateTo } = useApp();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filtered, setFiltered] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('tous');

  const categories = ['tous', 'Immobilier', 'BTP / Construction', 'Investissement', 'Législation'];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const list = await db.getArticles();
        // Only show published articles
        setArticles(list.filter(a => a.statut === 'publié'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    let result = [...articles];

    if (activeCategory !== 'tous') {
      result = result.filter(a => a.categorie.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.titre.toLowerCase().includes(q) || 
        a.resume?.toLowerCase().includes(q) ||
        a.contenu?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [articles, activeCategory, searchQuery]);

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="blog-catalog">
      
      {/* Title & subtitle info */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2 font-mono">Conseils d'experts &amp; Actualités</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark font-serif">Le Blog de l'Immobilier Sénégalais</h1>
        <div className="w-16 h-1 bg-immo-primary mx-auto mt-4" />
        <p className="text-sm text-gray-500 mt-4 leading-relaxed font-sans">
          Décryptages du marché foncier à Dakar, conseils de financement BTP et analyses juridiques rédigées par nos experts agréés à Yoff.
        </p>
      </div>

      {/* Categories & Search Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 pb-6 border-b border-gray-100 font-sans">
        
        {/* Categories list */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                activeCategory === cat 
                  ? 'bg-immo-primary text-white border-immo-primary font-bold' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-immo-primary hover:text-immo-primary'
              }`}
            >
              {cat === 'tous' ? 'Tous les articles' : cat}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2.5 pl-9 pr-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-immo-primary text-gray-800 font-sans font-bold"
          />
          <Search size={14} className="absolute left-3.5 top-3.2 text-gray-400" />
        </div>

      </div>

      {/* Main Blog List/Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-immo-primary mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Chargement des billets de blog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-500">
          <p className="font-bold text-immo-primary mb-1">Aucun article disponible</p>
          <p className="text-xs text-gray-400 font-sans mb-4">Ajustez vos filtres de catégories ou réinitialisez votre saisie.</p>
          <button onClick={() => { setSearchQuery(''); setActiveCategory('tous'); }} className="text-xs text-immo-secondary underline">Tout afficher</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blog-posts-grid">
          {filtered.map((article) => (
            <article 
              key={article.id} 
              onClick={() => navigateTo('article-detail', { slug: article.slug })}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full group cursor-pointer"
            >
              
              {/* Photo Wrapper */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={article.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400'} 
                  alt={article.titre}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category tag */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-immo-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">
                  {article.categorie}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  {/* Date and actions stats */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-2 font-mono">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(article.cree_le).toLocaleDateString('fr-FR')}</span>
                    <span>• {article.temps_lecture || '4 min'} de lecture</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-immo-text-dark mb-2 leading-tight group-hover:text-immo-primary transition-colors line-clamp-2">
                    {article.titre}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 font-sans leading-relaxed mb-4">
                    {article.resume || article.contenu.substring(0, 120) + '...'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-immo-primary">
                  {/* Author detail */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-immo-primary/10 text-immo-primary flex items-center justify-center font-mono font-bold text-[9px]">
                      ID
                    </div>
                    <span className="text-[10px] text-gray-400 font-sans font-semibold">Rédacteur ImmoDakar</span>
                  </div>

                  {/* Icon deep */}
                  <span className="flex items-center gap-1.5 text-immo-primary group-hover:text-immo-primary-light transition-colors">
                    Lire l'article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

              </div>
              
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
