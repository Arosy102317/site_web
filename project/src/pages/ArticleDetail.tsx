import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, User, Tag, Share2, ArrowRight, Facebook, Linkedin, Twitter,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Actualite, Categorie } from '../lib/types'
import Breadcrumb from '../components/Breadcrumb'
import Loader from '../components/Loader'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [article, setArticle] = useState<Actualite | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [similaires, setSimilaires] = useState<Actualite[]>([])

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      setLoading(true)
      const data = await api.getActualiteBySlug(slug)
      if (!data) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setArticle(data)

      const all = await api.getActualites()
      const sim = all.filter(a => a.id !== data.id && a.categorie_id === data.categorie_id).slice(0, 3)
      setSimilaires(sim)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <>
        <div className="pt-28" />
        <Loader label="Chargement de l'article..." />
      </>
    )
  }

  if (notFound || !article) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold text-primary-900">Article introuvable</h1>
        <p className="mt-3 text-gray-600">Cet article n'existe pas ou a été déplacé.</p>
        <Link to="/actualites" className="btn-primary mt-6">Retour aux actualités</Link>
      </div>
    )
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const c = (article.categorie as Categorie | null) ?? null
  const catColor = c
    ? ({
        primary: 'bg-primary-100 text-primary-800',
        accent: 'bg-accent-100 text-accent-600',
        secondary: 'bg-primary-100 text-primary-700',
        error: 'bg-red-100 text-red-700',
      } as Record<string, string>)[c.couleur] ?? 'bg-gray-100 text-gray-700'
    : 'bg-gray-100 text-gray-700'

  const shareUrl = window.location.href
  const shareText = encodeURIComponent(article.titre)

  const renderMarkdown = (md: string) => {
    // Lightweight markdown rendering: headings, paragraphs, lists.
    const lines = md.split('\n')
    const blocks: JSX.Element[] = []
    let listItems: string[] = []
    let key = 0

    const flushList = () => {
      if (listItems.length) {
        blocks.push(
          <ul key={key++} className="list-disc pl-6 my-3 space-y-1.5 text-gray-700">
            {listItems.map((it, i) => <li key={i}>{it}</li>)}
          </ul>,
        )
        listItems = []
      }
    }

    for (const raw of lines) {
      const line = raw.trim()
      if (!line) { flushList(); continue }
      if (line.startsWith('## ')) {
        flushList()
        blocks.push(<h2 key={key++} className="text-2xl font-bold text-primary-900 mt-8 mb-3">{line.slice(3)}</h2>)
      } else if (line.startsWith('# ')) {
        flushList()
        blocks.push(<h1 key={key++} className="text-3xl font-extrabold text-primary-900 mt-8 mb-3">{line.slice(2)}</h1>)
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        listItems.push(line.slice(2))
      } else {
        flushList()
        blocks.push(<p key={key++} className="text-gray-700 leading-relaxed my-3">{line}</p>)
      }
    }
    flushList()
    return blocks
  }

  return (
    <>
      <article>
        {/* Hero image */}
        <section className="relative pt-24">
          <div className="relative h-[360px] md:h-[440px] overflow-hidden">
            {article.image_url ? (
              <img src={article.image_url} alt={article.titre} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-primary-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent" />
            <div className="container mx-auto px-4 absolute inset-x-0 bottom-0 pb-8">
              <div className="max-w-3xl">
                {c && <span className={`badge ${catColor} mb-3`}>{c.nom}</span>}
                <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{article.titre}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-primary-100">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(article.date_publication)}</span>
                  <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {article.auteur}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Breadcrumb items={[{ label: 'Actualités', to: '/actualites' }, { label: article.titre }]} />

        <section className="section pt-8">
          <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_280px] gap-10">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed font-medium border-l-4 border-primary-600 pl-4 italic">
                {article.extrait}
              </p>
              <div className="mt-6 prose max-w-none">{renderMarkdown(article.contenu ?? '')}</div>

              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-400" />
                  {article.tags.map((t) => (
                    <span key={t} className="badge bg-gray-100 text-gray-600">#{t}</span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700"><Share2 className="h-4 w-4" /> Partager</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer noopener" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-800 hover:bg-primary-800 hover:text-white transition-colors" aria-label="Partager sur Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer noopener" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-800 hover:bg-primary-800 hover:text-white transition-colors" aria-label="Partager sur LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer noopener" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-800 hover:bg-primary-800 hover:text-white transition-colors" aria-label="Partager sur Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>

              <Link to="/actualites" className="btn-secondary mt-10">
                <ArrowLeft className="h-4 w-4" /> Retour aux actualités
              </Link>
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card p-5">
                <p className="text-xs text-gray-400">{article.lu ?? 0} vues</p>
                <p className="mt-2 text-sm text-gray-600">Publié le {formatDate(article.date_publication)}</p>
                <p className="text-sm text-gray-600 mt-1">Par <span className="font-semibold text-gray-800">{article.auteur}</span></p>
              </div>

              {similaires.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-primary-900 mb-3">Articles similaires</h3>
                  <div className="space-y-3">
                    {similaires.map((s) => (
                      <Link key={s.id} to={`/actualites/${s.slug}`} className="card p-3 flex gap-3 group">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                          {s.image_url ? (
                            <img src={s.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="h-full w-full bg-primary-100" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">{s.titre}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(s.date_publication)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>
      </article>
    </>
  )
}
