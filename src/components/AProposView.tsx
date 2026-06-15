/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from './AppContext';
import { Award, HeartHandshake, MapPin, Check, Phone, Mail } from 'lucide-react';

export const AProposView: React.FC = () => {
  const { navigateTo } = useApp();

  const engagements = [
    {
      title: "Réactivité",
      desc: "Une réponse en moins de 2 heures. Toujours."
    },
    {
      title: "Sérieux",
      desc: "Agence officielle, documents signés, vérifications systématiques."
    },
    {
      title: "Proximité",
      desc: "Une équipe à Yoff, un interlocuteur direct, une vraie relation."
    },
    {
      title: "Transparence",
      desc: "Vous savez toujours ce qu'on fait, ce qu'on dépense, et où en est votre dossier."
    }
  ];

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="a-propos-page">
      
      {/* Narrative Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16" id="history-box">
        
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block">Qui sommes-nous ?</span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-immo-text-dark leading-tight">
            Qui sommes-nous.<br />
            <span className="text-immo-primary font-sans italic font-black">Votre bien, entre de bonnes mains.</span>
          </h1>

          <div className="space-y-4 text-sm text-gray-500 leading-relaxed font-sans">
            <h2 className="text-lg font-bold font-serif text-immo-text-dark">Notre histoire</h2>
            <p>
              ImmoDakar est une agence immobilière et BTP basée à Yoff, Dakar. Nous sommes une jeune agence — et nous l'assumons pleinement. Là où d'autres mettent en avant leurs décennies d'existence, nous préférons prouver notre valeur autrement : par notre réactivité, notre sérieux et notre proximité.
            </p>
            <p>
              Nous croyons que la confiance ne se décrète pas par l'ancienneté, mais se construit par les actes — des contrats signés, des locataires vérifiés, des comptes rendus réguliers, une disponibilité réelle.
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-500 leading-relaxed font-sans pt-2">
            <h2 className="text-lg font-bold font-serif text-immo-text-dark">Notre mission</h2>
            <p>
              Accompagner les propriétaires, les locataires et la diaspora sénégalaise dans tous leurs projets immobiliers et de construction à Dakar — avec une exigence de transparence et de sérieux à chaque étape.
            </p>
          </div>
        </div>

        {/* Big high quality visual container */}
        <div className="lg:col-span-5 relative h-96 rounded-3xl overflow-hidden border border-immo-border shadow-md bg-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" 
            alt="Bureau technique ImmoDakar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-immo-primary/50 to-transparent flex items-end p-6 text-white font-sans">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 block font-mono">Yoff Ouest Foire</span>
              <span className="font-serif font-bold text-base">Sérieux · Réactivité · Proximité</span>
            </div>
          </div>
        </div>

      </section>

      {/* Values Bar */}
      <section className="bg-[#f4f8f5] border border-immo-border rounded-3xl p-8 sm:p-10 mb-16" id="commitments-section">
        <h2 className="text-center font-serif text-2xl font-bold text-immo-text-dark mb-4">Nos Valeurs</h2>
        <p className="text-xs text-[#556b2f] text-center max-w-lg mx-auto mb-8 font-sans">
          Ce qui nous engage avec vous, chaque jour.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagements.map((eng, idx) => (
            <div key={idx} className="space-y-2 bg-white p-5 rounded-2xl border border-immo-border flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-immo-primary/10 text-immo-primary flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-serif font-bold text-sm text-immo-text-dark mt-3">{eng.title}</h3>
                <p className="text-xs text-gray-500 font-sans leading-relaxed mt-2">
                  {eng.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Engagement Diaspora Section */}
      <section className="bg-white border border-immo-border rounded-3xl p-8 sm:p-10 mb-16" id="diaspora-engagement-box">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block font-mono">Notre engagement diaspora</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-immo-text-dark">Pour la diaspora sénégalaise</h2>
          <p className="text-sm text-gray-500 leading-relaxed font-sans">
            Une part importante de notre activité est dédiée à la diaspora sénégalaise. Nous savons ce que ça représente d'avoir un bien au pays quand on vit loin — et ce que coûte de ne pas pouvoir intervenir. Nous mettons tout en œuvre pour que vous gardiez le contrôle, où que vous soyez.
          </p>
        </div>
      </section>

      {/* Special CTA for Whatsapp */}
      <section className="bg-gradient-to-r from-immo-primary via-[#1a3f25] to-immo-text-dark text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl" id="diaspora-whatsapp-cta">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold text-immo-primary-pale uppercase tracking-widest block mb-1">Votre interlocuteur direct</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">Votre projet mérite une réponse rapide.</h2>
          <p className="text-gray-300 text-sm leading-relaxed font-sans max-w-lg mx-auto">
            Un message suffit. Notre équipe vous répond sous 2 heures — sans formalités, sans attente, sans standard anonyme.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://wa.me/221786606545" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 py-3.5 bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md text-sm"
            >
              <Phone size={16} />
              <span>Contact WhatsApp Direct (+221 78 660 65 45)</span>
            </a>
            <button 
              onClick={() => navigateTo('contact')}
              className="px-6 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl transition-all text-sm cursor-pointer"
            >
              Formuler un e-mail officiel
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
