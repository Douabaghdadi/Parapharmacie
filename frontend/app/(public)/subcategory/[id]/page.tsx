'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function SubcategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategory, setSubcategory] = useState<any>(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/subcategories/${params.id}`)
      .then(r => r.json())
      .then(data => setSubcategory(data));

    fetch('http://localhost:5000/api/brands')
      .then(r => r.json())
      .then(data => setBrands(data));

    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        console.log('Tous les produits:', data);
        console.log('ID recherché:', params.id);
        const filtered = data.filter((p: any) => {
          console.log('Produit:', p.name, 'Subcategories:', p.subcategories);
          return p.subcategories?.some((sub: any) => sub._id === params.id);
        });
        console.log('Produits filtrés:', filtered);
        setProducts(filtered);
        setFilteredProducts(filtered);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    let result = [...products];

    if (selectedBrand) {
      result = result.filter((p: any) => p.brand?._id === selectedBrand);
    }

    if (showDiscountOnly) {
      result = result.filter((p: any) => p.discount > 0);
    }

    if (priceRange.min) {
      result = result.filter((p: any) => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        return finalPrice >= parseFloat(priceRange.min);
      });
    }

    if (priceRange.max) {
      result = result.filter((p: any) => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        return finalPrice <= parseFloat(priceRange.max);
      });
    }

    if (sortBy === 'price-asc') {
      result.sort((a: any, b: any) => {
        const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a: any, b: any) => {
        const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(result);
  }, [products, selectedBrand, priceRange, showDiscountOnly, sortBy]);

  return (
    <div className="container-fluid py-5" style={{marginTop: '160px'}}>
      <div className="container py-5">
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href="/">Accueil</Link></li>
                <li className="breadcrumb-item active">{subcategory?.name}</li>
              </ol>
            </nav>
            <h2 className="mb-2">{subcategory?.name}</h2>
            <p className="text-muted mb-0">Catégorie: {subcategory?.category?.name}</p>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-3">Filtres</h5>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Marque</label>
                  <select className="form-select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">Toutes les marques</option>
                    {brands.map((brand: any) => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Prix (TND)</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Min" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                      />
                    </div>
                    <div className="col-6">
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Max" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="discountFilter"
                      checked={showDiscountOnly}
                      onChange={(e) => setShowDiscountOnly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="discountFilter">
                      Produits en promotion uniquement
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Trier par</label>
                  <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Par défaut</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>

                <button 
                  className="btn btn-outline-secondary w-100" 
                  onClick={() => {
                    setSelectedBrand('');
                    setPriceRange({ min: '', max: '' });
                    setShowDiscountOnly(false);
                    setSortBy('');
                  }}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-9">

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-grow text-primary" role="status"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="alert alert-info text-center">
            Aucun produit disponible avec ces filtres
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product: any) => (
              <div key={product._id} className="col-md-6 col-lg-4">
                <Link href={`/product/${product._id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="rounded position-relative fruite-item h-100 d-flex flex-column border shadow-sm" style={{cursor: 'pointer', transition: 'transform 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="fruite-img">
                    <img src={product.image} className="img-fluid w-100 rounded-top" alt={product.name} style={{height: '250px', objectFit: 'cover'}} />
                  </div>
                  <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{top: '10px', left: '10px'}}>
                    {product.brand?.name || 'Sans marque'}
                  </div>
                  {product.discount > 0 && (
                    <div className="text-white bg-danger px-3 py-1 rounded position-absolute" style={{top: '10px', right: '10px'}}>
                      -{product.discount}%
                    </div>
                  )}
                  <div className="p-4 border border-secondary border-top-0 rounded-bottom flex-grow-1 d-flex flex-column">
                    <h4 style={{height: '60px', overflow: 'hidden'}}>{product.name}</h4>
                    <p className="text-truncate" style={{height: '24px'}}>{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <p className="text-muted text-decoration-line-through mb-0 small">{product.price} TND</p>
                            <p className="text-dark fs-5 fw-bold mb-0">{(product.price * (1 - product.discount / 100)).toFixed(2)} TND</p>
                          </>
                        ) : (
                          <p className="text-dark fs-5 fw-bold mb-0">{product.price} TND</p>
                        )}
                      </div>
                      <button className="btn border border-secondary rounded-pill px-3 text-primary">
                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Ajouter
                      </button>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
