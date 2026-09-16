from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DepartementViewSet, ChercheurViewSet, CentreRegionalViewSet,
    ProjetViewSet, PublicationViewSet, CategorieViewSet,
    ActualiteViewSet, PartenaireViewSet, EvenementViewSet,
    MessageContactViewSet
)

router = DefaultRouter()
router.register(r'departements', DepartementViewSet, basename='departement')
router.register(r'chercheurs', ChercheurViewSet, basename='chercheur')
router.register(r'centres_regionaux', CentreRegionalViewSet, basename='centre_regional')
router.register(r'projets', ProjetViewSet, basename='projet')
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'actualites', ActualiteViewSet, basename='actualite')
router.register(r'partenaires', PartenaireViewSet, basename='partenaire')
router.register(r'evenements', EvenementViewSet, basename='evenement')
router.register(r'messages_contact', MessageContactViewSet, basename='message_contact')

urlpatterns = [
    path('', include(router.urls)),
]
