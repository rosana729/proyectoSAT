// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  
  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#' || href === '#login') return;
      
      const target = document.querySelector(href);
      if (target) {
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('active');
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
  document.addEventListener('DOMContentLoaded', () => {
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

  // Stats animation
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
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

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

  // Prevenir que los enlaces # hagan scroll
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });

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
// =============================
// FAQ Toggle Animation
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const answer = faqItem.querySelector('.faq-answer');

      // Cierra cualquier otra pregunta abierta
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      // Alterna la actual
      faqItem.classList.toggle('active');

      if (faqItem.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
});

// =============================
// Scroll suave para los enlaces
// =============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// FAQ Toggle
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const wasActive = item.classList.contains('active');
            
            // Cerrar todos
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Abrir el clickeado si no estaba activo
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
});

// FAQ functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('FAQ items found:', faqItems.length); // Debug line
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            console.log('FAQ clicked'); // Debug line
            const currentlyActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!currentlyActive) {
                item.classList.add('active');
            }
        });
    });
});

// FAQ Toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            
            // Cerrar todos los FAQs
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Abrir el actual si no estaba activo
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
});
