import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

type Crumb = { label: string; to?: string }

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="container mx-auto px-4 pt-28 pb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <li>
          <Link to="/" className="hover:text-primary-800 transition-colors">Accueil</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.to ? (
              <Link to={item.to} className="hover:text-primary-800 transition-colors">{item.label}</Link>
            ) : (
              <span className="text-primary-800 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
