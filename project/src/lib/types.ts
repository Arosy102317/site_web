export type Departement = {
  id: string
  nom: string
  slug: string
  mission: string
  description: string
  responsable: string
  email: string
  telephone: string
  icon_name: string
  ordre: number
}

export type Chercheur = {
  id: string
  nom: string
  fonction: string
  departement_id: string | null
  specialite: string
  email: string
  photo_url: string | null
  linkedin_url: string | null
  departement?: Departement | null
}

export type CentreRegional = {
  id: string
  nom: string
  region: string
  ville: string
  adresse: string
  telephone: string
  email: string
  responsable: string
}

export type Projet = {
  id: string
  titre: string
  slug: string
  domaine: string
  resume?: string
  description?: string
  statut?: string
  date_debut?: string | null
  date_fin?: string | null
  budget?: string | null
  bailleur?: string | null
  responsable?: string | null
  impact?: string | null
  image_url?: string | null
  created_at?: string
}

export type Publication = {
  id: string
  titre: string
  slug: string
  type?: string
  auteurs?: string
  annee?: number
  resume?: string
  fichier_url?: string | null
  projet_id?: string | null
  projet?: Projet | null
}

export type Categorie = {
  id: string
  nom: string
  slug: string
  couleur: string
}

export type Actualite = {
  id: string
  titre: string
  slug: string
  extrait?: string
  contenu?: string
  image_url?: string | null
  categorie_id?: string | null
  auteur?: string
  date_publication: string
  tags?: string[] | null
  lu?: number
  categorie?: Categorie | null
}

export type Partenaire = {
  id: string
  nom: string
  logo_url: string | null
  site_web: string | null
  type: string
}

export type Evenement = {
  id: string
  titre: string
  description: string
  date_debut: string
  date_fin: string | null
  lieu: string
  image_url: string | null
}

export type MessageContact = {
  id: string
  nom: string
  email: string
  sujet: string
  message: string
  created_at: string
}
