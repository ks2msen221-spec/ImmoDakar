/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from './AppContext';
import { db } from '../lib/supabase/client';
import { Annonce, DemandeContact } from '../types';
import { ChevronLeft, ChevronRight, MapPin, Share2, Phone, Mail, Calendar, MessageSquare, Check, Sparkles, AlertCircle } from 'lucide-react';

export const AnnonceDetailView: React.FC = () => {
  const { navigateTo, currentUser, routeParams, triggerDbUpdate } = useApp();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [similarAnnonces, setSimilarAnnonces] = useState<Annonce[]>([]);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formErr, setFormErr] = useState<string>('');

  // Share action state helpers
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const slug = routeParams?.slug;

  useEffect(() => {
    const fetchSelected = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await db.getAnnonceBySlug(slug);
        setAnnonce(item);
        
        if (item) {
          // Prepopulate user info if logged in
          if (currentUser) {
            setName(currentUser.full_name || '');
            setTel(currentUser.phone || '');
            setEmail('client@immodakar.com');
          }
          setMsg(`Bonjour, je souhaiterais visiter le bien "${item.titre}" (${item.quartier}). Merci de planifier un rendez-vous.`);

          // Load similar items of same type
          const all = await db.getAnnonces();
          const filtered = all.filter(a => a.id !== item.id && a.type_bien === item.type_bien && a.statut === 'publié');
          setSimilarAnnonces(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSelected();
    setActiveImageIdx(0);
    setFormSuccess(false);
  }, [slug, currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErr('');
    if (!name || !email || !tel || !msg) {
      setFormErr('Veuillez remplir tous les champs requis.');
      return;
    }

    try {
      if (annonce) {
        await db.createDemande({
          nom: name,
          email: email,
          telephone: tel,
          message: msg,
          annonce_id: annonce.id,
          user_id: currentUser ? currentUser.id : null
        });
        setFormSuccess(true);
        triggerDbUpdate();
      }
    } catch (err) {
      setFormErr('Une erreur est survenue lors de l’envoi de votre demande.');
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!annonce) return;
    const text = `Découvrez cette superbe annonce sur ImmoDakar : ${annonce.titre} à ${annonce.quartier}. Prix: ${new Intl.NumberFormat('fr-FR').format(annonce.prix)} FCFA. Lien: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-immo-primary mx-auto mb-4" />
        <p className="text-gray-400">Chargement des données exclusives...</p>
      </div>
    );
  }

  if (!annonce) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center" id="annonce-not-found">
        <h2 className="text-2xl font-serif text-immo-primary font-bold mb-2">Annonce Introuvable</h2>
        <p className="text-gray-500 mb-6">Le bien que vous recherchez n'est pas ou plus disponible au sein de notre catalogue.</p>
        <button 
          onClick={() => navigateTo('annonces')}
          className="px-5 py-2.5 bg-immo-primary text-white font-bold rounded-lg cursor-pointer"
        >
          Retourner au catalogue
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="fiche-detaille">
      
      {/* Back to catalog & Share controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <button 
          onClick={() => navigateTo('annonces')}
          className="text-xs font-bold text-gray-400 hover:text-immo-primary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft size={16} /> Retour au catalogue des biens
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-immo-primary font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 size={13} />
            <span>{copiedLink ? 'Lien copié !' : 'Copier le lien'}</span>
          </button>
          <button 
            onClick={handleShareWhatsApp}
            className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01s11.95 5.336 11.95 11.938c0 3.203-1.251 6.213-3.522 8.482l-.01.01c-2.27 2.269-5.282 3.518-8.484 3.518h-.01c-2.02-.001-4.012-.533-5.787-1.539L0 24zm4.97-4.435l.322.191C6.962 20.73 8.76 21.23 10.6 21.23h.01c5.441 0 9.893-4.417 9.897-9.86 0-2.636-1.03-5.115-2.9-6.985-1.87-1.868-4.363-2.897-7.009-2.897-5.462 0-9.914 4.417-9.919 9.861-.001 1.95.513 3.856 1.492 5.56l.208.36L.99 21.117l1.714-1.688c.175.172.4.298.66.368z" />
            </svg>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery & characteristics left, Form right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Photo carousel and specs */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Visual */}
          <div className="bg-slate-100 rounded-2xl overflow-hidden border border-gray-100 relative h-[360px] sm:h-[480px]">
            <img 
              src={annonce.images[activeImageIdx] || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200'} 
              alt={annonce.titre}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Overlay indicators */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f4f8f5] bg-immo-primary px-2.5 py-1 rounded-[3px]">
                  À {annonce.transaction === 'vente' ? 'vendre' : 'louer'}
                </span>
                <p className="text-xs text-gray-200 mt-2 font-mono">Image {activeImageIdx + 1} de {annonce.images.length}</p>
              </div>
            </div>

            {/* Left Right selectors */}
            {annonce.images.length > 1 && (
              <div className="absolute inset-y-0 inset-x-4 flex justify-between items-center pointer-events-none">
                <button 
                  onClick={() => setActiveImageIdx(prev => (prev === 0 ? annonce.images.length - 1 : prev - 1))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white text-immo-primary transition-colors pointer-events-auto"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={() => setActiveImageIdx(prev => (prev === annonce.images.length - 1 ? 0 : prev + 1))}
                  className="p-2 rounded-full bg-white/80 hover:bg-white text-immo-primary transition-colors pointer-events-auto"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Inline Gallery Thumbnails */}
          {annonce.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2">
              {annonce.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIdx === i ? 'border-immo-primary scale-102 shadow-sm' : 'border-transparent opacity-65'
                  }`}
                >
                  <img src={img} alt="Miniature" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Title & Core Summary */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 bg-[#f4f8f5] text-immo-primary text-[10px] font-bold uppercase tracking-widest rounded font-mono">
                {annonce.type_bien}
              </span>
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <MapPin size={13} className="text-immo-primary" /> {annonce.quartier}, {annonce.ville}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-immo-text-dark leading-snug">
              {annonce.titre}
            </h1>
            
            <p className="text-3xl font-extrabold text-immo-primary font-sans mt-3">
              {formatPrice(annonce.prix)}
              {annonce.transaction === 'location' && <span className="text-sm text-gray-500 font-normal"> / mois</span>}
            </p>
          </div>

          {/* Description Block */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-immo-primary mb-4 pb-2 border-b border-gray-100">Description du bien</h2>
            <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-line font-sans">
              {annonce.description || 'Aucune description disponible pour cette propriété.'}
            </p>
          </div>

          {/* Specifications Matrix Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-immo-primary mb-5 pb-2 border-b border-gray-100">Fiche technique &amp; Caractéristiques</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Superficie</span>
                <span className="text-base font-bold text-immo-dark font-sans">{annonce.surface} m²</span>
              </div>

              {annonce.chambres > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-gray-100">
                  <span className="text-xs text-gray-400 block mb-1">Chambres</span>
                  <span className="text-base font-bold text-immo-dark font-sans">{annonce.chambres}</span>
                </div>
              )}

              {annonce.salles_de_bain > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-gray-100">
                  <span className="text-xs text-gray-400 block mb-1">Salles de bain</span>
                  <span className="text-base font-bold text-immo-dark font-sans">{annonce.salles_de_bain}</span>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl text-center border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Garage / Parking</span>
                <span className="text-base font-bold text-immo-dark font-sans">{annonce.parking ? 'Oui' : 'Non'}</span>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-50 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-immo-success" />
                <span>Titre foncier individuel vérifié (Cadastre de Dakar ok)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-immo-success" />
                <span>Libre de toute hypothèque / Servitude</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-immo-success" />
                <span>Raccordements Eau, Électricité &amp; Internet Senelec/SNDE</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-immo-success" />
                <span>Certificat de conformité technique d'ingénierie</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Lead Contact box / Demand form */}
        <div className="lg:col-span-4" id="lead-form-panel">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xl sticky top-28">
            
            <h2 className="text-base font-extrabold font-serif text-immo-primary mb-2">Demander une Visite</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Planifiez une rencontre sur site avec l'un de nos conseillers professionnels dans le secteur de Dakar.
            </p>

            {formSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-xl border border-emerald-100 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-immo-success flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h3 className="font-bold text-sm mb-1">Demande enregistrée !</h3>
                <p className="text-xs leading-relaxed text-emerald-700">
                  Votre message a bien été envoyé. Un conseiller technique de l'agence ImmoDakar vous recontactera sous 24 heures ouvrées.
                </p>
                <button 
                  onClick={() => setFormSuccess(false)}
                  className="mt-4 text-xs font-bold underline text-immo-primary cursor-pointer"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                {formErr && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{formErr}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Votre nom complet *</label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Abdoulaye Sarr"
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary text-gray-800 font-sans font-bold"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Adresse e-mail *</label>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: abdou@gmail.com"
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary text-gray-800 font-sans font-bold"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Numéro de téléphone *</label>
                  <input 
                    type="tel"
                    required
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="Ex: +221 77 123 45 67"
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary text-gray-800 font-sans font-bold"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Message personnalisé *</label>
                  <textarea 
                    required
                    rows={4}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Détaillez vos dates libres..."
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary text-gray-800 font-sans resize-none font-bold"
                  />
                </div>

                {/* Sub text warning */}
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                  * En envoyant ce formulaire, vous acceptez d'être contacté par un agent foncier certifié et d'alimenter votre historique client.
                </p>

                {/* Submit button */}
                <button 
                  type="submit"
                  className="w-full py-3 bg-immo-primary hover:bg-[#1c3f26] transition-colors text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
                >
                  <Calendar size={14} />
                  <span>Confirmer la Demande</span>
                </button>
              </form>
            )}

            {/* Quick contact information */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center text-xs space-y-1.5 font-sans" id="agent-direct">
              <p className="font-semibold text-immo-text-dark">Bureau Principal ImmoDakar</p>
              <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-immo-primary flex items-center justify-center gap-1.5 font-bold"><Phone size={12} className="text-immo-primary" /> WhatsApp : +221 78 660 65 45</a>
              <a href="mailto:contact@immodakar.com" className="text-gray-500 hover:text-immo-primary flex items-center justify-center gap-1.5 font-bold"><Mail size={12} className="text-immo-primary" /> contact@immodakar.com</a>
            </div>

          </div>
        </div>

      </div>

      {/* Similar Annonces list */}
      {similarAnnonces.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-100" id="similar-list font-sans">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-1 font-mono">Affinités</span>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-immo-text-dark font-serif">Biens immobiliers similaires</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {similarAnnonces.map((similar) => (
              <div 
                key={similar.id} 
                onClick={() => navigateTo('annonce-detail', { slug: similar.slug })}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col h-full group"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={similar.images[0]} alt={similar.titre} className="w-full h-full object-cover group-hover:scale-102 transition-transform" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-immo-primary text-white text-[9px] font-bold py-0.5 px-2 rounded font-mono">
                    À {similar.transaction === 'vente' ? 'Vendre' : 'Louer'}
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-immo-text-dark line-clamp-1 group-hover:text-immo-primary transition-colors mb-1 font-serif">{similar.titre}</h4>
                    <p className="text-[11px] text-gray-400 font-sans block">{similar.quartier}</p>
                  </div>
                  <p className="text-sm font-extrabold text-immo-primary font-sans mt-3">
                    {formatPrice(similar.prix)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
