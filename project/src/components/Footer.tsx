import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, Facebook, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-50 mt-16">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white">
                <Leaf className="h-6 w-6" />
              </span>
              <div className="leading-tight">
                <p className="text-xl font-extrabold text-white">FOFIFA</p>
                <p className="text-xs text-primary-200">Centre National de Recherche</p>
              </div>
            </div>
            <p className="text-sm text-primary-100 leading-relaxed">
              Le Centre National de la Recherche Appliquée au Développement Rural conduit des
              recherches au service de l'agriculture, de l'élevage, de la foresterie et du
              développement durable à Madagascar.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Youtube" className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800 hover:bg-primary-700 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens utiles</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/structure" className="text-primary-100 hover:text-white transition-colors">Structure & départements</Link></li>
              <li><Link to="/recherches" className="text-primary-100 hover:text-white transition-colors">Programmes de recherche</Link></li>
              <li><Link to="/actualites" className="text-primary-100 hover:text-white transition-colors">Actualités & événements</Link></li>
              <li><Link to="/recherches#publications" className="text-primary-100 hover:text-white transition-colors">Publications scientifiques</Link></li>
              <li><Link to="/contact" className="text-primary-100 hover:text-white transition-colors">Contact & coordonnées</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Domaines de recherche</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/recherches?domaine=Agronomie" className="text-primary-100 hover:text-white transition-colors">Agronomie</Link></li>
              <li><Link to="/recherches?domaine=Zootechnie" className="text-primary-100 hover:text-white transition-colors">Élevage & zootechnie</Link></li>
              <li><Link to="/recherches?domaine=Foresterie" className="text-primary-100 hover:text-white transition-colors">Foresterie</Link></li>
              <li><Link to="/recherches?domaine=Environnement" className="text-primary-100 hover:text-white transition-colors">Environnement & climat</Link></li>
              <li><Link to="/recherches?domaine=Sciences sociales" className="text-primary-100 hover:text-white transition-colors">Sciences sociales</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-300 shrink-0 mt-0.5" />
                <span>Lot AVB 77, Antananarivo 101, Madagascar</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary-300 shrink-0" />
                <span>+261 20 22 401 10</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary-300 shrink-0" />
                <a href="mailto:contact@fofifa.mg" className="hover:text-white transition-colors">contact@fofifa.mg</a>
              </li>
            </ul>
            <div className="mt-5 rounded-lg bg-primary-800/60 p-3 text-xs text-primary-200">
              <p className="font-semibold text-primary-100 mb-1">Horaires</p>
              Lun – Ven : 08h00 – 16h30<br />
              Sam : 08h00 – 12h00
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-primary-300">
          <p>© {new Date().getFullYear()} FOFIFA — Centre National de la Recherche Appliquée au Développement Rural. Tous droits réservés.</p>
          <p>Recherche au service du développement rural malgache.</p>
        </div>
      </div>
    </footer>
  )
}
