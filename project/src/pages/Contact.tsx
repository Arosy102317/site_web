import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import Breadcrumb from '../components/Breadcrumb'
import PageHero from '../components/PageHero'

const heroImage = 'https://images.pexels.com/photos/24782349/pexels-photo-24782349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nom.trim()) e.nom = 'Veuillez indiquer votre nom.'
    if (!form.email.trim()) e.email = 'Veuillez indiquer votre email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Adresse email invalide.'
    if (!form.sujet.trim()) e.sujet = 'Veuillez indiquer un sujet.'
    if (!form.message.trim()) e.message = 'Veuillez écrire votre message.'
    else if (form.message.trim().length < 10) e.message = 'Votre message est trop court (10 caractères min.).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    const res = await api.sendMessage({
      nom: form.nom.trim(),
      email: form.email.trim(),
      sujet: form.sujet.trim(),
      message: form.message.trim(),
    })
    if (!res.success) {
      setStatus('error')
      return
    }
    setStatus('success')
    setForm({ nom: '', email: '', sujet: '', message: '' })
  }

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n })
  }

  return (
    <>
      <PageHero
        title="Contactez-nous"
        subtitle="Une question, une proposition de partenariat ou une demande d'information ? Écrivez-nous."
        image={heroImage}
      />
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <section className="section">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          {/* INFOS */}
          <div>
            <h2 className="text-2xl font-bold text-primary-900 mb-6">Nos coordonnées</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-800 shrink-0">
                  <MapPin className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">Adresse</h3>
                  <p className="text-gray-600 text-sm mt-1">Lot AVB 77, Antananarivo 101, Madagascar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-800 shrink-0">
                  <Phone className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">Téléphone</h3>
                  <p className="text-gray-600 text-sm mt-1">+261 20 22 401 10</p>
                  <p className="text-gray-600 text-sm">+261 20 22 401 11</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-800 shrink-0">
                  <Mail className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">Email</h3>
                  <a href="mailto:contact@fofifa.mg" className="text-primary-700 hover:text-primary-900 text-sm mt-1 block">contact@fofifa.mg</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-800 shrink-0">
                  <Clock className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-800">Horaires d'ouverture</h3>
                  <p className="text-gray-600 text-sm mt-1">Lundi – Vendredi : 08h00 – 16h30</p>
                  <p className="text-gray-600 text-sm">Samedi : 08h00 – 12h00</p>
                </div>
              </div>
            </div>

            {/* CARTE */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <iframe
                title="Carte FOFIFA Antananarivo"
                src="https://www.openstreetmap.org/export/embed.html?bbox=47.52%2C-18.92%2C47.56%2C-18.90&layer=mapnik&marker=-18.9137%2C47.5361"
                className="w-full h-[300px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* FORMULAIRE */}
          <div>
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-2">Envoyer un message</h2>
              <p className="text-gray-600 text-sm mb-6">Remplissez ce formulaire, nous vous répondrons sous 48h.</p>

              {status === 'success' && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-primary-50 border border-primary-200 p-4 animate-fade-in">
                  <CheckCircle2 className="h-6 w-6 text-primary-700 shrink-0" />
                  <div>
                    <p className="font-semibold text-primary-900">Message envoyé avec succès !</p>
                    <p className="text-sm text-primary-700 mt-0.5">Nous vous répondrons dans les meilleurs délais.</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
                  <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Une erreur est survenue.</p>
                    <p className="text-sm text-red-700 mt-0.5">Veuillez réessayer ou nous écrire directement par email.</p>
                  </div>
                </div>
              )}

              <form onSubmit={onSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet *</label>
                  <input
                    id="nom"
                    type="text"
                    value={form.nom}
                    onChange={update('nom')}
                    className={`input ${errors.nom ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                    placeholder="Votre nom"
                    aria-invalid={!!errors.nom}
                  />
                  {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    className={`input ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                    placeholder="vous@exemple.com"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="sujet" className="block text-sm font-semibold text-gray-700 mb-1.5">Sujet *</label>
                  <input
                    id="sujet"
                    type="text"
                    value={form.sujet}
                    onChange={update('sujet')}
                    className={`input ${errors.sujet ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                    placeholder="Objet de votre message"
                    aria-invalid={!!errors.sujet}
                  />
                  {errors.sujet && <p className="mt-1 text-xs text-red-600">{errors.sujet}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    className={`input resize-none ${errors.message ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                    placeholder="Votre message..."
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <>Envoyer le message <Send className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
