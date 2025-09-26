from django.contrib.auth.models import User
from .models import IMCCalculation
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class IMCCalculationSerializer(serializers.ModelSerializer):
    class Meta:
        model = IMCCalculation
        fields = ['id', 'poids', 'taille', 'imc', 'statut', 'date']