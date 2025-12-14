// About page functionality

// Parks revitalized count - you can update this value or fetch from JSON
const PARKS_REVITALIZED = 12; // Replace with actual value or fetch from your data

// Animate counter
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = Math.floor(target);
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// Initialize counters when they come into view
function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .timeline-stat-number');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = PARKS_REVITALIZED;
        animateCounter(entry.target, target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Back to top button
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');

  if (!backToTopButton) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Add fade-in animation to timeline items
function initTimelineAnimation() {
  const timelineItems = document.querySelectorAll('.timeline-item');

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(30px)';

        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
}

// Add parallax effect to hero section
function initParallax() {
  const hero = document.querySelector('.page-hero');

  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (scrolled < hero.offsetHeight) {
      hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      hero.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Add hover effect to team cards
function initTeamCards() {
  const teamCards = document.querySelectorAll('.team-card');

  teamCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Initialize all functions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initBackToTop();
  initTimelineAnimation();
  initParallax();
  initSmoothScroll();
  initTeamCards();

  // Add loaded class for any additional animations
  document.body.classList.add('loaded');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Re-initialize animations if needed
    initCounters();
  }
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    animateCounter,
    PARKS_REVITALIZED
  };
}
