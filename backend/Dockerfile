# Utiliser une image Python
FROM python:3.12-slim-bookworm

# Variables d’environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Créer et définir le dossier de travail
WORKDIR /app

# Installer dépendances système nécessaires à psycopg2/Postgres et supprimer le cache apt non nécessaire
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copier le projet Django
COPY . .

# Créer un utilisateur non-root pour plus de sécurité
RUN useradd -m django
USER django

# Exposer le port Django/Gunicorn
EXPOSE 8000

# Lancer le serveur avec Gunicorn (production)
CMD ["gunicorn", "IMC_Calculator.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
