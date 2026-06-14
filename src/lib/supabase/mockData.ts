/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Annonce, Article, Profile, DemandeContact, Favori } from '../../types';

export const MOCK_PROFILES: Profile[] = [
  {
    id: 'admin-id-1234',
    full_name: 'Moustapha Diop',
    phone: '+221 77 123 45 67',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    created_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'editor-id-5678',
    full_name: 'Amy Sarr',
    phone: '+221 78 987 65 43',
    role: 'editor',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    created_at: new Date('2026-01-10').toISOString(),
  },
  {
    id: 'client-id-abcd',
    full_name: 'Abdoulaye Ndiaye',
    phone: '+221 70 555 44 33',
    role: 'client',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    created_at: new Date('2026-02-15').toISOString(),
  }
];

export const MOCK_ANNONCES: Annonce[] = [];

const _UNUSED_ANNONCES: Annonce[] = [
  {
    id: 'ann-1',
    titre: 'Villa de Prestige aux Almadies',
    slug: 'villa-de-prestige-aux-almadies',
    description: 'Somptueuse villa contemporaine située dans le quartier le plus prisé de Dakar. Offrant des finitions haut de gamme, une piscine miroir spectaculaire, un jardin arboré et un espace de vie baigné de lumière. Matériaux nobles importés d\'Italie, cuisine professionnelle équipée, suite parentale royale avec dressing et vue panoramique.',
    type_bien: 'villa',
    transaction: 'vente',
    prix: 650000000, // 650 Millions FCFA
    surface: 520,
    chambres: 5,
    salles_de_bain: 6,
    parking: true,
    quartier: 'Almadies',
    ville: 'Dakar',
    adresse: 'Rue des Hydrocarbures prolongée, Almadies, Dakar',
    latitude: 14.7479,
    longitude: -17.5147,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-01').toISOString(),
    updated_at: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'ann-2',
    titre: 'Appartement F4 Moderne avec Vue Sur Mer',
    slug: 'appartement-f4-moderne-vue-sur-mer',
    description: 'Splendide appartement de 4 pièces situé sur la Corniche Ouest (Fann Résidence). Grand séjour s\'ouvrant sur un grand balcon face à l\'océan Atlantique. La résidence dispose d\'une salle de sport, d\'un service de gardiennage 24/7, d\'un groupe électrogène et d\'un ascenseur. Cuisine américaine équipée et trois chambres autonomes.',
    type_bien: 'appartement',
    transaction: 'location',
    prix: 1800000, // 1.8 Millions FCFA / mois
    surface: 210,
    chambres: 3,
    salles_de_bain: 3,
    parking: true,
    quartier: 'Fann Résidence',
    ville: 'Dakar',
    adresse: 'Boulevard de la Corniche Ouest, Dakar',
    latitude: 14.6896,
    longitude: -17.4727,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-05').toISOString(),
    updated_at: new Date('2026-05-06').toISOString(),
  },
  {
    id: 'ann-3',
    titre: 'Terrain d’Angle Viabilisé',
    slug: 'terrain-d-angle-viabilise-diamniadio',
    description: 'Superbe opportunité d\'investissement dans le pôle urbain d\'avenir de Diamniadio. Terrain d\'angle régulier, entièrement desservi en eau, électricité et fibre optique. Idéal pour un projet de construction d\'immeuble résidentiel ou de bureaux. Papier en règle avec titre foncier individuel.',
    type_bien: 'terrain',
    transaction: 'vente',
    prix: 45000000, // 45 Millions FCFA
    surface: 400,
    chambres: 0,
    salles_de_bain: 0,
    parking: false,
    quartier: 'Diamniadio',
    ville: 'Dakar',
    adresse: 'Zone Résidentielle Pôle Urbain, Diamniadio',
    latitude: 14.7333,
    longitude: -17.2167,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-10').toISOString(),
    updated_at: new Date('2026-05-10').toISOString(),
  },
  {
    id: 'ann-4',
    titre: 'Bureaux Aménagés sur le Plateau',
    slug: 'bureaux-amenages-plateau-dakar',
    description: 'En plein cœur du quartier d\'affaires de Dakar Plateau, plateau de bureaux moderne prêt à l\'usage d\'une superficie de 150m². Idéal pour une entreprise, un cabinet ou une startup. Comprend un accueil, un grand open space, deux bureaux de direction fermés, une cuisine de courtoisie et sanitaire privé. Climatisation centrale.',
    type_bien: 'bureau',
    transaction: 'location',
    prix: 1200000, // 1.2 Millions FCFA / mois
    surface: 150,
    chambres: 0,
    salles_de_bain: 2,
    parking: true,
    quartier: 'Plateau',
    ville: 'Dakar',
    adresse: 'Rue Carnot angle Hassan II, Dakar Plateau',
    latitude: 14.6658,
    longitude: -17.4339,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-12').toISOString(),
    updated_at: new Date('2026-05-12').toISOString(),
  },
  {
    id: 'ann-5',
    titre: 'Villa Familiale Contemporaine à Ngor',
    slug: 'villa-familiale-contemporaine-ngor',
    description: 'Belle villa sur 3 niveaux située à Ngor, à quelques minutes de la plage et des restaurants. Ambiance chaleureuse avec un agréable patio intérieur. 4 suites parentales avec salles de bain attenantes, grand séjour double, terrasse aménagée au dernier niveau offrant une échappée visuelle sur l\'île de Ngor et coucher de soleil garanti.',
    type_bien: 'villa',
    transaction: 'vente',
    prix: 285000000, // 285 Millions FCFA
    surface: 350,
    chambres: 4,
    salles_de_bain: 5,
    parking: true,
    quartier: 'Ngor',
    ville: 'Dakar',
    adresse: 'Ngor Almadies Ouest, près du Casino, Dakar',
    latitude: 14.7442,
    longitude: -17.5132,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-18').toISOString(),
    updated_at: new Date('2026-05-18').toISOString(),
  },
  {
    id: 'ann-6',
    titre: 'Appartement F3 Calme à Mermoz',
    slug: 'appartement-f3-calme-mermoz',
    description: 'Charmant appartement 3 pièces au cœur de Mermoz, un secteur calme, résidentiel et extrêmement accessible. Salon spacieux et lumineux, cuisine fermée avec buanderie adjacente, deux chambres avec placards et climatiseurs installés. Parking souterrain sécurisé, gardiennage permanent.',
    type_bien: 'appartement',
    transaction: 'location',
    prix: 700000, // 700.000 FCFA / mois
    surface: 110,
    chambres: 2,
    salles_de_bain: 2,
    parking: true,
    quartier: 'Mermoz',
    ville: 'Dakar',
    adresse: 'Mermoz Pyrotechnie, Dakar',
    latitude: 14.7061,
    longitude: -17.4812,
    statut: 'publié',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80&w=600'
    ],
    createur_id: 'admin-id-1234',
    created_at: new Date('2026-05-20').toISOString(),
    updated_at: new Date('2026-05-20').toISOString(),
  }
]; // _UNUSED_ANNONCES

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    titre: 'Investir dans l’Immobilier à Dakar : Les Quartiers d’Avenir en 2026',
    slug: 'investir-immobilier-dakar-quartiers-avenir-2026',
    contenu: 'Dakar connaît un boom immobilier sans précédent. Avec le développement de pôles comme Diamniadio, les opportunités d\'investissement décollent. Cet article détaille pourquoi miser sur les Almadies reste une valeur sûre, les prix au m² actuels à Fann, et pourquoi la zone franche de Diamniadio attire les promoteurs.',
    extrait: 'Découvrez les opportunités d’investissement immobilier les plus rentables à Dakar pour l’année 2026 : de Ngor aux nouveaux pôles résidentiels.',
    image_couverture: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
    categorie: 'Investissement',
    tags: ['Dakar', 'Immobilier', 'Conseils', '2026'],
    statut: 'publié',
    auteur_id: 'editor-id-5678',
    published_at: new Date('2026-05-25').toISOString(),
    created_at: new Date('2026-05-25').toISOString(),
    updated_at: new Date('2026-05-25').toISOString(),
  },
  {
    id: 'art-2',
    titre: 'Construction BTP au Sénégal : Normes, Choix des Matériaux et Coûts',
    slug: 'construction-btp-senegal-normes-materiaux-couts',
    contenu: 'Faire construire sa maison à Dakar ou Saly requiert une parfaite connaissance des sols sénégalais et des normes en vigueur. ImmoDakar BTP vous explique comment choisir le béton adapté à la salinité maritime, comment optimiser le coût du fer de construction et comment concevoir un bâtiment bioclimatique.',
    extrait: 'Le guide complet pour réussir ses projets de construction BTP au Sénégal : fondations, résistance à la salinité et planification.',
    image_couverture: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1200',
    categorie: 'BTP & Construction',
    tags: ['BTP', 'Sénégal', 'Architecture', 'Matériaux'],
    statut: 'publié',
    auteur_id: 'editor-id-5678',
    published_at: new Date('2026-05-28').toISOString(),
    created_at: new Date('2026-05-27').toISOString(),
    updated_at: new Date('2026-05-28').toISOString(),
  },
  {
    id: 'art-3',
    titre: 'Location Meublée vs Nue : Quel Modèle Choisir à Dakar pour Votre Rendement ?',
    slug: 'location-meublee-vs-nue-dakar-rendement',
    contenu: 'Face à une clientèle internationale et d\'affaires exigeante, la location meublée de courte durée explose à Dakar. Cependant, la location nue à long terme offre une stabilité indéniable. ImmoDakar compare pour vous les taux d\'occupation, la fiscalité locale et le retour sur investissement net de ces deux modes.',
    extrait: 'Analyse comparative des rendements locatifs meublés et nus à Dakar pour optimiser les revenus de votre patrimoine immobilier.',
    image_couverture: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1200',
    categorie: 'Gestion Locative',
    tags: ['Location', 'Rendement', 'Dakar', 'Gestion'],
    statut: 'publié',
    auteur_id: 'editor-id-5678',
    published_at: new Date('2026-06-01').toISOString(),
    created_at: new Date('2026-05-30').toISOString(),
    updated_at: new Date('2026-06-01').toISOString(),
  }
];

export const MOCK_FAVORIS: Favori[] = [
  {
    id: 'fav-1',
    user_id: 'client-id-abcd',
    annonce_id: 'ann-1',
    created_at: new Date('2026-05-20').toISOString()
  }
];

export const MOCK_DEMANDES: DemandeContact[] = [
  {
    id: 'dem-1',
    nom: 'Khady Sy',
    email: 'khady.sy@gmail.com',
    telephone: '+221 77 456 12 34',
    message: 'Bonjour, je souhaiterais visiter cette splendide villa aux Almadies ce samedi si possible. Merci de me recontacter.',
    annonce_id: 'ann-1',
    user_id: null,
    statut: 'nouveau',
    created_at: new Date('2026-06-02').toISOString()
  },
  {
    id: 'dem-2',
    nom: 'Ibrahima Diallo',
    email: 'ibra.diallo@outlook.com',
    telephone: '+221 70 852 36 96',
    message: 'Je suis vivement intéressé par l’appartement F4 à Fann Résidence. Est-il immédiatement libre ?',
    annonce_id: 'ann-2',
    user_id: 'client-id-abcd',
    statut: 'traité',
    created_at: new Date('2026-06-04').toISOString()
  }
];
