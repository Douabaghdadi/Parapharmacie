"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function ClientOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }
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
    fetchOrders();
  }, []);

  const getStatusStyle = (status: string) => {
    const styles: any = {
      pending: { bg: '#ffb524', label: 'En attente' },
      confirmed: { bg: '#81c408', label: 'Confirmée' },
      shipped: { bg: '#0d6efd', label: 'Expédiée' },
      delivered: { bg: '#198754', label: 'Livrée' },
      cancelled: { bg: '#dc3545', label: 'Annulée' }
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="spinner-border" style={{ color: "#81c408", width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "calc(100vh - 200px)", 
      backgroundColor: "#f8f9fa", 
      padding: "3rem 0" 
    }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "2rem", 
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "0.25rem"
            }}>
              Mes Commandes
            </h1>
            <p style={{ color: "#6c757d", margin: 0, fontSize: "0.95rem" }}>
              Gérez et suivez vos commandes
            </p>
          </div>
          <Link 
            href="/client"
            style={{
              padding: "10px 24px",
              backgroundColor: "white",
              color: "#81c408",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "500",
              border: "2px solid #81c408",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#81c408";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#81c408";
            }}
          >
            ← Retour
          </Link>
        </div>

        {orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {orders.map((order: any) => {
              const statusStyle = getStatusStyle(order.status);
              return (
                <div 
                  key={order._id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    border: "1px solid #e9ecef",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
                    e.currentTarget.style.borderColor = "#81c408";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#e9ecef";
                  }}
                >
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "1.5rem",
                    alignItems: "center"
                  }}>
                    {/* Commande */}
                    <div>
                      <div style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        marginBottom: "0.4rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Commande
                      </div>
                      <div style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#81c408",
                        fontFamily: "monospace"
                      }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <div style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        marginBottom: "0.4rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Date
                      </div>
                      <div style={{
                        fontSize: "0.95rem",
                        color: "#2c3e50"
                      }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Articles */}
                    <div>
                      <div style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        marginBottom: "0.4rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Articles
                      </div>
                      <div style={{
                        fontSize: "0.95rem",
                        color: "#2c3e50"
                      }}>
                        {order.items?.length || 0}
                      </div>
                    </div>

                    {/* Montant */}
                    <div>
                      <div style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        color: "#6c757d",
                        marginBottom: "0.4rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Montant
                      </div>
                      <div style={{
                        fontSize: "1.1rem",
                        fontWeight: "700",
                        color: "#2c3e50"
                      }}>
                        {order.totalAmount.toFixed(2)} TND
                      </div>
                    </div>

                    {/* Statut */}
                    <div style={{ textAlign: "right" }}>
                      <span style={{
                        backgroundColor: statusStyle.bg,
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        display: "inline-block"
                      }}>
                        {statusStyle.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "4rem 2rem",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <div style={{
              fontSize: "4rem",
              marginBottom: "1rem",
              opacity: 0.3
            }}>
              🛍️
            </div>
            <h3 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: "0.5rem"
            }}>
              Aucune commande
            </h3>
            <p style={{
              fontSize: "1rem",
              color: "#6c757d",
              marginBottom: "1.5rem"
            }}>
              Vous n'avez pas encore passé de commande
            </p>
            <Link 
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                backgroundColor: "#81c408",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#6fa006";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#81c408";
              }}
            >
              Découvrir nos produits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientOrdersPage;
