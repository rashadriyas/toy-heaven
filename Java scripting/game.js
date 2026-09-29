const SYMBOLS = ['🍕', '🎧', '🚀', '🎮', '🌵', '🦊'];
const MAX_MOVES = 14;
const DISCOUNT_CODE = 'WIN20'; // change this to your real code

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const msg = document.getElementById('msg');
const prize = document.getElementById('prize');

let first = null;
let lock = false;
let movesLeft;
let matched;

// Randomly shuffle an array
const shuffle = arr =>
  arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);

function startGame() {
  movesLeft = MAX_MOVES;
  matched = 0;
  first = null;
  lock = false;
  msg.textContent = '';
  prize.style.display = 'none';
  updateStats();

  board.innerHTML = '';
  shuffle([...SYMBOLS, ...SYMBOLS]).forEach(symbol => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.dataset.symbol = symbol;
    btn.textContent = symbol;
    btn.addEventListener('click', () => flip(btn));
    board.appendChild(btn);
  });
}

function updateStats() {
  movesEl.textContent = 'Moves left: ' + movesLeft;
  pairsEl.textContent = 'Pairs: ' + matched + ' / ' + SYMBOLS.length;
}

function flip(card) {
  if (lock || card === first || card.classList.contains('done')) return;

  card.classList.add('open');
  if (!first) {
    first = card;
    return;
  }

  movesLeft--;
  lock = true;

  if (first.dataset.symbol === card.dataset.symbol) {
    // Match found
    first.classList.replace('open', 'done');
    card.classList.replace('open', 'done');
    matched++;
    first = null;
    lock = false;
    updateStats();
    checkEnd();
  } else {
    // No match: flip both back after a short delay
    setTimeout(() => {
      first.classList.remove('open');
      card.classList.remove('open');
      first = null;
      lock = false;
      updateStats();
      checkEnd();
    }, 700);
  }
  updateStats();
}

function checkEnd() {
  if (matched === SYMBOLS.length) {
    msg.textContent = 'You won with ' + movesLeft + ' moves to spare!';
    prize.style.display = 'block';
    document.getElementById('code').textContent = DISCOUNT_CODE;
    lock = true;
  } else if (movesLeft <= 0) {
    msg.textContent = 'Out of moves. Press New game to try again.';
    lock = true;
  }
}

document.getElementById('restart').addEventListener('click', startGame);

document.getElementById('copy').addEventListener('click', e => {
  navigator.clipboard.writeText(DISCOUNT_CODE)
    .then(() => { e.target.textContent = 'Copied!'; })
    .catch(() => { e.target.textContent = 'Select the code to copy'; });
});

startGame();