from django.contrib import admin
from .models import (
    Departement, Chercheur, CentreRegional, Projet, Publication,
    Categorie, Actualite, Partenaire, Evenement, MessageContact
)

@admin.register(Departement)
class DepartementAdmin(admin.ModelAdmin):
    list_display = ('nom', 'responsable', 'email', 'ordre')
    prepopulated_fields = {'slug': ('nom',)}

@admin.register(Chercheur)
class ChercheurAdmin(admin.ModelAdmin):
    list_display = ('nom', 'fonction', 'departement', 'specialite', 'email')

@admin.register(CentreRegional)
class CentreRegionalAdmin(admin.ModelAdmin):
    list_display = ('nom', 'region', 'ville', 'responsable')

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    list_display = ('titre', 'domaine', 'statut', 'bailleur', 'date_debut')
    list_filter = ('domaine', 'statut')
    prepopulated_fields = {'slug': ('titre',)}

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'type', 'auteurs', 'annee', 'projet')
    list_filter = ('type', 'annee')
    prepopulated_fields = {'slug': ('titre',)}

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('nom', 'slug', 'couleur')
    prepopulated_fields = {'slug': ('nom',)}

@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ('titre', 'categorie', 'auteur', 'date_publication', 'lu')
    list_filter = ('categorie', 'date_publication')
    prepopulated_fields = {'slug': ('titre',)}

@admin.register(Partenaire)
class PartenaireAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type', 'site_web')

@admin.register(Evenement)
class EvenementAdmin(admin.ModelAdmin):
    list_display = ('titre', 'lieu', 'date_debut', 'date_fin')

@admin.register(MessageContact)
class MessageContactAdmin(admin.ModelAdmin):
    list_display = ('nom', 'email', 'sujet', 'created_at', 'traite')
    list_filter = ('traite', 'created_at')
    readonly_fields = ('created_at',)
