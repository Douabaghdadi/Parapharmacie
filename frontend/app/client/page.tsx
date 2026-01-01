"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DashboardCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  color: string;
  bgGradient: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchClientStats();
  }, [router]);

  const fetchClientStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const orders = await response.json();
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === "pending").length,
        deliveredOrders: orders.filter((o: any) => o.status === "delivered").length,
        totalSpent: orders
          .filter((o: any) => o.status !== "cancelled")
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0)
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "Mes commandes",
      subtitle: "Suivez l'état de toutes vos commandes",
      icon: "📦",
      link: "/client/orders",
      color: "#667eea",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Votre évolution",
      subtitle: "L'évolution de vos commandes et de votre CA",
      icon: "📊",
      link: "/client/evolution",
      color: "#3498db",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "3rem 0", 
      backgroundColor: "#ffffff",
      minHeight: "calc(100vh - 200px)" 
    }}>
      {/* Welcome Section */}
      <div className="container mb-5">
        <div className="text-center mb-5">
          <h1 style={{ 
            fontSize: "2.8rem", 
            fontWeight: "300", 
            color: "#2c3e50",
            letterSpacing: "2px",
            marginBottom: "0.5rem"
          }}>
            ESPACE CLIENT
          </h1>
          <div style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #81c408 0%, #5a9006 100%)",
            margin: "1rem auto 1.5rem"
          }}></div>
          <p style={{ 
            fontSize: "1.1rem", 
            color: "#6c757d",
            fontWeight: "300"
          }}>
            Bienvenue, <strong style={{ fontWeight: "500" }}>{user?.name || "Client"}</strong>
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mb-5">
        <div className="row g-4">
          <div className="col-md-3">
            <div 
              className="card border-0" 
              style={{ 
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                height: "4px",
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
              }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2" style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      letterSpacing: "1px"
                    }}>
                      TOTAL COMMANDES
                    </p>
                    <h2 className="mb-0" style={{ 
                      color: "#667eea",
                      fontWeight: "300",
                      fontSize: "2.5rem"
                    }}>
                      {stats.totalOrders}
                    </h2>
                  </div>
                  <div style={{ 
                    fontSize: "3rem", 
                    opacity: 0.15,
                    lineHeight: 1
                  }}>
                    🛍️
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div 
              className="card border-0" 
              style={{ 
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                height: "4px",
                background: "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"
              }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2" style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      letterSpacing: "1px"
                    }}>
                      EN ATTENTE
                    </p>
                    <h2 className="mb-0" style={{ 
                      color: "#f5576c",
                      fontWeight: "300",
                      fontSize: "2.5rem"
                    }}>
                      {stats.pendingOrders}
                    </h2>
                  </div>
                  <div style={{ 
                    fontSize: "3rem", 
                    opacity: 0.15,
                    lineHeight: 1
                  }}>
                    ⏳
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div 
              className="card border-0" 
              style={{ 
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                height: "4px",
                background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
              }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2" style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      letterSpacing: "1px"
                    }}>
                      LIVRÉES
                    </p>
                    <h2 className="mb-0" style={{ 
                      color: "#00f2fe",
                      fontWeight: "300",
                      fontSize: "2.5rem"
                    }}>
                      {stats.deliveredOrders}
                    </h2>
                  </div>
                  <div style={{ 
                    fontSize: "3rem", 
                    opacity: 0.15,
                    lineHeight: 1
                  }}>
                    ✅
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div 
              className="card border-0" 
              style={{ 
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{
                height: "4px",
                background: "linear-gradient(90deg, #fa709a 0%, #fee140 100%)"
              }}></div>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-2" style={{ 
                      fontSize: "0.75rem", 
                      fontWeight: "600",
                      letterSpacing: "1px"
                    }}>
                      TOTAL DÉPENSÉ
                    </p>
                    <h2 className="mb-0" style={{ 
                      color: "#fa709a",
                      fontWeight: "300",
                      fontSize: "1.8rem"
                    }}>
                      {stats.totalSpent.toFixed(2)} <span style={{ fontSize: "1.2rem" }}>TND</span>
                    </h2>
                  </div>
                  <div style={{ 
                    fontSize: "3rem", 
                    opacity: 0.15,
                    lineHeight: 1
                  }}>
                    💰
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="container pb-5">
        <div className="row g-4">
          {dashboardCards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <Link href={card.link} style={{ textDecoration: "none" }}>
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  }}
                >
                  <div 
                    style={{
                      background: card.bgGradient,
                      height: "5px",
                      width: "100%"
                    }}
                  ></div>
                  <div className="card-body text-center p-5">
                    <div 
                      style={{
                        fontSize: "4.5rem",
                        marginBottom: "1.5rem",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                        lineHeight: 1
                      }}
                    >
                      {card.icon}
                    </div>
                    <h5 
                      className="card-title mb-3" 
                      style={{ 
                        color: card.color,
                        fontWeight: "500",
                        fontSize: "1.3rem",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {card.title}
                    </h5>
                    <p 
                      className="card-text text-muted mb-0"
                      style={{ 
                        fontSize: "0.9rem",
                        lineHeight: "1.6",
                        fontWeight: "300"
                      }}
                    >
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
