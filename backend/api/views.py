from django.contrib.auth.models import User
from .models import IMCCalculation
from django.contrib.auth import authenticate
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from .serializers import UserSerializer
from .serializers import IMCCalculationSerializer

# Vue pour l'inscription
@api_view(['POST'])
@permission_classes([AllowAny])  # accessible sans etre connecte
def register(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    # Verifier email format
    try:
        validate_email(email)
    except ValidationError:
        return Response({"error": "L'adresse email n'est pas valide."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verifier username (alphanumérique et 3-30 caractères)
    if not username or not username.isalnum() or len(username) < 3 or len(username) > 30:
        return Response({"error": "Username invalide (alphanumérique, 3-30 caractères)"}, status=status.HTTP_400_BAD_REQUEST)

    # Verifier si username deja pris
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username déjà pris"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verifier si email deja pris
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email déjà pris"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Verifier mot de passe (au moins 6 caractères)
    if not password or len(password) < 6:
        return Response({"error": "Mot de passe trop court (min 6 caractères)"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Creer user
    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({"user": UserSerializer(user).data, "token": token.key}, status=status.HTTP_201_CREATED)

# Vue pour le profil
@api_view(['GET'])          # accessible uniquement si connecte et seulment son propre profil
def profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

# Vue pour la connexion
@api_view(['POST'])
@permission_classes([AllowAny])  # accessible sans etre connecte
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    # Verifie les identifiants
    user = authenticate(username=username, password=password)

    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Identifiants invalides"}, status=status.HTTP_401_UNAUTHORIZED)
    
# Vue pour la deconnexion
@api_view(['POST'])          # accessible uniquement si connecte
def logout(request):
    request.user.auth_token.delete()  # Supprime le token
    return Response({"success": "Déconnecté avec succès"}, status=status.HTTP_200_OK)

# Vue pour vérifier le token
@api_view(['GET'])          # accessible uniquement si connecte
def verify_token(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response({"user": serializer.data}, status=status.HTTP_200_OK)

# Vue pour calculer l'IMC
@api_view(['POST'])
@permission_classes([AllowAny])  # accessible sans être connecte
def calc_imc(request):
    # verifier les données
    if "poids" not in request.data or "taille" not in request.data:
        return Response({"error": "Champs 'poids' et 'taille' requis"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not isinstance(request.data.get("poids"), (int, float)) or not isinstance(request.data.get("taille"), (int, float)):
        return Response({"error": "'poids' et 'taille' doivent être des nombres"}, status=status.HTTP_400_BAD_REQUEST)
    
    if float(request.data.get("poids")) <= 0 or float(request.data.get("taille")) <= 0:
        return Response({"error": "'poids' et 'taille' doivent être des nombres positifs"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Calcul de l'IMC
    poids = float(request.data.get("poids"))
    taille = float(request.data.get("taille")) / 100  # en m
    imc = round(poids / (taille * taille), 2)

    # Interprétation simple
    if imc < 18.5:
        status = "Maigreur"
    elif imc < 25:
        status = "Normal"
    elif imc < 30:
        status = "Surpoids"
    else:
        status = "Obésité"

    # Sauvegarde dans la base si utilisateur connecte
    if request.user.is_authenticated:
        IMCCalculation.objects.create(
            user=request.user,
            poids=poids,
            taille=taille * 100,
            imc=imc,
            statut=status
        )

    # Si pas connecte, on renvoie juste le resultat
    return Response({"imc": imc, "statut": status})

# Vue pour l'historique des calculs d'IMC
@api_view(['GET'])
def imc_history(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentification requise"}, status=401)

    records = IMCCalculation.objects.filter(user=request.user).order_by('-date')
    serializer = IMCCalculationSerializer(records, many=True)
    return Response(serializer.data)