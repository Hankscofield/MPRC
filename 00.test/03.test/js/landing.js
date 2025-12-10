document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
      } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileMenuBtn.querySelector('i').classList.remove('bi-x');
          mobileMenuBtn.querySelector('i').classList.add('bi-list');
        }
      }
    });
  });

  createParticles();
});

function createParticles() {
  const ambientLayer = document.getElementById('ambientLayer');
  if (!ambientLayer) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    particle.style.setProperty('--x', Math.random() * 100 + '%');
    particle.style.setProperty('--delay', Math.random() * 10 + 's');
    particle.style.setProperty('--duration', 15 + Math.random() * 10 + 's');
    ambientLayer.appendChild(particle);
  }
}
