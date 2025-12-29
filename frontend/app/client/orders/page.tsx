"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setLoading(false);
    }
  };

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
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 style={{ fontSize: "2.5rem", fontWeight: "300", color: "#2c3e50" }}>
            MES COMMANDES
          </h1>
          <Link href="/client" className="btn btn-outline-primary">
            Retour
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="row g-4">
            {orders.map((order: any) => (
              <div key={order._id} className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>COMMANDE</p>
                        <p className="mb-0" style={{ fontWeight: "700", color: "#667eea" }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>DATE</p>
                        <p className="mb-0">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="col-md-2">
                        <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>ARTICLES</p>
                        <p className="mb-0">{order.items?.length || 0}</p>
                      </div>
                      <div className="col-md-2">
                        <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>MONTANT</p>
                        <p className="mb-0" style={{ fontWeight: "700", color: "#27ae60" }}>
                          {order.totalAmount.toFixed(2)} TND
                        </p>
                      </div>
                      <div className="col-md-2">
                        <span style={{
                          backgroundColor: order.status === 'delivered' ? '#28a745' : '#ffc107',
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '0.85rem'
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
            <div className="card-body text-center py-5">
              <div style={{ fontSize: "5rem", opacity: 0.2 }}>🛒</div>
              <h4 style={{ color: "#6c757d", fontWeight: "300" }}>
                Aucune commande trouvée
              </h4>
              <Link href="/" className="btn btn-primary mt-3">
                Commencer mes achats
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
