// Cart Logic - cart-logic.js

// Initialize or get session ID
function getSessionId() {
  let sessionId = localStorage.getItem('krishna_session_id');
  return sessionId;
}

async function initSession() {
  if (!getSessionId()) {
    try {
      const res = await fetch('/api/cart/session');
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('krishna_session_id', data.sessionId);
      }
    } catch (err) {
      console.error('Error fetching session:', err);
    }
  }
}

// Fetch Cart and update badge
async function updateCartBadge() {
  const sessionId = getSessionId();
  if (!sessionId) return;

  try {
    const res = await fetch('/api/cart', {
      headers: { 'x-session-id': sessionId }
    });
    const data = await res.json();
    if (data.success && data.cart) {
      const totalItems = data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const badges = document.querySelectorAll('.cart-badge');
      badges.forEach(badge => {
        badge.textContent = totalItems;
      });
    }
  } catch (err) {
    console.error('Error updating cart badge:', err);
  }
}

// Add to cart function
async function addToCart(productId, quantity = 1) {
  const sessionId = getSessionId();
  if (!sessionId) {
    await initSession();
  }

  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId()
      },
      body: JSON.stringify({ productId, quantity })
    });
    
    const data = await res.json();
    if (data.success) {
      updateCartBadge();
      alert('Item added to cart!'); // Could be a toast notification in a real app
    } else {
      alert(data.message || 'Error adding to cart');
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    alert('Error adding to cart. Please try again.');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await initSession();
  updateCartBadge();

  // Attach event listeners to Add to Cart buttons
  // Assumes buttons have class 'add-to-cart-btn' and data-id attribute
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      e.preventDefault();
      const productId = e.target.getAttribute('data-id');
      if (productId) {
        addToCart(productId);
      }
    }
  });
});
