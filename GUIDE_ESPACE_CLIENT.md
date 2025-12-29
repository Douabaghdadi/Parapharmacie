# 🚀 Guide de Démarrage Rapide - Espace Client

## 📋 Vue d'ensemble

L'espace client est une interface moderne et intuitive qui permet aux utilisateurs de gérer leurs commandes, profil et accéder à divers services.

## 🎯 Fonctionnalités Principales

### ✅ Fonctionnalités Actives

1. **Dashboard Principal** (`/client`)
   - 10 cartes interactives avec design moderne
   - Statistiques en temps réel
   - Navigation rapide vers toutes les sections

2. **Gestion des Commandes** (`/client/orders`)
   - Liste complète des commandes
   - Filtrage par statut (En attente, Confirmée, Expédiée, Livrée, Annulée)
   - Modal de détails avec informations complètes
   - Affichage des produits avec images

3. **Profil Utilisateur** (`/client/profile`)
   - Modification des informations personnelles
   - Changement de mot de passe
   - Affichage des informations du compte

### 🔜 Fonctionnalités À Venir

- Factures
- Évolution du CA
- Messagerie
- Documents à télécharger
- Gestion des affaires
- Interlocuteurs
- Pièces détachées
- Newsletter

## 🎨 Design

### Caractéristiques

- **Design moderne** avec dégradés de couleurs
- **Animations fluides** au survol
- **Responsive** (mobile, tablette, desktop)
- **Icônes emoji** pour une meilleure UX
- **Cartes interactives** avec effets de survol

### Palette de Couleurs

```css
Principal: #667eea → #764ba2 (dégradé violet)
Succès: #27ae60
Avertissement: #f39c12
Danger: #e74c3c
Info: #3498db
Fond: #f5f7fa
```

## 🚀 Démarrage

### 1. Accès à l'espace client

```bash
# Démarrer le frontend
cd frontend
npm run dev
```

### 2. Se connecter

1. Allez sur `http://localhost:3000/login`
2. Connectez-vous avec vos identifiants
3. Vous serez redirigé vers `/client`

### 3. Navigation

**Via le menu supérieur:**
- Dashboard
- Commandes
- Profil
- Boutique
- Déconnexion

**Via les cartes du dashboard:**
- Cliquez sur n'importe quelle carte pour accéder à la section

## 📱 Interface Utilisateur

### Dashboard Principal

```
┌─────────────────────────────────────────────────────────┐
│  🏥 Parapharmacie                    [Retour Boutique]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Espace Client                                          │
│  Bienvenue, [Nom de l'utilisateur]                     │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [Total: 5]  [En attente: 2]  [Livrées: 3]  [150 TND] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 🛍️       │  │ 📄       │  │ 📊       │             │
│  │ Vos      │  │ Vos      │  │ Votre    │             │
│  │ commandes│  │ factures │  │ évolution│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ 💼       │  │ ✉️       │  │ ☁️       │             │
│  │ Gestion  │  │ Message- │  │ Documents│             │
│  │ affaires │  │ rie      │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                                                          │
│  ... et plus encore                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Page Commandes

```
┌─────────────────────────────────────────────────────────┐
│  📦 Mes Commandes                          [Retour]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Filtrer: [Tous les statuts ▼]          [5 commandes]  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ID      │ Date       │ Articles │ Montant │ Statut│ │
│  ├────────────────────────────────────────────────────┤ │
│  │ #ABC123 │ 28/12/2023 │ 3        │ 45 TND  │ ✅    │ │
│  │ #DEF456 │ 27/12/2023 │ 2        │ 30 TND  │ 🚚    │ │
│  │ #GHI789 │ 26/12/2023 │ 1        │ 15 TND  │ ⏳    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🔐 Sécurité

### Protection des routes

Toutes les pages de l'espace client sont protégées :

```typescript
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
}, [router]);
```

### Déconnexion

```typescript
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
```

## 📊 Données Affichées

### Statistiques Dashboard

- **Total commandes**: Nombre total de commandes passées
- **En attente**: Commandes avec statut "pending"
- **Livrées**: Commandes avec statut "delivered"
- **Total dépensé**: Somme de toutes les commandes (hors annulées)

### Détails Commande

- ID de commande
- Date et heure
- Liste des produits avec images
- Prix unitaires et totaux
- Adresse de livraison
- Statut de la commande
- Mode de paiement

## 🎯 Personnalisation

### Modifier les couleurs

Dans chaque fichier, modifiez les styles inline :

```tsx
style={{ 
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
}}
```

### Ajouter une nouvelle section

1. Créer le dossier et le fichier :
```bash
mkdir frontend/app/client/nouvelle-section
touch frontend/app/client/nouvelle-section/page.tsx
```

2. Ajouter le contenu :
```tsx
"use client";
import Link from "next/link";

export default function NouvelleSection() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", padding: "2rem 0" }}>
      <div className="container">
        {/* Votre contenu */}
      </div>
    </div>
  );
}
```

3. Ajouter la carte dans le dashboard :
```tsx
{
  title: "Nouvelle Section",
  subtitle: "Description de la section",
  icon: "🎯",
  link: "/client/nouvelle-section",
  color: "#3498db",
  bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
}
```

## 🐛 Résolution de Problèmes

### Problème: Redirection vers login

**Cause**: Token manquant ou expiré

**Solution**:
1. Vérifier que vous êtes connecté
2. Vérifier le localStorage : `localStorage.getItem("token")`
3. Se reconnecter si nécessaire

### Problème: Données non chargées

**Cause**: Backend non démarré ou URL incorrecte

**Solution**:
1. Vérifier que le backend tourne sur `http://localhost:5000`
2. Vérifier la console pour les erreurs
3. Vérifier les routes API

### Problème: Style cassé

**Cause**: Bootstrap non chargé

**Solution**:
1. Vérifier que Bootstrap est importé dans `layout.tsx`
2. Vérifier les imports CSS
3. Vider le cache du navigateur

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (1 carte par ligne)
- **Tablette**: 768px - 992px (2 cartes par ligne)
- **Desktop**: > 992px (3 cartes par ligne)

### Navigation Mobile

Le menu se transforme en hamburger menu sur mobile avec toutes les fonctionnalités accessibles.

## 🎓 Bonnes Pratiques

### 1. Toujours vérifier l'authentification

```tsx
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
}, [router]);
```

### 2. Gérer les états de chargement

```tsx
if (loading) {
  return <div>Chargement...</div>;
}
```

### 3. Gérer les erreurs

```tsx
try {
  // Code
} catch (error) {
  console.error("Erreur:", error);
  // Afficher un message d'erreur
}
```

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation
2. Vérifiez les logs de la console
3. Contactez l'équipe de développement

## 🎉 Conclusion

L'espace client est maintenant prêt à l'emploi avec :

✅ Dashboard moderne et interactif
✅ Gestion complète des commandes
✅ Profil utilisateur éditable
✅ Design responsive et moderne
✅ Navigation intuitive
✅ Sécurité renforcée

Profitez de votre nouvel espace client ! 🚀
