import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, User, Building2, Banknote, Target, CheckCircle2, Clock,
  FileText, BookOpen, ArrowRight,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Projet, Publication } from '../lib/types'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import Loader from '../components/Loader'

export default function ProjetDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [projet, setProjet] = useState<Projet | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [publications, setPublications] = useState<Publication[]>([])

  useEffect(() => {
    if (!slug) return
    const load = async () => {
      setLoading(true)
      const data = await api.getProjetBySlug(slug)
      if (!data) {
        setNotFound(true)
        setLoading(false)
        return
      }
      setProjet(data)
      const allPubs = await api.getPublications()
      const pubs = allPubs.filter(p => p.projet_id === data.id)
      setPublications(pubs)
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <>
        <div className="pt-28" />
        <Loader label="Chargement du projet..." />
      </>
    )
  }

  if (notFound || !projet) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-20 text-center">
        <h1 className="text-3xl font-bold text-primary-900">Projet introuvable</h1>
        <p className="mt-3 text-gray-600">Ce projet de recherche n'existe pas ou a été déplacé.</p>
        <Link to="/recherches" className="btn-primary mt-6">Retour aux recherches</Link>
      </div>
    )
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '—'

  return (
    <>
      <PageHero title={projet.titre} subtitle={projet.resume} image={projet.image_url ?? 'https://images.pexels.com/photos/35174688/pexels-photo-35174688.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'} />
      <Breadcrumb items={[{ label: 'Recherches', to: '/recherches' }, { label: projet.titre }]} />

      <section className="section">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_300px] gap-10">
          {/* Contenu */}
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="badge bg-primary-100 text-primary-800">{projet.domaine}</span>
              <span className={`badge ${projet.statut === 'En cours' ? 'bg-accent-100 text-accent-600' : 'bg-primary-100 text-primary-800'}`}>
                {projet.statut === 'En cours' ? <><Clock className="h-3 w-3 mr-1" /> En cours</> : <><CheckCircle2 className="h-3 w-3 mr-1" /> Terminé</>}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mb-4">Présentation du projet</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{projet.description}</p>

            {projet.impact && (
              <div className="mt-8 rounded-2xl bg-primary-50 border border-primary-100 p-6">
                <h3 className="flex items-center gap-2 font-bold text-primary-900 mb-2">
                  <Target className="h-5 w-5" /> Impacts & résultats
                </h3>
                <p className="text-gray-700 leading-relaxed">{projet.impact}</p>
              </div>
            )}

            {publications.length > 0 && (
              <div className="mt-10">
                <h3 className="text-xl font-bold text-primary-900 mb-4">Publications associées</h3>
                <div className="space-y-3">
                  {publications.map((pub) => (
                    <div key={pub.id} className="card p-5 flex items-start gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-800 shrink-0">
                        {pub.type === 'Article scientifique' ? <FileText className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 leading-tight">{pub.titre}</p>
                        <p className="text-xs text-gray-500 mt-1">{pub.auteurs} · {pub.annee} · {pub.type}</p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pub.resume}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link to="/recherches" className="btn-secondary mt-10">
              <ArrowLeft className="h-4 w-4" /> Retour aux recherches
            </Link>
          </div>

          {/* Sidebar infos */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6">
              <h3 className="font-bold text-primary-900 mb-4">Informations</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold tracking-wide"><Calendar className="h-4 w-4" /> Période</dt>
                  <dd className="text-gray-800 mt-1">{formatDate(projet.date_debut ?? null)} — {formatDate(projet.date_fin ?? null)}</dd>
                </div>
                {projet.responsable && (
                  <div>
                    <dt className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold tracking-wide"><User className="h-4 w-4" /> Responsable</dt>
                    <dd className="text-gray-800 mt-1">{projet.responsable}</dd>
                  </div>
                )}
                {projet.bailleur && (
                  <div>
                    <dt className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold tracking-wide"><Building2 className="h-4 w-4" /> Bailleur</dt>
                    <dd className="text-gray-800 mt-1">{projet.bailleur}</dd>
                  </div>
                )}
                {projet.budget && (
                  <div>
                    <dt className="flex items-center gap-2 text-gray-500 text-xs uppercase font-semibold tracking-wide"><Banknote className="h-4 w-4" /> Budget</dt>
                    <dd className="text-gray-800 mt-1">{projet.budget}</dd>
                  </div>
                )}
              </dl>
              <Link to="/contact" className="btn-primary w-full mt-6 !py-2.5 text-sm">
                Contacter l'équipe <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
