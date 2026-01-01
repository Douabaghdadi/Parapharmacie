"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simuler l'envoi du message
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  return (
    <div style={{ marginTop: "160px", backgroundColor: "#f8f9fa", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Hero Section */}
      <div style={{ background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)", padding: "60px 0", marginBottom: "50px" }}>
        <div className="container text-center">
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "white", marginBottom: "15px" }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto" }}>
            Une question ? N'hésitez pas à nous contacter. Notre équipe est là pour vous aider.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="row g-5">
          {/* Informations de contact */}
          <div className="col-lg-4">
            <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)", height: "100%" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "30px" }}>
                Nos Coordonnées
              </h3>

              {/* Adresse */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: "20px", color: "#81C784" }}></i>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "5px" }}>Adresse</h5>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                    123 Rue de la Santé<br />
                    Tunis, Tunisie
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="fas fa-phone-alt" style={{ fontSize: "20px", color: "#81C784" }}></i>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "5px" }}>Téléphone</h5>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    (+216) 29 135 995
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="fas fa-envelope" style={{ fontSize: "20px", color: "#81C784" }}></i>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "5px" }}>Email</h5>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    contact@parapharmacie.tn
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="fas fa-clock" style={{ fontSize: "20px", color: "#81C784" }}></i>
                </div>
                <div>
                  <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "5px" }}>Horaires</h5>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" }}>
                    Lun - Ven: 9h00 - 18h00<br />
                    Sam: 9h00 - 13h00
                  </p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "1px solid #eee" }}>
                <h5 style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a", marginBottom: "15px" }}>Suivez-nous</h5>
                <div style={{ display: "flex", gap: "12px" }}>
                  <a href="#" style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", color: "#81C784", transition: "all 0.3s" }}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", color: "#81C784", transition: "all 0.3s" }}>
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#f0f9f4", display: "flex", alignItems: "center", justifyContent: "center", color: "#81C784", transition: "all 0.3s" }}>
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="col-lg-8">
            <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "30px" }}>
                Envoyez-nous un message
              </h3>

              {success && (
                <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: "15px 20px", borderRadius: "10px", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <i className="fas fa-check-circle"></i>
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
                      placeholder="Votre nom"
                      onFocus={(e) => e.target.style.borderColor = "#81C784"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
                      placeholder="votre@email.com"
                      onFocus={(e) => e.target.style.borderColor = "#81C784"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Sujet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border-color 0.3s", boxSizing: "border-box" }}
                      placeholder="Sujet de votre message"
                      onFocus={(e) => e.target.style.borderColor = "#81C784"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: "100%", padding: "14px 18px", border: "2px solid #e0e0e0", borderRadius: "10px", fontSize: "15px", outline: "none", transition: "border-color 0.3s", resize: "vertical", boxSizing: "border-box" }}
                      placeholder="Écrivez votre message ici..."
                      onFocus={(e) => e.target.style.borderColor = "#81C784"}
                      onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        padding: "16px 40px",
                        background: loading ? "#ccc" : "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                        boxShadow: loading ? "none" : "0 4px 15px rgba(129,199,132,0.3)"
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div style={{ marginTop: "50px", backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102239.97366!2d10.0653!3d36.8065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis!5e0!3m2!1sfr!2stn!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
