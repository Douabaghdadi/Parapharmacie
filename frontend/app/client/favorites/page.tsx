"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";

export default function FavoritesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Erreur:", err);
      }
      setLoading(false);
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFavorite = async (productId: string) => {
    await removeFavorite(productId);
    setProducts(products.filter((p) => p._id !== productId));
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div className="spinner-grow" style={{ color: "#81C784" }} role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px 40px" }}>
      {/* Header Section */}
      <div style={{ 
        background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
        borderRadius: "24px",
        padding: "50px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-30px",
          left: "30%",
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%"
        }}></div>
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px" }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(10px)"
            }}>
              <i className="fas fa-heart" style={{ fontSize: "28px", color: "white" }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", color: "white", margin: 0 }}>
                Mes Favoris
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", margin: "5px 0 0 0" }}>
                {products.length} produit{products.length > 1 ? "s" : ""} sauvegardé{products.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 40px",
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
        }}>
          <div style={{
            width: "120px",
            height: "120px",
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 30px"
          }}>
            <i className="far fa-heart" style={{ fontSize: "50px", color: "#ccc" }}></i>
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: "700", color: "#1a1a1a", marginBottom: "12px" }}>
            Votre liste de favoris est vide
          </h3>
          <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px", maxWidth: "400px", margin: "0 auto 30px" }}>
            Explorez notre catalogue et ajoutez vos produits préférés pour les retrouver facilement.
          </p>
          <Link 
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 32px",
              background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 8px 25px rgba(129,199,132,0.3)",
              transition: "all 0.3s"
            }}
          >
            <i className="fas fa-shopping-bag"></i>
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px"
        }}>
          {products.map((product) => {
            const finalPrice = product.discount > 0
              ? (product.price * (1 - product.discount / 100)).toFixed(2)
              : product.price;

            return (
              <div 
                key={product._id} 
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(product._id)}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ff4757";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#666";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  title="Retirer des favoris"
                >
                  <i className="fas fa-times" style={{ fontSize: "14px" }}></i>
                </button>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "13px",
                    fontWeight: "700",
                    zIndex: 10,
                    boxShadow: "0 4px 15px rgba(255,107,107,0.4)"
                  }}>
                    -{product.discount}%
                  </div>
                )}

                {/* Product Image */}
                <Link href={`/product/${product._id}`}>
                  <div style={{
                    background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
                    padding: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "250px"
                  }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "200px",
                        objectFit: "contain",
                        transition: "transform 0.4s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div style={{ padding: "25px" }}>
                  {/* Brand */}
                  {product.brand?.name && (
                    <span style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
                      color: "white",
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {product.brand.name}
                    </span>
                  )}

                  {/* Product Name */}
                  <Link href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                    <h4 style={{
                      fontSize: "17px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "15px",
                      lineHeight: "1.5",
                      height: "52px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      transition: "color 0.3s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#81C784"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#1a1a1a"}
                    >
                      {product.name}
                    </h4>
                  </Link>

                  {/* Price Section */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px"
                  }}>
                    {product.discount > 0 ? (
                      <>
                        <span style={{
                          fontSize: "14px",
                          color: "#999",
                          textDecoration: "line-through"
                        }}>
                          {product.price} TND
                        </span>
                        <span style={{
                          fontSize: "24px",
                          fontWeight: "800",
                          background: "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent"
                        }}>
                          {finalPrice} TND
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        color: "#1a1a1a"
                      }}>
                        {product.price} TND
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "20px"
                  }}>
                    <div style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: product.stock > 0 ? "#2ed573" : "#ff4757"
                    }}></div>
                    <span style={{
                      fontSize: "13px",
                      color: product.stock > 0 ? "#2ed573" : "#ff4757",
                      fontWeight: "500"
                    }}>
                      {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: product.stock === 0 
                        ? "#e0e0e0" 
                        : "linear-gradient(135deg, #81C784 0%, #66BB6A 100%)",
                      color: product.stock === 0 ? "#999" : "white",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: product.stock === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      boxShadow: product.stock === 0 ? "none" : "0 8px 25px rgba(129,199,132,0.3)"
                    }}
                    onMouseEnter={(e) => {
                      if (product.stock > 0) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 30px rgba(129,199,132,0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = product.stock === 0 ? "none" : "0 8px 25px rgba(129,199,132,0.3)";
                    }}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
