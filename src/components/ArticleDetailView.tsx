/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { db } from '../lib/supabase/client';
import { Article } from '../types';
import { ChevronLeft, Calendar, Share2, Clipboard, HeartCrack, Bookmark, CornerDownRight } from 'lucide-react';

export const ArticleDetailView: React.FC = () => {
  const { navigateTo, routeParams } = useApp();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const slug = routeParams?.slug;

  useEffect(() => {
    const fetchArticleDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await db.getArticleBySlug(slug);
        setArticle(item);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetail();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-immo-primary mx-auto mb-4" />
        <p className="text-gray-400">Ouverture de la note éditoriale...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-serif text-immo-primary font-bold mb-2">Article Introuvable</h2>
        <p className="text-gray-400 text-sm mb-6">Le billet de blog demandé est indisponible ou n'existe pas.</p>
        <button 
          onClick={() => navigateTo('blog')}
          className="px-5 py-2 bg-immo-primary text-white font-bold rounded-lg cursor-pointer"
        >
          Retourner au Blog
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6" id="article-detail-view">
      
      {/* Back and copy link ribbon */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <button 
          onClick={() => navigateTo('blog')}
          className="text-xs font-bold text-gray-400 hover:text-immo-primary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft size={16} /> Retour au Blog
        </button>

        <button 
          onClick={handleCopyLink}
          className="text-xs font-bold text-gray-400 hover:text-immo-primary flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Share2 size={13} />
          <span>{copied ? 'Lien copié !' : 'Partager l\'article'}</span>
        </button>
      </div>

      {/* Main Core Meta details */}
      <header className="mb-8 font-sans">
        <span className="px-3 py-1 bg-[#f4f8f5] text-immo-primary text-[10px] font-bold uppercase tracking-widest rounded mb-4 inline-block font-mono">
          {article.categorie}
        </span>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-immo-text-dark leading-tight mb-4 font-serif">
          {article.titre}
        </h1>

        <div className="flex items-center gap-4 text-xs text-gray-400 font-sans border-t border-b border-gray-50 py-3 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-immo-primary text-white flex items-center justify-center font-bold text-xs">
              BD
            </div>
            <div>
              <span className="font-bold text-gray-700 block text-[11px]">Babacar Diop</span>
              <span className="text-[10px] text-gray-400">Analyste Foncier Principal</span>
            </div>
          </div>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(article.cree_le).toLocaleDateString('fr-FR')}</span>
          <span className="text-gray-300">|</span>
          <span>Temps de lecture: {article.temps_lecture || '5 min'}</span>
        </div>
      </header>

      {/* Top Banner Cover Image */}
      <div className="bg-slate-100 rounded-3xl overflow-hidden h-64 sm:h-96 border border-gray-100 shadow-xs mb-10">
        <img 
          src={article.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'} 
          alt={article.titre}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Article Content Paragraphs with clean typography spacing */}
      <article className="prose prose-slate max-w-none text-gray-650 leading-relaxed font-sans text-sm space-y-6" id="article-prose">
        
        {/* Intro pull-quote styled box */}
        {article.resume && (
          <div className="bg-[#f4f8f5]/60 border-l-4 border-immo-primary p-5 rounded-r-xl italic font-serif text-base text-immo-text-dark my-6 leading-relaxed">
            "{article.resume}"
          </div>
        )}

        <div className="whitespace-pre-line leading-relaxed font-sans text-gray-600 block">
          {article.contenu}
        </div>

        {/* Section divider with custom architectural block */}
        <div className="mt-12 pt-8 border-t border-gray-100 text-center" id="conclusions">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">À propos de l'auteur d'ImmoDakar BTP</p>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-normal">
            Nos articles sont relus par un comité d'ingénieurs civils et d'agents d'administration du cadastre national sénégalais pour garantir l'exactitude des procédures foncières présentées.
          </p>
        </div>

      </article>

    </div>
  );
};
