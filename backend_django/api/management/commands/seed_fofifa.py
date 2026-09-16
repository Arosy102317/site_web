from django.core.management.base import BaseCommand
from api.models import (
    Departement, Chercheur, CentreRegional, Projet, Publication,
    Categorie, Actualite, Partenaire, Evenement
)
from django.utils import timezone
import datetime

class Command(BaseCommand):
    help = 'Popule la base de données Django avec les données initiales du FOFIFA'

    def handle(self, *args, **options):
        self.stdout.write('Création des départements...')
        d1, _ = Departement.objects.get_or_create(
            slug='drz',
            defaults={
                'nom': 'Département de Recherches Zootechniques et Vétérinaires (DRZV)',
                'mission': 'Amélioration des races locales, nutrition animale et santé vétérinaire à Madagascar.',
                'description': 'Le DRZV mène des travaux appliqués pour accroître la productivité des filières bétail, volaille et apiculture.',
                'responsable': 'Dr. Ramanantsoa Jean',
                'email': 'drzv@fofifa.mg',
                'telephone': '+261 20 22 234 56',
                'icon_name': 'Fish',
                'ordre': 1,
            }
        )

        d2, _ = Departement.objects.get_or_create(
            slug='drr',
            defaults={
                'nom': 'Département de Recherches Rizicoles et Agronomiques (DRR)',
                'mission': 'Création de variétés de riz résilientes et optimisation de la riziculture durable.',
                'description': 'Développement de semences améliorées, gestion intégrée des ravageurs et fertilité des sols.',
                'responsable': 'Dr. Razafindrakoto Marie',
                'email': 'drr@fofifa.mg',
                'telephone': '+261 20 22 345 67',
                'icon_name': 'Sprout',
                'ordre': 2,
            }
        )

        d3, _ = Departement.objects.get_or_create(
            slug='drf',
            defaults={
                'nom': 'Département de Recherches Forestières et de l\'Environnement (DRFP)',
                'mission': 'Gestion durable des forêts, agroforesterie et préservation de la biodiversité.',
                'description': 'Recherches sur la restauration des écosystèmes forestiers et les essences à croissance rapide.',
                'responsable': 'Dr. Andriamampianina Luc',
                'email': 'drfp@fofifa.mg',
                'telephone': '+261 20 22 456 78',
                'icon_name': 'TreePine',
                'ordre': 3,
            }
        )

        self.stdout.write('Création des chercheurs...')
        Chercheur.objects.get_or_create(
            nom='Dr. Ramanantsoa Jean',
            defaults={
                'fonction': 'Directeur du DRZV',
                'departement': d1,
                'specialite': 'Génétique et amélioration bovine',
                'email': 'j.ramanantsoa@fofifa.mg',
            }
        )
        Chercheur.objects.get_or_create(
            nom='Dr. Razafindrakoto Marie',
            defaults={
                'fonction': 'Enseignante-Chercheuse Senior',
                'departement': d2,
                'specialite': 'Sélection variétale du riz pluvial',
                'email': 'm.razafi@fofifa.mg',
            }
        )

        self.stdout.write('Création des catégories et actualités...')
        cat_ric, _ = Categorie.objects.get_or_create(slug='riziculture', defaults={'nom': 'Riziculture', 'couleur': 'emerald'})
        cat_inno, _ = Categorie.objects.get_or_create(slug='innovation', defaults={'nom': 'Innovation', 'couleur': 'blue'})

        Actualite.objects.get_or_create(
            slug='nouvelles-varietes-riz-2026',
            defaults={
                'titre': 'Lancement de nouvelles variétés de riz adaptées au changement climatique',
                'extrait': 'Le FOFIFA présente 3 nouvelles variétés de riz à haut rendement tolérantes à la sécheresse.',
                'contenu': 'Face aux défis climatiques récents, le Département de Recherches Rizicoles du FOFIFA a homologué de nouvelles semences qui réduisent le besoin en eau de 30%.',
                'categorie': cat_ric,
                'auteur': 'Dr. Razafindrakoto',
                'date_publication': timezone.now(),
                'tags': ['Riz', 'Climat', 'Agronomie'],
            }
        )

        self.stdout.write('Création des projets...')
        Projet.objects.get_or_create(
            slug='projet-riz-resilient',
            defaults={
                'titre': 'Projet Riziculture Résiliente & Durable (RRD-Mada)',
                'domaine': 'Agronomie',
                'resume': 'Amélioration de la productivité rizicole dans la région de Alaotra Mangoro.',
                'description': 'Mise à disposition de semences certifiées et formation des groupements paysants aux bonnes pratiques agroécologiques.',
                'statut': 'En cours',
                'date_debut': datetime.date(2024, 1, 15),
                'date_fin': datetime.date(2027, 12, 31),
                'budget': '1.5M EUR',
                'bailleur': 'Union Européenne & CIRAD',
                'responsable': 'Dr. Razafindrakoto Marie',
            }
        )

        self.stdout.write(self.style.SUCCESS('Base de données FOFIFA (Django) populée avec succès!'))
