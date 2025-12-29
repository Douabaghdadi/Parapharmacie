"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          const updatedOrder = await response.json();
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: { class: "badge-warning", icon: "mdi-clock-outline", text: "En attente" },
      confirmed: { class: "badge-info", icon: "mdi-check-circle-outline", text: "Confirmée" },
      shipped: { class: "badge-primary", icon: "mdi-truck-delivery-outline", text: "Expédiée" },
      delivered: { class: "badge-success", icon: "mdi-package-variant", text: "Livrée" },
      cancelled: { class: "badge-danger", icon: "mdi-close-circle-outline", text: "Annulée" }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.class}`}>
        <i className={`mdi ${badge.icon}`}></i> {badge.text}
      </span>
    );
  };

  const getPaymentBadge = (method: string) => {
    return method === "cash" ? (
      <span className="badge badge-secondary">
        <i className="mdi mdi-cash"></i> Espèces
      </span>
    ) : (
      <span className="badge badge-info">
        <i className="mdi mdi-credit-card"></i> Carte
      </span>
    );
  };

  const filtered = orders.filter((order: any) => {
    const matchSearch = 
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || order.status === filterStatus;
    const matchPayment = !filterPayment || order.paymentMethod === filterPayment;
    return matchSearch && matchStatus && matchPayment;
  }).sort((a: any, b: any) => {
    if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "amount-desc") return b.totalAmount - a.totalAmount;
    if (sortBy === "amount-asc") return a.totalAmount - b.totalAmount;
    return 0;
  });

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterPayment("");
    setSortBy("date-desc");
    setCurrentPage(1);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === "pending").length,
      confirmed: orders.filter((o: any) => o.status === "confirmed").length,
      shipped: orders.filter((o: any) => o.status === "shipped").length,
      delivered: orders.filter((o: any) => o.status === "delivered").length,
      cancelled: orders.filter((o: any) => o.status === "cancelled").length,
      totalRevenue: orders.filter((o: any) => o.status !== "cancelled").reduce((sum: number, o: any) => sum + o.totalAmount, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Gestion des Commandes</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Commandes</li>
                </ol>
              </nav>
            </div>

            {/* Statistiques */}
            <div className="row mb-4">
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-info card-img-holder text-white">
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">
                      Total Commandes
                      <i className="mdi mdi-cart float-right"></i>
                    </h4>
                    <h2 className="mb-0">{stats.total}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-warning card-img-holder text-white">
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">
                      En attente
                      <i className="mdi mdi-clock-outline float-right"></i>
                    </h4>
                    <h2 className="mb-0">{stats.pending}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-primary card-img-holder text-white">
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">
                      En cours
                      <i className="mdi mdi-truck-delivery float-right"></i>
                    </h4>
                    <h2 className="mb-0">{stats.confirmed + stats.shipped}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">
                      Revenu Total
                      <i className="mdi mdi-cash-multiple float-right"></i>
                    </h4>
                    <h2 className="mb-0">{stats.totalRevenue.toFixed(2)} TND</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Liste des commandes</h4>
                    
                    {/* Barre de recherche et filtres */}
                    <div className="mb-4">
                      <div className="row g-2 mb-3 align-items-center">
                        <div className="col-lg-6 col-md-12">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="mdi mdi-magnify text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Rechercher par ID, client, email..."
                              value={search}
                              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="mdi mdi-sort text-muted"></i>
                            </span>
                            <select 
                              className="form-select border-start-0" 
                              value={sortBy} 
                              onChange={(e) => setSortBy(e.target.value)}
                            >
                              <option value="date-desc">📅 Plus récentes</option>
                              <option value="date-asc">📅 Plus anciennes</option>
                              <option value="amount-desc">💰 Montant décroissant</option>
                              <option value="amount-asc">💰 Montant croissant</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <button 
                            className={`btn w-100 ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setShowFilters(!showFilters)}
                          >
                            <i className={`mdi mdi-filter${showFilters ? '-remove' : '-variant'}`}></i> 
                            {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
                          </button>
                        </div>
                      </div>

                      {showFilters && (
                        <div className="card shadow-sm border-0 mt-3" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="card-body">
                            <h6 className="mb-3 text-primary">
                              <i className="mdi mdi-filter-variant"></i> Filtres avancés
                            </h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted">STATUT</label>
                                <select 
                                  className="form-select" 
                                  value={filterStatus} 
                                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Tous les statuts</option>
                                  <option value="pending">⏳ En attente</option>
                                  <option value="confirmed">✅ Confirmée</option>
                                  <option value="shipped">🚚 Expédiée</option>
                                  <option value="delivered">📦 Livrée</option>
                                  <option value="cancelled">❌ Annulée</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted">MODE DE PAIEMENT</label>
                                <select 
                                  className="form-select" 
                                  value={filterPayment} 
                                  onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Tous les modes</option>
                                  <option value="cash">💵 Espèces</option>
                                  <option value="card">💳 Carte</option>
                                </select>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                              <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                                <i className="mdi mdi-refresh"></i> Réinitialiser
                              </button>
                              <span className="badge bg-primary rounded-pill px-3 py-2">
                                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Table des commandes */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID Commande</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Articles</th>
                            <th>Montant</th>
                            <th>Paiement</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order: any) => (
                            <tr key={order._id}>
                              <td>
                                <span className="font-weight-bold text-primary">
                                  #{order._id.slice(-8).toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <div className="font-weight-bold">{order.user?.name || "N/A"}</div>
                                  <small className="text-muted">{order.user?.email || "N/A"}</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                  <br />
                                  <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="badge badge-secondary">
                                  {order.items?.length || 0} article{order.items?.length > 1 ? 's' : ''}
                                </span>
                              </td>
                              <td className="font-weight-bold text-success">
                                {order.totalAmount.toFixed(2)} TND
                              </td>
                              <td>{getPaymentBadge(order.paymentMethod)}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td>
                                <button 
                                  onClick={() => viewOrderDetails(order)} 
                                  className="btn btn-sm btn-info"
                                  title="Voir détails"
                                >
                                  <i className="mdi mdi-eye"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={8} className="text-center py-4">
                                <i className="mdi mdi-cart-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <p className="text-muted mt-2">Aucune commande trouvée</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {filtered.length > itemsPerPage && (
                      <div className="d-flex justify-content-center mt-3">
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            </li>
                            {[...Array(Math.ceil(filtered.length / itemsPerPage))].map((_, i) => (
                              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                              </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(filtered.length / itemsPerPage) ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails de commande */}
      {showModal && selectedOrder && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="mdi mdi-receipt"></i> Détails de la commande #{selectedOrder._id.slice(-8).toUpperCase()}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">INFORMATIONS CLIENT</h6>
                    <div className="card bg-light">
                      <div className="card-body">
                        <p className="mb-1"><strong>Nom:</strong> {selectedOrder.user?.name || "N/A"}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.user?.email || "N/A"}</p>
                        <p className="mb-0"><strong>Téléphone:</strong> {selectedOrder.shippingAddress?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">ADRESSE DE LIVRAISON</h6>
                    <div className="card bg-light">
                      <div className="card-body">
                        <p className="mb-1"><strong>{selectedOrder.shippingAddress?.fullName}</strong></p>
                        <p className="mb-1">{selectedOrder.shippingAddress?.address}</p>
                        <p className="mb-0">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-md-4">
                    <h6 className="text-muted mb-2">STATUT</h6>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-muted mb-2">PAIEMENT</h6>
                    {getPaymentBadge(selectedOrder.paymentMethod)}
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-muted mb-2">DATE</h6>
                    <p className="mb-0">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                </div>

                <h6 className="text-muted mb-3">ARTICLES COMMANDÉS</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product?.image && (
                                <img 
                                  src={item.product.image} 
                                  alt={item.product?.name} 
                                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px', marginRight: '10px' }}
                                />
                              )}
                              <span>{item.product?.name || "Produit supprimé"}</span>
                            </div>
                          </td>
                          <td>{item.price.toFixed(2)} TND</td>
                          <td>
                            <span className="badge badge-secondary">{item.quantity}</span>
                          </td>
                          <td className="font-weight-bold">{(item.price * item.quantity).toFixed(2)} TND</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="table-light">
                      <tr>
                        <td colSpan={3} className="text-end"><strong>TOTAL:</strong></td>
                        <td className="font-weight-bold text-success">{selectedOrder.totalAmount.toFixed(2)} TND</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                  <div className="mt-4">
                    <h6 className="text-muted mb-3">CHANGER LE STATUT</h6>
                    <div className="btn-group w-100" role="group">
                      {selectedOrder.status === "pending" && (
                        <>
                          <button 
                            className="btn btn-info"
                            onClick={() => { updateOrderStatus(selectedOrder._id, "confirmed"); setShowModal(false); }}
                          >
                            <i className="mdi mdi-check-circle"></i> Confirmer
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => { updateOrderStatus(selectedOrder._id, "cancelled"); setShowModal(false); }}
                          >
                            <i className="mdi mdi-close-circle"></i> Annuler
                          </button>
                        </>
                      )}
                      {selectedOrder.status === "confirmed" && (
                        <button 
                          className="btn btn-primary w-100"
                          onClick={() => { updateOrderStatus(selectedOrder._id, "shipped"); setShowModal(false); }}
                        >
                          <i className="mdi mdi-truck-delivery"></i> Marquer comme expédiée
                        </button>
                      )}
                      {selectedOrder.status === "shipped" && (
                        <button 
                          className="btn btn-success w-100"
                          onClick={() => { updateOrderStatus(selectedOrder._id, "delivered"); setShowModal(false); }}
                        >
                          <i className="mdi mdi-package-variant"></i> Marquer comme livrée
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
