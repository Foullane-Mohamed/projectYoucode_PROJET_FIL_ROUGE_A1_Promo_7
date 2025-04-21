document.addEventListener('DOMContentLoaded', function() {
  // Force recalculation of styles to ensure proper rendering
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