"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        address: parsedUser.address || ""
      });
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de mise à jour du profil
    alert("Profil mis à jour avec succès!");
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa", padding: "2rem 0" }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1" style={{ color: "#2c3e50", fontWeight: "700" }}>
              👤 Mon Profil
            </h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link href="/client" style={{ textDecoration: "none" }}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Mon Profil</li>
              </ol>
            </nav>
          </div>
          <Link href="/client" className="btn btn-outline-primary">
            <i className="mdi mdi-arrow-left me-2"></i>
            Retour
          </Link>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            {/* Profile Card */}
            <div className="card border-0 shadow-sm">
              <div 
                className="card-header text-white text-center py-4"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <div 
                  className="mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem"
                  }}
                >
                  👤
                </div>
                <h4 className="mb-1">{user?.name}</h4>
                <p className="mb-0 small" style={{ opacity: 0.9 }}>{user?.email}</p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted">RÔLE</small>
                  <p className="mb-0 fw-bold">
                    {user?.role === "admin" ? "👑 Administrateur" : "🛍️ Client"}
                  </p>
                </div>
                <div className="mb-3">
                  <small className="text-muted">MEMBRE DEPUIS</small>
                  <p className="mb-0 fw-bold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            {/* Profile Form */}
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0" style={{ color: "#2c3e50", fontWeight: "700" }}>
                    Informations personnelles
                  </h5>
                  {!editing && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setEditing(true)}
                      style={{ borderRadius: "8px" }}
                    >
                      <i className="mdi mdi-pencil me-2"></i>
                      Modifier
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nom complet</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!editing}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!editing}
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!editing}
                        placeholder="Votre numéro de téléphone"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Adresse</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!editing}
                        placeholder="Votre adresse"
                        style={{ borderRadius: "8px" }}
                      />
                    </div>
                  </div>

                  {editing && (
                    <div className="mt-4 d-flex gap-2">
                      <button type="submit" className="btn btn-success" style={{ borderRadius: "8px" }}>
                        <i className="mdi mdi-check me-2"></i>
                        Enregistrer
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setEditing(false)}
                        style={{ borderRadius: "8px" }}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body p-4">
                <h5 className="mb-4" style={{ color: "#2c3e50", fontWeight: "700" }}>
                  🔒 Changer le mot de passe
                </h5>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe actuel</label>
                    <input type="password" className="form-control" style={{ borderRadius: "8px" }} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input type="password" className="form-control" style={{ borderRadius: "8px" }} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmer le mot de passe</label>
                    <input type="password" className="form-control" style={{ borderRadius: "8px" }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: "8px" }}>
                    <i className="mdi mdi-lock-reset me-2"></i>
                    Mettre à jour le mot de passe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
