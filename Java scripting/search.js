// Reusable search bar - works on every page.
// - Typing shows suggestions (from PRODUCTS in products-data.js)
// - Recent searches are saved in localStorage
// - Submitting goes to the product list, which filters its cards
// Uses events, DOM, arrays, localStorage and JSON from the lecture notes.

const SEARCH_KEY = 'toyHeavenRecentSearches';
const MAX_RECENT = 5;

let currentSearch = '';          // used by filter.js on the product list page
const onProductPage = document.querySelector('.product-list') !== null;
const inHtmlFolder = window.location.pathname.toLowerCase().indexOf('/html/') !== -1;
const PRODUCT_PAGE = (inHtmlFolder ? '' : 'HTML/') + 'products listing page.html';

/* ---------- reusable helpers ---------- */
function cleanWord(word) {
  word = word.toLowerCase();
  // "toys" should match "toy"
  if (word.length > 3 && word.charAt(word.length - 1) === 's') {
    word = word.slice(0, -1);
  }
  return word;
}

// true if EVERY word typed is found somewhere in the text
function textMatches(text, query) {
  let words = query.trim().split(/\s+/);
  text = text.toLowerCase();
  for (let i = 0; i < words.length; i++) {
    if (words[i] !== '' && text.indexOf(cleanWord(words[i])) === -1) return false;
  }
  return true;
}

// used by filter.js for each product card
function cardMatchesSearch(card) {
  if (currentSearch === '') return true;
  let text = card.querySelector('h2').textContent + ' ' +
             card.querySelector('.product-category').textContent + ' ' +
             card.querySelector('img').getAttribute('alt');
  return textMatches(text, currentSearch);
}

function loadRecent() {
  try {
    let list = JSON.parse(localStorage.getItem(SEARCH_KEY));
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

function saveRecent(query) {
  let list = loadRecent();
  let newList = [query];
  for (let i = 0; i < list.length; i++) {
    if (list[i].toLowerCase() !== query.toLowerCase()) newList.push(list[i]);
  }
  try {
    localStorage.setItem(SEARCH_KEY, JSON.stringify(newList.slice(0, MAX_RECENT)));
  } catch (e) {}
}

/* ---------- running a search ---------- */
function runSearch(query) {
  query = query.trim();
  if (query === '') return;
  saveRecent(query);

  if (onProductPage) {
    setSearch(query);
  } else {
    window.location.href = PRODUCT_PAGE + '?search=' + encodeURIComponent(query);
  }
}

// product list page only: apply the search to the cards
function setSearch(query) {
  currentSearch = query.trim();
  let inputs = document.querySelectorAll('.search-input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value !== query) inputs[i].value = query;
  }
  showSearchNote();
  // filterBox is set by filter.js once the page is ready; before that,
  // filter.js runs applyFilters() itself and will use currentSearch
  if (typeof applyFilters === 'function' && filterBox) applyFilters();
}

function showSearchNote() {
  let note = document.getElementById('search-note');
  if (!note) {
    note = document.createElement('p');
    note.id = 'search-note';
    note.style.margin = '0 0 12px';
    let list = document.querySelector('.product-list');
    list.parentNode.insertBefore(note, list);
  }
  if (currentSearch === '') {
    note.style.display = 'none';
    return;
  }
  note.style.display = 'block';
  note.textContent = 'Showing results for "' + currentSearch + '" ';
  let clear = document.createElement('button');
  clear.type = 'button';
  clear.textContent = 'Clear search';
  clear.className = 'search-clear';
  clear.addEventListener('click', clearSearch);
  note.appendChild(clear);
}

function clearSearch() {
  setSearch('');
}

/* ---------- suggestions dropdown ---------- */
function getSuggestions(query) {
  let result = [];
  if (typeof PRODUCTS === 'undefined') return result;
  for (let i = 0; i < PRODUCTS.length; i++) {
    let p = PRODUCTS[i];
    if (textMatches(p.name + ' ' + p.category, query)) result.push(p);
  }
  return result.slice(0, 6);
}

function showDropdown(input) {
  let form = input.closest('form');
  let box = form.querySelector('.search-suggest');
  box.innerHTML = '';
  let query = input.value.trim();
  let items = [];

  if (query === '') {
    let recent = loadRecent();
    for (let i = 0; i < recent.length; i++) items.push({ text: recent[i], small: 'Recent' });
  } else {
    let found = getSuggestions(query);
    for (let i = 0; i < found.length; i++) {
      items.push({ text: found[i].name, small: found[i].category });
    }
    if (found.length === 0) items.push({ text: query, small: 'Search all products' });
  }

  if (items.length === 0) {
    box.style.display = 'none';
    return;
  }

  for (let i = 0; i < items.length; i++) {
    let row = document.createElement('button');
    row.type = 'button';
    row.className = 'suggest-item';
    row.innerHTML = '<span></span><small></small>';
    row.children[0].textContent = items[i].text;
    row.children[1].textContent = items[i].small;
    row.addEventListener('mousedown', suggestionClicked);
    box.appendChild(row);
  }
  box.style.display = 'block';
}

function suggestionClicked(event) {
  event.preventDefault();
  runSearch(this.children[0].textContent);
}

function hideAllDropdowns() {
  let boxes = document.querySelectorAll('.search-suggest');
  for (let i = 0; i < boxes.length; i++) boxes[i].style.display = 'none';
}

/* ---------- setting up every search form on the page ---------- */
function setupSearchForm(form) {
  let input = form.querySelector('.search-input');
  if (!input) return;

  form.style.position = 'relative';
  input.setAttribute('autocomplete', 'off');

  let box = document.createElement('section');
  box.className = 'search-suggest';
  form.appendChild(box);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    hideAllDropdowns();
    if (input.value.trim() === '' && onProductPage) {
      clearSearch();
    } else {
      runSearch(input.value);
    }
  });

  input.addEventListener('focus', function () { showDropdown(input); });
  input.addEventListener('input', function () {
    showDropdown(input);
    // on the product list, filter while typing
    if (onProductPage) setSearch(input.value);
  });
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') hideAllDropdowns();
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let forms = document.querySelectorAll('.search-form, .search-Products-form');
  for (let i = 0; i < forms.length; i++) setupSearchForm(forms[i]);

  document.addEventListener('click', function (event) {
    if (!event.target.closest('form')) hideAllDropdowns();
  });

  // arriving from another page: ...products listing page.html?search=word
  if (onProductPage) {
    let word = new URLSearchParams(window.location.search).get('search');
    if (word) setSearch(word);
  }
});