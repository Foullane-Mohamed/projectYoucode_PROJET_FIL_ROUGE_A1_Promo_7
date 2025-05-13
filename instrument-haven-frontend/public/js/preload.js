document.addEventListener('DOMContentLoaded', function() {
  const categoryCards = document.querySelectorAll('.category-card');
  if (categoryCards) {
    categoryCards.forEach(card => {
      card.style.opacity = '0.99';
      setTimeout(() => {
        card.style.opacity = '1';
      }, 10);
    });
  }
});