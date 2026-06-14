/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Roles in the ImmoDakar platform
export type UserRole = 'admin' | 'editor' | 'client';

// Profile interface mapping to table profiles
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

// Annotation details matching table annonces
export type TypeBien = 'appartement' | 'villa' | 'terrain' | 'bureau' | 'local_commercial' | 'maison';
export type TypeTransaction = 'vente' | 'location';
export type StatutAnnonce = 'brouillon' | 'publié' | 'archivé';

export interface Annonce {
  id: string;
  titre: string;
  slug: string;
  description: string;
  type_bien: TypeBien;
  transaction: TypeTransaction;
  prix: number;
  surface: number;
  chambres: number;
  salles_de_bain: number;
  parking: boolean;
  quartier: string;
  ville: string;
  adresse: string;
  latitude: number;
  longitude: number;
  statut: StatutAnnonce;
  images: string[];
  createur_id: string;
  created_at: string;
  updated_at: string;
}

// Article detail matching table articles
export type StatutArticle = 'brouillon' | 'publié';

export interface Article {
  id: string;
  titre: string;
  slug: string;
  contenu: string;
  extrait: string;
  image_couverture: string;
  categorie: string;
  tags: string[];
  statut: StatutArticle;
  auteur_id: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Favoris mapping to table favoris
export interface Favori {
  id: string;
  user_id: string;
  annonce_id: string;
  created_at: string;
}

// Demande contact matching table demandes_contact
export type StatutDemande = 'nouveau' | 'traité';

export interface DemandeContact {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  annonce_id: string | null;
  user_id: string | null;
  statut: StatutDemande;
  created_at: string;
}

// Filter structure for searches
export interface FilterParams {
  transaction: TypeTransaction | 'tous';
  type_bien: TypeBien | 'tous';
  quartier: string;
  prixMin: string;
  prixMax: string;
  surfaceMin: string;
  chambresMin: string;
}
