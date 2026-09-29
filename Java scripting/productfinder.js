/* =========================================================
   Toy Heaven - productfinder.js  (Smart Product Finder)
   Asks 5 questions, gives every toy a match score,
   shows the best matches and lets the user save them.
   All names start with "finder" so they don't clash with
   wishlist.js and badge.js on the same page.
   ========================================================= */

const FINDER_WISHLIST_KEY = 'toyHeavenWishlist';
const FINDER_CART_KEY = 'toyHeavenCart';
const FINDER_MAX_QTY = 10;
const FINDER_PRODUCT_PAGE = 'products listing page.html';

/* ---------- toy data (JSON format) ----------
   ages: age groups it suits     interests: what it is good for
   type: toy category            tags: popular / gift / trending / value */
const FINDER_TOYS = [
  { name: 'Beyblade Battle Set', category: 'Action Toys', price: 3500, image: '../images for products/Beyblades.jpg', type: 'collectibles', ages: ['6-8', '9-12'], interests: ['fun', 'active'], tags: ['popular', 'trending'] },
  { name: 'Kids Slime Set', category: 'Creative Toys', price: 2100, image: '../images for products/Kids Slime.jpg', type: 'creative', ages: ['6-8', '9-12'], interests: ['creative', 'fun'], tags: ['value', 'gift'] },
  { name: 'Creative Lego Building Set', category: 'Building Toys', price: 6500, image: '../images for products/Lego toys.jpg', type: 'building', ages: ['6-8', '9-12'], interests: ['learn', 'creative'], tags: ['popular', 'gift'] },
  { name: 'Pokemon Collection', category: 'Collectibles', price: 4800, image: '../images for products/All kinds of pokemons.jpg', type: 'collectibles', ages: ['6-8', '9-12', 'teens'], interests: ['collect', 'fun'], tags: ['trending', 'popular', 'gift'] },
  { name: 'Kids Kitchen Set', category: 'Pretend Play', price: 4500, image: '../images for products/kitchen set.jpg', type: 'creative', ages: ['3-5', '6-8'], interests: ['creative', 'fun'], tags: ['gift'] },
  { name: "Classic Rubik's Cube", category: 'Games', price: 2500, image: '../images for products/Rubix cube.jpg', type: 'games', ages: ['9-12', 'teens'], interests: ['learn'], tags: ['value', 'popular'] },
  { name: 'Building Blox', category: 'Building Toys', price: 3000, image: '../images for products/Building Blox.jpg', type: 'building', ages: ['3-5', '6-8'], interests: ['learn', 'creative'], tags: ['value'] },
  { name: 'My Barbie Doll', category: 'Dolls', price: 5500, image: '../images for products/My Barbie.jpg', type: 'creative', ages: ['3-5', '6-8'], interests: ['creative', 'collect'], tags: ['popular', 'gift'] },
  { name: 'Kids Football', category: 'Sports Toys', price: 2000, image: '../New folder/balls.jpg', type: 'outdoor', ages: ['6-8', '9-12'], interests: ['active'], tags: ['value', 'popular'] },
  { name: 'PlayStation Gaming Set', category: 'Gaming', price: 25000, image: '../New folder/ps.jpg', type: 'games', ages: ['9-12', 'teens'], interests: ['fun'], tags: ['popular', 'trending'] },
  { name: 'Family Board Game', category: 'Games', price: 4500, image: '../New folder/boaed games.jpg', type: 'games', ages: ['6-8', '9-12', 'teens'], interests: ['learn', 'fun'], tags: ['gift', 'popular'] },
  { name: 'Fun Toy Collection', category: 'Toys', price: 3800, image: '../New folder/d1.jpg', type: 'other', ages: ['3-5', '6-8'], interests: ['fun'], tags: ['value'] },
  { name: 'Pokemon Cards', category: 'Collectibles', price: 3000, image: '../images for products/Pokemon Cards.jpg', type: 'collectibles', ages: ['9-12', 'teens'], interests: ['collect'], tags: ['trending', 'value'] },
  { name: 'Batman Toy', category: 'Action Figures', price: 4000, image: '../images for products/Batman.jpg', type: 'collectibles', ages: ['6-8', '9-12', 'teens'], interests: ['collect', 'fun'], tags: ['popular', 'gift'] },
  { name: 'Groot Toy', category: 'Action Figures', price: 3000, image: '../images for products/trendy img 1.jpg', type: 'collectibles', ages: ['6-8', '9-12', 'teens'], interests: ['collect'], tags: ['trending'] },
  { name: 'Hulk Toy', category: 'Action Figures', price: 4000, image: '../images for products/terndy img 2.png', type: 'collectibles', ages: ['6-8', '9-12', 'teens'], interests: ['collect', 'active'], tags: ['popular'] },
  { name: 'Labubu Toy', category: 'Collectible Toys', price: 4200, image: '../images for products/Trendy image 3.jpg', type: 'collectibles', ages: ['9-12', 'teens'], interests: ['collect'], tags: ['trending', 'gift'] },
  { name: 'Kids Scooter', category: 'Outdoor Toys', price: 6800, image: '../New folder/scooter.jpg', type: 'outdoor', ages: ['6-8', '9-12'], interests: ['active', 'fun'], tags: ['popular', 'gift'] },
  { name: 'Kids Toy', category: 'Toys', price: 4000, image: '../New folder/gg.jpg', type: 'other', ages: ['0-2', '3-5'], interests: ['fun', 'learn'], tags: ['value'] },
  { name: 'Slinky', category: 'Classic Toys', price: 2400, image: '../New folder/images.jpg', type: 'other', ages: ['3-5', '6-8'], interests: ['fun', 'learn'], tags: ['value'] },
  { name: 'Iron Man', category: 'Action Figures', price: 4500, image: '../New folder/tony.jpg', type: 'collectibles', ages: ['6-8', '9-12', 'teens'], interests: ['collect'], tags: ['popular', 'gift'] }
];

/* ---------- the 5 questions ---------- */
const FINDER_QUESTIONS = [
  { key: 'age', icon: '🎂', title: 'Who is the toy for?', options: [
    { label: '0–2 years', value: '0-2' }, { label: '3–5 years', value: '3-5' },
    { label: '6–8 years', value: '6-8' }, { label: '9–12 years', value: '9-12' },
    { label: 'Teens', value: 'teens' } ] },
  { key: 'interest', icon: '🎯', title: 'What should the toy be good for?', options: [
    { label: 'Pure fun', value: 'fun' }, { label: 'Learning & thinking', value: 'learn' },
    { label: 'Creativity', value: 'creative' }, { label: 'Active play', value: 'active' },
    { label: 'Collecting', value: 'collect' } ] },
  { key: 'category', icon: '🧸', title: 'Which toy category do you like?', options: [
    { label: 'Building toys', value: 'building' }, { label: 'Games & puzzles', value: 'games' },
    { label: 'Collectibles & figures', value: 'collectibles' }, { label: 'Creative & pretend play', value: 'creative' },
    { label: 'Outdoor & sports', value: 'outdoor' }, { label: 'Surprise me', value: 'any' } ] },
  { key: 'budget', icon: '💰', title: 'What is your budget?', options: [
    { label: 'Up to Rs. 3,000', value: 'low' }, { label: 'Rs. 3,000 – 5,000', value: 'mid' },
    { label: 'Over Rs. 5,000', value: 'high' }, { label: 'Any budget', value: 'any' } ] },
  { key: 'pref', icon: '⭐', title: 'What matters most to you?', options: [
    { label: 'Good value', value: 'value' }, { label: 'Most popular', value: 'popular' },
    { label: 'Great for gifting', value: 'gift' }, { label: 'Trending now', value: 'trending' },
    { label: 'No preference', value: 'none' } ] }
];

/* words used when explaining a match */
const FINDER_AGE_ORDER = ['0-2', '3-5', '6-8', '9-12', 'teens'];
const FINDER_BUDGETS = { low: [0, 3000], mid: [3000, 5000], high: [5000, 1000000] };
const FINDER_INTEREST_TEXT = { fun: 'fun play', learn: 'learning', creative: 'creative play', active: 'active play', collect: 'collecting' };
const FINDER_TYPE_TEXT = { building: 'building', games: 'games', collectibles: 'collectibles', creative: 'creative', outdoor: 'outdoor' };
const FINDER_PREF_TEXT = { value: 'is good value', popular: 'is a popular pick', gift: 'makes a great gift', trending: 'is trending right now' };

/* ---------- state ---------- */
let finderStep = 0;
let finderAnswers = {};

/* ---------- small helpers ---------- */
function finderEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function finderMoney(n) {
  return 'Rs. ' + Number(n).toLocaleString('en-US');
}

function finderSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function finderLoadList(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

function finderSaveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {}
}

function finderAgeText(value) {
  return value === 'teens' ? 'teens' : value.replace('-', '–');
}

/* ---------- scoring: how well does a toy match? (max 100) ---------- */
function finderScoreToy(toy, a) {
  let score = 0;
  const reasons = [];

  // 1. age group - 30 points (next door age group gets a few)
  if (toy.ages.indexOf(a.age) !== -1) {
    score += 30;
    reasons.push('suits ages ' + finderAgeText(a.age));
  } else {
    const wanted = FINDER_AGE_ORDER.indexOf(a.age);
    for (let i = 0; i < toy.ages.length; i++) {
      if (Math.abs(FINDER_AGE_ORDER.indexOf(toy.ages[i]) - wanted) === 1) {
        score += 10;
        break;
      }
    }
  }

  // 2. purpose / interest - 25 points
  if (toy.interests.indexOf(a.interest) !== -1) {
    score += 25;
    reasons.push('is great for ' + FINDER_INTEREST_TEXT[a.interest]);
  }

  // 3. category - 20 points
  if (a.category === 'any') {
    score += 20;
  } else if (toy.type === a.category) {
    score += 20;
    reasons.push('is in the ' + FINDER_TYPE_TEXT[a.category] + ' category');
  }

  // 4. budget - 15 points (a little over/under gets some)
  if (a.budget === 'any') {
    score += 15;
  } else {
    const min = FINDER_BUDGETS[a.budget][0];
    const max = FINDER_BUDGETS[a.budget][1];
    if (toy.price >= min && toy.price <= max) {
      score += 15;
      reasons.push('fits your budget');
    } else if (toy.price >= min * 0.8 && toy.price <= max * 1.25) {
      score += 6;
    }
  }

  // 5. important preference - 10 points
  if (a.pref === 'none') {
    score += 10;
  } else if (toy.tags.indexOf(a.pref) !== -1) {
    score += 10;
    reasons.push(FINDER_PREF_TEXT[a.pref]);
  }

  return { toy: toy, score: score, reasons: reasons };
}

function finderReasonSentence(reasons) {
  if (reasons.length === 0) return 'Closest match to your answers.';
  const list = reasons.slice(0, 3);
  let text = list[0];
  for (let i = 1; i < list.length; i++) {
    text += (i === list.length - 1 ? ' and ' : ', ') + list[i];
  }
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

/* ---------- questions ---------- */
function finderStartQuiz() {
  finderStep = 0;
  finderAnswers = {};
  document.getElementById('pf-start').hidden = true;
  document.getElementById('pf-results').hidden = true;
  document.getElementById('pf-quiz').hidden = false;
  finderShowQuestion();
}

function finderShowQuestion() {
  const q = FINDER_QUESTIONS[finderStep];
  const total = FINDER_QUESTIONS.length;
  const box = document.getElementById('pf-options');

  document.getElementById('pf-step').textContent = 'Question ' + (finderStep + 1) + ' of ' + total;
  document.getElementById('pf-bar-fill').style.width = ((finderStep + 1) / total * 100) + '%';
  document.getElementById('pf-question').textContent = q.icon + ' ' + q.title;
  box.innerHTML = '';

  for (let i = 0; i < q.options.length; i++) {
    const btn = finderEl('button', 'pf-option', q.options[i].label);
    btn.type = 'button';
    btn.setAttribute('data-value', q.options[i].value);
    if (finderAnswers[q.key] === q.options[i].value) btn.classList.add('selected');
    btn.addEventListener('click', finderOptionClicked);
    box.appendChild(btn);
  }

  document.getElementById('pf-back').disabled = finderStep === 0;
  document.getElementById('pf-next').disabled = !finderAnswers[q.key];
  document.getElementById('pf-next').textContent = finderStep === total - 1 ? 'Show my matches' : 'Next';
}

function finderOptionClicked() {
  const q = FINDER_QUESTIONS[finderStep];
  const buttons = document.querySelectorAll('#pf-options .pf-option');
  for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('selected');

  this.classList.add('selected');
  finderAnswers[q.key] = this.getAttribute('data-value');
  document.getElementById('pf-next').disabled = false;
}

function finderNext() {
  if (finderStep < FINDER_QUESTIONS.length - 1) {
    finderStep++;
    finderShowQuestion();
  } else {
    finderShowResults();
  }
}

function finderBack() {
  if (finderStep > 0) {
    finderStep--;
    finderShowQuestion();
  }
}

/* ---------- results ---------- */
function finderShowResults() {
  const scored = FINDER_TOYS.map(toy => finderScoreToy(toy, finderAnswers));
  scored.sort((a, b) => b.score - a.score || a.toy.price - b.toy.price);

  let best = scored.filter(r => r.score >= 40).slice(0, 4);
  if (best.length < 3) best = scored.slice(0, 3);

  const grid = document.getElementById('pf-grid');
  grid.innerHTML = '';
  for (let i = 0; i < best.length; i++) grid.appendChild(finderBuildCard(best[i]));

  document.getElementById('pf-results-note').textContent = best[0].score >= 70
    ? 'Based on your answers, these toys fit best.'
    : 'No perfect match, so here are the closest toys to your answers.';

  document.getElementById('pf-quiz').hidden = true;
  document.getElementById('pf-results').hidden = false;
  document.getElementById('pf-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function finderBuildCard(result) {
  const toy = result.toy;
  const li = finderEl('li', 'pf-card');
  const article = finderEl('article');

  article.appendChild(finderEl('span', 'pf-match', result.score + '% Match'));

  const fig = finderEl('figure', 'pf-thumb');
  const img = document.createElement('img');
  img.src = toy.image;
  img.alt = toy.name;
  fig.appendChild(img);
  article.appendChild(fig);

  const info = finderEl('section', 'pf-info');
  info.appendChild(finderEl('p', 'pf-cat', toy.category));
  info.appendChild(finderEl('h4', 'pf-name', toy.name));
  info.appendChild(finderEl('p', 'pf-price', finderMoney(toy.price)));
  info.appendChild(finderEl('p', 'pf-reason', finderReasonSentence(result.reasons)));

  const actions = finderEl('section', 'pf-actions');

  const view = finderEl('a', 'pf-link', 'View Product');
  view.href = FINDER_PRODUCT_PAGE + '?search=' + encodeURIComponent(toy.name);
  actions.appendChild(view);

  const wish = finderEl('button', 'pf-wish');
  wish.type = 'button';
  finderSetWishButton(wish, finderIsSaved(toy));
  wish.addEventListener('click', () => finderToggleWishlist(toy, wish));
  actions.appendChild(wish);

  const cart = finderEl('button', 'pf-cart', 'Add to Cart');
  cart.type = 'button';
  cart.addEventListener('click', () => finderAddToCart(toy, cart));
  actions.appendChild(cart);

  info.appendChild(actions);
  article.appendChild(info);
  li.appendChild(article);
  return li;
}

/* ---------- wishlist and cart (same localStorage keys as the rest of the site) ---------- */
function finderToProduct(toy) {
  return { id: finderSlug(toy.name), name: toy.name, category: toy.category, price: toy.price, image: toy.image };
}

function finderIsSaved(toy) {
  const list = finderLoadList(FINDER_WISHLIST_KEY);
  const id = finderSlug(toy.name);
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) return true;
  }
  return false;
}

function finderSetWishButton(button, saved) {
  button.textContent = saved ? '♥ Saved' : '♡ Add to Wishlist';
  if (saved) {
    button.classList.add('saved');
  } else {
    button.classList.remove('saved');
  }
}

function finderToggleWishlist(toy, button) {
  const list = finderLoadList(FINDER_WISHLIST_KEY);
  const id = finderSlug(toy.name);
  let newList = [];
  const wasSaved = finderIsSaved(toy);

  if (wasSaved) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id !== id) newList.push(list[i]);
    }
  } else {
    newList = list;
    newList.push(finderToProduct(toy));
  }

  finderSaveList(FINDER_WISHLIST_KEY, newList);
  finderSetWishButton(button, !wasSaved);
  finderRefreshPage();
}

function finderAddToCart(toy, button) {
  const cart = finderLoadList(FINDER_CART_KEY);
  const id = finderSlug(toy.name);
  let existing = null;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) existing = cart[i];
  }

  if (existing) {
    existing.qty = Math.min(existing.qty + 1, FINDER_MAX_QTY);
  } else {
    const item = finderToProduct(toy);
    item.qty = 1;
    cart.push(item);
  }

  finderSaveList(FINDER_CART_KEY, cart);
  finderRefreshPage();

  button.textContent = 'Added ✓';
  button.disabled = true;
  setTimeout(() => {
    button.textContent = 'Add to Cart';
    button.disabled = false;
  }, 900);
}

// update the wishlist list above and the header badges (functions from wishlist.js / badge.js)
function finderRefreshPage() {
  if (typeof render === 'function') render();
  if (typeof updateCartBadgeHeader === 'function') updateCartBadgeHeader();
  if (typeof updateWishlistBadgeHeader === 'function') updateWishlistBadgeHeader();
}

/* ---------- init ---------- */
document.addEventListener('DOMContentLoaded', function () {
  const start = document.getElementById('pf-start');
  if (!start) return;   // this page has no finder section

  start.addEventListener('click', finderStartQuiz);
  document.getElementById('pf-next').addEventListener('click', finderNext);
  document.getElementById('pf-back').addEventListener('click', finderBack);
  document.getElementById('pf-restart').addEventListener('click', finderStartQuiz);
  document.getElementById('pf-change').addEventListener('click', function () {
    finderStep = 0;
    document.getElementById('pf-results').hidden = true;
    document.getElementById('pf-quiz').hidden = false;
    finderShowQuestion();
  });
});
