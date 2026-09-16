from rest_framework import serializers
from .models import (
    Departement, Chercheur, CentreRegional, Projet, Publication,
    Categorie, Actualite, Partenaire, Evenement, MessageContact
)

class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'

class ChercheurSerializer(serializers.ModelSerializer):
    departement = DepartementSerializer(read_only=True)
    departement_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Chercheur
        fields = '__all__'

class CentreRegionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CentreRegional
        fields = '__all__'

class ProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projet
        fields = '__all__'

class PublicationSerializer(serializers.ModelSerializer):
    projet = ProjetSerializer(read_only=True)
    projet_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Publication
        fields = '__all__'

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'

class ActualiteSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Actualite
        fields = '__all__'

class PartenaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partenaire
        fields = '__all__'

class EvenementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evenement
        fields = '__all__'

class MessageContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageContact
        fields = '__all__'
