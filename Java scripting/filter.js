/* =========================================================
   Toy Heaven - productfilter.js
   Filters the product list by price, age group and toy type.
   ========================================================= */

/* ---------- age groups per product (edit as needed) ---------- */
const productAges = {
  "Beyblade Battle Set": ["6-8", "9-12"],
  "Kids Slime Set": ["6-8", "9-12"],
  "Creative Lego Building Set": ["6-8", "9-12"],
  "Pokemon Collection": ["6-8", "9-12", "teens"],
  "Kids Kitchen Set": ["3-5", "6-8"],
  "Classic Rubik's Cube": ["9-12", "teens"],
  "Building Blox": ["3-5", "6-8"],
  "My Barbie Doll": ["3-5", "6-8"],
  "Kids Football": ["6-8", "9-12"],
  "PlayStation Gaming Set": ["9-12", "teens"],
  "Family Board Game": ["6-8", "9-12", "teens"],
  "Fun Toy Collection": ["3-5", "6-8"],
  "Pokemon Cards": ["9-12", "teens"],
  "Batman Toy": ["6-8", "9-12", "teens"],
  "Groot Toy": ["6-8", "9-12", "teens"],
  "Hulk Toy": ["6-8", "9-12", "teens"],
  "Labubu Toy": ["9-12", "teens"],
  "Kids Scooter": ["6-8", "9-12"],
  "Kids Toy": ["0-2", "3-5"],
  "Slinky": ["3-5", "6-8"],
  "Iron Man": ["6-8", "9-12", "teens"]
};

/* ---------- category text -> toy type ---------- */
const categoryToType = {
  "Building Toys": "building",
  "Games": "games",
  "Gaming": "games",
  "Collectibles": "collectibles",
  "Collectible Toys": "collectibles",
  "Action Figures": "collectibles",
  "Action Toys": "collectibles",
  "Creative Toys": "creative",
  "Pretend Play": "creative",
  "Outdoor Toys": "vehicles"
};

/* ---------- element references ---------- */
let filterBox, cards, countText, clearBtn, productList, emptyMsg;
let products = [];

/* ---------- read the current price from a card ---------- */
function getPrice(card) {
  const priceEl = card.querySelector(".price");
  let text = priceEl.textContent;

  // remove the crossed-out old price (<del>) from the text
  const oldPrice = priceEl.querySelector("del");
  if (oldPrice) {
    text = text.replace(oldPrice.textContent, "");
  }

  // keep only the digits
  let digits = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    if (ch >= "0" && ch <= "9") {
      digits += ch;
    }
  }

  return digits === "" ? 0 : parseInt(digits, 10);
}

/* ---------- build the products array from the cards ---------- */
function readProducts() {
  products = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const name = card.querySelector("h2").textContent.trim();
    const category = card.querySelector(".product-category").textContent.trim();

    products.push({
      card: card,
      price: getPrice(card),
      ages: productAges[name] || [],
      type: categoryToType[category] || ""
    });
  }
}

/* ---------- helpers ---------- */
function getChecked(name) {
  const boxes = filterBox.querySelectorAll('input[name="' + name + '"]:checked');
  const values = [];

  for (let i = 0; i < boxes.length; i++) {
    values.push(boxes[i].value);
  }

  return values;
}

function priceMatches(price, ranges) {
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];

    if (range === "under-2000" && price < 2000) return true;
    else if (range === "2000-5000" && price >= 2000 && price <= 5000) return true;
    else if (range === "5000-10000" && price > 5000 && price <= 10000) return true;
    else if (range === "over-10000" && price > 10000) return true;
  }
  return false;
}

function ageMatches(productAgeList, selectedAges) {
  for (let i = 0; i < selectedAges.length; i++) {
    if (productAgeList.indexOf(selectedAges[i]) !== -1) {
      return true;
    }
  }
  return false;
}

/* ---------- main filter ---------- */
function applyFilters() {
  const prices = getChecked("price");
  const ages = getChecked("age");
  const types = getChecked("type");
  let visible = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    // an empty group of ticks means "don't filter on this"
    const okPrice = prices.length === 0 || priceMatches(p.price, prices);
    const okAge = ages.length === 0 || ageMatches(p.ages, ages);
    const okType = types.length === 0 || types.indexOf(p.type) !== -1;

    const okSearch = typeof cardMatchesSearch === "function" ? cardMatchesSearch(p.card) : true;

    const show = okPrice && okAge && okType && okSearch;
    p.card.style.display = show ? "" : "none";

    if (show) visible++;
  }

  if (countText) {
    countText.textContent = visible + (visible === 1 ? " product available" : " products available");
  }

  emptyMsg.style.display = visible === 0 ? "block" : "none";
}

/* ---------- clear all filters ---------- */
function clearFilters() {
  const boxes = filterBox.querySelectorAll('input[type="checkbox"]');

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }

  applyFilters();
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function () {
  filterBox = document.querySelector(".Filter-box");
  cards = document.querySelectorAll(".product-list .product-card");
  countText = document.querySelector(".products-toolbar strong");
  clearBtn = document.querySelector(".filter-clear");
  productList = document.querySelector(".product-list");

  // stop if the page doesn't have the filter or any products
  if (!filterBox || cards.length === 0) return;

  readProducts();

  // "No products" message, created with the DOM and placed after the list
  emptyMsg = document.createElement("p");
  emptyMsg.textContent = "No products match your search or filters.";
  emptyMsg.style.display = "none";
  emptyMsg.style.textAlign = "center";
  emptyMsg.style.padding = "30px";
  productList.parentNode.insertBefore(emptyMsg, productList.nextSibling);

  // events
  filterBox.addEventListener("change", applyFilters);

  if (clearBtn) {
    clearBtn.addEventListener("click", clearFilters);
  }

  applyFilters();
});