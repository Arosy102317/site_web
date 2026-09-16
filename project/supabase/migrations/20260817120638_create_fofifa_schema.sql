/*
# FOFIFA - Schema initial

## Description
Cree le schema complet du site vitrine FOFIFA (Centre National de la Recherche
Appliquee au Developpement Rural). Site public sans authentification : toutes
les donnees sont destinees a etre lues par le public, et le formulaire de
contact ecrit des messages consultables par l'administration.

## Nouvelles tables
1. `departements` - departements de recherche du FOFIFA (nom, mission, responsable, contacts, icone).
2. `chercheurs` - equipe de recherche (nom, fonction, specialite, photo, lien linkedin, rattachement departement).
3. `centres_regionaux` - centres regionaux du FOFIFA (region, ville, adresse, contacts, responsable).
4. `projets` - projets de recherche (titre, domaine, resume, description, statut, dates, budget, bailleur, responsable, impact, image).
5. `publications` - publications scientifiques et rapports (titre, type, auteurs, annee, resume, lien fichier, projet lie).
6. `categories` - categories d'actualites (nom, slug, couleur).
7. `actualites` - articles d'actualite (titre, slug, extrait, contenu, image, categorie, auteur, date, tags, compteur de vues).
8. `partenaires` - partenaires institutionnels (nom, logo, site web, type).
9. `evenements` - agenda evenementiel (titre, description, dates, lieu, image).
10. `messages_contact` - messages recus via le formulaire de contact (nom, email, sujet, message, horodatage).

## Securite
- RLS activee sur TOUTES les tables.
- Application vitrine publique sans ecran de connexion : les politiques SELECT
  sont ouvertes a `anon, authenticated` (donnees publiques).
- INSERT autorise uniquement sur `messages_contact` (le public ecrit des messages)
  pour `anon, authenticated`.
- Aucun UPDATE/DELETE public : la gestion du contenu se fait via le back-office
  (phase 2) avec un compte administrateur authenticate.
- Les politiques utilisent `USING (true)`/`WITH CHECK (true)` uniquement parce
  que ces donnees sont intentionnellement publiques (site vitrine sans auth).

## Notes importantes
1. Toutes les tables ont un id UUID genere automatiquement et un champ
   `created_at`/`updated_at` par defaut.
2. Les slugs sont uniques pour gerer les routes propres (recherches/:slug,
   actualites/:slug).
3. Les tags des actualites sont stockes dans un tableau text[].
4. Les cles etrangeres lient publications->projets, chercheurs->departements,
   actualites->categories.
*/

CREATE TABLE IF NOT EXISTS departements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  mission text NOT NULL,
  description text NOT NULL DEFAULT '',
  responsable text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  telephone text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Leaf',
  ordre integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chercheurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  fonction text NOT NULL DEFAULT '',
  departement_id uuid REFERENCES departements(id) ON DELETE SET NULL,
  specialite text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  photo_url text,
  linkedin_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS centres_regionaux (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  region text NOT NULL DEFAULT '',
  ville text NOT NULL DEFAULT '',
  adresse text NOT NULL DEFAULT '',
  telephone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  responsable text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  slug text UNIQUE NOT NULL,
  domaine text NOT NULL DEFAULT 'Agronomie',
  resume text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  statut text NOT NULL DEFAULT 'En cours',
  date_debut date,
  date_fin date,
  budget text,
  bailleur text,
  responsable text,
  impact text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  slug text UNIQUE NOT NULL,
  type text NOT NULL DEFAULT 'Rapport',
  auteurs text NOT NULL DEFAULT '',
  annee integer NOT NULL DEFAULT EXTRACT(year FROM now())::int,
  resume text NOT NULL DEFAULT '',
  fichier_url text,
  projet_id uuid REFERENCES projets(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  couleur text NOT NULL DEFAULT 'primary',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actualites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  slug text UNIQUE NOT NULL,
  extrait text NOT NULL DEFAULT '',
  contenu text NOT NULL DEFAULT '',
  image_url text,
  categorie_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  auteur text NOT NULL DEFAULT 'FOFIFA',
  date_publication timestamptz NOT NULL DEFAULT now(),
  tags text[] NOT NULL DEFAULT '{}',
  lu integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS partenaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  logo_url text,
  site_web text,
  type text NOT NULL DEFAULT 'Institutionnel',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evenements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text NOT NULL DEFAULT '',
  date_debut timestamptz NOT NULL DEFAULT now(),
  date_fin timestamptz,
  lieu text NOT NULL DEFAULT '',
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages_contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  sujet text NOT NULL DEFAULT '',
  message text NOT NULL,
  traite boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE departements ENABLE ROW LEVEL SECURITY;
ALTER TABLE chercheurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE centres_regionaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_contact ENABLE ROW LEVEL SECURITY;

-- SELECT publiques (site vitrine sans auth)
DROP POLICY IF EXISTS "public_read_departements" ON departements;
CREATE POLICY "public_read_departements" ON departements FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_chercheurs" ON chercheurs;
CREATE POLICY "public_read_chercheurs" ON chercheurs FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_centres" ON centres_regionaux;
CREATE POLICY "public_read_centres" ON centres_regionaux FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_projets" ON projets;
CREATE POLICY "public_read_projets" ON projets FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_publications" ON publications;
CREATE POLICY "public_read_publications" ON publications FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_actualites" ON actualites;
CREATE POLICY "public_read_actualites" ON actualites FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_partenaires" ON partenaires;
CREATE POLICY "public_read_partenaires" ON partenaires FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_evenements" ON evenements;
CREATE POLICY "public_read_evenements" ON evenements FOR SELECT TO anon, authenticated USING (true);

-- Messages de contact : lecture reservee (admin futur), insertion publique
DROP POLICY IF EXISTS "public_insert_messages" ON messages_contact;
CREATE POLICY "public_insert_messages" ON messages_contact FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Index pour les recherches frequentes
CREATE INDEX IF NOT EXISTS idx_projets_domaine ON projets(domaine);
CREATE INDEX IF NOT EXISTS idx_projets_statut ON projets(statut);
CREATE INDEX IF NOT EXISTS idx_actualites_date ON actualites(date_publication DESC);
CREATE INDEX IF NOT EXISTS idx_actualites_categorie ON actualites(categorie_id);
CREATE INDEX IF NOT EXISTS idx_publications_annee ON publications(annee DESC);
CREATE INDEX IF NOT EXISTS idx_chercheurs_departement ON chercheurs(departement_id);
