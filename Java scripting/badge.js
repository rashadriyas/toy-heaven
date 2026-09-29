/* =========================================================
   Toy Heaven - badges.js
   Shows the cart and wishlist item counts on the header
   icons across every page of the site.
   ========================================================= */

const BADGE_CART_KEY = 'toyHeavenCart';
const BADGE_WISHLIST_KEY = 'toyHeavenWishlist';

/* ---------- storage helpers ---------- */
function loadCartForBadge() {
  try {
    let data = JSON.parse(localStorage.getItem(BADGE_CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function loadWishlistForBadge() {
  try {
    let data = JSON.parse(localStorage.getItem(BADGE_WISHLIST_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

/* ---------- badge rendering ---------- */
function setHeaderBadge(selector, count) {
  let link = document.querySelector(selector);
  if (!link) return;

  let badge = link.querySelector('.cart-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    link.appendChild(badge);
  }

  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function updateCartBadgeHeader() {
  let cart = loadCartForBadge();
  let count = 0;
  for (let i = 0; i < cart.length; i++) {
    count += cart[i].qty;
  }
  setHeaderBadge('.top-icons a[aria-label="cart"]', count);
}

function updateWishlistBadgeHeader() {
  let list = loadWishlistForBadge();
  setHeaderBadge('.top-icons a[aria-label="Wishlist"]', list.length);
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  updateCartBadgeHeader();
  updateWishlistBadgeHeader();

  window.addEventListener('storage', function () {
    updateCartBadgeHeader();
    updateWishlistBadgeHeader();
  });
});