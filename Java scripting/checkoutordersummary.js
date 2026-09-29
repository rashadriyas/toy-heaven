/* =========================================================
   Toy Heaven - Checkout.js
   Reads the order saved by cart.js (localStorage) and shows
   it on the checkout page. Handles shipping selection,
   payment method toggling, form validation, and shows a
   confirmation pop-up (dialog) once the order is submitted.
   ========================================================= */

/* ---------- settings ---------- */
var ORDER_KEY = 'toyHeavenOrder';
var CART_KEY = 'toyHeavenCart';

/* ---------- element references ---------- */
var checkoutForm, orderItemsList, itemCountEl, subtotalEl, shippingCostEl,
    finalTotalEl, shippingRadios, paymentRadios, cardFields, codMessage,
    emptyCartDialog, successDialog, successMessage, successOrderNumber;

/* ---------- storage helpers ---------- */
function loadOrder() {
  try {
    var data = JSON.parse(localStorage.getItem(ORDER_KEY));
    if (data && Array.isArray(data.items)) return data;
    return null;
  } catch (e) {
    return null;
  }
}

function clearCartAndOrder() {
  try {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(ORDER_KEY);
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

/* ---------- rendering order items ---------- */
function orderItemHTML(item) {
  return (
    '<li class="order-item" data-id="' + escapeHTML(item.id) + '">' +
      '<section class="order-item-info">' +
        '<p class="order-item-name">' + escapeHTML(item.name) + '</p>' +
        '<p class="order-item-qty">Qty: ' + item.qty + '</p>' +
      '</section>' +
      '<p class="order-item-price">' + money(item.price * item.qty) + '</p>' +
    '</li>'
  );
}

function renderOrderItems(order) {
  if (!orderItemsList) return;

  var count = 0;
  var html = '';
  for (var i = 0; i < order.items.length; i++) {
    count += order.items[i].qty;
    html += orderItemHTML(order.items[i]);
  }

  orderItemsList.innerHTML = html;

  if (itemCountEl) {
    itemCountEl.textContent = count + (count === 1 ? ' item' : ' items');
  }
}

/* ---------- totals ---------- */
function getSelectedShippingPrice() {
  var price = 0;
  for (var i = 0; i < shippingRadios.length; i++) {
    if (shippingRadios[i].checked) {
      var value = parseFloat(shippingRadios[i].getAttribute('data-price'));
      price = isNaN(value) ? 0 : value;
      break;
    }
  }
  return price;
}

function updateTotals(order) {
  var itemsAfterDiscount = order.totals.subtotal - order.totals.discount;
  var shippingPrice = getSelectedShippingPrice();
  var finalTotal = itemsAfterDiscount + shippingPrice;

  if (subtotalEl) subtotalEl.textContent = money(itemsAfterDiscount);
  if (shippingCostEl) shippingCostEl.textContent = shippingPrice === 0 ? 'FREE' : money(shippingPrice);
  if (finalTotalEl) finalTotalEl.textContent = money(finalTotal);
}

/* ---------- payment method toggle ---------- */
function togglePaymentFields(method) {
  if (method === 'card') {
    if (cardFields) cardFields.hidden = false;
    if (codMessage) codMessage.hidden = true;
  } else {
    if (cardFields) cardFields.hidden = true;
    if (codMessage) codMessage.hidden = false;
  }
}

/* ---------- helpers for radios ---------- */
function getCheckedRadioValue(name) {
  var radios = document.getElementsByName(name);
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return '';
}

/* ---------- form validation ---------- */
function showError(inputId, message) {
  var errorEl = document.getElementById(inputId + '-error');
  if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
  var errorEls = document.querySelectorAll('.error');
  for (var i = 0; i < errorEls.length; i++) {
    errorEls[i].textContent = '';
  }
}

function validateForm() {
  clearErrors();
  var isValid = true;

  var requiredFields = ['first-name', 'last-name', 'email', 'phone', 'address', 'city', 'state', 'country'];
  for (var i = 0; i < requiredFields.length; i++) {
    var field = document.getElementById(requiredFields[i]);
    if (field && field.value.trim() === '') {
      showError(requiredFields[i], 'This field is required.');
      isValid = false;
    }
  }

  var emailField = document.getElementById('email');
  if (emailField && emailField.value.trim() !== '') {
    var emailValue = emailField.value.trim();
    var hasAt = emailValue.indexOf('@') > -1;
    var hasDot = emailValue.indexOf('.') > -1;
    if (!hasAt || !hasDot) {
      showError('email', 'Please enter a valid email address.');
      isValid = false;
    }
  }

  var paymentMethod = getCheckedRadioValue('payment');
  if (paymentMethod === 'card') {
    var cardNumber = document.getElementById('card-number');
    var expiry = document.getElementById('expiry');
    var cvc = document.getElementById('cvc');

    if (cardNumber && cardNumber.value.trim() === '') {
      showError('card-number', 'Card number is required.');
      isValid = false;
    }
    if (expiry && expiry.value.trim() === '') {
      showError('expiry', 'Expiry date is required.');
      isValid = false;
    }
    if (cvc && cvc.value.trim() === '') {
      showError('cvc', 'CVC is required.');
      isValid = false;
    }
  }

  return isValid;
}

/* ---------- order number ---------- */
function generateOrderNumber() {
  var random = Math.floor(Math.random() * 900000) + 100000;
  return 'TH-' + random;
}

/* ---------- submit handler (shows the pop-up) ---------- */
function handleSubmit(event) {
  event.preventDefault();

  var order = loadOrder();
  if (!order || !order.items.length) {
    if (emptyCartDialog) emptyCartDialog.showModal();
    return;
  }

  var formIsValid = validateForm();
  if (!formIsValid) return;

  var orderNumber = generateOrderNumber();

  if (successMessage) {
    successMessage.textContent = 'Your order has been placed successfully.';
  }
  if (successOrderNumber) {
    successOrderNumber.textContent = 'Order number: ' + orderNumber;
  }

  clearCartAndOrder();

  if (successDialog) successDialog.showModal();

  if (checkoutForm) checkoutForm.reset();
  togglePaymentFields('card');
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  checkoutForm = document.getElementById('checkout-form');
  orderItemsList = document.getElementById('order-items');
  itemCountEl = document.getElementById('item-count');
  subtotalEl = document.getElementById('subtotal');
  shippingCostEl = document.getElementById('shipping-cost');
  finalTotalEl = document.getElementById('final-total');
  shippingRadios = document.getElementsByName('shipping');
  paymentRadios = document.getElementsByName('payment');
  cardFields = document.getElementById('card-fields');
  codMessage = document.getElementById('cod-message');
  emptyCartDialog = document.getElementById('empty-cart-dialog');
  successDialog = document.getElementById('success-dialog');
  successMessage = document.getElementById('success-message');
  successOrderNumber = document.getElementById('success-order-number');

  var order = loadOrder();

  /* No order saved, or the cart was empty -> show the empty-cart pop-up */
  if (!order || !order.items.length) {
    if (emptyCartDialog) emptyCartDialog.showModal();
    return;
  }

  renderOrderItems(order);
  updateTotals(order);

  for (var i = 0; i < shippingRadios.length; i++) {
    shippingRadios[i].addEventListener('change', function () {
      updateTotals(order);
    });
  }

  for (var j = 0; j < paymentRadios.length; j++) {
    paymentRadios[j].addEventListener('change', function (event) {
      togglePaymentFields(event.target.value);
    });
  }

});