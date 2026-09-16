import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Search, Leaf } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/structure', label: 'Structure' },
  { to: '/recherches', label: 'Recherches' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.location.href = `/actualites?q=${encodeURIComponent(query.trim())}`
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-white/80 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-800 text-white shadow-sm">
              <Leaf className="h-6 w-6" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold text-primary-900">FOFIFA</span>
              <span className="text-[11px] text-gray-500 hidden sm:block">
                Recherche & Développement Rural
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-800 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-800 hover:bg-primary-50/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setSearchOpen((s) => !s)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/contact" className="hidden sm:inline-flex btn-primary !py-2 !px-4 text-sm">
              Nous contacter
            </Link>
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-primary-50"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form
            onSubmit={onSearchSubmit}
            className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 animate-fade-in"
          >
            <Search className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher dans les actualités..."
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
            />
            <button type="submit" className="btn-primary !py-1.5 !px-3 text-sm">
              OK
            </button>
          </form>
        )}

        {mobileOpen && (
          <nav className="lg:hidden mt-3 flex flex-col gap-1 border-t border-gray-100 pt-3 animate-fade-in">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? 'text-primary-800 bg-primary-50'
                      : 'text-gray-700 hover:bg-primary-50/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
