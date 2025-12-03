document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ИНИЦИАЛИЗАЦИЯ И ПРОВЕРКИ
  // ==========================================

  // Инициализация иконок
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  } else {
      console.warn('Lucide icons library not loaded');
  }

  // Регистрация GSAP ScrollTrigger
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (hasGSAP) {
      gsap.registerPlugin(ScrollTrigger);
  } else {
      console.warn('GSAP or ScrollTrigger not loaded');
  }

  // ==========================================
  // 2. ХЕДЕР И МОБИЛЬНОЕ МЕНЮ
  // ==========================================

  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.header__link');
  const header = document.querySelector('.header');

  if (burgerBtn && navMenu) {
      burgerBtn.addEventListener('click', () => {
          navMenu.classList.toggle('active');
          const isOpened = navMenu.classList.contains('active');
          burgerBtn.innerHTML = `<i data-lucide="${isOpened ? 'x' : 'menu'}"></i>`;
          if (typeof lucide !== 'undefined') lucide.createIcons();
      });

      navLinks.forEach(link => {
          link.addEventListener('click', () => {
              navMenu.classList.remove('active');
              burgerBtn.innerHTML = `<i data-lucide="menu"></i>`;
              if (typeof lucide !== 'undefined') lucide.createIcons();
          });
      });
  }

  if (header) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 20) {
              header.style.background = 'rgba(11, 14, 20, 0.95)';
              header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
          } else {
              header.style.background = 'rgba(11, 14, 20, 0.85)';
              header.style.boxShadow = 'none';
          }
      });
  }

  // ==========================================
  // 3. АНИМАЦИЯ ТЕКСТА HERO (SplitType)
  // ==========================================

  if (hasGSAP && typeof SplitType !== 'undefined' && document.querySelector('.hero__title')) {
      try {
          // Используем try-catch, чтобы ошибка шрифтов не ломала весь скрипт
          const heroTitle = new SplitType('.hero__title', { types: 'lines, words' });
          const heroSubtitle = new SplitType('.hero__subtitle', { types: 'lines, words' });

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.from(heroTitle.words, {
              y: 50,
              opacity: 0,
              rotationX: -20,
              stagger: 0.05,
              duration: 1,
              delay: 0.2
          })
          .from(heroSubtitle.words, {
              y: 30,
              opacity: 0,
              stagger: 0.02,
              duration: 0.8
          }, '-=0.6')
          .from('.animate-fade-up', {
              y: 30,
              opacity: 0,
              stagger: 0.2,
              duration: 0.8,
              clearProps: 'all' // Очищаем стили после анимации
          }, '-=0.4');
      } catch (e) {
          console.error('SplitType error:', e);
          // Фолбэк: если ошибка, просто показываем текст
          gsap.to('.hero__title, .hero__subtitle', { opacity: 1, y: 0, duration: 0.5 });
      }
  }

  // ==========================================
  // 4. ФОН HERO (CANVAS)
  // ==========================================

  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];
      let mouse = { x: null, y: null, radius: 150 };

      const styles = getComputedStyle(document.documentElement);
      const primaryColor = styles.getPropertyValue('--color-primary').trim() || '#3B82F6';
      const accentColor = styles.getPropertyValue('--color-accent').trim() || '#10B981';

      function hexToRgba(hex, alpha) {
          hex = hex.replace('#', '').trim();
          let r = 0, g = 0, b = 0;
          if (hex.length === 3) {
              r = parseInt(hex[0] + hex[0], 16);
              g = parseInt(hex[1] + hex[1], 16);
              b = parseInt(hex[2] + hex[2], 16);
          } else if (hex.length === 6) {
              r = parseInt(hex.substring(0, 2), 16);
              g = parseInt(hex.substring(2, 4), 16);
              b = parseInt(hex.substring(4, 6), 16);
          }
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      function initCanvas() {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
          particles = [];

          const densityDivider = window.innerWidth < 768 ? 15000 : 9000;
          const numberOfParticles = (width * height) / densityDivider;

          for (let i = 0; i < numberOfParticles; i++) {
              let size = (Math.random() * 2) + 1;
              let x = Math.random() * width;
              let y = Math.random() * height;
              let directionX = (Math.random() * 0.4) - 0.2;
              let directionY = (Math.random() * 0.4) - 0.2;
              let color = Math.random() > 0.5 ? primaryColor : accentColor;

              particles.push({ x, y, directionX, directionY, size, color });
          }
      }

      function animateCanvas() {
          requestAnimationFrame(animateCanvas);
          ctx.clearRect(0, 0, width, height);

          particles.forEach(particle => {
              particle.x += particle.directionX;
              particle.y += particle.directionY;

              if (particle.x > width || particle.x < 0) particle.directionX = -particle.directionX;
              if (particle.y > height || particle.y < 0) particle.directionY = -particle.directionY;

              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fillStyle = hexToRgba(particle.color, 0.8);
              ctx.fill();

              particles.forEach(otherParticle => {
                  let dx = particle.x - otherParticle.x;
                  let dy = particle.y - otherParticle.y;
                  let distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < 120) {
                      ctx.beginPath();
                      ctx.strokeStyle = hexToRgba(particle.color, 1 - (distance / 120));
                      ctx.lineWidth = 0.5;
                      ctx.moveTo(particle.x, particle.y);
                      ctx.lineTo(otherParticle.x, otherParticle.y);
                      ctx.stroke();
                  }
              });

              if (mouse.x) {
                  let dx = mouse.x - particle.x;
                  let dy = mouse.y - particle.y;
                  let distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance < mouse.radius) {
                      const forceDirectionX = dx / distance;
                      const forceDirectionY = dy / distance;
                      const force = (mouse.radius - distance) / mouse.radius;
                      const directionX = forceDirectionX * force * 3;
                      const directionY = forceDirectionY * force * 3;

                      if (particle.x < width - 10 && particle.x > 10) particle.x -= directionX;
                      if (particle.y < height - 10 && particle.y > 10) particle.y -= directionY;
                  }
              }
          });
      }

      window.addEventListener('resize', initCanvas);
      window.addEventListener('mousemove', (e) => {
          mouse.x = e.clientX;
          // Коррекция на скролл, если canvas relative, иначе просто clientY
          mouse.y = e.clientY + (getComputedStyle(canvas).position === 'fixed' ? 0 : window.scrollY);
      });
      window.addEventListener('mouseout', () => {
          mouse.x = null;
          mouse.y = null;
      });

      initCanvas();
      animateCanvas();
  }

  // ==========================================
  // 5. ИСПРАВЛЕННАЯ ЛОГИКА АНИМАЦИИ СЕТОК
  // ==========================================

  if (hasGSAP) {
      // --- 1. BENEFITS (Преимущества) ---
      // Ищем контейнер
      const benefitsGrid = document.querySelector('.benefits__grid');
      const benefitCards = document.querySelectorAll('.benefit-card');

      if (benefitsGrid && benefitCards.length > 0) {
          gsap.from(benefitCards, {
              scrollTrigger: {
                  trigger: benefitsGrid, // Триггер - весь контейнер
                  start: 'top 85%',      // Начинаем, когда верх контейнера на 85% высоты экрана
              },
              y: 50,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2, // Задержка между карточками
              clearProps: 'all' // Очищаем, чтобы CSS hover работал
          });
      }

      // --- 2. ABOUT (О платформе) ---
      // Анимация картинки
      const aboutImg = document.querySelector('.about__image-wrapper');
      if (aboutImg) {
          gsap.from(aboutImg, {
              scrollTrigger: { trigger: '#about', start: 'top 70%' },
              x: 50, opacity: 0, duration: 1
          });
      }

      // Анимация списка
      const aboutList = document.querySelectorAll('.about__item');
      if (aboutList.length > 0) {
          gsap.from(aboutList, {
              scrollTrigger: { trigger: '.about__list', start: 'top 90%' },
              x: -30, opacity: 0, duration: 0.6, stagger: 0.1
          });
      }

      // --- 3. EDUCATION (Обучение) ---
      const educationGrid = document.querySelector('.education__grid');
      const courseCards = document.querySelectorAll('.course-card');

      if (educationGrid && courseCards.length > 0) {
          gsap.from(courseCards, {
              scrollTrigger: {
                  trigger: educationGrid,
                  start: 'top 85%',
              },
              y: 60,
              opacity: 0,
              duration: 0.8,
              stagger: 0.2,
              clearProps: 'all'
          });
      }

      // Обновляем ScrollTrigger после загрузки всех ресурсов
      window.addEventListener('load', () => ScrollTrigger.refresh());
  }

  // ==========================================
  // 6. FAQ
  // ==========================================

  const faqQuestions = document.querySelectorAll('.faq__question');
  faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
          const item = question.parentElement;
          const answer = item.querySelector('.faq__answer');
          const isActive = item.classList.contains('active');

          // Закрываем все открытые
          document.querySelectorAll('.faq__item.active').forEach(activeItem => {
              // Если кликнули не на тот же самый элемент - закрываем
              if (activeItem !== item) {
                  activeItem.classList.remove('active');
                  activeItem.querySelector('.faq__answer').style.maxHeight = null;
              }
          });

          // Открываем/Закрываем текущий
          if (!isActive) {
              item.classList.add('active');
              answer.style.maxHeight = answer.scrollHeight + "px";
          } else {
              item.classList.remove('active');
              answer.style.maxHeight = null;
          }
      });
  });

  // ==========================================
  // 7. КОНТАКТНАЯ ФОРМА
  // ==========================================

  const contactForm = document.getElementById('lead-form');

  if (contactForm) {
      const phoneInput = document.getElementById('phone');
      const statusDiv = document.getElementById('form-status');
      const captchaLabel = document.getElementById('captcha-label');
      const captchaInput = document.getElementById('captcha-input');

      let num1 = Math.floor(Math.random() * 10);
      let num2 = Math.floor(Math.random() * 10);

      if (captchaLabel) {
          captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
      }

      if (phoneInput) {
          phoneInput.addEventListener('input', (e) => {
              const val = e.target.value;
              if (!/^\d*$/.test(val)) {
                  phoneInput.parentElement.classList.add('error');
                  e.target.value = val.replace(/\D/g, '');
              } else {
                  phoneInput.parentElement.classList.remove('error');
              }
          });
      }

      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          if (parseInt(captchaInput.value) !== num1 + num2) {
              statusDiv.textContent = 'Ошибка в капче.';
              statusDiv.style.color = '#ef4444';
              num1 = Math.floor(Math.random() * 10);
              num2 = Math.floor(Math.random() * 10);
              captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
              captchaInput.value = '';
              return;
          }

          const btn = contactForm.querySelector('button[type="submit"]');
          const originalText = btn.textContent;

          btn.textContent = 'Отправка...';
          btn.disabled = true;

          setTimeout(() => {
              btn.textContent = 'Успешно!';
              btn.style.background = 'var(--color-accent)';
              statusDiv.textContent = 'Заявка отправлена. Ожидайте звонка.';
              statusDiv.className = 'form-status success';

              contactForm.reset();

              setTimeout(() => {
                  btn.textContent = originalText;
                  btn.disabled = false;
                  btn.style.background = '';
                  statusDiv.textContent = '';
                  num1 = Math.floor(Math.random() * 10);
                  num2 = Math.floor(Math.random() * 10);
                  captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
              }, 4000);
          }, 1500);
      });
  }

  // ==========================================
  // 8. COOKIE POPUP
  // ==========================================

  const cookiePopup = document.getElementById('cookie-popup');
  const acceptCookieBtn = document.getElementById('accept-cookies');

  if (cookiePopup && acceptCookieBtn) {
      if (!localStorage.getItem('cookiesAccepted')) {
          setTimeout(() => {
              cookiePopup.classList.add('show');
          }, 2000);
      }

      acceptCookieBtn.addEventListener('click', () => {
          localStorage.setItem('cookiesAccepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }
});