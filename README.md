# 🇲🇬 FOFIFA - Site Web Institutionnel & Plateforme de Recherche

Plateforme web institutionnelle du **FOFIFA** (Centre National de la Recherche Appliquée au Développement Rural à Madagascar), construite avec **Django**, **React** et **PHP**.

---

## 🛠️ Architecture Technique

- **Frontend Client** : React 18, TypeScript, Tailwind CSS, Lucide Icons, React Router.
- **Backend API Principal** : Python Django 4.2 + Django REST Framework + Django Admin (`/admin`).
- **Backend API Secondaire / Hébergement Mutualisé** : PHP 8.2 (PDO, Apache, PHPMailer).
- **Base de données** : PostgreSQL (Production) / SQLite / MySQL.
- **Déploiement** : Docker Compose, Nginx, SSL (Let's Encrypt / Certbot).

---

## 🚀 Démarrage en Développement Local

### 1. Frontend React
```bash
cd project
npm install
npm run dev
```

### 2. Backend Django
```bash
cd backend_django
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_fofifa
python manage.py createsuperuser
python manage.py runserver 8000
```
Le serveur Django est accessible sur : `http://localhost:8000/api/` et l'admin sur `http://localhost:8000/admin/`.

### 3. Backend PHP (Alternative cPanel / Apache)
Copier les fichiers du dossier `backend_php/` sur votre serveur web Apache/PHP ou exécuter :
```bash
cd backend_php
php -S localhost:8080
```

---

## 🌐 Déploiement en Ligne (Production Docker)

1. **Cloner le dépôt sur votre serveur VPS (Ubuntu/Debian)** :
   ```bash
   git clone <url-du-depot>
   cd project-fofifa
   ```

2. **Configurer les variables d'environnement** :
   ```bash
   cp .env.example .env
   # Modifier le fichier .env avec vos clés de sécurité
   ```

3. **Compiler le frontend React** :
   ```bash
   cd project
   npm install
   npm run build
   cd ..
   ```

4. **Lancer les conteneurs Docker** :
   ```bash
   docker-compose up -d --build
   ```

5. **Exécuter les migrations et le remplissage initial dans le conteneur Django** :
   ```bash
   docker exec -it fofifa_django python manage.py migrate
   docker exec -it fofifa_django python manage.py seed_fofifa
   docker exec -it fofifa_django python manage.py createsuperuser
   ```

Votre application est maintenant en ligne ! 🚀
- Frontend SPA : `http://votre-domaine.mg`
- API Django REST : `http://votre-domaine.mg/api/`
- Panneau d'administration : `http://votre-domaine.mg/admin/`
