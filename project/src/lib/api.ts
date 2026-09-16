import { supabase } from './supabase'
import type {
  Actualite, Projet, Departement, Chercheur, CentreRegional,
  Partenaire, Publication, MessageContact
} from './types'

// Détection de l'URL du Backend (Django ou PHP)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const PHP_API_BASE = import.meta.env.VITE_PHP_API_BASE_URL || 'http://localhost:8080'

// Helper de requête REST générique avec fallback automatique
async function fetchRest<T>(endpoint: string): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      // DRF pagination response support:
      return (data && Array.isArray(data.results) ? data.results : data) as T
    }
  } catch (err) {
    // Si l'API Django échoue, tenter l'API PHP si disponible
    try {
      const phpEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      const phpRes = await fetch(`${PHP_API_BASE}${phpEndpoint}.php`)
      if (phpRes.ok) {
        return (await phpRes.json()) as T
      }
    } catch {
      // API PHP non disponible
    }
  }
  return null
}

export const api = {
  // --- ACTUALITÉS ---
  async getActualites(limit?: number): Promise<Actualite[]> {
    const restData = await fetchRest<Actualite[]>(`/actualites/${limit ? `?limit=${limit}` : ''}`)
    if (restData) return restData

    try {
      let q = supabase
        .from('actualites')
        .select('id, titre, slug, extrait, image_url, date_publication, auteur, lu, categorie:categories(*)')
        .order('date_publication', { ascending: false })
      if (limit) q = q.limit(limit)
      const { data } = await q
      return (data as unknown as Actualite[]) ?? []
    } catch {
      return []
    }
  },

  async getActualiteBySlug(slug: string): Promise<Actualite | null> {
    const restData = await fetchRest<Actualite>(`/actualites/${slug}/`)
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('actualites')
        .select('*, categorie:categories(*)')
        .eq('slug', slug)
        .maybeSingle()
      return data
    } catch {
      return null
    }
  },

  // --- PROJETS & PUBLICATIONS ---
  async getProjets(): Promise<Projet[]> {
    const restData = await fetchRest<Projet[]>('/projets/')
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('projets')
        .select('*')
        .order('created_at', { ascending: false })
      return data ?? []
    } catch {
      return []
    }
  },

  async getProjetBySlug(slug: string): Promise<Projet | null> {
    const restData = await fetchRest<Projet>(`/projets/${slug}/`)
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('projets')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()
      return data
    } catch {
      return null
    }
  },

  async getPublications(): Promise<Publication[]> {
    const restData = await fetchRest<Publication[]>('/publications/')
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('publications')
        .select('*, projet:projets(*)')
        .order('annee', { ascending: false })
      return data ?? []
    } catch {
      return []
    }
  },

  // --- DÉPARTEMENTS, CHERCHEURS & CENTRES ---
  async getDepartements(): Promise<Departement[]> {
    const restData = await fetchRest<Departement[]>('/departements/')
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('departements')
        .select('*')
        .order('ordre')
      return data ?? []
    } catch {
      return []
    }
  },

  async getChercheurs(): Promise<Chercheur[]> {
    const restData = await fetchRest<Chercheur[]>('/chercheurs/')
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('chercheurs')
        .select('*, departement:departements(*)')
        .order('nom')
      return data ?? []
    } catch {
      return []
    }
  },

  async getCentresRegionaux(): Promise<CentreRegional[]> {
    const restData = await fetchRest<CentreRegional[]>('/centres_regionaux/')
    if (restData) return restData

    try {
      const { data } = await supabase
        .from('centres_regionaux')
        .select('*')
        .order('region')
      return data ?? []
    } catch {
      return []
    }
  },

  async getPartenaires(): Promise<Partenaire[]> {
    const restData = await fetchRest<Partenaire[]>('/partenaires/')
    if (restData) return restData

    try {
      const { data } = await supabase.from('partenaires').select('*')
      return data ?? []
    } catch {
      return []
    }
  },

  // --- MESSAGES DE CONTACT ---
  async sendMessage(msg: Omit<MessageContact, 'id' | 'created_at'>): Promise<{ success: boolean; error?: string }> {
    // 1. Essai Django REST API
    try {
      const res = await fetch(`${API_BASE}/messages_contact/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      })
      if (res.ok) return { success: true }
    } catch {
      // Continuer vers PHP ou Supabase
    }

    // 2. Essai PHP API
    try {
      const res = await fetch(`${PHP_API_BASE}/contact.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      })
      if (res.ok) return { success: true }
    } catch {
      // Continuer vers Supabase
    }

    // 3. Essai Supabase
    try {
      const { error } = await supabase.from('messages_contact').insert(msg)
      if (!error) return { success: true }
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Erreur réseau' }
    }

    return { success: false, error: 'Impossible d\'envoyer le message.' }
  }
}
