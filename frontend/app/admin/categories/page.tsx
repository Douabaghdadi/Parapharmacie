"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Impossible de charger les catégories. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter((cat: any) => {
    return cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase());
  });

  const resetFilters = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const deleteCategory = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erreur lors de la suppression");
        fetchCategories();
      } catch (err) {
        alert("Erreur lors de la suppression de la catégorie");
      }
    }
  };

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">
                  <i className="mdi mdi-alert-circle"></i> Erreur de chargement
                </h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">
                  <button className="btn btn-primary" onClick={fetchCategories}>
                    <i className="mdi mdi-refresh"></i> Réessayer
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Catégories</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Catégories</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title">Liste des catégories</h4>
                      <Link href="/admin/categories/new" className="btn btn-primary btn-sm">
                        <i className="mdi mdi-plus"></i> Ajouter une catégorie
                      </Link>
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher par nom ou description..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category: any) => (
                            <tr key={category._id}>
                              <td>{category.name}</td>
                              <td>{category.description}</td>
                              <td>
                                <Link href={`/admin/categories/${category._id}`} className="btn btn-sm btn-warning me-2">
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                                <button onClick={() => deleteCategory(category._id)} className="btn btn-sm btn-danger">
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={3} className="text-center py-4">
                                <i className="mdi mdi-folder-open" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <p className="text-muted mt-2">
                                  {categories.length === 0 ? "Aucune catégorie dans la base de données" : "Aucune catégorie ne correspond à votre recherche"}
                                </p>
                                {categories.length === 0 && (
                                  <Link href="/admin/categories/new" className="btn btn-primary mt-2">
                                    <i className="mdi mdi-plus"></i> Ajouter votre première catégorie
                                  </Link>
                                )}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
    </div>
  );
}
