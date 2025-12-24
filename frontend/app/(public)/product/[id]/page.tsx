'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '160px'}}>
        <div className="text-center py-5">
          <div className="spinner-grow text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '160px'}}>
        <div className="alert alert-danger">Produit non trouvé</div>
      </div>
    );
  }

  const finalPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  return (
    <div className="container-fluid py-5" style={{marginTop: '160px'}}>
      <div className="container py-5">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Accueil</Link></li>
            <li className="breadcrumb-item">{product.category?.name}</li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="border rounded p-3 position-relative">
              <img src={product.image} className="img-fluid w-100 rounded" alt={product.name} />
              {product.discount > 0 && (
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-danger fs-5 px-3 py-2">-{product.discount}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-7">
            <h2 className="fw-bold mb-3">{product.name}</h2>
            
            {product.brand && (
              <p className="text-muted mb-3">
                <strong>Marque:</strong> {product.brand.name}
              </p>
            )}

            <div className="mb-3">
              {product.subcategories?.map((sub: any) => (
                <span key={sub._id} className="badge bg-secondary me-2">{sub.name}</span>
              ))}
            </div>

            <div className="mb-4">
              {product.discount > 0 ? (
                <>
                  <h3 className="text-muted text-decoration-line-through">{product.price} TND</h3>
                  <h2 className="text-success fw-bold">{finalPrice} TND</h2>
                  <p className="text-success">Vous économisez {(product.price - finalPrice).toFixed(2)} TND</p>
                </>
              ) : (
                <h2 className="text-dark fw-bold">{product.price} TND</h2>
              )}
            </div>

            <div className="mb-4">
              <button className="btn btn-primary btn-lg px-5" disabled={product.stock === 0}>
                <i className="fa fa-shopping-bag me-2"></i>
                {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>

            <div className="border-top pt-4">
              <h4 className="mb-3">Description</h4>
              <p style={{whiteSpace: 'pre-line'}}>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
