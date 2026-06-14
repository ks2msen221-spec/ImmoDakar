/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: 'admin' | 'editor' | 'client';
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'editor' | 'client';
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'editor' | 'client';
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      annonces: {
        Row: {
          id: string;
          titre: string;
          slug: string;
          description: string | null;
          type_bien: 'appartement' | 'villa' | 'terrain' | 'bureau' | 'local_commercial' | 'maison' | null;
          transaction: 'vente' | 'location' | null;
          prix: number | null;
          surface: number | null;
          chambres: number | null;
          salles_de_bain: number | null;
          parking: boolean;
          quartier: string | null;
          ville: string;
          adresse: string | null;
          latitude: number | null;
          longitude: number | null;
          statut: 'brouillon' | 'publié' | 'archivé';
          images: string[] | null;
          createur_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          slug: string;
          description?: string | null;
          type_bien?: 'appartement' | 'villa' | 'terrain' | 'bureau' | 'local_commercial' | 'maison' | null;
          transaction?: 'vente' | 'location' | null;
          prix?: number | null;
          surface?: number | null;
          chambres?: number | null;
          salles_de_bain?: number | null;
          parking?: boolean;
          quartier?: string | null;
          ville?: string;
          adresse?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          statut?: 'brouillon' | 'publié' | 'archivé';
          images?: string[] | null;
          createur_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titre?: string;
          slug?: string;
          description?: string | null;
          type_bien?: 'appartement' | 'villa' | 'terrain' | 'bureau' | 'local_commercial' | 'maison' | null;
          transaction?: 'vente' | 'location' | null;
          prix?: number | null;
          surface?: number | null;
          chambres?: number | null;
          salles_de_bain?: number | null;
          parking?: boolean;
          quartier?: string | null;
          ville?: string;
          adresse?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          statut?: 'brouillon' | 'publié' | 'archivé';
          images?: string[] | null;
          createur_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          titre: string;
          slug: string;
          contenu: string | null;
          extrait: string | null;
          image_couverture: string | null;
          categorie: string | null;
          tags: string[] | null;
          statut: 'brouillon' | 'publié';
          auteur_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titre: string;
          slug: string;
          contenu?: string | null;
          extrait?: string | null;
          image_couverture?: string | null;
          categorie?: string | null;
          tags?: string[] | null;
          statut?: 'brouillon' | 'publié';
          auteur_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titre?: string;
          slug?: string;
          contenu?: string | null;
          extrait?: string | null;
          image_couverture?: string | null;
          categorie?: string | null;
          tags?: string[] | null;
          statut?: 'brouillon' | 'publié';
          auteur_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      favoris: {
        Row: {
          id: string;
          user_id: string | null;
          annonce_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          annonce_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          annonce_id?: string | null;
          created_at?: string;
        };
      };
      demandes_contact: {
        Row: {
          id: string;
          nom: string | null;
          email: string | null;
          telephone: string | null;
          message: string | null;
          annonce_id: string | null;
          user_id: string | null;
          statut: 'nouveau' | 'traité';
          created_at: string;
        };
        Insert: {
          id?: string;
          nom?: string | null;
          email?: string | null;
          telephone?: string | null;
          message?: string | null;
          annonce_id?: string | null;
          user_id?: string | null;
          statut?: 'nouveau' | 'traité';
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string | null;
          email?: string | null;
          telephone?: string | null;
          message?: string | null;
          annonce_id?: string | null;
          user_id?: string | null;
          statut?: 'nouveau' | 'traité';
          created_at?: string;
        };
      };
    };
  };
}
