/* =========================================================
   Toy Heaven - productModal.js
   Opens a quick-view popup showing full details of a
   product when its card is clicked.
   ========================================================= */

var modal, modalImage, modalCategory, modalName, modalRating,
    modalPrice, modalCartBtn, modalWishBtn, currentCard;

function openModal(card) {
  currentCard = card;

  var nameEl = card.querySelector('h2');
  var catEl = card.querySelector('.product-category');
  var priceEl = card.querySelector('.price');
  var ratingEl = card.querySelector('.rating');
  var imgEl = card.querySelector('.thumb img');
  var wishBtn = card.querySelector('.wishlist-btn');

  if (imgEl) {
    modalImage.src = imgEl.getAttribute('src');
    modalImage.alt = imgEl.getAttribute('alt') || '';
  }

  modalCategory.textContent = catEl ? catEl.textContent.trim() : '';
  modalName.textContent = nameEl ? nameEl.textContent.trim() : '';
  modalRating.innerHTML = ratingEl ? ratingEl.innerHTML : '';
  modalPrice.innerHTML = priceEl ? priceEl.innerHTML : '';

  var saved = wishBtn ? wishBtn.classList.contains('active') : false;
  setWishlistButtonState(modalWishBtn, saved);

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
  currentCard = null;
}

// Keeps the wishlist heart on the real product card in sync
// after the user toggles it from inside the modal.
function syncCardWishlistButton() {
  if (!currentCard) return;
  var nameEl = currentCard.querySelector('h2');
  var wishBtn = currentCard.querySelector('.wishlist-btn');
  if (!nameEl || !wishBtn) return;

  var id = slugify(nameEl.textContent.trim());
  setWishlistButtonState(wishBtn, isInWishlist(id));
}

document.addEventListener('DOMContentLoaded', function () {
  modal = document.getElementById('product-modal');
  modalImage = document.getElementById('modal-image');
  modalCategory = document.getElementById('modal-category');
  modalName = document.getElementById('modal-name');
  modalRating = document.getElementById('modal-rating');
  modalPrice = document.getElementById('modal-price');
  modalCartBtn = document.getElementById('modal-cart-btn');
  modalWishBtn = document.getElementById('modal-wishlist-btn');

  if (!modal) {
    console.error('productModal.js: #product-modal not found — check your HTML.');
    return;
  }

  // Open the modal when a card is clicked (but not when a
  // button inside the card, like Add to Cart, is clicked).
  var cards = document.querySelectorAll('.product-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') return;
      openModal(card);
    });
  });

  // Close the modal via the X button or clicking the overlay
  modal.addEventListener('click', function (e) {
    if (e.target.getAttribute('data-action') === 'close-modal') {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  // Modal's own Add to Cart button
  modalCartBtn.addEventListener('click', function () {
    if (currentCard) addToCart(currentCard, modalCartBtn);
  });

  // Modal's own wishlist heart
  modalWishBtn.addEventListener('click', function () {
    if (currentCard) {
      toggleWishlist(currentCard, modalWishBtn);
      syncCardWishlistButton();
    }
  });
});