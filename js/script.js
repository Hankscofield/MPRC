let mouseX = 0;
let mouseY = 0;
let scrollY = 0;
let plantGrowth = 0;
let cursorSpeed = 0;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initPlantAnimation();
  initStatCounters();
  initLeafAnimation();
  initScrollAnimations();
  initMouseTracking();
  initButtonEffects();
  initParallax();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

function initMouseTracking() {
  document.addEventListener('mousemove', (e) => {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    cursorSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    mouseX = e.clientX;
    mouseY = e.clientY;

    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    updatePlantInteraction();
    updateGradientOrbs();
    updateRipples();
  });

  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    updateScrollIndicator();
  });
}

function initPlantAnimation() {
  const plantContainer = document.getElementById('plantContainer');
  const plantSvg = document.getElementById('plantSvg');

  if (!plantContainer || !plantSvg) return;

  let animationFrame;
  let targetRotation = 0;
  let currentRotation = 0;

  function animatePlant() {
    const rect = plantContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < 400) {
      const angle = Math.atan2(deltaX, deltaY);
      targetRotation = angle * (180 / Math.PI) * 0.1;

      const growthFactor = Math.max(0, (400 - distance) / 400);
      plantGrowth = growthFactor;
    } else {
      targetRotation = 0;
      plantGrowth = Math.max(0, plantGrowth - 0.01);
    }

    currentRotation += (targetRotation - currentRotation) * 0.1;

    const scale = 1 + plantGrowth * 0.1;
    plantSvg.style.transform = `rotate(${currentRotation}deg) scale(${scale})`;

    const leaves = plantSvg.querySelectorAll('.leaf');
    leaves.forEach((leaf, index) => {
      const leafRotation = Math.sin(Date.now() * 0.001 + index) * 5;
      const leafScale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.05;
      leaf.style.transform = `rotate(${leafRotation}deg) scale(${leafScale})`;
    });

    animationFrame = requestAnimationFrame(animatePlant);
  }

  animatePlant();
}

function updatePlantInteraction() {
  const plantContainer = document.getElementById('plantContainer');
  if (!plantContainer) return;

  const rect = plantContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < 300 && cursorSpeed > 5) {
    createLeaf(mouseX, mouseY);
  }
}

function initLeafAnimation() {
  const leafContainer = document.getElementById('leafContainer');
  if (!leafContainer) return;

  setInterval(() => {
    if (Math.random() > 0.7) {
      const x = Math.random() * window.innerWidth;
      createLeaf(x, -20);
    }
  }, 2000);
}

const MAX_LEAVES = 30;

function createLeaf(x, y) {
  if (leafContainer.childElementCount >= MAX_LEAVES) return;

  const leafContainer = document.getElementById('leafContainer');
  if (!leafContainer) return;

  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  leaf.style.left = x + 'px';
  leaf.style.top = y + 'px';
  leaf.style.animationDuration = (10 + Math.random() * 5) + 's';
  leaf.style.animationDelay = '0s';

  leafContainer.appendChild(leaf);

  setTimeout(() => {
    leaf.remove();
  }, 15000);
}
function updateGradientOrbs() {
  const orbs = document.querySelectorAll('.gradient-orb');
  orbs.forEach((orb, index) => {
    const speed = 0.00005 * (index + 1);
    const offsetX = (mouseX - window.innerWidth / 2) * speed;
    const offsetY = (mouseY - window.innerHeight / 2) * speed;

    orb.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
}

function updateRipples() {
  const rippleContainer = document.getElementById('rippleContainer');
  if (!rippleContainer) return;

  const rect = rippleContainer.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance < 200) {
    const ripples = rippleContainer.querySelectorAll('.ripple');
    ripples.forEach(ripple => {
      ripple.style.animationDuration = '2s';
    });
  }
}

function initStatCounters() {
  const statsCard = document.getElementById('statsCard');
  if (!statsCard) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statsCard);
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target.toLocaleString();
      }
    };

    updateCounter();
  });
}

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.feature-item, .step-card, .mission-visual, .mission-text');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(el);
  });
}

function updateScrollIndicator() {
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (!scrollIndicator) return;

  if (scrollY > 200) {
    scrollIndicator.style.opacity = '0';
  } else {
    scrollIndicator.style.opacity = '1';
  }
}

function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      createRippleEffect(e, this);
    });

    button.addEventListener('click', function(e) {
      createClickRipple(e, this);
    });
  });

  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      document.getElementById('mission').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  const learnBtn = document.getElementById('learnBtn');
  if (learnBtn) {
    learnBtn.addEventListener('click', () => {
      window.location.href = '/guide.html';
    });
  }

  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      alert('Sign up functionality coming soon!');
    });
  }
}

function createRippleEffect(e, button) {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  button.style.setProperty('--ripple-x', x + 'px');
  button.style.setProperty('--ripple-y', y + 'px');
}

function createClickRipple(e, button) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();

  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255, 255, 255, 0.6)';
  ripple.style.width = '20px';
  ripple.style.height = '20px';
  ripple.style.left = (e.clientX - rect.left - 10) + 'px';
  ripple.style.top = (e.clientY - rect.top - 10) + 'px';
  ripple.style.pointerEvents = 'none';
  ripple.style.animation = 'rippleExpand 0.6s ease-out';

  button.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes rippleExpand {
    to {
      transform: scale(10);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
      const speed = 0.05 * (index + 1);
      const yPos = -(scrolled * speed);
      item.style.transform = `translateY(${yPos}px)`;
    });

    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distance = cardCenter - windowCenter;

      if (Math.abs(distance) < 400) {
        const offset = distance * 0.05;
        card.style.transform = `translateY(${offset}px)`;
      }
    });
  });
}

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

window.addEventListener('resize', () => {
  mouseX = window.innerWidth / 2;
  mouseY = window.innerHeight / 2;
});
