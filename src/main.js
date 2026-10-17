/**
 * BSF THE GYM — Core Interactive Experience & Motion Controller
 * High-performance 3D interaction, smooth physics tilt, and robust conversion flows
 */
import { initHero3D } from './hero-3d.js';

// Central Business Configuration — Editable by Gym Owner
export const CONFIG = {
  businessName: 'BSF THE GYM',
  phoneDisplay: '+91 63551 48429',
  phoneWhatsApp: '916355148429',
  address: '619–626, Red Coral Hamptons, Gotri–Sevasi Road, opposite Pizza Bell, near Osia Mall, New Alkapuri, Laxmipura, Vadodara, Gujarat 390021, India',
  city: 'Vadodara',
  hours: {
    closingTime: '10:30 PM',
    weekdaySchedule: '6:00 AM – 10:30 PM',
    sundaySchedule: '7:00 AM – 1:00 PM'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js 3D Emblem in Hero
  try {
    initHero3D();
  } catch (err) {
    console.warn('3D initialization fallback to CSS composition:', err);
  }

  // 2. Initialize Core Interactions
  init3DCardTilt();
  initStickyHeader();
  initActiveNavSpy();
  initMobileDrawer();
  initScrollReveal();
  initPricingEnquiryHooks();
  initGalleryLightbox();
  initEnquiryForm();
  initFooterYear();
});

/**
 * 1. 3D Perspective Card Tilt with Dynamic Specular Glare
 * Adds subtle physical depth to cards when hovered on desktop devices
 */
function init3DCardTilt() {
  // Disable tilt on touch devices or reduced motion
  if (window.matchMedia('(pointer: coarse)').matches || 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tiltCards = document.querySelectorAll('.card-tilt');

  tiltCards.forEach(card => {
    const glare = card.querySelector('.card-specular-glare');

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Restrained tilt angles (max ~6 degrees)
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.15) 0%, transparent 65%)`;
        glare.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      if (glare) {
        glare.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
  });
}

/**
 * 2. Sticky Floating Header with dark glass blur on scroll
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Active Navigation Spy via IntersectionObserver
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 4. Mobile Drawer Navigation
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-action-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 5. Scroll-triggered reveal animations
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (!revealElements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * 6. Membership Enquire Buttons Hook
 * Pre-selects the plan and smoothly scrolls to the enquiry form
 */
function initPricingEnquiryHooks() {
  const enquireButtons = document.querySelectorAll('.tier-enquire-btn');
  const planSelect = document.getElementById('planInterest');
  const contactSection = document.getElementById('contact');
  const nameInput = document.getElementById('fullName');

  enquireButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      if (planSelect && planName) {
        for (let i = 0; i < planSelect.options.length; i++) {
          if (planSelect.options[i].value === planName) {
            planSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (nameInput) nameInput.focus();
        }, 550);
      }
    });
  });
}

/**
 * 7. Facility Gallery Lightbox Modal
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const dialog = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxActiveImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  if (!dialog || !galleryItems.length) return;

  const images = Array.from(galleryItems).map(item => ({
    src: item.getAttribute('data-src') || '',
    caption: item.getAttribute('data-caption') || ''
  }));

  let currentIndex = 0;

  function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    currentIndex = index;

    const item = images[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      showImage(idx);
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.body.style.overflow = 'hidden';
    });
  });

  const closeDialog = () => {
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDialog);
  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeDialog();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'Escape') closeDialog();
  });
}

/**
 * 8. Interactive Validated Enquiry Form
 */
function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  const nameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const planSelect = document.getElementById('planInterest');
  const messageInput = document.getElementById('message');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const successView = document.getElementById('enquirySuccessView');
  const successCustomerName = document.getElementById('successCustomerName');
  const successTierName = document.getElementById('successTierName');
  const sendViaWhatsappBtn = document.getElementById('sendViaWhatsappBtn');
  const resetBtn = document.getElementById('resetEnquiryBtn');

  if (!form) return;

  function validateContact(input) {
    const val = input.trim();
    // Allow either phone (at least 10 digits) or email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const cleanedDigits = val.replace(/\D/g, '');
    const isPhone = cleanedDigits.length >= 10;
    return isEmail || isPhone;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const planVal = planSelect.value;
    const messageVal = messageInput ? messageInput.value.trim() : '';

    // Validate Name
    if (!nameVal || nameVal.length < 2) {
      nameInput.classList.add('is-invalid');
      nameError.classList.add('visible');
      isValid = false;
    } else {
      nameInput.classList.remove('is-invalid');
      nameError.classList.remove('visible');
    }

    // Validate Phone or Email
    if (!validateContact(phoneVal)) {
      phoneInput.classList.add('is-invalid');
      phoneError.classList.add('visible');
      isValid = false;
    } else {
      phoneInput.classList.remove('is-invalid');
      phoneError.classList.remove('visible');
    }

    if (!isValid) return;

    // Show simulated success state with authentic WhatsApp handoff
    form.style.display = 'none';
    successView.style.display = 'flex';

    if (successCustomerName) successCustomerName.textContent = nameVal;
    if (successTierName) successTierName.textContent = planVal;

    // Build pre-filled WhatsApp message
    let waMsg = `Hi BSF THE GYM! My name is ${nameVal} (Contact: ${phoneVal}). I would like to enquire about the ${planVal}.`;
    if (messageVal) {
      waMsg += ` Training Goals: ${messageVal}`;
    }

    const waUrl = `https://wa.me/${CONFIG.phoneWhatsApp}?text=${encodeURIComponent(waMsg)}`;
    if (sendViaWhatsappBtn) {
      sendViaWhatsappBtn.href = waUrl;
    }
  });

  // Real-time clearance of errors
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      nameInput.classList.remove('is-invalid');
      nameError.classList.remove('visible');
    }
  });

  phoneInput.addEventListener('input', () => {
    if (validateContact(phoneInput.value)) {
      phoneInput.classList.remove('is-invalid');
      phoneError.classList.remove('visible');
    }
  });

  // Reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'flex';
      successView.style.display = 'none';
      nameInput.focus();
    });
  }
}

/**
 * 9. Auto Current Year in Footer
 */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
