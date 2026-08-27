import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminApi } from './utils/api';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    material: '',
    size: '',
    fabric: '',
    type: '',
    pallu: '',
    weight: '600 gms',
    category: 'Silk',
    originalPrice: '',
    discountPercentage: '0',
    discountedPrice: '',
    stock: '1',
    sku: '',
    status: 'Active',
    primaryImage: '',
    images: []
  });

  const [colorVariants, setColorVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // Up to 5 files
  const [imagePreviews, setImagePreviews] = useState([]); // Up to 5 previews
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await adminApi.getCategories();
        setCategories(cats);

        if (isEditMode) {
          const product = await adminApi.getProduct(id);
          setFormData({
            ...product,
            originalPrice: product.originalPrice.toString(),
            discountPercentage: product.discountPercentage.toString(),
            discountedPrice: product.discountedPrice.toString(),
            stock: product.stock.toString()
          });
          if (product.primaryImage) {
            setImagePreviews(product.images && product.images.length > 0 ? product.images : [product.primaryImage]);
          }
          if (product.colorVariants) {
            setColorVariants(product.colorVariants);
          }
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  useEffect(() => {
    const orig = parseFloat(formData.originalPrice);
    const disc = parseFloat(formData.discountPercentage);
    
    if (!isNaN(orig) && !isNaN(disc)) {
      const discounted = orig - (orig * (disc / 100));
      setFormData(prev => ({
        ...prev,
        discountedPrice: Math.round(discounted).toString()
      }));
    }
  }, [formData.originalPrice, formData.discountPercentage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (imageFiles.length + files.length > 5) {
        alert('You can only upload up to 5 images');
        return;
      }
      
      const newFiles = [...imageFiles, ...files].slice(0, 5);
      setImageFiles(newFiles);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result].slice(0, 5));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleAddVariant = () => {
    setColorVariants([...colorVariants, { colorName: '', imageUrl: '', file: null, preview: '' }]);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...colorVariants];
    newVariants[index][field] = value;
    setColorVariants(newVariants);
  };

  const handleVariantImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newVariants = [...colorVariants];
        newVariants[index].file = file;
        newVariants[index].preview = reader.result;
        setColorVariants(newVariants);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeVariant = (index) => {
    const newVariants = [...colorVariants];
    newVariants.splice(index, 1);
    setColorVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let finalImages = formData.images && formData.images.length > 0 ? formData.images : (formData.primaryImage ? [formData.primaryImage] : []);

      if (imageFiles.length > 0) {
        setUploadingImage(true);
        // Upload new files and append
        const newUploaded = [];
        for (const file of imageFiles) {
          const { imageUrl } = await adminApi.uploadImage(file);
          newUploaded.push(imageUrl);
        }
        // If there were existing images we didn't remove, we'd need to handle that. 
        // For simplicity, if they select new files, we'll just use the new previews state 
        // Wait, imagePreviews contains BOTH existing URLs and new DataURLs. 
        // Let's just construct the final array based on imagePreviews:
        finalImages = [];
        let newFileIndex = 0;
        for (const preview of imagePreviews) {
          if (preview.startsWith('data:')) {
            // It's a new file
            const { imageUrl } = await adminApi.uploadImage(imageFiles[newFileIndex]);
            finalImages.push(imageUrl);
            newFileIndex++;
          } else {
            // It's an existing URL
            finalImages.push(preview);
          }
        }
      } else {
        // Just use existing previews
        finalImages = imagePreviews;
      }
      
      let finalPrimaryImage = finalImages.length > 0 ? finalImages[0] : '';

      // Upload variant images
      const uploadedVariants = [];
      for (const variant of colorVariants) {
        let varImageUrl = variant.imageUrl;
        if (variant.file) {
          setUploadingImage(true);
          const res = await adminApi.uploadImage(variant.file);
          varImageUrl = res.imageUrl;
        }
        uploadedVariants.push({
          colorName: variant.colorName,
          imageUrl: varImageUrl
        });
      }
      setUploadingImage(false);

      const productData = {
        ...formData,
        originalPrice: Number(formData.originalPrice),
        discountPercentage: Number(formData.discountPercentage),
        discountedPrice: Number(formData.discountedPrice),
        stock: Number(formData.stock),
        primaryImage: finalPrimaryImage,
        images: finalImages,
        colorVariants: uploadedVariants
      };

      if (isEditMode) {
        await adminApi.updateProduct(id, productData);
      } else {
        await adminApi.createProduct(productData);
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
      setUploadingImage(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-product-form-container">
      <div className="admin-page-header">
        <h1 className="admin-page-title">{isEditMode ? 'Edit Saree' : 'Add New Saree'}</h1>
        <Link to="/admin/products" className="admin-btn-secondary">
          Cancel
        </Link>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="form-layout-grid">
        <form onSubmit={handleSubmit} className="main-form-section">
          
          <div className="admin-card form-card">
            <h3>Saree Details</h3>
            
            <div className="form-group">
              <label htmlFor="name">🪷 NAME *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Royal Blue Kanchipuram Silk Saree"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="material">🪷 MATERIAL</label>
                <input type="text" id="material" name="material" value={formData.material} onChange={handleChange} placeholder="e.g. Pure Silk" />
              </div>
              <div className="form-group">
                <label htmlFor="size">🪷 SIZE</label>
                <input type="text" id="size" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 6.2 meters with blouse piece" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fabric">🪷 FABRIC</label>
                <input type="text" id="fabric" name="fabric" value={formData.fabric} onChange={handleChange} placeholder="e.g. Silk Blend" />
              </div>
              <div className="form-group">
                <label htmlFor="type">🪷 TYPE</label>
                <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. Handwoven Kanchipuram" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pallu">🪷 PALLU</label>
                <input type="text" id="pallu" name="pallu" value={formData.pallu} onChange={handleChange} placeholder="e.g. Rich Zari Pallu" />
              </div>
              <div className="form-group">
                <label htmlFor="weight">🪷 WEIGHT</label>
                <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 600 gms" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="Silk">Silk Sarees</option>
                  <option value="Kanchipuram">Kanchipuram</option>
                  <option value="Bridal">Bridal Edit</option>
                  <option value="Festive">Festive Collection</option>
                  {categories.map(c => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-card form-card">
            <h3>Pricing & Inventory</h3>
            
            <div className="form-row triple">
              <div className="form-group">
                <label htmlFor="originalPrice">🪷 PRICE (₹) *</label>
                <input type="number" id="originalPrice" name="originalPrice" value={formData.originalPrice} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="discountPercentage">Discount (%)</label>
                <input type="number" id="discountPercentage" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} min="0" max="100" />
              </div>
              <div className="form-group">
                <label htmlFor="discountedPrice">Final Price (₹)</label>
                <input type="number" id="discountedPrice" name="discountedPrice" value={formData.discountedPrice} readOnly className="readonly-input" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="KS-1024" />
              </div>
            </div>
          </div>

          <div className="admin-card form-card">
            <h3>Images & Color Variants</h3>
            
            <div className="form-group">
              <label>Product Images (Up to 5) *</label>
              <div className="image-upload-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="image-preview-area" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative', width: '100px', height: '133px' }}>
                        <img src={preview} alt={`Preview ${index}`} className="uploaded-preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                        <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#D64545', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        {index === 0 && <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 4px', borderRadius: '2px' }}>Main</span>}
                      </div>
                    ))
                  ) : (
                    <div className="no-image" style={{ width: '100px', height: '133px' }}>
                      <p>No images</p>
                    </div>
                  )}
                </div>
                {imagePreviews.length < 5 && (
                  <div className="upload-actions">
                    <label className="admin-btn-secondary upload-btn">
                      Choose Images
                      <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="variants-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem 0', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
                <h4 style={{ margin: 0, color: '#2d2d2d' }}>Color Variants</h4>
                <button type="button" className="admin-btn-secondary" onClick={handleAddVariant} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  + Add Color
                </button>
              </div>
              
              {colorVariants.length === 0 && (
                <p style={{ color: '#7a6a58', fontSize: '0.85rem' }}>No color variants added yet. Click "+ Add Color" to add more colors for this saree.</p>
              )}

              {colorVariants.map((variant, index) => (
                <div key={index} className="variant-row" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', background: '#FAFAF8', padding: '1rem', borderRadius: '8px' }}>
                  <div className="variant-image-preview" style={{ width: '60px', height: '80px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {variant.preview || variant.imageUrl ? (
                      <img src={variant.preview || variant.imageUrl} alt="Color" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: '#999' }}>Image</span>
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', color: '#7a6a58' }}>Color Name (e.g. Crimson Red)</label>
                    <input 
                      type="text" 
                      value={variant.colorName} 
                      onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)} 
                      placeholder="Color Name"
                      style={{ padding: '8px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="admin-btn-secondary upload-btn" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                      Upload
                      <input type="file" accept="image/*" onChange={(e) => handleVariantImageChange(index, e)} style={{ display: 'none' }} />
                    </label>
                    <button type="button" onClick={() => removeVariant(index)} style={{ background: 'none', border: 'none', color: '#D64545', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="form-actions-bottom">
            <button type="submit" className="admin-btn-primary submit-btn" disabled={saving || uploadingImage}>
              {saving || uploadingImage ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>

        <div className="preview-section hidden-mobile">
          <div className="preview-sticky">
            <h3 className="preview-title">Live Preview</h3>
            <p className="preview-subtitle">How it will appear on the website</p>
            
            <div className="collection-card preview-card" style={{ padding: '1rem' }}>
              <div className="collection-image" style={{ background: '#f5f5f5', height: '300px', borderRadius: '4px', overflow: 'hidden' }}>
                {imagePreviews.length > 0 ? (
                  <img src={imagePreviews[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image</div>
                )}
              </div>
              
              {/* Color variants thumbnails in preview */}
              {colorVariants.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' }}>
                  {colorVariants.map((v, i) => (
                    <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #C49A4A', flexShrink: 0 }}>
                       {(v.preview || v.imageUrl) ? <img src={v.preview || v.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : <div style={{background:'#eee', width:'100%', height:'100%'}}></div>}
                    </div>
                  ))}
                </div>
              )}

              <div className="collection-info" style={{ backgroundColor: '#fff', paddingTop: '1rem' }}>
                <h3 style={{ color: '#2d2d2d', fontSize: '1.2rem', marginBottom: '8px' }}>{formData.name || 'Saree Name'}</h3>
                
                <div style={{ fontSize: '0.85rem', color: '#7a6a58', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                  {formData.material && <div>🪷 Material: {formData.material}</div>}
                  {formData.fabric && <div>🪷 Fabric: {formData.fabric}</div>}
                </div>

                <div className="preview-pricing" style={{ color: '#2d2d2d', fontWeight: '600', fontSize: '1.1rem' }}>
                  ₹{formData.discountedPrice || '0'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
