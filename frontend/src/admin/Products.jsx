import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from './utils/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await adminApi.deleteProduct(productToDelete._id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product.');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <Link to="/admin/products/add" className="admin-btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="admin-card">
        <div className="products-toolbar">
          <div className="admin-search toolbar-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="toolbar-filters">
            <select className="admin-select">
              <option value="">All Categories</option>
              <option value="Silk">Silk</option>
              <option value="Cotton">Cotton</option>
              <option value="Bridal">Bridal</option>
            </select>
            <select className="admin-select">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="admin-loading">Loading Products...</div>
          ) : filteredProducts.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-thumbnail">
                          {product.primaryImage ? (
                            <img src={product.primaryImage} alt={product.name} />
                          ) : (
                            <div className="placeholder-img">No Img</div>
                          )}
                        </div>
                        <div className="product-info-cell">
                          <span className="product-name">{product.name}</span>
                          <span className="product-sku" style={{ color: '#C49A4A' }}>{product.type || 'Saree'} &bull; {product.fabric || 'Unknown Fabric'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      <div className="price-cell">
                        <span className="final-price">{formatCurrency(product.discountedPrice)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`stock-value ${product.stock < 5 ? (product.stock === 0 ? 'critical' : 'warning') : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${product.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <a href={`/#saree-${product._id}`} target="_blank" rel="noopener noreferrer" className="action-btn view" title="View on Website">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </a>
                        <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit" title="Edit">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </Link>
                        <button onClick={() => handleDeleteClick(product)} className="action-btn delete" title="Delete">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <h3>No Products Found</h3>
              <p>Try adjusting your search or filter, or add a new product.</p>
              <Link to="/admin/products/add" className="admin-btn-secondary" style={{marginTop: '1rem'}}>
                + Add Product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Product?</h2>
              <button className="modal-close" onClick={() => setDeleteModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>?</p>
              <p className="danger-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="admin-btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
              <button className="admin-btn-danger" onClick={confirmDelete}>Delete Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
