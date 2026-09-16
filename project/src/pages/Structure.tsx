import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf, Wheat, Fish, TreePine, Globe, Users, FlaskConical,
  Mail, Phone, MapPin, User, Building2, Network,
} from 'lucide-react'
import * as Icons from 'lucide-react'
import { api } from '../lib/api'
import type { Departement, Chercheur, CentreRegional } from '../lib/types'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'
import Loader from '../components/Loader'
import { useReveal } from '../hooks/useReveal'

const heroImage = 'https://images.pexels.com/photos/11627650/pexels-photo-11627650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

export default function Structure() {
  const [departements, setDepartements] = useState<Departement[] | null>(null)
  const [chercheurs, setChercheurs] = useState<Chercheur[] | null>(null)
  const [centres, setCentres] = useState<CentreRegional[] | null>(null)
  const [activeDept, setActiveDept] = useState<string | null>(null)
  const reveal = useReveal<HTMLDivElement>()

  useEffect(() => {
    const load = async () => {
      const [d, c, centresRes] = await Promise.all([
        api.getDepartements(),
        api.getChercheurs(),
        api.getCentresRegionaux(),
      ])
      setDepartements(d)
      setChercheurs(c)
      setCentres(centresRes)
    }
    load()
  }, [])

  const getIcon = (name: string) => {
    const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
    return IconComp ?? Leaf
  }

  const chercheursByDept = (deptId: string) =>
    chercheurs?.filter((c) => c.departement_id === deptId) ?? []

  return (
    <>
      <PageHero
        title="Structure & organisation"
        subtitle="Départements, chercheurs et centres régionaux qui composent le FOFIFA."
        image={heroImage}
      />
      <Breadcrumb items={[{ label: 'Structure' }]} />

      {/* ORGANIGRAMME */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Organisation</span>
            <h2 className="section-title">Organigramme institutionnel</h2>
            <p className="section-subtitle mx-auto">
              Une direction générale articulée autour de six départements de recherche et d'un maillage régional.
            </p>
          </div>

          <div className="max-w-4xl mx-auto" ref={reveal.ref}>
            {/* Direction */}
            <div className="flex justify-center">
              <div className="bg-primary-800 text-white rounded-2xl px-8 py-6 text-center shadow-lg w-full max-w-md">
                <Network className="h-8 w-8 mx-auto mb-2 text-primary-200" />
                <h3 className="text-xl font-bold">Direction Générale</h3>
                <p className="text-primary-100 text-sm mt-1">Dr. Rakotoarimanana</p>
                <p className="text-primary-200 text-xs mt-1">Siège national — Antananarivo</p>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <div className="w-px h-10 bg-primary-200" />
            </div>

            {/* Conseil scientifique + admin */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                <h4 className="font-bold text-primary-900">Conseil Scientifique</h4>
                <p className="text-xs text-gray-500 mt-1">Orientation et évaluation des programmes</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm">
                <h4 className="font-bold text-primary-900">Direction Administrative & Financière</h4>
                <p className="text-xs text-gray-500 mt-1">Gestion des ressources et des partenariats</p>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <div className="w-px h-10 bg-primary-200" />
            </div>

            {/* Departements */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departements?.map((d) => {
                const Icon = getIcon(d.icon_name)
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setActiveDept(d.id)
                      document.getElementById('departements')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`rounded-xl p-4 text-left border transition-all ${
                      activeDept === d.id
                        ? 'bg-primary-50 border-primary-400 shadow-md'
                        : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-800 mb-2">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="font-bold text-primary-900 text-sm leading-tight">{d.nom}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.responsable}</p>
                  </button>
                )
              }) ?? <Loader />}
            </div>
          </div>
        </div>
      </section>

      {/* DEPARTEMENTS DETAIL */}
      <section id="departements" className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Départements</span>
            <h2 className="section-title">Nos six départements de recherche</h2>
            <p className="section-subtitle mx-auto">
              Chaque département conduit des programmes spécifiques avec ses chercheurs et ses terrains.
            </p>
          </div>

          {departements === null ? (
            <Loader />
          ) : (
            <div className="space-y-6">
              {departements.map((d) => {
                const Icon = getIcon(d.icon_name)
                const isActive = activeDept === d.id
                return (
                  <div
                    key={d.id}
                    className={`card overflow-hidden transition-all ${
                      isActive ? 'ring-2 ring-primary-400' : ''
                    }`}
                  >
                    <div className="grid md:grid-cols-3 gap-0">
                      <div className="bg-primary-800 text-white p-6 md:p-8">
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary-700 mb-4">
                          <Icon className="h-7 w-7" />
                        </span>
                        <h3 className="text-xl font-bold leading-tight">{d.nom}</h3>
                        <p className="text-primary-200 text-sm mt-2 italic">{d.mission}</p>
                        <div className="mt-5 space-y-2 text-sm text-primary-100">
                          <p className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary-300" /> {d.responsable}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary-300" /> {d.email}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary-300" /> {d.telephone}
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-2 p-6 md:p-8">
                        <h4 className="font-bold text-primary-900 mb-2">Présentation</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">{d.description}</p>

                        {chercheurs && chercheursByDept(d.id).length > 0 && (
                          <>
                            <h4 className="font-bold text-primary-900 mt-6 mb-3">Équipe de recherche</h4>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {chercheursByDept(d.id).map((c) => (
                                <div key={c.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-800 shrink-0">
                                    <User className="h-5 w-5" />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm leading-tight">{c.nom}</p>
                                    <p className="text-xs text-gray-500">{c.fonction}</p>
                                    <p className="text-xs text-primary-700 mt-0.5">{c.specialite}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CENTRES REGIONAUX */}
      <section className="section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="badge bg-primary-100 text-primary-800 mb-4">Maillage territorial</span>
            <h2 className="section-title">Centres régionaux</h2>
            <p className="section-subtitle mx-auto">
              Un réseau de centres au plus près des terrains de recherche à travers Madagascar.
            </p>
          </div>

          {centres === null ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centres.map((c) => (
                <div key={c.id} className="card p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-800 mb-4">
                    <Building2 className="h-6 w-6" />
                  </span>
                  <h3 className="font-bold text-primary-900 leading-tight">{c.nom}</h3>
                  <p className="text-xs text-accent-600 font-semibold mt-1">{c.region}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p className="flex items-start gap-2"><MapPin className="h-4 w-4 text-primary-600 shrink-0 mt-0.5" /> {c.adresse}, {c.ville}</p>
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-600" /> {c.telephone}</p>
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-600" /> {c.email}</p>
                    <p className="flex items-center gap-2"><User className="h-4 w-4 text-primary-600" /> {c.responsable}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white">Une question sur nos départements ?</h3>
          <p className="mt-2 text-primary-100">Notre équipe est à votre écoute.</p>
          <Link to="/contact" className="btn-accent mt-6">Contactez-nous</Link>
        </div>
      </section>
    </>
  )
}
