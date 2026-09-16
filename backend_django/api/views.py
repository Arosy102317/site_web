from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import (
    Departement, Chercheur, CentreRegional, Projet, Publication,
    Categorie, Actualite, Partenaire, Evenement, MessageContact
)
from .serializers import (
    DepartementSerializer, ChercheurSerializer, CentreRegionalSerializer,
    ProjetSerializer, PublicationSerializer, CategorieSerializer,
    ActualiteSerializer, PartenaireSerializer, EvenementSerializer,
    MessageContactSerializer
)

class DepartementViewSet(viewsets.ModelViewSet):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer
    lookup_field = 'slug'

    def get_object(self):
        # Allow lookup by UUID or slug
        lookup = self.kwargs.get(self.lookup_field)
        if lookup:
            try:
                return Departement.objects.get(pk=lookup)
            except (Departement.DoesNotExist, ValueError):
                return Departement.objects.get(slug=lookup)
        return super().get_object()


class ChercheurViewSet(viewsets.ModelViewSet):
    queryset = Chercheur.objects.select_related('departement').all()
    serializer_class = ChercheurSerializer


class CentreRegionalViewSet(viewsets.ModelViewSet):
    queryset = CentreRegional.objects.all()
    serializer_class = CentreRegionalSerializer


class ProjetViewSet(viewsets.ModelViewSet):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'domaine', 'resume', 'description']

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            return Projet.objects.get(pk=lookup)
        except (Projet.DoesNotExist, ValueError):
            return Projet.objects.get(slug=lookup)


class PublicationViewSet(viewsets.ModelViewSet):
    queryset = Publication.objects.select_related('projet').all()
    serializer_class = PublicationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'auteurs', 'resume']


class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer


class ActualiteViewSet(viewsets.ModelViewSet):
    queryset = Actualite.objects.select_related('categorie').all()
    serializer_class = ActualiteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['titre', 'extrait', 'contenu']

    def get_object(self):
        lookup = self.kwargs.get('pk')
        try:
            instance = Actualite.objects.get(pk=lookup)
        except (Actualite.DoesNotExist, ValueError):
            instance = Actualite.objects.get(slug=lookup)
        
        # Increment views counter
        instance.lu += 1
        instance.save(update_fields=['lu'])
        return instance


class PartenaireViewSet(viewsets.ModelViewSet):
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer


class EvenementViewSet(viewsets.ModelViewSet):
    queryset = Evenement.objects.all()
    serializer_class = EvenementSerializer


class MessageContactViewSet(viewsets.ModelViewSet):
    queryset = MessageContact.objects.all()
    serializer_class = MessageContactSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
