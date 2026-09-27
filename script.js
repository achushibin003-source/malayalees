/* ==========================================================================
   MALAYALEES — Premium Kerala Coconut Oil
   Interactive Scripts & E-Commerce Logic
   ========================================================================== */

// --- PRODUCT DATA (All 6 Standard Sizes) ---
const PRODUCTS = [
  {
    id: 'prod-100ml',
    brand: 'MALAYALEES',
    size: '100 ml',
    title: 'MALAYALEES',
    price: 45,
    badge: 'Starter',
    image: 'assets/product.jpg'
  },
  {
    id: 'prod-200ml',
    brand: 'MALAYALEES',
    size: '200 ml',
    title: 'MALAYALEES',
    price: 85,
    badge: 'Compact',
    image: 'assets/product.jpg'
  },
  {
    id: 'prod-500ml',
    brand: 'MALAYALEES',
    size: '500 ml',
    title: 'MALAYALEES',
    price: 195,
    badge: 'Popular',
    image: 'assets/product.jpg'
  },
  {
    id: 'prod-1l',
    brand: 'MALAYALEES',
    size: '1 Litre',
    title: 'MALAYALEES',
    price: 370,
    badge: 'Best Value',
    image: 'assets/product.jpg'
  },
  {
    id: 'prod-2l',
    brand: 'MALAYALEES',
    size: '2 Litre',
    title: 'MALAYALEES',
    price: 720,
    badge: 'Family Pack',
    image: 'assets/product.jpg'
  },
  {
    id: 'prod-5l',
    brand: 'MALAYALEES',
    size: '5 Litre',
    title: 'MALAYALEES',
    price: 1750,
    badge: 'Bulk Saver',
    image: 'assets/product.jpg'
  }
];

// --- GOOGLE CUSTOMER REVIEWS ---
const REVIEWS = [
  {
    author: 'Anjali Menon',
    location: 'Kochi, Kerala',
    avatar: 'A',
    rating: 5,
    quote: 'The aroma when this oil hits the hot earthen pan is absolutely heavenly. Reminds me exactly of my grandmother’s kitchen in Kottayam. Pure and untouched!'
  },
  {
    author: 'Rahul Nambiar',
    location: 'Bengaluru, Karnataka',
    avatar: 'R',
    rating: 5,
    quote: 'Finding real Kerala coconut oil outside the state was tough until MALAYALEES. Crystal clear, authentic wood-pressed scent, and prompt delivery.'
  },
  {
    author: 'Dr. Priya Varma',
    location: 'Thrissur, Kerala',
    avatar: 'P',
    rating: 5,
    quote: 'Zero artificial preservatives or chemical residues. The natural coconut sweetness elevates our traditional roast and thoran effortlessly.'
  },
  {
    author: 'Suresh Kurup',
    location: 'Chennai, Tamil Nadu',
    avatar: 'S',
    rating: 5,
    quote: 'Ordered the 5L heritage can. Pristine packaging with no leaks, and the quality is far superior to supermarket brands. Will definitely reorder.'
  }
];

// --- STATE MANAGEMENT ---
let cart = [];

try {
  const savedCart = localStorage.getItem('malayalees_cart');
  if (savedCart) cart = JSON.parse(savedCart);
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem('malayalees_cart', JSON.stringify(cart));
  } catch (e) {}
}

// --- DOM ELEMENTS ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const productsGrid = document.getElementById('productsGrid');
const reviewsTrack = document.getElementById('reviewsTrack');
const reviewsPrev = document.getElementById('reviewsPrev');
const reviewsNext = document.getElementById('reviewsNext');

const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartFooter = document.getElementById('cartFooter');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const cartContinue = document.getElementById('cartContinue');

const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutClose = document.getElementById('checkoutClose');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutItems = document.getElementById('checkoutItems');
const coSubtotal = document.getElementById('co-subtotal');
const coTotal = document.getElementById('co-total');
const placeOrderBtn = document.getElementById('placeOrderBtn');

const successOverlay = document.getElementById('successOverlay');
const successClose = document.getElementById('successClose');
const addNotif = document.getElementById('addNotif');
const addNotifText = document.getElementById('addNotifText');
const contactForm = document.getElementById('contactForm');

// --- INITIALIZE PRODUCTS ---
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card reveal-up">
      <span class="product-badge">${p.badge}</span>
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.brand} ${p.size}" class="product-img" loading="lazy" />
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.brand}</h3>
        <div class="product-size">${p.size}</div>
        <div class="product-footer">
          <span class="product-price">₹${p.price}</span>
          <button class="product-btn-add" onclick="addToCart('${p.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- INITIALIZE REVIEWS ---
let currentReviewIndex = 0;

function renderReviews() {
  if (!reviewsTrack) return;
  reviewsTrack.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-stars">
        ${'★'.repeat(r.rating)}
      </div>
      <p class="review-quote">"${r.quote}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.avatar}</div>
        <div class="review-meta">
          <h5>${r.author}</h5>
          <span>${r.location}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function updateReviewPosition() {
  if (!reviewsTrack) return;
  const cards = reviewsTrack.querySelectorAll('.review-card');
  if (!cards.length) return;
  const cardWidth = cards[0].getBoundingClientRect().width + 32;
  reviewsTrack.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;
}

if (reviewsPrev && reviewsNext) {
  reviewsPrev.addEventListener('click', () => {
    if (currentReviewIndex > 0) {
      currentReviewIndex--;
      updateReviewPosition();
    }
  });

  reviewsNext.addEventListener('click', () => {
    const maxIdx = Math.max(0, REVIEWS.length - 2);
    if (currentReviewIndex < maxIdx) {
      currentReviewIndex++;
      updateReviewPosition();
    } else {
      currentReviewIndex = 0;
      updateReviewPosition();
    }
  });
}

// --- CART FUNCTIONS ---
function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalCount;

  if (!cartItems) return;

  if (cart.length === 0) {
    if (cartEmpty) cartEmpty.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'none';
    const itemsToRemove = cartItems.querySelectorAll('.cart-item');
    itemsToRemove.forEach(el => el.remove());
    return;
  }

  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartFooter) cartFooter.style.display = 'flex';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
  if (cartTotal) cartTotal.textContent = `₹${subtotal}`;

  // Render items
  const itemsHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title} (${item.size})</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  `).join('');

  cartItems.innerHTML = itemsHTML;
}

window.addToCart = function(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`Added ${product.brand || product.title} (${product.size}) to your cart`);
};

window.updateQty = function(productId, delta) {
  const item = cart.find(p => p.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }

  saveCart();
  updateCartUI();
};

window.removeFromCart = function(productId) {
  cart = cart.filter(p => p.id !== productId);
  saveCart();
  updateCartUI();
};

function openCart() {
  if (cartDrawer) cartDrawer.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (cartDrawer) cartDrawer.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeCart);
if (cartContinue) cartContinue.addEventListener('click', closeCart);

// --- TOAST NOTIFICATION ---
let toastTimer = null;
function showToast(msg) {
  if (!addNotif || !addNotifText) return;
  addNotifText.textContent = msg;
  addNotif.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    addNotif.classList.remove('show');
  }, 2800);
}

// --- CHECKOUT MODAL FLOW ---
function openCheckout() {
  if (cart.length === 0) {
    showToast('Your cart is empty. Add a product first!');
    return;
  }
  closeCart();

  // Populate checkout summary
  if (checkoutItems) {
    checkoutItems.innerHTML = cart.map(item => `
      <div class="checkout-item-line">
        <span>${item.brand || item.title || 'MALAYALEES'} (${item.size}) × ${item.quantity}</span>
        <strong>₹${item.price * item.quantity}</strong>
      </div>
    `).join('');
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (coSubtotal) coSubtotal.textContent = `₹${subtotal}`;
  if (coTotal) coTotal.textContent = `₹${subtotal}`;

  if (checkoutOverlay) checkoutOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  if (checkoutOverlay) checkoutOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);

if (placeOrderBtn) {
  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('ch-name');
    const phoneInput = document.getElementById('ch-phone');
    const emailInput = document.getElementById('ch-email');
    const addressInput = document.getElementById('ch-address');
    const cityInput = document.getElementById('ch-city');
    const pinInput = document.getElementById('ch-pincode');

    if (!nameInput?.value.trim() || !phoneInput?.value.trim() || !addressInput?.value.trim()) {
      alert('Please fill out all required fields before placing your order.');
      return;
    }

    closeCheckout();
    cart = [];
    saveCart();
    updateCartUI();

    if (successOverlay) successOverlay.classList.add('active');
  });
}

if (successClose) {
  successClose.addEventListener('click', () => {
    if (successOverlay) successOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// --- HERO SLIDER AUTO-ROTATE ---
let currentHeroSlide = 0;
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');

function setHeroSlide(idx) {
  if (!heroSlides.length) return;
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
  currentHeroSlide = idx;
}

if (heroDots.length) {
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => setHeroSlide(i));
  });

  setInterval(() => {
    const nextIdx = (currentHeroSlide + 1) % heroSlides.length;
    setHeroSlide(nextIdx);
  }, 6000);
}

// --- NAVBAR SCROLL & HAMBURGER ---
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// --- STATS COUNTER ANIMATION ---
function animateCounters() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    
    let count = 0;
    const duration = 1600;
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      count += increment;
      if (count >= target) {
        stat.textContent = target;
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(count);
      }
    }, stepTime);
  });
}

// --- INTERSECTION OBSERVER (REVEAL ANIMATIONS) ---
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

let statsAnimated = false;
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      
      // If story section is revealed, animate counters once
      if (entry.target.closest('#story') && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function setupReveals() {
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
}

// --- CONTACT FORM SUBMISSION ---
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! Your message has been received.');
    contactForm.reset();
  });
}

// --- BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderReviews();
  updateCartUI();
  setupReveals();
});
