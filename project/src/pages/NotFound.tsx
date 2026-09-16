import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 text-center">
      <p className="text-8xl font-extrabold text-primary-800">404</p>
      <h1 className="mt-4 text-2xl font-bold text-primary-900">Page introuvable</h1>
      <p className="mt-3 text-gray-600 max-w-md mx-auto">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary"><Home className="h-4 w-4" /> Accueil</Link>
        <Link to="/actualites" className="btn-secondary"><ArrowLeft className="h-4 w-4" /> Voir les actualités</Link>
      </div>
    </div>
  )
}
