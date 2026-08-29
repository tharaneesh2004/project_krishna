import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import './AllCollections.css';

const AllCollections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch products from the backend API
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  return (
    <div className="all-collections-page">
      <Navbar />
      
      {/* HEADER */}
      <div className="ac-header">
        <span className="section-label">OUR COLLECTIONS</span>
        <h1 className="section-title">Timeless Weaves, Every Thread a Story.</h1>
        <p className="section-subtitle">
          Explore our handpicked collection of exquisite sarees, woven with heritage and crafted with love.
        </p>
      </div>

      {/* FILTERS */}
      <div className="ac-filters-container">
        <div className="ac-filters">
          <div className="ac-filters-left">
            <select className="ac-filter-select">
              <option>All Sarees</option>
              <option>Silk Sarees</option>
              <option>Cotton Sarees</option>
            </select>
            <select className="ac-filter-select">
              <option>All Materials</option>
              <option>Pure Silk</option>
              <option>Kora Silk</option>
            </select>
            <select className="ac-filter-select">
              <option>All Types</option>
              <option>Woven</option>
              <option>Printed</option>
            </select>
            <select className="ac-filter-select">
              <option>All Price Ranges</option>
              <option>Under ₹1000</option>
              <option>₹1000 - ₹5000</option>
            </select>
          </div>
          <div className="ac-filters-right">
            <span>Sort by:</span>
            <select className="ac-filter-select">
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading collections...</div>
      ) : (
        <div className="ac-grid">
          {products.map(product => {
            const mainImgSrc = product.primaryImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg');
            return (
              <div className="ac-card" key={product._id}>
                <div className="ac-card-image-wrap">
                  {product.discountPercentage > 0 && (
                    <div className="ac-badge">{product.discountPercentage}% OFF</div>
                  )}
                  <div className="ac-wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </div>
                  <img src={mainImgSrc} alt={product.name} className="ac-card-image" />
                </div>
                <div className="ac-card-content">
                  <h3 className="ac-card-title">{product.name}</h3>
                  <div className="ac-card-material">{product.material || product.fabric || 'Premium Fabric'}</div>
                  
                  <div className="ac-card-footer">
                    <div className="ac-price-wrap">
                      <span className="ac-price-final">{formatPrice(product.discountedPrice)}</span>
                      {product.discountPercentage > 0 && (
                        <span className="ac-price-original">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    {product.type && (
                      <span className="ac-tag">{product.type}</span>
                    )}
                  </div>
                  
                  <div className="ac-card-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      className="btn btn-gold" 
                      style={{ flex: 1, padding: '8px', fontSize: '0.9rem' }}
                      onClick={() => addToCart(product._id, 1)}
                    >
                      ADD TO CART
                    </button>
                    <button 
                      className="btn" 
                      style={{ flex: 1, padding: '8px', fontSize: '0.9rem', backgroundColor: '#2c2117', color: '#fff', border: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        const buyNowProduct = {
                          productId: product._id,
                          name: product.name,
                          image: product.primaryImage || (product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'),
                          price: product.discountedPrice || product.originalPrice,
                          discount: product.discountPercentage || 0,
                          quantity: 1
                        };
                        localStorage.setItem('buyNowProduct', JSON.stringify(buyNowProduct));
                        window.location.href = '/checkout';
                      }}
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllCollections;
