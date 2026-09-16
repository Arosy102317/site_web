import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Calendar, ArrowRight, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { api } from '../lib/api'
import type { Actualite, Categorie } from '../lib/types'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import Loader from '../components/Loader'

const heroImage = 'https://images.pexels.com/photos/11053137/pexels-photo-11053137.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
const PER_PAGE = 6

export default function Actualites() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [news, setNews] = useState<Actualite[] | null>(null)
  const [categories, setCategories] = useState<Categorie[]>([])
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const cat = searchParams.get('cat') ?? 'all'
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)

  useEffect(() => {
    const load = async () => {
      const n = await api.getActualites()
      setNews(n)
    }
    load()
  }, [])

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    if (!news) return null
    return news.filter((a) => {
      if (cat !== 'all') {
        const matchCat = a.categorie && typeof a.categorie === 'object' && 'slug' in a.categorie
          ? (a.categorie as Categorie).slug === cat
          : false
        if (!matchCat) return false
      }
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!a.titre.toLowerCase().includes(q) && !(a.extrait ?? '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [news, cat, query])

  const totalPages = filtered ? Math.max(1, Math.ceil(filtered.length / PER_PAGE)) : 1
  const safePage = Math.min(page, totalPages)
  const paged = filtered ? filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE) : null

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const catColor = (c: Categorie | null) => {
    if (!c) return 'bg-gray-100 text-gray-700'
    const map: Record<string, string> = {
      primary: 'bg-primary-100 text-primary-800',
      accent: 'bg-accent-100 text-accent-600',
      secondary: 'bg-primary-100 text-primary-700',
      error: 'bg-red-100 text-red-700',
    }
    return map[c.couleur] ?? 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      <PageHero
        title="Actualités & événements"
        subtitle="Avancées de la recherche, événements, publications et formations du FOFIFA."
        image={heroImage}
      />
      <Breadcrumb items={[{ label: 'Actualités' }]} />

      <section className="section">
        <div className="container mx-auto px-4">
          {/* Barre recherche + filtres catégories */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setParam('q', e.target.value) }}
                placeholder="Rechercher un article..."
                className="input !pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setParam('cat', 'all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  cat === 'all' ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                }`}
              >
                Toutes
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setParam('cat', c.slug)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    cat === c.slug ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  {c.nom}
                </button>
              ))}
            </div>
          </div>

          {paged === null ? (
            <Loader label="Chargement des actualités..." />
          ) : paged.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg font-semibold">Aucun article trouvé.</p>
              <button type="button" onClick={() => { setQuery(''); setSearchParams(new URLSearchParams()) }} className="btn-secondary mt-4">
                Réinitialiser
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paged.map((a) => {
                  const c = (a.categorie as Categorie | null) ?? null
                  return (
                    <Link
                      key={a.id}
                      to={`/actualites/${a.slug}`}
                      className="card overflow-hidden group flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative h-52 overflow-hidden">
                        {a.image_url ? (
                          <img src={a.image_url} alt={a.titre} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        ) : (
                          <div className="h-full w-full bg-primary-100" />
                        )}
                        {c && <span className={`absolute top-3 left-3 badge ${catColor(c)}`}>{c.nom}</span>}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                          <Calendar className="h-3.5 w-3.5" /> {formatDate(a.date_publication)}
                        </span>
                        <h3 className="text-lg font-bold text-primary-900 leading-snug group-hover:text-primary-700 transition-colors">{a.titre}</h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{a.extrait ?? ''}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-xs text-gray-400">Par {a.auteur}</span>
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
                            Lire <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setParam('page', String(safePage - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setParam('page', String(p))}
                      className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                        p === safePage ? 'bg-primary-800 text-white' : 'border border-gray-200 text-gray-600 hover:bg-primary-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setParam('page', String(safePage + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
