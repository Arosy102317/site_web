import uuid
from django.db import models
from django.utils import timezone

class Departement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    mission = models.TextField()
    description = models.TextField(blank=True, default='')
    responsable = models.CharField(max_length=255, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    telephone = models.CharField(max_length=50, blank=True, default='')
    icon_name = models.CharField(max_length=50, default='Leaf')
    ordre = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['ordre', 'nom']

    def __str__(self):
        return self.nom


class Chercheur(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=255)
    fonction = models.CharField(max_length=255, blank=True, default='')
    departement = models.ForeignKey(Departement, on_delete=models.SET_NULL, null=True, blank=True, related_name='chercheurs')
    specialite = models.CharField(max_length=255, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    photo_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nom']

    def __str__(self):
        return self.nom


class CentreRegional(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=255)
    region = models.CharField(max_length=255, blank=True, default='')
    ville = models.CharField(max_length=255, blank=True, default='')
    adresse = models.TextField(blank=True, default='')
    telephone = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    responsable = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['region', 'nom']

    def __str__(self):
        return f"{self.nom} ({self.region})"


class Projet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    domaine = models.CharField(max_length=100, default='Agronomie')
    resume = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    statut = models.CharField(max_length=50, default='En cours')
    date_debut = models.DateField(blank=True, null=True)
    date_fin = models.DateField(blank=True, null=True)
    budget = models.CharField(max_length=100, blank=True, null=True)
    bailleur = models.CharField(max_length=255, blank=True, null=True)
    responsable = models.CharField(max_length=255, blank=True, null=True)
    impact = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.titre


class Publication(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=100, default='Rapport')
    auteurs = models.CharField(max_length=255, blank=True, default='')
    annee = models.IntegerField(default=timezone.now().year)
    resume = models.TextField(blank=True, default='')
    fichier_url = models.URLField(blank=True, null=True)
    projet = models.ForeignKey(Projet, on_delete=models.SET_NULL, null=True, blank=True, related_name='publications')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-annee', 'titre']

    def __str__(self):
        return f"{self.titre} ({self.annee})"


class Categorie(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    couleur = models.CharField(max_length=50, default='primary')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


class Actualite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    extrait = models.TextField(blank=True, default='')
    contenu = models.TextField(blank=True, default='')
    image_url = models.URLField(blank=True, null=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, blank=True, related_name='actualites')
    auteur = models.CharField(max_length=100, default='FOFIFA')
    date_publication = models.DateTimeField(default=timezone.now)
    tags = models.JSONField(default=list, blank=True)
    lu = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_publication']

    def __str__(self):
        return self.titre


class Partenaire(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, null=True)
    site_web = models.URLField(blank=True, null=True)
    type = models.CharField(max_length=100, default='Institutionnel')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


class Evenement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    date_debut = models.DateTimeField(default=timezone.now)
    date_fin = models.DateTimeField(blank=True, null=True)
    lieu = models.CharField(max_length=255, blank=True, default='')
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_debut']

    def __str__(self):
        return self.titre


class MessageContact(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=255)
    email = models.EmailField()
    sujet = models.CharField(max_length=255, blank=True, default='')
    message = models.TextField()
    traite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message de {self.nom} - {self.sujet}"
