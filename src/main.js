document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide Icons
  lucide.createIcons();

  // Mobile Menu Toggle
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.header__link');

  burgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      // Toggle icon between menu and x
      const icon = navMenu.classList.contains('active') ? 'x' : 'menu';
      // Re-render icon specifically for burger button (simplified for now)
      burgerBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
      lucide.createIcons();
  });

  // Close menu when clicking a link
  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          burgerBtn.innerHTML = `<i data-lucide="menu"></i>`;
          lucide.createIcons();
      });
  });

  // Header Blur Effect on Scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.background = 'rgba(11, 14, 20, 0.95)';
          header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      } else {
          header.style.background = 'rgba(11, 14, 20, 0.85)';
          header.style.boxShadow = 'none';
      }
  });
});