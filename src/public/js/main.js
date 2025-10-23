// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });
  }

  // Smooth scroll para links de navegación
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar links vacíos o solo con #
      if (href === '#' || href === '') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Cerrar menú móvil si está abierto
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          if (menuToggle) menuToggle.classList.remove('active');
        }
      }
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Cerrar todas las preguntas
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
      });
      
      // Abrir la clickeada si no estaba activa
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

  // Observar elementos con animación
  const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .price-card, .testimonial-card');
  animatedElements.forEach(el => observer.observe(el));

  // Contador animado para estadísticas (si existen)
  const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };
    
    updateCounter();
  };

  // Activar contadores cuando sean visibles
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateCounter(entry.target, target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  console.log('✅ SAT - Sistema inicializado correctamente');
});

// Función auxiliar para detectar dispositivo móvil
function isMobile() {
  return window.innerWidth <= 768;
}

// Prevenir comportamiento por defecto en enlaces vacíos
document.addEventListener('click', (e) => {
  if (e.target.matches('a[href="#"]')) {
    e.preventDefault();
  }
});