/* =========================================================
   Toy Heaven - cart.js
   Reads the cart saved by productlist.js and shows it on
   the shopping cart page.
   ========================================================= */

/* ---------- settings  ---------- */
var CART_KEY = 'toyHeavenCart';
var COUPON_KEY = 'toyHeavenCoupon';
var ORDER_KEY = 'toyHeavenOrder';
var MAX_QTY = 10;
var FREE_DELIVERY_OVER = 5000; // Rs.
var DELIVERY_FEE = 350;        // Rs.
var CHECKOUT_PAGE = './Checkout.html';

var COUPONS = {
  TOY10:      { type: 'percent', value: 10,  label: '10% off' },
  WELCOME500: { type: 'flat',    value: 500, label: 'Rs. 500 off' }
};

/* ---------- element references ---------- */
var cartLayoutPanel, orderSummary, emptyCart, itemsBox, itemSummary,
    subtotalEl, deliveryEl, totalEl, couponInput, couponMsg, checkoutBtn;

/* ---------- storage helpers ---------- */
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

function loadCoupon() {
  try {
    return localStorage.getItem(COUPON_KEY) || '';
  } catch (e) {
    return '';
  }
}

function saveCoupon(code) {
  try {
    if (code) localStorage.setItem(COUPON_KEY, code);
    else localStorage.removeItem(COUPON_KEY);
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

/* ---------- calculations ---------- */
function calculate(cart) {
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    subtotal += cart[i].price * cart[i].qty;
  }

  var discount = 0;
  var code = loadCoupon();
  var coupon = COUPONS[code];
  if (coupon && subtotal > 0) {
    if (coupon.type === 'percent') {
      discount = Math.round(subtotal * coupon.value / 100);
    } else {
      discount = Math.min(coupon.value, subtotal);
    }
  }

  var afterDiscount = subtotal - discount;
  var delivery = subtotal === 0 ? 0 : (afterDiscount >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE);

  return {
    subtotal: subtotal,
    discount: discount,
    delivery: delivery,
    total: afterDiscount + delivery,
    code: coupon ? code : ''
  };
}

/* ---------- rendering (no div tags) ---------- */
function itemHTML(item) {
  return (
    '<article class="cart-item" data-id="' + escapeHTML(item.id) + '">' +
      '<img src="' + escapeHTML(item.image) + '" alt="' + escapeHTML(item.name) + '">' +
      '<section class="cart-item-info">' +
        '<h3 class="cart-item-name">' + escapeHTML(item.name) + '</h3>' +
        '<p class="cart-item-price">' + money(item.price) + ' each</p>' +
        '<span class="quantity-controls">' +
          '<button type="button" data-action="dec" aria-label="Decrease quantity of ' + escapeHTML(item.name) + '">−</button>' +
          '<span aria-live="polite">' + item.qty + '</span>' +
          '<button type="button" data-action="inc" aria-label="Increase quantity of ' + escapeHTML(item.name) + '">+</button>' +
        '</span>' +
      '</section>' +
      '<section class="cart-item-side">' +
        '<p class="cart-item-total">' + money(item.price * item.qty) + '</p>' +
        '<button type="button" class="remove-item" data-action="remove">Remove</button>' +
      '</section>' +
    '</article>'
  );
}

function setVisible(el, show) {
  if (!el) return;
  el.hidden = !show;
  el.style.display = show ? '' : 'none';
}

function render() {
  if (!itemsBox) {
    console.error('cart.js: #cart-items element not found — check your Cart HTML id.');
    return;
  }

  var cart = loadCart();
  var isEmpty = cart.length === 0;

  setVisible(cartLayoutPanel, !isEmpty);
  setVisible(orderSummary, !isEmpty);
  setVisible(emptyCart, isEmpty);

  var count = 0;
  var itemsHTML = '';
  for (var i = 0; i < cart.length; i++) {
    count += cart[i].qty;
    itemsHTML += itemHTML(cart[i]);
  }

  if (itemSummary) {
    itemSummary.textContent = '(' + count + (count === 1 ? ' item)' : ' items)');
  }
  itemsBox.innerHTML = itemsHTML;

  var t = calculate(cart);
  if (subtotalEl) subtotalEl.textContent = money(t.subtotal);
  if (deliveryEl) deliveryEl.textContent = t.delivery === 0 ? 'Free' : money(t.delivery);
  if (totalEl) totalEl.textContent = money(t.total);
  if (checkoutBtn) checkoutBtn.disabled = isEmpty;

  if (couponMsg) {
    if (t.code) {
      couponMsg.textContent = t.code + ' applied: ' + COUPONS[t.code].label + ' (−' + money(t.discount) + ')';
      couponMsg.className = 'coupon-message success';
      if (couponInput) couponInput.value = t.code;
    } else if (couponMsg.className.indexOf('error') === -1) {
      couponMsg.textContent = '';
      couponMsg.className = 'coupon-message';
    }
  }
}

/* ---------- actions ---------- */
function changeQty(id, delta) {
  var cart = loadCart();
  var item = null;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      item = cart[i];
      break;
    }
  }
  if (!item) return;

  item.qty = Math.min(item.qty + delta, MAX_QTY);

  if (item.qty <= 0) {
    var newCart = [];
    for (var j = 0; j < cart.length; j++) {
      if (cart[j].id !== id) newCart.push(cart[j]);
    }
    cart = newCart;
  }

  saveCart(cart);
  render();
}

function removeItem(id) {
  var cart = loadCart();
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) newCart.push(cart[i]);
  }
  saveCart(newCart);
  render();
}

function clearCart() {
  if (!loadCart().length) return;
  if (!window.confirm('Remove all items from your cart?')) return;
  saveCart([]);
  saveCoupon('');
  if (couponInput) couponInput.value = '';
  render();
}

function applyCoupon() {
  if (!couponInput || !couponMsg) return;
  var code = couponInput.value.trim().toUpperCase();

  if (!code) {
    saveCoupon('');
    couponMsg.textContent = 'Please enter a discount code.';
    couponMsg.className = 'coupon-message error';
    render();
    return;
  }

  if (!COUPONS[code]) {
    saveCoupon('');
    couponMsg.textContent = 'Sorry, that code is not valid.';
    couponMsg.className = 'coupon-message error';
    render();
    return;
  }

  saveCoupon(code);
  couponMsg.className = 'coupon-message';
  render();
}

function checkout() {
  var cart = loadCart();
  if (!cart.length) return;

  var t = calculate(cart);
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify({ items: cart, totals: t }));
  } catch (e) {}

  window.location.href = CHECKOUT_PAGE;
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  cartLayoutPanel = document.querySelector('.cart-panel');
  orderSummary = document.getElementById('order-summary');
  emptyCart = document.getElementById('empty-cart');
  itemsBox = document.getElementById('cart-items');
  itemSummary = document.getElementById('item-summary');
  subtotalEl = document.getElementById('subtotal');
  deliveryEl = document.getElementById('delivery');
  totalEl = document.getElementById('total');
  couponInput = document.getElementById('coupon-code');
  couponMsg = document.getElementById('coupon-message');
  checkoutBtn = document.getElementById('checkout-button');

  if (!cartLayoutPanel) console.error('cart.js: element with class "cart-panel" not found.');
  if (!itemsBox) console.error('cart.js: element with id "cart-items" not found.');
  if (!orderSummary) console.warn('cart.js: element with id "order-summary" not found.');
  if (!emptyCart) console.warn('cart.js: element with id "empty-cart" not found.');

  if (itemsBox) {
    itemsBox.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName !== 'BUTTON') return;

      var row = target.closest('.cart-item');
      if (!row) return;
      var id = row.getAttribute('data-id');
      var action = target.getAttribute('data-action');

      if (action === 'inc') changeQty(id, 1);
      else if (action === 'dec') changeQty(id, -1);
      else if (action === 'remove') removeItem(id);
    });
  }

  var clearBtn = document.getElementById('clear-cart');
  if (clearBtn) clearBtn.addEventListener('click', clearCart);

  var applyBtn = document.getElementById('apply-coupon');
  if (applyBtn) applyBtn.addEventListener('click', applyCoupon);

  if (couponInput) {
    couponInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { applyCoupon(); }
    });
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);

  window.addEventListener('storage', render);

  render();
});