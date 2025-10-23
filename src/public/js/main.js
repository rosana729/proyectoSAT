// Archivo JS principal - puedes mover aquí los scripts desde tu index.html
// JavaScript extraído desde index.html

// Scroll suave para anclas internas
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#' || href === '#login') return;
      const target = document.querySelector(href);
      if (target) {
        // Cerrar menú móvil si está abierto
        const navLinksEl = document.getElementById('navLinks');
        if (navLinksEl) navLinksEl.classList.remove('active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  // FAQ Toggle
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      // Cerrar todos
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      // Abrir el clickeado si no estaba activo
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Animación de entrada para elementos
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card, .benefit-item, .testimonial-card, .pricing-card, .faq-item').forEach(el => {
    observer.observe(el);
  });

  // Smooth stats animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('.stat-item h3');
        stats.forEach((stat, index) => {
          const finalValue = stat.textContent;
          stat.textContent = '0';
          setTimeout(() => {
            const isNumber = !isNaN(parseInt(finalValue));
            if (isNumber) {
              animateNumber(stat, parseInt(finalValue));
            } else {
              stat.textContent = finalValue;
            }
          }, index * 100);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);

  function animateNumber(element, target) {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
      }
    }, duration / steps);
  }
  // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            
            // Cerrar todos
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            
            // Abrir el clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Animación de entrada para cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .benefit-item, .testimonial-card').forEach(el => {
        observer.observe(el);
    });

  // Prevenir que los enlaces # hagan scroll
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => { e.preventDefault(); });
  });
});
// Ejemplo: toggle menú móvil
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
  }
});
   // Scroll suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // FAQ Toggle
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');
                
                // Cerrar todos
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                
                // Abrir el clickeado si no estaba activo
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });

        // Animación de entrada para cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .benefit-item, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
