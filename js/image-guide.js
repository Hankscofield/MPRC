/**
 * MPRC Image Upload Guide - JavaScript
 * Handles animations and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // ============================================
  // Intersection Observer for Scroll Animations
  // ============================================
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-visible');
        // Optionally unobserve after animation
        // animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe step items
  document.querySelectorAll('.step-item').forEach(item => {
    item.style.opacity = '0';
    animateOnScroll.observe(item);
  });

  // Observe alternative cards
  document.querySelectorAll('.alternative-card').forEach(card => {
    animateOnScroll.observe(card);
  });

  // ============================================
  // Add visible class styles dynamically
  // ============================================
  
  const style = document.createElement('style');
  style.textContent = `
    .step-item.animate-visible {
      opacity: 1 !important;
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // Image Lightbox (optional enhancement)
  // ============================================
  
  const stepImages = document.querySelectorAll('.step-image img');
  
  stepImages.forEach(img => {
    img.style.cursor = 'pointer';
    
    img.addEventListener('click', function() {
      // Create lightbox overlay
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(6, 35, 29, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
      `;
      
      // Create enlarged image
      const enlargedImg = document.createElement('img');
      enlargedImg.src = this.src;
      enlargedImg.alt = this.alt;
      enlargedImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;
      
      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 253, 238, 0.1);
        border: none;
        color: #FFFDEE;
        font-size: 32px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
      `;
      
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 253, 238, 0.2)';
      });
      
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 253, 238, 0.1)';
      });
      
      overlay.appendChild(enlargedImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Animate in
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        enlargedImg.style.transform = 'scale(1)';
      });
      
      // Close function
      const closeLightbox = () => {
        overlay.style.opacity = '0';
        enlargedImg.style.transform = 'scale(0.9)';
        setTimeout(() => {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        }, 300);
      };
      
      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', closeLightbox);
      
      // Close on escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    });
  });

  // ============================================
  // Copy Link Helper (for demo purposes)
  // ============================================
  
  // If there are any copy buttons in the future, this handles them
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', function() {
      const textToCopy = this.getAttribute('data-copy');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 2000);
      });
    });
  });

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

  console.log('MPRC Image Guide loaded successfully');
});