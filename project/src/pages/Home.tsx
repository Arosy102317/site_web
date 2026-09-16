import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Leaf, Fish, TreePine, Globe, Users, FlaskConical,
  Sprout, BookOpen, Calendar, MapPin, Award, TrendingUp, Microscope,
} from 'lucide-react'
import { api } from '../lib/api'
import type { Actualite, Partenaire, Projet } from '../lib/types'
import { useReveal } from '../hooks/useReveal'
import { useCountUp } from '../hooks/useCountUp'
import Loader from '../components/Loader'

const heroImage = 'https://images.pexels.com/photos/33620444/pexels-photo-33620444.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

const domaines = [
  { icon: Sprout, nom: 'Agronomie', desc: 'Cultures vivrières et de rente, variétés résilientes, irrigation.', to: '/recherches?domaine=Agronomie' },
  { icon: Fish, nom: 'Élevage & Zootechnie', desc: 'Zébu, petit bétail, volaille et aquaculture paysanne.', to: '/recherches?domaine=Zootechnie' },
  { icon: TreePine, nom: 'Foresterie', desc: 'Reboisement, agroforesterie et biodiversité endémique.', to: '/recherches?domaine=Foresterie' },
  { icon: Globe, nom: 'Environnement', desc: 'Changement climatique, sols et bassins versants.', to: '/recherches?domaine=Environnement' },
  { icon: Users, nom: 'Sciences sociales', desc: 'Filières, marchés ruraux et sécurité alimentaire.', to: '/recherches?domaine=Sciences%20sociales' },
  { icon: FlaskConical, nom: 'Technologie alimentaire', desc: 'Transformation post-récolte et valorisation locale.', to: '/recherches?domaine=Technologie%20alimentaire' },
]

function Stat({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(end)
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-extrabold text-white">
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm md:text-base text-primary-100">{label}</p>
    </div>
  )
}

export default function Home() {
  const [news, setNews] = useState<Actualite[] | null>(null)
  const [projets, setProjets] = useState<Projet[] | null>(null)
  const [partenaires, setPartenaires] = useState<Partenaire[] | null>(null)
  const reveal = useReveal<HTMLDivElement>()

  useEffect(() => {
    const load = async () => {
      const [n, p, part] = await Promise.all([
        api.getActualites(3),
        api.getProjets(),
        api.getPartenaires(),
      ])
      setNews(n)
      setProjets(p.slice(0, 3))
      setPartenaires(part)
    }
    load()
  }, [])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      {/* HERO */}
      <section className="relative pt-16">
        <div className="relative min-h-[640px] flex items-center overflow-hidden">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/30" />
          <div className="container mx-auto px-4 relative z-10 py-20">
            <div className="max-w-2xl animate-fade-in-up">
              <span className="badge bg-primary-700/40 text-primary-100 border border-primary-300/30 mb-5">
                <Leaf className="h-3.5 w-3.5 mr-1.5" /> Centre National de Recherche
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1]">
                La recherche agronomique au service du développement rural de Madagascar
              </h1>
              <p className="mt-6 text-lg md:text-xl text-primary-100 leading-relaxed max-w-xl">
                Le FOFIFA conduit des recherches appliquées en agriculture, élevage, foresterie et
                environnement pour améliorer la sécurité alimentaire et promouvoir un développement durable.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/recherches" className="btn-accent">
                  Découvrir nos recherches <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/structure" className="btn-secondary !bg-white/10 !text-white !border-white/40 hover:!bg-white/20">
                  Notre structure
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-primary-800 -mt-1">
          <div className="container mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat end={40} suffix="+" label="Années de recherche" />
            <Stat end={120} suffix="+" label="Chercheurs & techniciens" />
            <Stat end={6} label="Centres régionaux" />
            <Stat end={300} suffix="+" label="Publications scientifiques" />
          </div>
        </div>
      </section>

      {/* PRESENTATION */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div
            ref={reveal.ref}
            className={`reveal ${reveal.visible ? 'is-visible' : ''}`}
          >
            <span className="badge bg-primary-100 text-primary-800 mb-4">À propos du FOFIFA</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 leading-tight">
              Une institution nationale dédiée à la recherche appliquée
            </h2>
            <p className="mt-5 text-gray-600 leading-relaxed">
              Le FOFIFA — Centre National de la Recherche Appliquée au Développement Rural — est
              l'institution malgache de référence pour la recherche agronomique. Depuis quatre
              décennies, il produit des connaissances et des innovations au service des paysans,
              des éleveurs, des décideurs et des partenaires du développement.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Ses travaux couvrent l'agronomie, l'élevage, la foresterie, l'environnement, les
              sciences sociales et la technologie alimentaire, avec un maillage de centres régionaux
              au plus près des terrains.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Microscope className="h-6 w-6 text-primary-700 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Recherche appliquée et participative</p>
              </div>
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-primary-700 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Partenariats nationaux & internationaux</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-primary-700 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Impact mesurable sur le terrain</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-primary-700 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">6 centres régionaux actifs</p>
              </div>
            </div>
            <Link to="/structure" className="btn-primary mt-8">
              En savoir plus sur notre structure <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3912520/pexels-photo-3912520.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Chercheur au laboratoire"
              className="rounded-2xl shadow-xl w-full h-[420px] object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -left-6 hidden md:block bg-white rounded-xl shadow-lg p-5 max-w-xs border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                  <BookOpen className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-primary-900">300+ publications</p>
                  <p className="text-xs text-gray-500">Diffusées en libre accès</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINES */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Nos domaines</span>
            <h2 className="section-title">Six domaines de recherche au service du rural</h2>
            <p className="section-subtitle mx-auto">
              Du laboratoire au terrain, nos départements couvrent l'ensemble des enjeux du
              développement rural malgache.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domaines.map((d) => (
              <Link
                key={d.nom}
                to={d.to}
                className="card p-7 group hover:-translate-y-1"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-800 group-hover:bg-primary-800 group-hover:text-white transition-colors">
                  <d.icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-primary-900">{d.nom}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{d.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
                  Explorer <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROJETS PHARES */}
      <section className="section bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="badge bg-primary-700/60 text-primary-100 border border-primary-600/40 mb-4">
                Recherches en cours
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Projets phares</h2>
              <p className="mt-4 text-primary-100 max-w-xl">
                Un aperçu de nos programmes de recherche actuels, du riz d'altitude à l'agroforesterie.
              </p>
            </div>
            <Link to="/recherches" className="btn-accent shrink-0">
              Tous les projets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {projets === null ? (
            <Loader label="Chargement des projets..." />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {projets.map((p) => (
                <Link
                  key={p.id}
                  to={`/recherches/${p.slug}`}
                  className="group rounded-2xl overflow-hidden bg-primary-800/40 border border-primary-700/40 hover:bg-primary-800/70 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.titre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary-700" />
                    )}
                    <span className="absolute top-3 left-3 badge bg-white/90 text-primary-900">
                      {p.domaine}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className={`badge ${
                      p.statut === 'En cours' ? 'bg-accent-500/20 text-accent-400' : 'bg-primary-600/40 text-primary-100'
                    }`}>
                      {p.statut}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-white leading-snug group-hover:text-accent-400 transition-colors">
                      {p.titre}
                    </h3>
                    <p className="mt-2 text-sm text-primary-200 line-clamp-2">{p.resume}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ACTUALITES */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="badge bg-primary-100 text-primary-800 mb-4">Actualités</span>
              <h2 className="section-title">Dernières actualités</h2>
              <p className="section-subtitle">
                Suivez les avancées, événements et publications du FOFIFA.
              </p>
            </div>
            <Link to="/actualites" className="btn-secondary shrink-0">
              Toutes les actualités <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {news === null ? (
            <Loader label="Chargement des actualités..." />
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {news.map((a) => (
                <Link
                  key={a.id}
                  to={`/actualites/${a.slug}`}
                  className="card overflow-hidden group flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt={a.titre}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary-100" />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 badge bg-white/90 text-primary-900">
                      <Calendar className="h-3 w-3" /> {formatDate(a.date_publication)}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-primary-900 leading-snug group-hover:text-primary-700 transition-colors">
                      {a.titre}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{a.extrait}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 group-hover:gap-2.5 transition-all">
                      Lire l'article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Nos partenaires</span>
            <h2 className="section-title">Ils nous font confiance</h2>
            <p className="section-subtitle mx-auto">
              Ministères, instituts de recherche, bailleurs et coopérations internationales.
            </p>
          </div>
          {partenaires === null ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {partenaires.map((p) => (
                <a
                  key={p.id}
                  href={p.site_web ?? '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="card p-5 flex flex-col items-center justify-center text-center group"
                  title={p.nom}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-800 group-hover:bg-primary-800 group-hover:text-white transition-colors">
                    <Award className="h-7 w-7" />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-primary-800 transition-colors leading-tight">
                    {p.nom}
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">{p.type}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/33620447/pexels-photo-33620447.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-primary-900/90" />
        <div className="container mx-auto px-4 relative z-10 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-2xl mx-auto leading-tight">
            Vous êtes chercheur, partenaire ou étudiant ?
          </h2>
          <p className="mt-4 text-primary-100 max-w-xl mx-auto">
            Collaborons sur des projets de recherche, accédez à nos publications ou rejoignez nos équipes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-accent">
              Nous contacter <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/recherches" className="btn-secondary !bg-white/10 !text-white !border-white/40 hover:!bg-white/20">
              Voir les recherches
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
