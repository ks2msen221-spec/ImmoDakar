/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Mail, Phone, MapPin, CheckCircle, Clock, Send, AlertTriangle, Loader2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { currentUser } = useApp();

  // Form state
  const [nom, setNom] = useState<string>(currentUser?.full_name || '');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [motif, setMotif] = useState<string>('contact');
  const [message, setMessage] = useState<string>('');

  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Maps form motif values to leads table type_demande enum
  const motifToType = (m: string): string => {
    if (['mise_location', 'gestion_locative', 'location_saisonniere', 'diaspora'].includes(m)) return 'location';
    if (['btp_coordination', 'btp_materiaux', 'btp_supervision_diaspora'].includes(m)) return 'btp';
    return 'contact';
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nom || !phone || !message) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim() || null,
          telephone: phone.trim(),
          message: message.trim(),
          type_demande: motifToType(motif),
          bien_ref: null,
          source: 'page_contact',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      setSuccess(true);
      setMessage('');
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="contact-page">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2">Direct et réactif</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-immo-text-dark">Parlons de votre projet.</h1>
        <div className="w-16 h-1 bg-immo-primary mx-auto mt-4" />
        <p className="text-sm text-gray-500 mt-4 leading-relaxed font-sans">
          Une question, un bien à confier, un logement à trouver, un projet de construction ? Écrivez-nous — réponse garantie en moins de 2 heures, 6 jours sur 7.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left column descriptor card */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-immo-primary text-white p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl" id="office-info">
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-slate-950/20 pointer-events-none" />
            
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6">Notre Bureau à Yoff</h2>
            
            <div className="space-y-6 font-sans text-xs">
              
              <div className="flex gap-4">
                <MapPin className="text-immo-primary-pale flex-shrink-0" size={18} />
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-gray-300 text-[10px] mb-1">Notre Adresse</h3>
                  <p className="text-gray-100 text-[11px] leading-relaxed">
                    Rond Point Yoff, <br />
                    Dakar, Sénégal
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="text-immo-primary-pale flex-shrink-0" size={18} />
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-gray-300 text-[10px] mb-1">WhatsApp &amp; Téléphone</h3>
                  <p className="text-gray-100 text-[11px] font-sans font-bold">
                    WhatsApp : +221 78 660 65 45
                  </p>
                  <p className="text-gray-100 text-[11px] font-sans font-bold">
                    Tél : +221 76 396 50 75
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="text-immo-primary-pale flex-shrink-0" size={18} />
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-gray-300 text-[10px] mb-1">Adresse E-mail</h3>
                  <p className="text-gray-100 text-[11px] font-sans">
                    contact@immodakar.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock className="text-immo-primary-pale flex-shrink-0" size={18} />
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-gray-300 text-[10px] mb-1">Horaires</h3>
                  <p className="text-gray-100 text-[11px]">
                    Réponse garantie en moins de 2 heures.<br />
                    Lundi au Samedi : 08:30 - 18:00
                  </p>
                </div>
              </div>

            </div>

            {/* Quick WhatsApp button */}
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <a 
                href="https://wa.me/221786606545" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Phone size={15} />
                <span>Nous écrire sur WhatsApp en 1 clic</span>
              </a>
            </div>

          </div>

          {/* Senelec cadastral note */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 text-xs text-gray-500 leading-relaxed font-sans">
            <h3 className="font-semibold text-immo-primary mb-1">Sérieux et Proximité</h3>
            <p className="text-[11px]">
              Toutes nos transactions font l'objet de contrats écrits et officiels. Notre équipe est à Yoff — un interlocuteur direct qui connaît votre dossier. Pas de standard, pas d'anonymat.
            </p>
          </div>

        </div>

        {/* Right column form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
            
            <h2 className="text-base font-extrabold font-serif text-immo-text-dark mb-2">Décrivez votre projet en quelques mots</h2>
            <p className="text-xs text-gray-400 mb-6 font-sans">
              On vous lit, on vous répond, on vous accompagne — un interlocuteur direct, pas un standard.
            </p>

            {success ? (
              <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-100 text-center animate-fade-in" id="contact-success">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-25">
                  <CheckCircle size={30} />
                </div>
                <h3 className="font-bold font-serif text-base mb-1">Votre message a été transmis !</h3>
                <p className="text-xs text-emerald-750 font-sans leading-relaxed max-w-sm mx-auto">
                  Nous avons bien reçu votre message. Notre équipe vous répond sous 2 heures. Pour aller plus vite, écrivez-nous directement sur WhatsApp au <strong>+221 78 660 65 45</strong>.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-immo-primary hover:bg-immo-primary-light transition-colors text-white text-xs font-bold rounded-lg cursor-pointer animate-pulse"
                  >
                    Rédiger un nouveau message
                  </button>
                  <a 
                    href="https://wa.me/221786606545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#25d366] hover:bg-[#20ba5a] transition-colors text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                  >
                    <Phone size={13} />
                    <span>Ouvrir WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name field */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Votre nom complet *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Babacar Sène"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary-light text-gray-800 font-sans"
                    />
                  </div>

                  {/* Mail field */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Adresse e-mail de contact *</label>
                    <input 
                      type="email"
                      required
                      placeholder="Ex: babacar.sene@immodakar.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary-light text-gray-800 font-sans"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Tel field */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Numéro de Téléphone (avec WhatsApp) *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="Ex: +221 76 396 50 75"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary-light text-gray-800 font-sans font-bold"
                    />
                  </div>

                  {/* Purpose list */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Je suis :</label>
                    <select 
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary-light text-gray-800 font-sans cursor-pointer font-bold"
                    >
                      <option value="proprietaire">Propriétaire</option>
                      <option value="locataire">Locataire</option>
                      <option value="diaspora">Diaspora</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                </div>

                {/* Main Text message space */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Votre message *</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Saisissez en quelques mots votre projet immobilier ou BTP..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                    className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-gray-200 rounded-lg focus:outline-none focus:border-immo-primary-light text-gray-800 font-sans resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-grow py-3 bg-immo-primary hover:bg-immo-primary-light transition-colors text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 size={13} className="animate-spin" /><span>Envoi en cours...</span></>
                    ) : (
                      <><Send size={13} /><span>Envoyer</span></>
                    )}
                  </button>
                  <a 
                    href="https://wa.me/221786606545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-6 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone size={13} />
                    <span>Contact WhatsApp direct</span>
                  </a>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

      {/* Slogan final banner */}
      <div className="mt-16 text-center py-8 border-t border-gray-150">
        <p className="text-sm font-serif italic text-immo-text-muted">
          "Votre bien, entre de bonnes mains."
        </p>
      </div>

    </div>
  );
};
