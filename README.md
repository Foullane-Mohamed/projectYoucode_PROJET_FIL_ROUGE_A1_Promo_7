# 🎸 Instrument Haven - Site de vente d’instruments de musique

## 📝 Description du projet

Instrument Haven est une plateforme de commerce électronique pour la vente d’instruments de musique. Ce projet full-stack combine **React.js** (frontend) avec **Laravel 10** (backend) pour offrir une expérience utilisateur moderne, rapide et sécurisée.

---

## ⚙️ Fonctionnalités

### 🧑‍🎤 Front Office

- **Page d’accueil dynamique** : Slider, catégories, sous-catégories et tags.
- **Page des produits** : Liste, filtre avancé, recherche, wishlist.
- **Page de produit détaillé** : Nom, description, images, prix, stock, etc.
- **Panier et paiement** : Modifier quantité, supprimer, paiement via Stripe.
- **Formulaire de contact** : Pour joindre l’administration.

### 🛠️ Back Office (Admin)

- Dashboard pour la gestion :
  - Produits (CRUD)
  - Commandes (statuts)
  - Utilisateurs et rôles (sans package externe)
  - Catégories, sous-catégories et tags
  - Coupons de réduction
- Analyse des ventes
- Gestion des permissions manuellement (sans package)

---

## 🛠️ Technologies utilisées

### Frontend

- **React.js** (JavaScript)
- **Tailwind CSS** pour un design responsive
- **Material UI** pour les composants
- **Formik & Yup** pour les formulaires et la validation

### Backend

- **Laravel 10** avec **Sanctum** pour l’authentification
- **MySQL** pour la base de données
- **Repository Pattern** pour une architecture propre
- **Gestion des rôles et permissions sans package externe**

---

## 📦 Entités principales

- **Produits** : ID, nom, description, catégorie, prix, images, stock.
- **Utilisateurs** : ID, nom, email, mot de passe, rôle.
- **Commandes** : ID, produits, utilisateur, total, statut, date.

---

## ✅ Critères de qualité

- Interface rapide et réactive
- Code propre, organisé et maintenable
- Sécurité côté client et serveur
- Expérience utilisateur fluide

---

## 👥 User Stories

### Visiteur

- Parcourir les instruments
- Rechercher / filtrer
- Voir détails / évaluations
- Créer un compte

### Client

- Se connecter / gérer profil
- Ajouter au panier / wishlist
- Passer commande / suivre statut
- Évaluer les produits

### Administrateur

- Gérer les produits, catégories, utilisateurs
- Suivre les commandes
- Gérer les coupons / offres
- Analyser les statistiques
- Gérer les permissions sans package
- Maintenir la sécurité du site

---

## 🚀 Lancer le projet

### Frontend

1. **Backend:**

   ```
   cd instrument-haven-backend
   composer install
   php artisan serve
   ```

2. **Frontend:**
   ```
   cd instrument-haven-frontend
   npm install
   npm run dev
   ```
