# 🔌 API Documentation - Espace Client

## 📡 Endpoints Utilisés

### Base URL
```
http://localhost:5000/api
```

## 🔐 Authentification

Toutes les requêtes nécessitent un token JWT dans le header :

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 📋 Endpoints

### 1. Récupérer les commandes de l'utilisateur

**Endpoint**: `GET /orders/my-orders`

**Headers**:
```javascript
{
  'Authorization': 'Bearer <token>'
}
```

**Réponse Success (200)**:
```json
[
  {
    "_id": "65abc123def456789",
    "user": {
      "_id": "65abc123def456789",
      "name": "Jean Dupont",
      "email": "jean@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "65abc123def456789",
          "name": "Produit 1",
          "image": "http://localhost:5000/uploads/product.jpg"
        },
        "quantity": 2,
        "price": 25.50
      }
    ],
    "totalAmount": 51.00,
    "status": "pending",
    "paymentMethod": "cash",
    "shippingAddress": {
      "fullName": "Jean Dupont",
      "address": "123 Rue Example",
      "city": "Tunis",
      "postalCode": "1000",
      "phone": "+216 12 345 678"
    },
    "createdAt": "2023-12-28T10:30:00.000Z",
    "updatedAt": "2023-12-28T10:30:00.000Z"
  }
]
```

**Statuts de commande**:
- `pending`: En attente
- `confirmed`: Confirmée
- `shipped`: Expédiée
- `delivered`: Livrée
- `cancelled`: Annulée

**Méthodes de paiement**:
- `cash`: Espèces
- `card`: Carte bancaire

### 2. Récupérer le profil utilisateur

**Endpoint**: `GET /users/profile`

**Headers**:
```javascript
{
  'Authorization': 'Bearer <token>'
}
```

**Réponse Success (200)**:
```json
{
  "_id": "65abc123def456789",
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "role": "user",
  "phone": "+216 12 345 678",
  "address": "123 Rue Example, Tunis",
  "createdAt": "2023-01-15T10:30:00.000Z",
  "updatedAt": "2023-12-28T10:30:00.000Z"
}
```

### 3. Mettre à jour le profil

**Endpoint**: `PUT /users/profile`

**Headers**:
```javascript
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

**Body**:
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+216 12 345 678",
  "address": "123 Rue Example, Tunis"
}
```

**Réponse Success (200)**:
```json
{
  "message": "Profil mis à jour avec succès",
  "user": {
    "_id": "65abc123def456789",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+216 12 345 678",
    "address": "123 Rue Example, Tunis"
  }
}
```

### 4. Changer le mot de passe

**Endpoint**: `PUT /users/change-password`

**Headers**:
```javascript
{
  'Authorization': 'Bearer <token>',
  'Content-Type': 'application/json'
}
```

**Body**:
```json
{
  "currentPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}
```

**Réponse Success (200)**:
```json
{
  "message": "Mot de passe changé avec succès"
}
```

## 💻 Exemples d'Utilisation

### Récupérer les commandes

```typescript
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors du chargement");
    }
    
    const data = await response.json();
    setOrders(data);
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

### Mettre à jour le profil

```typescript
const updateProfile = async (formData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }
    
    const data = await response.json();
    alert("Profil mis à jour avec succès!");
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de la mise à jour");
  }
};
```

### Changer le mot de passe

```typescript
const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/change-password", {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors du changement de mot de passe");
    }
    
    const data = await response.json();
    alert("Mot de passe changé avec succès!");
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors du changement de mot de passe");
  }
};
```

## 🔒 Gestion des Erreurs

### Codes d'erreur courants

| Code | Description | Action |
|------|-------------|--------|
| 401 | Non autorisé | Rediriger vers login |
| 403 | Accès interdit | Vérifier les permissions |
| 404 | Non trouvé | Afficher message d'erreur |
| 500 | Erreur serveur | Réessayer plus tard |

### Exemple de gestion d'erreur

```typescript
const handleApiError = (error: any, response: Response) => {
  if (response.status === 401) {
    // Token expiré ou invalide
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  } else if (response.status === 403) {
    // Accès interdit
    alert("Vous n'avez pas les permissions nécessaires");
  } else if (response.status === 404) {
    // Ressource non trouvée
    alert("Ressource non trouvée");
  } else {
    // Erreur générique
    alert("Une erreur est survenue");
  }
};
```

## 📊 Calcul des Statistiques

### Total des commandes

```typescript
const totalOrders = orders.length;
```

### Commandes en attente

```typescript
const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
```

### Commandes livrées

```typescript
const deliveredOrders = orders.filter((o: any) => o.status === "delivered").length;
```

### Total dépensé

```typescript
const totalSpent = orders
  .filter((o: any) => o.status !== "cancelled")
  .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
```

## 🔄 Rafraîchissement des Données

### Auto-refresh

```typescript
useEffect(() => {
  fetchOrders();
  
  // Rafraîchir toutes les 30 secondes
  const interval = setInterval(() => {
    fetchOrders();
  }, 30000);
  
  return () => clearInterval(interval);
}, []);
```

### Refresh manuel

```typescript
const handleRefresh = () => {
  setLoading(true);
  fetchOrders();
};
```

## 🎯 Filtrage des Données

### Filtrer par statut

```typescript
const filterByStatus = (status: string) => {
  if (status) {
    return orders.filter((o: any) => o.status === status);
  }
  return orders;
};
```

### Filtrer par date

```typescript
const filterByDate = (startDate: Date, endDate: Date) => {
  return orders.filter((o: any) => {
    const orderDate = new Date(o.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });
};
```

### Recherche

```typescript
const searchOrders = (query: string) => {
  return orders.filter((o: any) => 
    o._id.toLowerCase().includes(query.toLowerCase()) ||
    o.items.some((item: any) => 
      item.product?.name.toLowerCase().includes(query.toLowerCase())
    )
  );
};
```

## 📝 Format des Données

### Date et Heure

```typescript
// Format français
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('fr-FR');
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
```

### Prix

```typescript
const formatPrice = (price: number) => {
  return `${price.toFixed(2)} TND`;
};
```

### ID de commande

```typescript
const formatOrderId = (id: string) => {
  return `#${id.slice(-8).toUpperCase()}`;
};
```

## 🚀 Optimisations

### Cache des données

```typescript
const [cache, setCache] = useState<any>(null);
const [cacheTime, setCacheTime] = useState<number>(0);

const fetchWithCache = async () => {
  const now = Date.now();
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes
  
  if (cache && (now - cacheTime) < cacheExpiry) {
    return cache;
  }
  
  const data = await fetchOrders();
  setCache(data);
  setCacheTime(now);
  return data;
};
```

### Pagination

```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 10;

const paginatedOrders = orders.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);
```

## 🔍 Debugging

### Logs utiles

```typescript
console.log("Token:", localStorage.getItem("token"));
console.log("User:", localStorage.getItem("user"));
console.log("Orders:", orders);
console.log("API Response:", response);
```

### Vérifier l'authentification

```typescript
const checkAuth = () => {
  const token = localStorage.getItem("token");
  console.log("Token présent:", !!token);
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token payload:", payload);
      console.log("Token expiré:", payload.exp < Date.now() / 1000);
    } catch (e) {
      console.error("Token invalide");
    }
  }
};
```

## 📞 Support

Pour toute question concernant l'API :

1. Vérifiez que le backend est démarré
2. Vérifiez les logs du serveur
3. Utilisez Postman pour tester les endpoints
4. Consultez la documentation du backend

---

**Version**: 1.0.0  
**Dernière mise à jour**: Décembre 2023
