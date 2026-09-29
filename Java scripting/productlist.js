// Product list page - Add to Cart and Wishlist buttons
// Uses addEventListener with named functions and 'this' to
// access the element the event happened on (see Events slide 12)

const CART_KEY = 'toyHeavenCart';
const WISHLIST_KEY = 'toyHeavenWishlist';
const MAX_QTY = 10;

document.addEventListener('DOMContentLoaded', setupProductButtons);

function setupProductButtons() {
  let cartButtons = document.querySelectorAll('.product-card .cart-btn');
  let wishButtons = document.querySelectorAll('.product-card .wishlist-btn');

  for (let i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener('click', cartButtonClicked);
  }

  for (let i = 0; i < wishButtons.length; i++) {
    wishButtons[i].addEventListener('click', wishButtonClicked);
  }

  markSavedWishlistItems();
}

/* ---------- storage helpers ---------- */
function loadList(key) {
  try {
    let data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

/* ---------- helpers ---------- */
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function readProduct(card) {
  let priceEl = card.querySelector('.price').cloneNode(true);
  let oldPrice = priceEl.querySelector('del');
  if (oldPrice) oldPrice.remove();

  let name = card.querySelector('h2').textContent.trim();

  return {
    id: slugify(name),
    name: name,
    category: card.querySelector('.product-category').textContent.trim(),
    price: Number(priceEl.textContent.replace(/[^\d]/g, '')) || 0,
    image: card.querySelector('.thumb img').getAttribute('src')
  };
}

function isInWishlist(id) {
  let wishlist = loadList(WISHLIST_KEY);
  for (let i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === id) return true;
  }
  return false;
}

function setWishlistButtonState(button, saved) {
  button.textContent = saved ? '♥' : '♡';
  if (saved) {
    button.classList.add('active');
  } else {
    button.classList.remove('active');
  }
}

/* ---------- reusable actions ----------
   Called both by the buttons on each product card AND by
   productpopupview.js's modal Add to Cart / wishlist heart. */
function addToCart(card, button) {
  let product = readProduct(card);
  let cart = loadList(CART_KEY);

  let existing = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      existing = cart[i];
      break;
    }
  }

  if (existing) {
    existing.qty = Math.min(existing.qty + 1, MAX_QTY);
  } else {
    product.qty = 1;
    cart.push(product);
  }

  saveList(CART_KEY, cart);

  if (button) {
    let originalText = button.textContent;
    button.textContent = 'Added ✓';
    button.disabled = true;
    setTimeout(resetCartButton, 900, button, originalText);
  }
}

function resetCartButton(button, originalText) {
  button.textContent = originalText;
  button.disabled = false;
}

function toggleWishlist(card, button) {
  let product = readProduct(card);
  let wishlist = loadList(WISHLIST_KEY);
  let alreadySaved = isInWishlist(product.id);
  let newList = [];

  if (alreadySaved) {
    for (let i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id !== product.id) newList.push(wishlist[i]);
    }
  } else {
    newList = wishlist;
    newList.push(product);
  }

  saveList(WISHLIST_KEY, newList);
  setWishlistButtonState(button, !alreadySaved);
}

/* ---------- event handlers for buttons on the card itself ---------- */
function cartButtonClicked() {
  let card = this.closest('.product-card');
  addToCart(card, this);
}

function wishButtonClicked() {
  let card = this.closest('.product-card');
  toggleWishlist(card, this);
}

function markSavedWishlistItems() {
  let cards = document.querySelectorAll('.product-card');
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    let button = card.querySelector('.wishlist-btn');
    let name = card.querySelector('h2').textContent.trim();
    setWishlistButtonState(button, isInWishlist(slugify(name)));
  }
}


function addToCart(card, button) {
  let product = readProduct(card);
  let cart = loadList(CART_KEY);

  let existing = null;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      existing = cart[i];
      break;
    }
  }

  if (existing) {
    existing.qty = Math.min(existing.qty + 1, MAX_QTY);
  } else {
    product.qty = 1;
    cart.push(product);
  }

  saveList(CART_KEY, cart);
  refreshBadges();

  if (button) {
    let originalText = button.textContent;
    button.textContent = 'Added ✓';
    button.disabled = true;
    setTimeout(resetCartButton, 900, button, originalText);
  }
}



function toggleWishlist(card, button) {
  let product = readProduct(card);
  let wishlist = loadList(WISHLIST_KEY);
  let alreadySaved = isInWishlist(product.id);
  let newList = [];

  if (alreadySaved) {
    for (let i = 0; i < wishlist.length; i++) {
      if (wishlist[i].id !== product.id) newList.push(wishlist[i]);
    }
  } else {
    newList = wishlist;
    newList.push(product);
  }

  saveList(WISHLIST_KEY, newList);
  setWishlistButtonState(button, !alreadySaved);
  refreshBadges();
}

function refreshBadges() {
  if (typeof updateCartBadgeHeader === 'function') updateCartBadgeHeader();
  if (typeof updateWishlistBadgeHeader === 'function') updateWishlistBadgeHeader();
}