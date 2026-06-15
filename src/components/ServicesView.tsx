/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from './AppContext';
import { ArrowRight, Phone } from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="animate-fade-in py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="services-page">
      
      {/* Title Header */}
      <div className="mb-12 text-center">
        <span className="text-xs font-bold text-immo-primary uppercase tracking-widest block mb-2 font-mono">Nos Services</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-immo-text-dark">Nos Services & Offres</h1>
        <div className="w-16 h-1 bg-immo-primary mx-auto mt-4" />
        <p className="text-sm text-gray-500 mt-4 font-sans max-w-2xl mx-auto leading-relaxed">
          Chaque service ImmoDakar répond à un besoin précis et à une vraie inquiétude. Nous avons conçu chaque offre pour vous apporter sérénité, transparence et contrôle.
        </p>
      </div>

      {/* Services Grid layout (8 offers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 font-sans">
        
        {/* OFFRE 1 — Xell Bu Dall */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">01</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Xell Bu Dall</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Mise en location : Sérénité</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Locataire vérifié. Garant exigé. Vous validez le dossier complet avant toute signature."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Vous craignez les impayés, les dégradations ou un locataire qui disparaît.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Candidats vérifiés (identité, revenus, garant) et validation finale par vos soins.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Annonces toutes plateformes</li>
                  <li>Vérification rigoureuse solvabilité</li>
                  <li>WhatsApp après visites & rapport hebdo</li>
                  <li>Rédaction du bail & état des lieux photo</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 2 — Toppatóo */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">02</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Toppatóo</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Gestion locative : Gestion Sereine</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Loyer encaissé, reversé sous 48h, justifié chaque mois. Vous ne courez après rien."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Courir après le loyer, gérer les urgences à toute heure, ne jamais savoir si votre bien va bien.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Reçu systématique, reversement sous 48h, rapport mensuel détaillé à date fixe.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Suivi structuré des impayés</li>
                  <li>Petites réparations via artisans vérifiés</li>
                  <li>Visites périodiques avec photos</li>
                  <li>Gestion des renouvellements de baux</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 3 — Sa Kër Ci Sa Loxo */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">03</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Sa Kër Ci Sa Loxo</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Service diaspora</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Votre maison dans votre main, où que vous soyez."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> À 5 000 km, impossible de vérifier quoi que ce soit. Votre bien peut se dégrader sans que vous le sachiez.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Preuve visuelle datée (vidéo/photos) reçue chaque mois de façon automatique.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Interlocuteur unique adapté à votre fuseau</li>
                  <li>Reçus et documents numérisés</li>
                  <li>Loyer reversé à l'international</li>
                  <li>Surveillance/protection pour les biens vides</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 4 — Kër Bu Wér */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">04</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Kër Bu Wér</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Recherche de logement</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Arrêtez de perdre des semaines à chercher."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Fausses annonces, biens déjà loués, intermédiaires douteux — des semaines perdues pour rien, et le risque de l'arnaque.
              </div>
              <div className="border-t border-gray-100 pt-2">
                <span className="font-bold text-slate-750 block text-[11px] mb-1">Standard — Locataires à Dakar :</span>
                <p className="text-[11px] text-gray-500">Biens réels, visites accompagnées, bail officiel.</p>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <span className="font-bold text-slate-750 block text-[11px] mb-1">Premium (Clé en main expatriés/ONG) :</span>
                <p className="text-[11px] text-gray-500">Recherche sur-mesure, visites vidéo, aide à l'installation.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 5 — Firndé */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">05</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Firndé</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">État des lieux</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Protégez-vous avant le litige."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Conflits sur la caution lors du départ, accusations sans preuves.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Constat photo horodaté, pièce par pièce, signé et archivé numériquement.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Inspection exhaustive pièce par pièce</li>
                  <li>Photos horodatées de chaque défaut</li>
                  <li>Test des équipements</li>
                  <li>Rapport numérique envoyé le jour même</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 6 — Defar Bu Wér */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">06</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Defar Bu Wér</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Remise en état</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Vos travaux sans mauvaise surprise."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Dépassements de budget, artisans qui disparaissent, travaux bâclés.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Devis détaillé poste par poste et paiement par étapes sur validation de photos.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Évaluation technique & devis détaillé</li>
                  <li>Reporting photos et vidéos daté</li>
                  <li>Contrôle strict des artisans</li>
                  <li>Mise en location immédiate après travaux</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 7 — Jaay Bu Wér */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">07</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Jaay Bu Wér</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Courtage à la vente</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Vendez à Dakar sans vous déplacer. Acheteurs qualifiés, encadrement notarié, suivi à distance."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Acheteurs insolvables ou transactions risquées, surtout à distance.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Présentation d'acheteurs qualifiés financièrement, encadrement notarié.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Estimation au juste prix du marché</li>
                  <li>Multi-diffusion des annonces</li>
                  <li>Visites accompagnées & suivi diaspora</li>
                  <li>Accompagnement administratif</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

        {/* OFFRE 8 — Jënd Bu Wér */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-immo-border flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl font-serif text-immo-primary font-bold">08</span>
              <span className="px-2.5 py-1 text-[9px] font-bold text-immo-primary bg-[#f4f8f5] rounded-full uppercase tracking-wider font-mono">Jënd Bu Wér</span>
            </div>
            <h3 className="text-lg font-serif font-bold text-immo-text-dark mb-1">Courtage à l'achat</h3>
            <p className="text-xs font-semibold text-[#556b2f] mb-3 italic">"Achetez à Dakar sans vous faire piéger."</p>
            
            <div className="space-y-3 mt-4 text-xs text-gray-650">
              <div>
                <strong className="text-slate-700">Le problème :</strong> Acheter à distance, c'est risquer d'envoyer des millions sur un bien litigieux ou un titre foncier inexistant.
              </div>
              <div>
                <strong className="text-slate-700">Engagement :</strong> Vérification en amont du titre foncier, avis honnête (même négatif), visio direct.
              </div>
              <div className="pt-2">
                <strong className="text-slate-700 block mb-1">Inclus :</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-500">
                  <li>Recherche sur-mesure & avis objectif</li>
                  <li>Analyse de rendement locatif</li>
                  <li>Liaison et sécurisation avec notaire</li>
                  <li>Visite en direct commentée</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end items-center">
            <a href="https://wa.me/221786606545" target="_blank" rel="noopener noreferrer" className="p-2 bg-immo-primary hover:bg-[#1a3f25] text-white rounded-xl transition-all"><ArrowRight size={16} /></a>
          </div>
        </div>

      </div>


    </div>
  );
};
