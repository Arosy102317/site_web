import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTopButton from './components/ScrollToTopButton'
import ScrollToTopOnRouteChange from './components/ScrollToTopOnRouteChange'
import Home from './pages/Home'
import Structure from './pages/Structure'
import Recherches from './pages/Recherches'
import ProjetDetail from './pages/ProjetDetail'
import Actualites from './pages/Actualites'
import ArticleDetail from './pages/ArticleDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <ScrollToTopOnRouteChange />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/structure" element={<Structure />} />
          <Route path="/recherches" element={<Recherches />} />
          <Route path="/recherches/:slug" element={<ProjetDetail />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/actualites/:slug" element={<ArticleDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
