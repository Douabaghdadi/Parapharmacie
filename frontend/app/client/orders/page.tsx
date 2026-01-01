"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
      pending: { label: "En attente", color: "#f39c12", bgColor: "#fef9e7", icon: "⏳" },
      confirmed: { label: "Confirmée", color: "#3498db", bgColor: "#ebf5fb", icon: "✓" },
      shipped: { label: "Expédiée", color: "#9b59b6", bgColor: "#f5eef8", icon: "🚚" },
      delivered: { label: "Livrée", color: "#27ae60", bgColor: "#eafaf1", icon: "✅" },
      cancelled: { label: "Annulée", color: "#e74c3c", bgColor: "#fdedec", icon: "❌" }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentLabel = (method: string) => {
    return method === "cash" ? "💵 Paiement à la livraison" : "💳 Carte bancaire";
  };

  const filteredOrders = filterStatus 
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  const getOrderStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    inProgress: orders.filter(o => ["confirmed", "shipped"].includes(o.status)).length
  });

  const stats = getOrderStats();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 200px)", backgroundColor: "#ffffff", padding: "3rem 0" }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: "300", color: "#2c3e50", marginBottom: "0.5rem" }}>
              MES COMMANDES
            </h1>
            <p className="text-muted mb-0">Suivez l'état de vos commandes</p>
          </div>
          <Link href="/client" className="btn btn-outline-secondary" style={{ borderRadius: "25px", padding: "10px 25px" }}>
            ← Retour
          </Link>
        </div>

        {/* Stats rapides */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.8rem", fontWeight: "600", color: "#667eea" }}>{stats.total}</div>
                <small className="text-muted">Total</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.8rem", fontWeight: "600", color: "#f39c12" }}>{stats.pending}</div>
                <small className="text-muted">En attente</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.8rem", fontWeight: "600", color: "#3498db" }}>{stats.inProgress}</div>
                <small className="text-muted">En cours</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.8rem", fontWeight: "600", color: "#27ae60" }}>{stats.delivered}</div>
                <small className="text-muted">Livrées</small>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
          <div className="card-body py-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted me-2">Filtrer:</span>
              <button 
                className={`btn btn-sm ${!filterStatus ? 'btn-primary' : 'btn-outline-secondary'}`}
                style={{ borderRadius: "20px" }}
                onClick={() => setFilterStatus("")}
              >
                Toutes ({orders.length})
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                style={{ borderRadius: "20px" }}
                onClick={() => setFilterStatus("pending")}
              >
                ⏳ En attente
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'confirmed' ? 'btn-info' : 'btn-outline-info'}`}
                style={{ borderRadius: "20px" }}
                onClick={() => setFilterStatus("confirmed")}
              >
                ✓ Confirmées
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'shipped' ? 'btn-purple' : 'btn-outline-secondary'}`}
                style={{ borderRadius: "20px", backgroundColor: filterStatus === 'shipped' ? '#9b59b6' : '', color: filterStatus === 'shipped' ? 'white' : '' }}
                onClick={() => setFilterStatus("shipped")}
              >
                🚚 Expédiées
              </button>
              <button 
                className={`btn btn-sm ${filterStatus === 'delivered' ? 'btn-success' : 'btn-outline-success'}`}
                style={{ borderRadius: "20px" }}
                onClick={() => setFilterStatus("delivered")}
              >
                ✅ Livrées
              </button>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length > 0 ? (
          <div className="row g-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} className="col-12">
                  <div 
                    className="card border-0 shadow-sm" 
                    style={{ 
                      borderRadius: "16px", 
                      overflow: "hidden",
                      borderLeft: `4px solid ${statusInfo.color}`,
                      transition: "all 0.3s ease"
                    }}
                  >
                    <div className="card-body p-4">
                      {/* En-tête de la commande */}
                      <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1" style={{ fontWeight: "600", color: "#2c3e50" }}>
                            Commande #{order._id.slice(-8).toUpperCase()}
                          </h5>
                          <small className="text-muted">
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                        <span 
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            padding: "8px 16px",
                            borderRadius: "25px",
                            fontSize: "0.85rem",
                            fontWeight: "600"
                          }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>

                      {/* Produits de la commande */}
                      <div className="mb-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div 
                            key={index} 
                            className="d-flex align-items-center mb-2 p-2" 
                            style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                          >
                            <div 
                              style={{ 
                                width: "60px", 
                                height: "60px", 
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundColor: "#e9ecef",
                                flexShrink: 0
                              }}
                            >
                              {item.product?.image ? (
                                <img 
                                  src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                                  alt={item.product?.name || "Produit"}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                  <span style={{ fontSize: "1.5rem" }}>📦</span>
                                </div>
                              )}
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <p className="mb-0" style={{ fontWeight: "500", color: "#2c3e50" }}>
                                {item.product?.name || "Produit non disponible"}
                              </p>
                              <small className="text-muted">
                                Qté: {item.quantity} × {item.price.toFixed(2)} TND
                              </small>
                            </div>
                            <div style={{ fontWeight: "600", color: "#27ae60" }}>
                              {(item.quantity * item.price).toFixed(2)} TND
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-muted text-center mb-0 mt-2" style={{ fontSize: "0.85rem" }}>
                            + {order.items.length - 3} autre(s) article(s)
                          </p>
                        )}
                      </div>

                      {/* Footer de la commande */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center pt-3" style={{ borderTop: "1px solid #eee" }}>
                        <div className="d-flex gap-4">
                          <div>
                            <small className="text-muted d-block">Articles</small>
                            <span style={{ fontWeight: "600" }}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                          </div>
                          <div>
                            <small className="text-muted d-block">Paiement</small>
                            <span style={{ fontSize: "0.9rem" }}>{order.paymentMethod === "cash" ? "💵 Espèces" : "💳 Carte"}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="text-end">
                            <small className="text-muted d-block">Total</small>
                            <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#27ae60" }}>
                              {order.totalAmount.toFixed(2)} TND
                            </span>
                          </div>
                          <button 
                            className="btn btn-outline-primary"
                            style={{ borderRadius: "25px", padding: "8px 20px" }}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Détails
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center py-5">
              <div style={{ fontSize: "5rem", opacity: 0.3 }}>🛒</div>
              <h4 style={{ color: "#6c757d", fontWeight: "400", marginTop: "1rem" }}>
                {filterStatus ? "Aucune commande avec ce statut" : "Vous n'avez pas encore de commandes"}
              </h4>
              <p className="text-muted mb-4">
                {filterStatus ? "Essayez un autre filtre" : "Découvrez nos produits et passez votre première commande !"}
              </p>
              {!filterStatus && (
                <Link href="/" className="btn btn-primary" style={{ borderRadius: "25px", padding: "12px 30px" }}>
                  Commencer mes achats
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedOrder && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }} 
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: "20px", border: "none" }}>
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title" style={{ fontWeight: "600", color: "#2c3e50" }}>
                    Commande #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h5>
                  <small className="text-muted">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Suivi de commande */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                    SUIVI DE COMMANDE
                  </h6>
                  <div className="d-flex justify-content-between position-relative" style={{ padding: "0 20px" }}>
                    <div 
                      style={{ 
                        position: "absolute", 
                        top: "15px", 
                        left: "40px", 
                        right: "40px", 
                        height: "3px", 
                        backgroundColor: "#e9ecef",
                        zIndex: 0
                      }}
                    >
                      <div 
                        style={{ 
                          height: "100%", 
                          backgroundColor: "#27ae60",
                          width: selectedOrder.status === "pending" ? "0%" :
                                 selectedOrder.status === "confirmed" ? "33%" :
                                 selectedOrder.status === "shipped" ? "66%" :
                                 selectedOrder.status === "delivered" ? "100%" : "0%",
                          transition: "width 0.5s ease"
                        }}
                      ></div>
                    </div>
                    {["pending", "confirmed", "shipped", "delivered"].map((status, index) => {
                      const statusInfo = getStatusInfo(status);
                      const isActive = ["pending", "confirmed", "shipped", "delivered"].indexOf(selectedOrder.status) >= index;
                      const isCurrent = selectedOrder.status === status;
                      return (
                        <div key={status} className="text-center" style={{ zIndex: 1 }}>
                          <div 
                            style={{
                              width: "35px",
                              height: "35px",
                              borderRadius: "50%",
                              backgroundColor: isActive ? statusInfo.color : "#e9ecef",
                              color: isActive ? "white" : "#adb5bd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 8px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              boxShadow: isCurrent ? `0 0 0 4px ${statusInfo.bgColor}` : "none",
                              transition: "all 0.3s ease"
                            }}
                          >
                            {isActive ? "✓" : index + 1}
                          </div>
                          <small 
                            style={{ 
                              color: isActive ? statusInfo.color : "#adb5bd",
                              fontWeight: isCurrent ? "600" : "400",
                              fontSize: "0.75rem"
                            }}
                          >
                            {statusInfo.label}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                  {selectedOrder.status === "cancelled" && (
                    <div className="alert alert-danger mt-3 mb-0" style={{ borderRadius: "10px" }}>
                      <strong>❌ Commande annulée</strong>
                    </div>
                  )}
                </div>

                {/* Adresse de livraison */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="text-muted mb-2" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                      ADRESSE DE LIVRAISON
                    </h6>
                    <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                      <p className="mb-1" style={{ fontWeight: "600" }}>{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="mb-1 text-muted">{selectedOrder.shippingAddress?.address}</p>
                      <p className="mb-1 text-muted">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                      <p className="mb-0 text-muted">📞 {selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                      MODE DE PAIEMENT
                    </h6>
                    <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
                      <p className="mb-0" style={{ fontSize: "1.1rem" }}>
                        {getPaymentLabel(selectedOrder.paymentMethod)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <h6 className="text-muted mb-3" style={{ fontSize: "0.8rem", letterSpacing: "1px" }}>
                  ARTICLES ({selectedOrder.items.length})
                </h6>
                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="d-flex align-items-center mb-2 p-3" 
                      style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}
                    >
                      <div 
                        style={{ 
                          width: "70px", 
                          height: "70px", 
                          borderRadius: "10px",
                          overflow: "hidden",
                          backgroundColor: "#e9ecef",
                          flexShrink: 0
                        }}
                      >
                        {item.product?.image ? (
                          <img 
                            src={item.product.image.startsWith('http') ? item.product.image : `http://localhost:5000${item.product.image}`}
                            alt={item.product?.name || "Produit"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <span style={{ fontSize: "2rem" }}>📦</span>
                          </div>
                        )}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <p className="mb-1" style={{ fontWeight: "600", color: "#2c3e50" }}>
                          {item.product?.name || "Produit non disponible"}
                        </p>
                        <small className="text-muted">
                          {item.quantity} × {item.price.toFixed(2)} TND
                        </small>
                      </div>
                      <div style={{ fontWeight: "700", color: "#27ae60", fontSize: "1.1rem" }}>
                        {(item.quantity * item.price).toFixed(2)} TND
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div 
                  className="d-flex justify-content-between align-items-center mt-4 p-3" 
                  style={{ 
                    backgroundColor: "#667eea", 
                    borderRadius: "12px",
                    color: "white"
                  }}
                >
                  <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>Total de la commande</span>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                    {selectedOrder.totalAmount.toFixed(2)} TND
                  </span>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ borderRadius: "25px" }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
