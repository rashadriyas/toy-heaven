/* =========================================================
   Toy Heaven - wishlist.js
   Reads the wishlist saved by productlist.js and shows it
   on the Wishlist page.
   ========================================================= */

var CART_KEY = 'toyHeavenCart';
var WISHLIST_KEY = 'toyHeavenWishlist';
var MAX_QTY = 10;

var listBox, countLabel, savedCount;

/* ---------- storage helpers ---------- */
function loadWishlist() {
  try {
    var data = JSON.parse(localStorage.getItem(WISHLIST_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  } catch (e) {}
}

function loadCart() {
  try {
    var data = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {}
}

/* ---------- formatting ---------- */
function money(n) {
  return 'Rs. ' + Number(n).toLocaleString('en-US');
}

function escapeHTML(str) {
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var result = '';
  var text = String(str);
  for (var i = 0; i < text.length; i++) {
    var ch = text.charAt(i);
    result += map[ch] ? map[ch] : ch;
  }
  return result;
}

/* ---------- rendering (no div tags) ---------- */
function cardHTML(item) {
  return (
    '<li class="product-card" data-id="' + escapeHTML(item.id) + '">' +
      '<article>' +
        '<section class="product-image">' +
          '<button class="wishlist-btn active" type="button" data-action="remove" aria-label="Remove ' + escapeHTML(item.name) + ' from wishlist">' +
            '♥' +
          '</button>' +
          '<figure class="thumb">' +
            '<img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '">' +
          '</figure>' +
        '</section>' +
        '<section class="product-info">' +
          '<p class="product-category">' + escapeHTML(item.category) + '</p>' +
          '<h2>' + escapeHTML(item.name) + '</h2>' +
          '<p class="price">' + money(item.price) + '</p>' +
          '<button class="cart-btn" type="button" data-action="add-to-cart">Add to Cart</button>' +
        '</section>' +
      '</article>' +
    '</li>'
  );
}

function render() {
  if (!listBox) {
    console.error('wishlist.js: wishlist list container not found — check the id on your <ul>.');
    return;
  }

  var list = loadWishlist();

  var html = '';
  for (var i = 0; i < list.length; i++) {
    html += cardHTML(list[i]);
  }
  listBox.innerHTML = html;

  if (countLabel) countLabel.textContent = '(' + list.length + ')';
  if (savedCount) savedCount.textContent = list.length;
}

/* ---------- actions ---------- */
function removeFromWishlist(id) {
  var list = loadWishlist();
  var newList = [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].id !== id) newList.push(list[i]);
  }
  saveWishlist(newList);
  render();
}

function addItemToCart(id) {
  var list = loadWishlist();
  var item = null;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      item = list[i];
      break;
    }
  }
  if (!item) return;

  var cart = loadCart();
  var existing = null;
  for (var j = 0; j < cart.length; j++) {
    if (cart[j].id === id) {
      existing = cart[j];
      break;
    }
  }

  if (existing) {
    existing.qty = existing.qty + 1;
    if (existing.qty > MAX_QTY) existing.qty = MAX_QTY;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      qty: 1
    });
  }

  saveCart(cart);
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  listBox = document.getElementById('wishlist-list');
  countLabel = document.getElementById('countLabel');
  savedCount = document.getElementById('savedCount');

  if (!listBox) {
    console.error('wishlist.js: element with id "wishlist-list" not found on this page.');
  }

  if (listBox) {
    listBox.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName !== 'BUTTON') return;

      var row = target.closest('.product-card');
      if (!row) return;
      var id = row.getAttribute('data-id');
      var action = target.getAttribute('data-action');

      if (action === 'remove') removeFromWishlist(id);
      else if (action === 'add-to-cart') {
        addItemToCart(id);
        target.textContent = 'Added ✓';
        target.disabled = true;
        setTimeout(function () {
          target.textContent = 'Add to Cart';
          target.disabled = false;
        }, 1000);
      }
    });
  }

  window.addEventListener('storage', render);

  render();
});