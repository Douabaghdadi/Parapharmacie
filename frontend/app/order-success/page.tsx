"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderRef, setOrderRef] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) {
      router.push("/");
      return;
    }
    setOrderRef(ref);
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div style={{ marginTop: "160px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "160px", backgroundColor: "#fafbfc", minHeight: "100vh", paddingBottom: "80px" }}>
      <div className="container py-5">
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          {/* Success Icon */}
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 30px", boxShadow: "0 20px 60px rgba(129,199,132,0.3)" }}>
            <i className="fa fa-check" style={{ fontSize: "60px", color: "white" }}></i>
          </div>
          
          {/* Title */}
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#1a1a1a", marginBottom: "16px" }}>
            Commande confirmée !
          </h1>
          
          {/* Description */}
          <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "40px", lineHeight: "1.6" }}>
            Merci pour votre commande. Nous avons bien reçu votre demande et nous la traitons dans les plus brefs délais.
          </p>
          
          {/* Order Details Card */}
          <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #e5e7eb", marginBottom: "30px" }}>
            {/* Order Reference */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "14px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                Référence de commande
              </span>
              <div style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#f0f9f4", borderRadius: "12px", border: "2px dashed #81C784" }}>
                <span style={{ fontSize: "24px", fontWeight: "800", color: "#1a1a1a", letterSpacing: "1px" }}>
                  #{orderRef}
                </span>
              </div>
            </div>
            
            {/* Divider */}
            <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "24px", marginTop: "24px" }}>
              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", textAlign: "left" }}>
                {/* Email Confirmation */}
                <div style={{ padding: "20px", backgroundColor: "#fafbfc", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <i className="fa fa-envelope" style={{ fontSize: "18px", color: "#81C784" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                      Email de confirmation
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
                    Vous recevrez un email avec les détails de votre commande
                  </p>
                </div>
                
                {/* Delivery Estimate */}
                <div style={{ padding: "20px", backgroundColor: "#fafbfc", borderRadius: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <i className="fa fa-truck" style={{ fontSize: "18px", color: "#81C784" }}></i>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>
                      Livraison estimée
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
                    2-4 jours ouvrables
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/client/orders" 
              style={{ padding: "16px 32px", background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)", color: "white", textDecoration: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", boxShadow: "0 8px 20px rgba(129,199,132,0.25)", display: "inline-block", border: "none", cursor: "pointer" }}
            >
              Voir mes commandes
            </Link>
            <Link 
              href="/" 
              style={{ padding: "16px 32px", backgroundColor: "white", color: "#1a1a1a", textDecoration: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", border: "2px solid #e5e7eb", display: "inline-block", cursor: "pointer" }}
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
