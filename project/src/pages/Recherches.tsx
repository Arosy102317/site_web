import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search, SlidersHorizontal, BookOpen, FileText, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { api } from '../lib/api'
import type { Projet, Publication } from '../lib/types'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import Loader from '../components/Loader'
import { useReveal } from '../hooks/useReveal'

const heroImage = 'https://images.pexels.com/photos/11053137/pexels-photo-11053137.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

const domaines = ['Tous', 'Agronomie', 'Zootechnie', 'Foresterie', 'Environnement', 'Sciences sociales', 'Technologie alimentaire']
const statuts = ['Tous', 'En cours', 'Terminé']

export default function Recherches() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projets, setProjets] = useState<Projet[] | null>(null)
  const [publications, setPublications] = useState<Publication[] | null>(null)
  const [tab, setTab] = useState<'projets' | 'publications'>('projets')
  const [query, setQuery] = useState('')
  const reveal = useReveal<HTMLDivElement>()

  const domaine = searchParams.get('domaine') ?? 'Tous'
  const statut = searchParams.get('statut') ?? 'Tous'

  useEffect(() => {
    const load = async () => {
      const [p, pubs] = await Promise.all([
        api.getProjets(),
        api.getPublications(),
      ])
      setProjets(p)
      setPublications(pubs)
    }
    load()
  }, [])

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'Tous' || !value) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  const filteredProjets = useMemo(() => {
    if (!projets) return null
    return projets.filter((p) => {
      if (domaine !== 'Tous' && p.domaine !== domaine) return false
      if (statut !== 'Tous' && p.statut !== statut) return false
      if (query.trim()) {
        const q = query.toLowerCase()
        if (!p.titre.toLowerCase().includes(q) && !(p.resume ?? '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [projets, domaine, statut, query])

  return (
    <>
      <PageHero
        title="Programmes de recherche"
        subtitle="Du laboratoire au terrain, nos projets répondent aux enjeux du monde rural malgache."
        image={heroImage}
      />
      <Breadcrumb items={[{ label: 'Recherches' }]} />

      {/* FILTRES + LISTE */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar filtres */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card p-5">
                <h3 className="flex items-center gap-2 font-bold text-primary-900 mb-4">
                  <SlidersHorizontal className="h-5 w-5" /> Filtres
                </h3>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recherche</label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Mots-clés..."
                      className="input !py-2 !pl-9 text-sm"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Domaine</label>
                  <div className="mt-2 flex flex-col gap-1">
                    {domaines.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFilter('domaine', d)}
                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          domaine === d
                            ? 'bg-primary-800 text-white font-semibold'
                            : 'text-gray-700 hover:bg-primary-50'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</label>
                  <div className="mt-2 flex gap-2">
                    {statuts.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFilter('statut', s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          statut === s
                            ? 'bg-primary-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Liste projets */}
            <div ref={reveal.ref}>
              {filteredProjets === null ? (
                <Loader label="Chargement des projets..." />
              ) : filteredProjets.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg font-semibold">Aucun projet ne correspond à votre recherche.</p>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setSearchParams(new URLSearchParams()) }}
                    className="btn-secondary mt-4"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    {filteredProjets.length} projet{filteredProjets.length > 1 ? 's' : ''} trouvé{filteredProjets.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {filteredProjets.map((p) => (
                      <Link
                        key={p.id}
                        to={`/recherches/${p.slug}`}
                        className="card overflow-hidden group flex flex-col hover:-translate-y-1"
                      >
                        <div className="relative h-44 overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.titre} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                          ) : (
                            <div className="h-full w-full bg-primary-100" />
                          )}
                          <span className="absolute top-3 left-3 badge bg-white/90 text-primary-900">{p.domaine}</span>
                          <span className={`absolute top-3 right-3 badge ${p.statut === 'En cours' ? 'bg-accent-500 text-white' : 'bg-primary-700 text-white'}`}>
                            {p.statut === 'En cours' ? <><Clock className="h-3 w-3 mr-1" /> En cours</> : <><CheckCircle2 className="h-3 w-3 mr-1" /> Terminé</>}
                          </span>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-primary-900 leading-snug group-hover:text-primary-700 transition-colors">{p.titre}</h3>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{p.resume ?? ''}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
                            Voir la fiche <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <section id="publications" className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Production scientifique</span>
            <h2 className="section-title">Publications & rapports</h2>
            <p className="section-subtitle mx-auto">
              Articles, guides techniques et rapports issus de nos programmes de recherche.
            </p>
          </div>

          {publications === null ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <div key={pub.id} className="card p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-800 shrink-0">
                      {pub.type === 'Article scientifique' ? <FileText className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </span>
                    <span className="badge bg-primary-50 text-primary-800">{pub.type}</span>
                  </div>
                  <h3 className="font-bold text-primary-900 leading-snug">{pub.titre}</h3>
                  <p className="mt-2 text-xs text-gray-500">{pub.auteurs} · {pub.annee}</p>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3 flex-1">{pub.resume}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {pub.annee}</span>
                    {pub.fichier_url ? (
                      <a href={pub.fichier_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">
                        Télécharger <FileText className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Sur demande</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
