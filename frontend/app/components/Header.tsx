'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getCartCount } = useCart();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Charger le nombre de commandes en attente
      if (parsedUser) {
        fetchPendingOrders();
      }
    }
    
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => {
        console.log('Catégories chargées:', data);
        setCategories(data);
      })
      .catch(err => console.error('Erreur chargement catégories:', err));

    fetch('http://localhost:5000/api/subcategories')
      .then(res => res.json())
      .then(data => {
        console.log('Sous-catégories chargées:', data);
        setSubcategories(data);
      })
      .catch(err => console.error('Erreur chargement sous-catégories:', err));

    // Fermer le menu utilisateur quand on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const orders = await response.json();
        const pending = orders.filter((o: any) => 
          o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipped'
        ).length;
        setPendingOrdersCount(pending);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPendingOrdersCount(0);
    router.push('/login');
  };

  return (
    <div className="container-fluid fixed-top" style={{backgroundColor: 'white'}}>
      <div className="container px-0">
        <nav className="navbar navbar-light bg-white navbar-expand-xl">
          <Link href="/" className="navbar-brand">
            <img src="/img/logo.png" alt="Green Parapharmacie" style={{height: '80px', width: 'auto'}} />
          </Link>
          <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars text-primary"></span>
          </button>
          <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
            <div className="navbar-nav mx-auto">
              <Link href="/" className="nav-item nav-link active">Home</Link>
              <Link href="/shop" className="nav-item nav-link">Shop</Link>
              <Link href="/shop-detail" className="nav-item nav-link">Shop Detail</Link>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                <div className="dropdown-menu m-0 bg-secondary rounded-0">
                  <Link href="/cart" className="dropdown-item">Cart</Link>
                  <Link href="/checkout" className="dropdown-item">Chackout</Link>
                  <Link href="/testimonial" className="dropdown-item">Testimonial</Link>
                  <Link href="/404" className="dropdown-item">404 Page</Link>
                </div>
              </div>
              <Link href="/contact" className="nav-item nav-link">Contact</Link>
            </div>
            <div className="d-flex m-3 me-0">
              <button className="btn-search btn btn-md-square rounded-circle me-4" style={{border: '2px solid #ffb524', backgroundColor: 'white'}}>
                <i className="fas fa-search" style={{color: '#81c408'}}></i>
              </button>
              <Link href="/cart" className="position-relative me-4 my-auto">
                <i className="fa fa-shopping-bag fa-2x" style={{color: '#81c408'}}></i>
                {getCartCount() > 0 && (
                  <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{top: '-5px', left: '15px', height: '20px', minWidth: '20px'}}>{getCartCount()}</span>
                )}
              </Link>
              <Link href="/client/favorites" className="position-relative me-4 my-auto">
                <i className="fa fa-heart fa-2x" style={{color: '#81c408'}}></i>
                {favoritesCount > 0 && (
                  <span className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1" style={{top: '-5px', left: '15px', height: '20px', minWidth: '20px'}}>{favoritesCount}</span>
                )}
              </Link>
              {user ? (
                <div className="dropdown" style={{ position: 'relative' }}>
                  <a 
                    href="#" 
                    className="my-auto" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUserMenu(!showUserMenu);
                    }}
                    style={{textDecoration: 'none'}}
                  >
                    <i className="fas fa-user fa-2x" style={{color: '#81c408'}}></i>
                  </a>
                  {showUserMenu && (
                    <div 
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '0.5rem',
                        minWidth: '280px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        border: '1px solid #e8e8e8'
                      }}
                    >
                      <div style={{
                        padding: '20px',
                        backgroundColor: '#f8f9fa',
                        borderBottom: '1px solid #e8e8e8'
                      }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#2c3e50',
                          marginBottom: '4px'
                        }}>
                          {user.name || 'Utilisateur'}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6c757d'
                        }}>
                          {user.email}
                        </div>
                      </div>
                      
                      <div style={{ padding: '8px 0' }}>
                        <Link 
                          href={user.role === 'admin' ? '/admin' : '/client'} 
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#2c3e50',
                            textDecoration: 'none',
                            fontSize: '15px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.paddingLeft = '24px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.paddingLeft = '20px';
                          }}
                        >
                          <i 
                            className={`fas ${user.role === 'admin' ? 'fa-cog' : 'fa-user-circle'}`}
                            style={{
                              fontSize: '18px',
                              marginRight: '12px',
                              color: '#81c408',
                              width: '20px',
                              textAlign: 'center'
                            }}
                          ></i>
                          {user.role === 'admin' ? 'Administration' : 'Mon Compte'}
                        </Link>
                      </div>

                      <div style={{
                        borderTop: '1px solid #e8e8e8',
                        padding: '8px 0'
                      }}>
                        <a 
                          onClick={(e) => {
                            e.preventDefault();
                            setShowUserMenu(false);
                            handleLogout();
                          }} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#dc3545',
                            textDecoration: 'none',
                            fontSize: '15px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff5f5';
                            e.currentTarget.style.paddingLeft = '24px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.paddingLeft = '20px';
                          }}
                        >
                          <i 
                            className="fas fa-sign-out-alt"
                            style={{
                              fontSize: '18px',
                              marginRight: '12px',
                              width: '20px',
                              textAlign: 'center'
                            }}
                          ></i>
                          Déconnexion
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="my-auto">
                  <i className="fas fa-user fa-2x" style={{color: '#81c408'}}></i>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div className="container-fluid bg-light py-3">
        <div className="container">
          <div style={{display: 'flex', gap: '0', justifyContent: 'center'}}>
            {categories.map(cat => {
              const catSubcategories = subcategories.filter(sub => sub.category?._id === cat._id);
              return (
                <div 
                  key={cat._id}
                  style={{position: 'relative'}}
                  onMouseEnter={() => setHoveredCategory(cat._id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <a 
                    href="#" 
                    style={{
                      display: 'block',
                      padding: '8px 12px',
                      color: '#666',
                      fontSize: '14px',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat.name} {catSubcategories.length > 0 && <i className="fas fa-chevron-down ms-1" style={{fontSize: '10px'}}></i>}
                  </a>
                  {hoveredCategory === cat._id && catSubcategories.length > 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        minWidth: '220px',
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 99999,
                        padding: '8px 0'
                      }}
                      onMouseEnter={() => setHoveredCategory(cat._id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {catSubcategories.map(sub => (
                        <Link
                          key={sub._id}
                          href={`/subcategory/${sub._id}`}
                          style={{
                            display: 'block',
                            padding: '8px 16px',
                            color: '#666',
                            fontSize: '13px',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.color = '#81c408';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#666';
                          }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
