/**
 * This admin panel is for internal use only. Do not link to it from any public page.
 * Access only via direct URL /admin.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/supabase/client';
import { Annonce, Article, TypeBien, TypeTransaction, StatutAnnonce, StatutArticle } from '../types';
import { 
  Lock, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  LogOut, 
  ShieldAlert, 
  Sparkles, 
  FolderPlus, 
  Key,
  Database,
  Eye,
  Check,
  Calendar,
  Image as ImageIcon,
  ChevronRight,
  Bold,
  Italic,
  Heading,
  List,
  Link,
  MapPin,
  Upload,
  DollarSign
} from 'lucide-react';

const SESSION_KEY = 'immodakar_admin_auth_timestamp';
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export const AdminDashboardView: React.FC = () => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'annonces' | 'blog'>('annonces');
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forms state
  const [annonceModalOpen, setAnnonceModalOpen] = useState<boolean>(false);
  const [articleModalOpen, setArticleModalOpen] = useState<boolean>(false);
  const [editingAnnonce, setEditingAnnonce] = useState<Annonce | null>(null);
  const [editingArticle, setArticleEdited] = useState<Article | null>(null);

  // Annonce Form fields
  const [annTitre, setAnnTitre] = useState<string>('');
  const [annType, setAnnType] = useState<string>('appartement');
  const [annTransaction, setAnnTransaction] = useState<string>('vente');
  const [annPrix, setAnnPrix] = useState<number>(1200000);
  const [annPrixType, setAnnPrixType] = useState<string>('FCFA/mois');
  const [annQuartier, setAnnQuartier] = useState<string>('Almadies');
  const [annSurface, setAnnSurface] = useState<number>(120);
  const [annChambres, setAnnChambres] = useState<number>(3);
  const [annDescription, setAnnDescription] = useState<string>('');
  const [annImages, setAnnImages] = useState<string[]>([]);
  const [annStatut, setAnnStatut] = useState<boolean>(true); // true = actif/publié, false = inactif/brouillon
  const [imageInputVal, setImageInputVal] = useState<string>('');

  // Blog Form fields
  const [blogTitre, setBlogTitre] = useState<string>('');
  const [blogSlug, setBlogSlug] = useState<string>('');
  const [blogCategorie, setBlogCategorie] = useState<string>('Immobilier');
  const [blogCover, setBlogCover] = useState<string>('');
  const [blogContenu, setBlogContenu] = useState<string>('');
  const [blogStatut, setBlogStatut] = useState<string>('Publié');
  const [blogDate, setBlogDate] = useState<string>('');

  // Form helpers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check auth session
  useEffect(() => {
    const checkSession = () => {
      const storedTime = localStorage.getItem(SESSION_KEY);
      if (storedTime) {
        const timeElapsed = Date.now() - parseInt(storedTime, 10);
        if (timeElapsed < SESSION_EXPIRY_MS) {
          setIsAuthenticated(true);
        } else {
          // expired
          localStorage.removeItem(SESSION_KEY);
          setIsAuthenticated(false);
        }
      }
    };
    checkSession();
  }, []);

  // Fetch lists
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const annList = await db.getAnnonces();
      setAnnonces(annList);
      const artList = await db.getArticles();
      setArticles(artList);
    } catch (err) {
      console.error("Erreur de chargement des données d'administration :", err);
    } finally {
      setLoading(false);
    }
  };

  // Auth Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'ImmoDakar2026';
    
    if (passwordInput === correctPassword) {
      localStorage.setItem(SESSION_KEY, Date.now().toString());
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      showToast('Authentification réussie !');
    } else {
      setAuthError('Mot de passe incorrect. Veuillez réessayer.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    showToast('Déconnexion effectuée.');
  };

  // Helper values to parse display type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'appartement': return 'Appartement';
      case 'villa': return 'Villa';
      case 'terrain': return 'Terrain';
      case 'bureau': return 'Bureau';
      case 'local_commercial': return 'Commerce';
      case 'maison': return 'BTP';
      default: return type;
    }
  };

  // Update blog slug when title changes
  useEffect(() => {
    if (!editingArticle && blogTitre) {
      setBlogSlug(blogTitre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [blogTitre, editingArticle]);

  // Form submissions
  const handleAnnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitre || !annQuartier) {
      showToast('Veuillez renseigner les champs obligatoires.');
      return;
    }

    const typeValueMap: Record<string, TypeBien> = {
      'appartement': 'appartement',
      'villa': 'villa',
      'terrain': 'terrain',
      'bureau': 'bureau',
      'commerce': 'local_commercial',
      'btp': 'maison'
    };

    const finalAnnImages = annImages.length > 0 ? annImages : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ];

    // Description suffix or storing price type to adapt formatting
    const parsedDesc = annDescription + (annPrixType !== 'FCFA' ? `_prixFormat:${annPrixType}` : '');

    try {
      const generatedSlug = annTitre.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000);

      const dataToSave = {
        titre: annTitre,
        slug: generatedSlug,
        type_bien: typeValueMap[annType] || 'appartement',
        transaction: annTransaction as TypeTransaction,
        prix: Number(annPrix),
        surface: Number(annSurface),
        chambres: Number(annChambres),
        salles_de_bain: 2,
        parking: true,
        quartier: annQuartier,
        ville: 'Dakar',
        adresse: `${annQuartier}, Dakar, Sénégal`,
        latitude: 14.6937,
        longitude: -17.4441,
        statut: (annStatut ? 'publié' : 'brouillon') as StatutAnnonce,
        images: finalAnnImages,
        description: parsedDesc,
        createur_id: 'admin'
      };

      if (editingAnnonce) {
        await db.saveAnnonce({ ...dataToSave, id: editingAnnonce.id, slug: editingAnnonce.slug });
        showToast('Annonce modifiée avec succès.');
      } else {
        await db.saveAnnonce(dataToSave);
        showToast('Nouvelle annonce créée.');
      }
      setAnnonceModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast('Une erreur est survenue.');
    }
  };

  const handleArtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitre || !blogSlug) {
      showToast('Veuillez remplir les champs obligatoires.');
      return;
    }

    const finalCover = blogCover || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200';

    try {
      const dataToSave = {
        titre: blogTitre,
        slug: blogSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        categorie: blogCategorie,
        image_couverture: finalCover,
        contenu: blogContenu,
        extrait: blogContenu.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + '...',
        statut: (blogStatut === 'Publié' ? 'publié' : 'brouillon') as StatutArticle,
        tags: [blogCategorie],
        auteur_id: 'admin',
        published_at: blogDate || new Date().toISOString().substring(0, 10),
      };

      if (editingArticle) {
        await db.saveArticle({ ...dataToSave, id: editingArticle.id });
        showToast('Article modifié avec succès.');
      } else {
        await db.saveArticle(dataToSave);
        showToast('Nouvel article de blog publié.');
      }
      setArticleModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showToast('Erreur d’enregistrement de l’article.');
    }
  };

  // Deletions
  const deleteAnn = async (id: string) => {
    if (window.confirm('Confirmez-vous la suppression de cette annonce ?')) {
      await db.deleteAnnonce(id);
      showToast('Annonce supprimée.');
      fetchData();
    }
  };

  const deleteArt = async (id: string) => {
    if (window.confirm('Confirmez-vous la suppression de cet article ?')) {
      await db.deleteArticle(id);
      showToast('Article supprimé.');
      fetchData();
    }
  };

  // Modal Triggers
  const openAddAnnonce = () => {
    setEditingAnnonce(null);
    setAnnTitre('');
    setAnnType('appartement');
    setAnnTransaction('vente');
    setAnnPrix(150000);
    setAnnPrixType('FCFA/mois');
    setAnnQuartier('Almadies');
    setAnnSurface(150);
    setAnnChambres(3);
    setAnnDescription('');
    setAnnImages([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=600'
    ]);
    setAnnStatut(true);
    setAnnonceModalOpen(true);
  };

  const openEditAnnonce = (a: Annonce) => {
    setEditingAnnonce(a);
    setAnnTitre(a.titre);
    
    // Reverse map types
    const reverseTypes: Record<string, string> = {
      'appartement': 'appartement',
      'villa': 'villa',
      'terrain': 'terrain',
      'bureau': 'bureau',
      'local_commercial': 'commerce',
      'maison': 'btp'
    };
    setAnnType(reverseTypes[a.type_bien] || 'appartement');
    setAnnTransaction(a.transaction);
    setAnnPrix(a.prix);

    // Extract format if stored
    let initialType = a.transaction === 'location' ? 'FCFA/mois' : 'FCFA';
    let cleanDesc = a.description;
    if (a.description.includes('_prixFormat:')) {
      const parts = a.description.split('_prixFormat:');
      initialType = parts[1] || initialType;
      cleanDesc = parts[0];
    }
    setAnnPrixType(initialType);
    setAnnQuartier(a.quartier);
    setAnnSurface(a.surface);
    setAnnChambres(a.chambres);
    setAnnDescription(cleanDesc);
    setAnnImages(a.images || []);
    setAnnStatut(a.statut === 'publié');
    setAnnonceModalOpen(true);
  };

  const openAddArticle = () => {
    setArticleEdited(null);
    setBlogTitre('');
    setBlogSlug('');
    setBlogCategorie('Immobilier');
    setBlogCover('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800');
    setBlogContenu('');
    setBlogStatut('Publié');
    setBlogDate(new Date().toISOString().substring(0, 10));
    setArticleModalOpen(true);
  };

  const openEditArticle = (art: Article) => {
    setArticleEdited(art);
    setBlogTitre(art.titre);
    setBlogSlug(art.slug);
    setBlogCategorie(art.categorie || 'Immobilier');
    setBlogCover(art.image_couverture);
    setBlogContenu(art.contenu);
    setBlogStatut(art.statut === 'publié' ? 'Publié' : 'Brouillon');
    setBlogDate(art.published_at ? art.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10));
    setArticleModalOpen(true);
  };

  // Rich text simulated helper
  const insertText = (tag: string) => {
    const txtArea = document.getElementById('blogContenuArea') as HTMLTextAreaElement;
    if (!txtArea) return;
    
    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const currentText = txtArea.value;
    const selectedText = currentText.substring(start, end);
    
    let replacement = '';
    switch (tag) {
      case 'bold':
        replacement = `**${selectedText || 'texte en gras'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'texte en italique'}*`;
        break;
      case 'heading':
        replacement = `### ${selectedText || 'Titre de niveau 3'}`;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'Élément de liste'}`;
        break;
      case 'link':
        replacement = `[${selectedText || 'texte du lien'}](https://)`;
        break;
      default:
        return;
    }
    
    const newText = currentText.substring(0, start) + replacement + currentText.substring(end);
    setBlogContenu(newText);
    
    // Refocus textarea and reset cursor
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + 2, start + 2 + (selectedText || '').length);
    }, 50);
  };

  // Format Helper
  const formatPrice = (price: number, typeStr: string = '') => {
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    if (typeStr) return `${formatted} ${typeStr}`;
    return `${formatted} FCFA`;
  };

  // Render Login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-immo-bg-light flex flex-col justify-center items-center py-16 px-4" id="admin-auth-panel">
        <div className="max-w-md w-full bg-white border border-immo-border p-8 rounded-3xl shadow-xl flex flex-col space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-immo-primary-faint text-immo-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} />
            </div>
            <h1 className="text-2xl font-serif font-extrabold text-immo-text-dark">Direction ImmoDakar</h1>
            <p className="text-xs text-immo-text-muted mt-2 font-sans">
              Connectez-vous au panneau d'administration via la clé d'habilitation unique.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-widest block mb-1.5 font-mono">
                Clé de Sécurité Administrative
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-immo-text-muted">
                  <Key size={16} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="Saisissez la clé admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full text-sm pl-10 pr-4 py-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark focus:outline-none focus:ring-1 focus:ring-immo-primary focus:border-immo-primary font-sans"
                />
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
                <ShieldAlert size={14} />
                <span>{authError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-immo-primary hover:bg-immo-primary-light text-white font-bold text-sm transition-all duration-200 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Accéder à l'administration</span>
              <ChevronRight size={16} />
            </button>
          </form>

          <div className="pt-4 border-t border-dashed border-immo-border text-center text-[10px] text-immo-text-muted italic">
            "Le professionnalisme et l'excellence au cœur de Dakar."
          </div>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" id="admin-dashboard-app">
      {/* Tiny Administrative Top Banner */}
      <div className="bg-immo-text-dark text-white text-[11px] font-mono py-1.5 px-6 flex justify-between items-center">
        <span className="flex items-center gap-1.5">
          <Database size={12} className="text-immo-primary-pale" />
          <span>PILOTE APPLICATIF IMMODAKAR · SECURE SESSION ACTIVE</span>
        </span>
        <button 
          onClick={handleLogout}
          className="text-immo-primary-pale hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider cursor-pointer font-sans"
        >
          <LogOut size={12} /> Déconnexion
        </button>
      </div>

      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-immo-primary text-white font-semibold text-xs py-3 px-5 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-immo-primary-light">
          <Check size={16} />
          {toastMessage}
        </div>
      )}

      {/* Grid Dashboard structure */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Left Side menu */}
        <aside className="w-full md:w-64 bg-immo-bg-light border-r border-immo-border p-6 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-mono font-bold text-immo-primary text-left uppercase tracking-widest mb-1.5">
                Espace Direction
              </h2>
              <div className="text-lg font-serif font-extrabold text-[#0f1f14]">
                Immo<span className="text-immo-primary-light">Dakar</span>
              </div>
            </div>

            <nav className="space-y-1.5">
              <button 
                onClick={() => setActiveTab('annonces')}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl flex items-center gap-3 transition-all ${
                  activeTab === 'annonces' 
                    ? 'bg-immo-primary text-white shadow-sm' 
                    : 'text-immo-text-body hover:bg-immo-primary-faint hover:text-immo-primary'
                }`}
              >
                <FolderPlus size={16} />
                <span>Gestion des Annonces</span>
              </button>

              <button 
                onClick={() => setActiveTab('blog')}
                className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl flex items-center gap-3 transition-all ${
                  activeTab === 'blog' 
                    ? 'bg-immo-primary text-white shadow-sm' 
                    : 'text-immo-text-body hover:bg-immo-primary-faint hover:text-immo-primary'
                }`}
              >
                <FileText size={16} />
                <span>Gestion du Blog</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-immo-border mt-10 md:mt-0">
            <div className="bg-white p-4 rounded-xl border border-immo-border space-y-2">
              <div className="text-[10px] font-mono font-bold text-immo-text-muted uppercase tracking-widest text-center">
                Statut Serveur
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-immo-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-immo-primary animate-pulse" />
                <span>Connecté</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Work desk */}
        <main className="flex-1 p-6 md:p-10 space-y-8">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-immo-border">
            <div>
              <h1 className="text-2xl font-serif font-extrabold text-immo-text-dark">
                {activeTab === 'annonces' ? 'Catalogue de Biens Immobiliers' : 'Publications & Blog Actualités'}
              </h1>
              <p className="text-xs text-immo-text-muted mt-1">
                {activeTab === 'annonces' 
                  ? 'Gérez la liste de vos villas, appartements, bureaux ou terrains mis en vente/location.' 
                  : 'Rédigez et publiez les articles professionnels sur l’immobilier et le BTP au Sénégal.'
                }
              </p>
            </div>

            <div>
              {activeTab === 'annonces' ? (
                <button 
                  onClick={openAddAnnonce}
                  className="px-5 py-3 bg-immo-primary hover:bg-immo-primary-light text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>Ajouter une annonce</span>
                </button>
              ) : (
                <button 
                  onClick={openAddArticle}
                  className="px-5 py-3 bg-immo-primary hover:bg-immo-primary-light text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>Nouvel article</span>
                </button>
              )}
            </div>
          </div>

          {/* Module lists view */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-immo-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-immo-text-muted font-bold font-mono">CHARGEMENT DES DONNÉES SECURE...</p>
            </div>
          ) : activeTab === 'annonces' ? (
            
            /* MODULE 1: ANNONCES LISTING */
            <div className="bg-white border border-immo-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-immo-bg-light border-b border-immo-border text-immo-text-dark font-extrabold">
                      <th className="py-4 px-4 font-bold">Bien</th>
                      <th className="py-4 px-4 font-bold">Quartier</th>
                      <th className="py-4 px-4 font-bold">Prix d'affichage</th>
                      <th className="py-4 px-4 font-bold text-center">Type / Usage</th>
                      <th className="py-4 px-4 font-bold text-center">Statut</th>
                      <th className="py-4 px-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-immo-border">
                    {annonces.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-immo-text-muted italic">
                          Aucun bien enregistré dans le catalogue.
                        </td>
                      </tr>
                    ) : (
                      annonces.map((ann) => {
                        // Extract format
                        let formatStr = ann.transaction === 'location' ? 'FCFA/mois' : 'FCFA';
                        if (ann.description.includes('_prixFormat:')) {
                          formatStr = ann.description.split('_prixFormat:')[1] || formatStr;
                        }

                        return (
                          <tr key={ann.id} className="hover:bg-immo-bg-light/35 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={ann.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=150'} 
                                  alt={ann.titre} 
                                  className="w-12 h-9 object-cover rounded-md border border-immo-border"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="font-extrabold text-immo-text-dark text-[13px] block">{ann.titre}</span>
                                  <span className="text-[10px] text-immo-text-muted font-mono">{ann.surface} m² • {ann.chambres} Chambres</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-immo-text-body font-medium">
                              {ann.quartier}
                            </td>
                            <td className="py-4 px-4 font-extrabold text-immo-text-dark font-sans text-[13px]">
                              {formatPrice(ann.prix, formatStr)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="px-2 py-1 bg-immo-primary-faint text-immo-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
                                {getTypeLabel(ann.type_bien)} / {ann.transaction}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full ${
                                ann.statut === 'publié' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-850'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${ann.statut === 'publié' ? 'bg-green-600' : 'bg-yellow-500'}`} />
                                {ann.statut === 'publié' ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2 justify-center">
                                <button 
                                  onClick={() => openEditAnnonce(ann)}
                                  className="p-1.5 text-immo-primary hover:bg-immo-primary-faint rounded-lg transition-colors border border-immo-border cursor-pointer bg-white"
                                  title="Éditer le bien"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button 
                                  onClick={() => deleteAnn(ann.id)}
                                  className="p-1.5 text-red-650 hover:bg-red-50 rounded-lg transition-colors border border-red-100 cursor-pointer bg-white"
                                  title="Supprimer définitivement"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            
            /* MODULE 2: BLOG POSTS LISTING */
            <div className="bg-white border border-immo-border rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-immo-bg-light border-b border-immo-border text-immo-text-dark font-extrabold">
                      <th className="py-4 px-4 font-bold">Image &amp; Titre</th>
                      <th className="py-4 px-4 font-bold">Catégorie</th>
                      <th className="py-4 px-4 font-bold">Date de publication</th>
                      <th className="py-4 px-4 font-bold text-center">Statut</th>
                      <th className="py-4 px-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-immo-border">
                    {articles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-immo-text-muted italic">
                          Aucun article rédigé pour le moment.
                        </td>
                      </tr>
                    ) : (
                      articles.map((art) => (
                        <tr key={art.id} className="hover:bg-immo-bg-light/35 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={art.image_couverture || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=150'} 
                                alt={art.titre} 
                                className="w-14 h-9 object-cover rounded-md border border-immo-border"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span className="font-extrabold text-immo-text-dark text-[13px] block">{art.titre}</span>
                                <span className="text-[10px] text-immo-text-muted font-mono">{art.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-immo-text-body font-medium">
                            <span className="px-2 py-0.5 bg-gray-100 rounded-sm font-semibold">{art.categorie || 'Sénégal'}</span>
                          </td>
                          <td className="py-4 px-4 text-immo-text-muted font-medium font-sans">
                            {art.published_at ? new Date(art.published_at).toLocaleDateString('fr-FR') : 'Non planifiée'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                              art.statut === 'publié' 
                                ? 'bg-indigo-100 text-indigo-800' 
                                : 'bg-amber-100 text-amber-850'
                            }`}>
                              {art.statut === 'publié' ? 'Publié' : 'Brouillon'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => openEditArticle(art)}
                                className="p-1.5 text-immo-primary hover:bg-immo-primary-faint rounded-lg transition-colors border border-immo-border cursor-pointer bg-white"
                                title="Modifier l’article"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button 
                                onClick={() => deleteArt(art.id)}
                                className="p-1.5 text-red-650 hover:bg-red-50 rounded-lg transition-colors border border-red-100 cursor-pointer bg-white"
                                title="Supprimer cet article"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD / EDIT ANNONCE */}
      {annonceModalOpen && (
        <div className="fixed inset-0 bg-[#0f1f14]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="modal-annonce-edit">
          <div className="bg-white border border-immo-border max-w-2xl w-full p-6 sm:p-8 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative font-sans">
            
            <button 
              onClick={() => setAnnonceModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 text-immo-text-muted hover:text-immo-text-dark transition-colors cursor-pointer bg-immo-bg-light rounded-full"
            >
              ×
            </button>

            <h3 className="text-xl font-serif font-extrabold text-immo-text-dark mb-1">
              {editingAnnonce ? 'Modifier l’annonce immobilière' : 'Ajouter un nouveau bien'}
            </h3>
            <p className="text-xs text-immo-text-muted mb-6">
              Veuillez compléter avec rigueur les caractéristiques et les prix du bien pour Dakar.
            </p>

            <form onSubmit={handleAnnSubmit} className="space-y-5 text-left text-xs font-sans">
              
              <div>
                <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                  Titre public de l'annonce *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex : Superbe Appartement F4 avec vue mer aux Almadies"
                  value={annTitre}
                  onChange={(e) => setAnnTitre(e.target.value)}
                  className="w-full font-medium py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl focus:outline-none focus:ring-1 focus:ring-immo-primary text-immo-text-dark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Type de bien *
                  </label>
                  <select 
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark cursor-pointer font-semibold focus:outline-none"
                  >
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau</option>
                    <option value="commerce">Commerce</option>
                    <option value="btp">BTP</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Transaction *
                  </label>
                  <select 
                    value={annTransaction}
                    onChange={(e) => setAnnTransaction(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark cursor-pointer font-semibold focus:outline-none"
                  >
                    <option value="vente">Vente (Achat)</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Quartier à Dakar *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex : Almadies, Fann, Mermoz..."
                    value={annQuartier}
                    onChange={(e) => setAnnQuartier(e.target.value)}
                    className="w-full font-semibold py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl focus:outline-none focus:ring-1 focus:ring-immo-primary text-immo-text-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Prix (Valeur numérique) *
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      required
                      value={annPrix}
                      onChange={(e) => setAnnPrix(Number(e.target.value))}
                      className="w-full font-bold py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Unité de tarification *
                  </label>
                  <select 
                    value={annPrixType}
                    onChange={(e) => setAnnPrixType(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark cursor-pointer font-semibold focus:outline-none"
                  >
                    <option value="FCFA/mois">FCFA / mois</option>
                    <option value="FCFA">FCFA (Prix total)</option>
                    <option value="négociable">négociable</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                      Surface (m²)
                    </label>
                    <input 
                      type="number"
                      required
                      value={annSurface}
                      onChange={(e) => setAnnSurface(Number(e.target.value))}
                      className="w-full py-2.5 px-2 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark focus:outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                      Chambres
                    </label>
                    <input 
                      type="number"
                      value={annChambres}
                      onChange={(e) => setAnnChambres(Number(e.target.value))}
                      className="w-full py-2.5 px-2 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Upload Area Simulation */}
              <div>
                <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                  Photos du bien (Max 10 images)
                </label>
                
                <div className="bg-immo-bg-light border-2 border-dashed border-immo-border rounded-xl p-4 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Upload size={20} className="text-immo-primary" />
                    <span className="text-[11px] text-immo-text-muted font-medium">Déposez vos images ici ou collez les liens URL Unsplash</span>
                    <div className="w-full max-w-md flex gap-2 mt-2">
                      <input 
                        type="text"
                        placeholder="Ajouter l'URL d'une belle photo..."
                        value={imageInputVal}
                        onChange={(e) => setImageInputVal(e.target.value)}
                        className="flex-1 bg-white border border-immo-border py-1.5 px-3 rounded-lg text-[10px]"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (imageInputVal.trim()) {
                            if (annImages.length >= 10) {
                              showToast('Limite de 10 photos atteinte.');
                              return;
                            }
                            setAnnImages([...annImages, imageInputVal.trim()]);
                            setImageInputVal('');
                            showToast('Photo ajoutée !');
                          }
                        }}
                        className="bg-immo-primary text-white text-[10px] px-3 font-semibold rounded-lg hover:bg-immo-primary-light"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnails list */}
                {annImages.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-3 p-2 bg-immo-bg-light rounded-xl">
                    {annImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-immo-border">
                        <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            setAnnImages(annImages.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-x-0 bottom-0 bg-red-650 hover:bg-red-700 text-white font-mono text-[8px] py-0.5 text-center transition-all opacity-95"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                  Description de l'offre *
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Décrivez en détail les caractéristiques exceptionnelles du bien..."
                  value={annDescription}
                  onChange={(e) => setAnnDescription(e.target.value)}
                  className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border text-immo-text-dark focus:outline-none resize-none rounded-xl text-xs"
                />
              </div>

              {/* Status Toggle */}
              <div className="bg-immo-bg-light p-4 rounded-xl flex items-center justify-between border border-immo-border">
                <div>
                  <span className="font-extrabold text-immo-text-dark block">Annonce Active</span>
                  <span className="text-[10px] text-immo-text-muted leading-relaxed">
                    Si désactivée, l'annonce passera en brouillon et ne sera pas visible en ligne.
                  </span>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={annStatut}
                      onChange={(e) => setAnnStatut(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-immo-primary" />
                  </label>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setAnnonceModalOpen(false)}
                  className="w-1/3 py-3 border border-immo-border hover:bg-immo-bg-light rounded-xl font-bold font-sans cursor-pointer text-center text-immo-text-body"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="w-2/3 py-3 bg-immo-primary hover:bg-immo-primary-light text-white font-bold rounded-xl shadow-xs cursor-pointer text-center"
                >
                  {editingAnnonce ? 'Enregistrer les modifications' : 'Créer l’annonce'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT BLOG ARTICLE */}
      {articleModalOpen && (
        <div className="fixed inset-0 bg-[#0f1f14]/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="modal-article-edit">
          <div className="bg-white border border-immo-border max-w-2xl w-full p-6 sm:p-8 rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative font-sans">
            
            <button 
              onClick={() => setArticleModalOpen(false)}
              className="absolute top-6 right-6 p-1.5 text-immo-text-muted hover:text-immo-text-dark transition-colors cursor-pointer bg-immo-bg-light rounded-full"
            >
              ×
            </button>

            <h3 className="text-xl font-serif font-extrabold text-immo-text-dark mb-1">
              {editingArticle ? 'Modifier l’article de blog' : 'Rédiger une nouvelle publication'}
            </h3>
            <p className="text-xs text-immo-text-muted mb-6">
              Rédigez l’actualité et les analyses du marché pour nos lecteurs d’ImmoDakar.
            </p>

            <form onSubmit={handleArtSubmit} className="space-y-4 text-left text-xs font-sans">
              
              <div>
                <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                  Titre de la publication *
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Ex : Tendances immobilières à Dakar pour le second semestre"
                  value={blogTitre}
                  onChange={(e) => setBlogTitre(e.target.value)}
                  className="w-full font-bold py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl focus:outline-none Focus:ring-1 focus:ring-immo-primary text-immo-text-dark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Slug d'accès (Auto-généré) *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="tendances-immobilieres-dakar"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    className="w-full font-mono py-2.5 px-3 bg-immo-bg-light border border-immo-border text-immo-text-dark focus:outline-none rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Catégorie *
                  </label>
                  <select 
                    value={blogCategorie}
                    onChange={(e) => setBlogCategorie(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark cursor-pointer font-bold focus:outline-none"
                  >
                    <option value="Immobilier">Immobilier</option>
                    <option value="BTP">BTP</option>
                    <option value="Conseils">Conseils</option>
                    <option value="Marché">Marché d'Excellence</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Image de couverture (URL)*
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={blogCover}
                    onChange={(e) => setBlogCover(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border text-immo-text-dark focus:outline-none rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Date de publication *
                  </label>
                  <input 
                    type="date"
                    required
                    value={blogDate}
                    onChange={(e) => setBlogDate(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border text-immo-text-dark focus:outline-none rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Rich Text Editor - Basic formatting toolbar */}
              <div>
                <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1 font-mono">
                  Contenu de l'article *
                </label>
                
                {/* Formatting Tools */}
                <div className="bg-immo-bg-light border border-immo-border border-b-0 rounded-t-xl py-1.5 px-3 flex gap-2">
                  <button 
                    type="button"
                    onClick={() => insertText('bold')}
                    className="p-1 px-2 font-bold hover:bg-white rounded hover:text-immo-primary flex items-center gap-1 cursor-pointer transition-colors"
                    title="Texte en gras"
                  >
                    <Bold size={13} /> Gras
                  </button>
                  <button 
                    type="button"
                    onClick={() => insertText('italic')}
                    className="p-1 px-2 italic hover:bg-white rounded hover:text-immo-primary flex items-center gap-1 cursor-pointer transition-colors"
                    title="Texte en italique"
                  >
                    <Italic size={13} /> Italique
                  </button>
                  <button 
                    type="button"
                    onClick={() => insertText('heading')}
                    className="p-1 px-2 hover:bg-white rounded hover:text-immo-primary flex items-center gap-1 cursor-pointer transition-colors font-medium"
                    title="Ajouter un titre"
                  >
                    <Heading size={13} /> Titre
                  </button>
                  <button 
                    type="button"
                    onClick={() => insertText('list')}
                    className="p-1 px-2 hover:bg-white rounded hover:text-immo-primary flex items-center gap-1 cursor-pointer transition-colors"
                    title="Ajouter une liste"
                  >
                    <List size={13} /> Liste
                  </button>
                  <button 
                    type="button"
                    onClick={() => insertText('link')}
                    className="p-1 px-2 hover:bg-white rounded hover:text-immo-primary flex items-center gap-1 cursor-pointer transition-colors"
                    title="Ajouter un lien"
                  >
                    <Link size={13} /> Lien
                  </button>
                </div>

                <textarea 
                  id="blogContenuArea"
                  required
                  rows={8}
                  placeholder="Écrivez le contenu de votre article ici. Utilisez les outils au-dessus pour formater."
                  value={blogContenu}
                  onChange={(e) => setBlogContenu(e.target.value)}
                  className="w-full py-3 px-3 bg-white border border-immo-border rounded-b-xl text-immo-text-dark font-sans text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-immo-text-muted uppercase tracking-wider block mb-1.5 font-mono">
                    Statut de Publication
                  </label>
                  <select 
                    value={blogStatut}
                    onChange={(e) => setBlogStatut(e.target.value)}
                    className="w-full py-2.5 px-3 bg-immo-bg-light border border-immo-border rounded-xl text-immo-text-dark cursor-pointer font-bold focus:outline-none"
                  >
                    <option value="Publié">Publié immédiatement</option>
                    <option value="Brouillon">Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="w-1/3 py-3 border border-immo-border hover:bg-immo-bg-light rounded-xl font-bold font-sans cursor-pointer text-center text-immo-text-body"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="w-2/3 py-3 bg-immo-primary hover:bg-immo-primary-light text-white font-bold rounded-xl shadow-xs cursor-pointer text-center"
                >
                  {editingArticle ? 'Mettre à jour l’article' : 'Publier cet article'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
