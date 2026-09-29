let slides;
let order = ['center', 'right', 'hidden', 'left'];

document.addEventListener('DOMContentLoaded', setupCarousel);

function setupCarousel() {
  slides = document.querySelectorAll('.thumb-list li');
  for (let i = 0; i < slides.length; i++) {
    slides[i].setAttribute('data-pos', order[i]);
  }
  setInterval(rotateCarousel, 3000);
}

function nextPos(pos) {
  if (pos === 'center') return 'left';
  if (pos === 'left') return 'hidden';
  if (pos === 'hidden') return 'right';
  if (pos === 'right') return 'center';
}

function rotateCarousel() {
  let current = [];
  for (let i = 0; i < slides.length; i++) {
    current.push(slides[i].getAttribute('data-pos'));
  }
  for (let i = 0; i < slides.length; i++) {
    slides[i].setAttribute('data-pos', nextPos(current[i]));
  }
}