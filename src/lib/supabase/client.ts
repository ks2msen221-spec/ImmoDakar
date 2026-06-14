/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Annonce, Article, Profile, DemandeContact, Favori, UserRole } from '../../types';
import { MOCK_PROFILES, MOCK_ANNONCES, MOCK_ARTICLES, MOCK_DEMANDES, MOCK_FAVORIS } from './mockData';

// 1. Safe Supabase initialization
const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';

export const isRealSupabaseConfigured = SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '';

// Create actual client if keys are present (lazy initialization fallback)
export let supabase: any = null;
if (isRealSupabaseConfigured) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.warn('Erreur lors de l\'initialisation de Supabase, utilisation du mock local:', error);
  }
}

// 2. High-fidelity LocalState Engine (Mock Database with LocalStorage persistence)
const getLocalData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`immodakar_${key}`);
  if (!data) {
    localStorage.setItem(`immodakar_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data) as T;
};

const saveLocalData = <T>(key: string, data: T) => {
  localStorage.setItem(`immodakar_${key}`, JSON.stringify(data));
  // Emit event for state synchronization
  window.dispatchEvent(new Event('immodakar_db_update'));
};

// Version bump here to force-clear old mock data from localStorage
const MOCK_DATA_VERSION = 'v2-no-mock-annonces';

// Initialize simulated database in client-side storage
export const initMockDb = () => {
  // One-time migration: clear cached mock annonces when version changes
  if (localStorage.getItem('immodakar_data_version') !== MOCK_DATA_VERSION) {
    localStorage.removeItem('immodakar_annonces');
    localStorage.setItem('immodakar_data_version', MOCK_DATA_VERSION);
  }
  getLocalData<Profile[]>('profiles', MOCK_PROFILES);
  getLocalData<Annonce[]>('annonces', MOCK_ANNONCES); // MOCK_ANNONCES is now []
  getLocalData<Article[]>('articles', MOCK_ARTICLES);
  getLocalData<Favori[]>('favoris', MOCK_FAVORIS);
  getLocalData<DemandeContact[]>('demandes', MOCK_DEMANDES);
  getLocalData<Profile | null>('currentUser', null);
};

// Auto-run init on module load
if (typeof window !== 'undefined') {
  initMockDb();
}

// 3. Database operations with seamless real-supabase fallback
export const db = {
  // --- AUTH SERVICES ---
  async getCurrentUser(): Promise<Profile | null> {
    if (isRealSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      return data;
    }
    return getLocalData<Profile | null>('currentUser', null);
  },

  async login(email: string, role: UserRole = 'client'): Promise<Profile> {
    // Elegant login mockup based on requested roles
    const profiles = getLocalData<Profile[]>('profiles', MOCK_PROFILES);
    let matchedProfile = profiles.find(p => p.role === role);
    
    if (!matchedProfile) {
      matchedProfile = {
        id: `user-${role}-${Date.now()}`,
        full_name: role === 'admin' ? 'M. Diop (Admin)' : role === 'editor' ? 'A. Sarr (Éditeur)' : 'Client ImmoDakar',
        phone: '+221 77 000 00 00',
        role,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
        created_at: new Date().toISOString()
      };
      profiles.push(matchedProfile);
      saveLocalData('profiles', profiles);
    }
    
    saveLocalData('currentUser', matchedProfile);
    return matchedProfile;
  },

  async register(fullName: string, phone: string, email: string): Promise<Profile> {
    const profiles = getLocalData<Profile[]>('profiles', MOCK_PROFILES);
    const newProfile: Profile = {
      id: `client-${Date.now()}`,
      full_name: fullName,
      phone: phone,
      role: 'client',
      avatar_url: null,
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    saveLocalData('profiles', profiles);
    saveLocalData('currentUser', newProfile);
    return newProfile;
  },

  async logout(): Promise<void> {
    if (isRealSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    saveLocalData<Profile | null>('currentUser', null);
  },

  // --- ANNONCES SERVICES ---
  async getAnnonces(): Promise<Annonce[]> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocalData<Annonce[]>('annonces', MOCK_ANNONCES);
  },

  async getAnnonceBySlug(slug: string): Promise<Annonce | null> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) return data;
    }
    const annonces = getLocalData<Annonce[]>('annonces', MOCK_ANNONCES);
    return annonces.find(a => a.slug === slug || a.id === slug) || null;
  },

  async saveAnnonce(annonce: Omit<Annonce, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Annonce> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('annonces')
        .upsert({
          ...annonce,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (!error && data) return data;
    }
    
    const annonces = getLocalData<Annonce[]>('annonces', MOCK_ANNONCES);
    const id = annonce.id || `ann-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const index = annonces.findIndex(a => a.id === id);
    const updated: Annonce = {
      id,
      titre: annonce.titre,
      slug: annonce.slug || annonce.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: annonce.description || '',
      type_bien: annonce.type_bien,
      transaction: annonce.transaction,
      prix: Number(annonce.prix),
      surface: Number(annonce.surface),
      chambres: Number(annonce.chambres),
      salles_de_bain: Number(annonce.salles_de_bain),
      parking: !!annonce.parking,
      quartier: annonce.quartier,
      ville: annonce.ville || 'Dakar',
      adresse: annonce.adresse || '',
      latitude: Number(annonce.latitude) || 14.6937,
      longitude: Number(annonce.longitude) || -17.4441,
      statut: annonce.statut || 'brouillon',
      images: annonce.images && annonce.images.length > 0 ? annonce.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'],
      createur_id: annonce.createur_id || 'admin-id-1234',
      created_at: index >= 0 ? annonces[index].created_at : timestamp,
      updated_at: timestamp
    };
    
    if (index >= 0) {
      annonces[index] = updated;
    } else {
      annonces.unshift(updated);
    }
    
    saveLocalData('annonces', annonces);
    return updated;
  },

  async deleteAnnonce(id: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      const { error } = await supabase.from('annonces').delete().eq('id', id);
      if (!error) return true;
    }
    const annonces = getLocalData<Annonce[]>('annonces', MOCK_ANNONCES);
    const filtered = annonces.filter(a => a.id !== id);
    saveLocalData('annonces', filtered);
    return true;
  },

  // --- BLOG ARTICLES SERVICES ---
  async getArticles(): Promise<Article[]> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocalData<Article[]>('articles', MOCK_ARTICLES);
  },

  async getArticleBySlug(slug: string): Promise<Article | null> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (!error && data) return data;
    }
    const articles = getLocalData<Article[]>('articles', MOCK_ARTICLES);
    return articles.find(a => a.slug === slug || a.id === slug) || null;
  },

  async saveArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Article> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .upsert({
          ...article,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (!error && data) return data;
    }
    
    const articles = getLocalData<Article[]>('articles', MOCK_ARTICLES);
    const id = article.id || `art-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    const index = articles.findIndex(a => a.id === id);
    const updated: Article = {
      id,
      titre: article.titre,
      slug: article.slug || article.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      contenu: article.contenu || '',
      extrait: article.extrait || '',
      image_couverture: article.image_couverture || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
      categorie: article.categorie || 'Actualité',
      tags: article.tags || [],
      statut: article.statut || 'brouillon',
      auteur_id: article.auteur_id || 'editor-id-5678',
      published_at: article.statut === 'publié' ? (article.published_at || timestamp) : null,
      created_at: index >= 0 ? articles[index].created_at : timestamp,
      updated_at: timestamp
    };
    
    if (index >= 0) {
      articles[index] = updated;
    } else {
      articles.unshift(updated);
    }
    
    saveLocalData('articles', articles);
    return updated;
  },

  async deleteArticle(id: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (!error) return true;
    }
    const articles = getLocalData<Article[]>('articles', MOCK_ARTICLES);
    const filtered = articles.filter(a => a.id !== id);
    saveLocalData('articles', filtered);
    return true;
  },

  // --- FAVORIS SERVICES ---
  async getFavoris(userId: string): Promise<Favori[]> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('favoris')
        .select('*')
        .eq('user_id', userId);
      if (!error && data) return data;
    }
    const favoris = getLocalData<Favori[]>('favoris', MOCK_FAVORIS);
    return favoris.filter(f => f.user_id === userId);
  },

  async toggleFavori(userId: string, annonceId: string): Promise<boolean> {
    if (isRealSupabaseConfigured && supabase) {
      const { data: maybeFav } = await supabase
        .from('favoris')
        .select('*')
        .eq('user_id', userId)
        .eq('annonce_id', annonceId)
        .maybeSingle();
      
      if (maybeFav) {
        await supabase.from('favoris').delete().eq('id', maybeFav.id);
        return false;
      } else {
        await supabase.from('favoris').insert({ user_id: userId, annonce_id: annonceId });
        return true;
      }
    }
    
    const favoris = getLocalData<Favori[]>('favoris', MOCK_FAVORIS);
    const index = favoris.findIndex(f => f.user_id === userId && f.annonce_id === annonceId);
    
    if (index >= 0) {
      favoris.splice(index, 1);
      saveLocalData('favoris', favoris);
      return false; // No longer favorite
    } else {
      favoris.push({
        id: `fav-${Date.now()}`,
        user_id: userId,
        annonce_id: annonceId,
        created_at: new Date().toISOString()
      });
      saveLocalData('favoris', favoris);
      return true; // Added to favorites
    }
  },

  async isFavori(userId: string, annonceId: string): Promise<boolean> {
    const favoris = await this.getFavoris(userId);
    return favoris.some(f => f.annonce_id === annonceId);
  },

  // --- DEMANDES CONTACT SERVICES ---
  async getDemandes(): Promise<DemandeContact[]> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('demandes_contact')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    return getLocalData<DemandeContact[]>('demandes', MOCK_DEMANDES);
  },

  async createDemande(demande: Omit<DemandeContact, 'id' | 'created_at' | 'statut'>): Promise<DemandeContact> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('demandes_contact')
        .insert({
          ...demande,
          statut: 'nouveau'
        })
        .select()
        .single();
      if (!error && data) return data;
    }

    const demandes = getLocalData<DemandeContact[]>('demandes', MOCK_DEMANDES);
    const newDemande: DemandeContact = {
      ...demande,
      id: `dem-${Date.now()}`,
      statut: 'nouveau',
      created_at: new Date().toISOString()
    };
    demandes.unshift(newDemande);
    saveLocalData('demandes', demandes);
    return newDemande;
  },

  async updateDemandeStatut(id: string, statut: 'nouveau' | 'traité'): Promise<DemandeContact> {
    if (isRealSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('demandes_contact')
        .update({ statut })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
    }

    const demandes = getLocalData<DemandeContact[]>('demandes', MOCK_DEMANDES);
    const index = demandes.findIndex(d => d.id === id);
    if (index >= 0) {
      demandes[index].statut = statut;
      saveLocalData('demandes', demandes);
      return demandes[index];
    }
    throw new Error('Demande introuvable');
  }
};
