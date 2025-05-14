document.addEventListener('DOMContentLoaded', () => {
  // Utility: Debounce function to limit rapid event firing
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Mobile Navigation Toggle
  const hamburger = document.querySelector('#hamburger');
  const mobileNav = document.querySelector('#mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileNav.classList.toggle('hidden', !isOpen);
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileNav.classList.add('hidden');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Brand Link Clicks
  document.querySelectorAll('[data-brand-link]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      window.open(link.getAttribute('href'), '_blank');
    });
  });

  // Prevent Double Tap Zoom (Exclude Links)
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    e => {
      const now = Date.now();
      const isLink = e.target.closest('[data-brand-link]');
      if (now - lastTouchEnd <= 300 && !isLink) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // Loading Spinner: Hide after page load
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    window.addEventListener('load', () => {
      spinner.style.opacity = '0';
      setTimeout(() => (spinner.style.display = 'none'), 300);
    });
  }

  // Gallery Carousel
  const galleryCarousel = document.querySelector('#storeSlideshow');
  const gallerySlides = galleryCarousel?.querySelectorAll('.gallery-slide') || [];
  const prevBtn = galleryCarousel?.querySelector('.carousel-prev');
  const nextBtn = galleryCarousel?.querySelector('.carousel-next');
  let currentGallery = 0;
  let galleryInterval;

  const showGallery = index => {
    if (index < 0 || index >= gallerySlides.length) return;
    gallerySlides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    currentGallery = index;
  };

  const startGallery = () => {
    galleryInterval = setInterval(() => showGallery((currentGallery + 1) % gallerySlides.length), 7000);
  };

  const stopGallery = () => clearInterval(galleryInterval);

  if (gallerySlides.length) {
    showGallery(0);
    startGallery();
    window.addEventListener('resize', () => showGallery(currentGallery));

    prevBtn?.addEventListener('click', () => {
      stopGallery();
      showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length);
      startGallery();
    });

    nextBtn?.addEventListener('click', () => {
      stopGallery();
      showGallery((currentGallery + 1) % gallerySlides.length);
      startGallery();
    });

    galleryCarousel.addEventListener('mouseenter', stopGallery);
    galleryCarousel.addEventListener('mouseleave', startGallery);

    // Swipe Support
    let gStartX = 0;
    galleryCarousel.addEventListener('touchstart', e => (gStartX = e.changedTouches[0].screenX));
    galleryCarousel.addEventListener(
      'touchend',
      debounce(e => {
        const gEndX = e.changedTouches[0].screenX;
        if (gStartX - gEndX > 75) {
          stopGallery();
          showGallery((currentGallery + 1) % gallerySlides.length);
          startGallery();
        } else if (gEndX - gStartX > 75) {
          stopGallery();
          showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length);
          startGallery();
        }
      }, 100)
    );

    // Keyboard Navigation
    galleryCarousel.setAttribute('tabindex', '0');
    galleryCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        stopGallery();
        showGallery((currentGallery + 1) % gallerySlides.length);
        startGallery();
      } else if (e.key === 'ArrowLeft') {
        stopGallery();
        showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length);
        startGallery();
      }
    });

    [prevBtn, nextBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('focus', stopGallery);
        btn.addEventListener('blur', startGallery);
      }
    });
  }

  // Testimonial Carousel
  const testimonialCarousel = document.querySelector('#testimonialCarousel');
  const testimonialSlides = testimonialCarousel?.querySelectorAll('.testimonial-slide') || [];
  const testimonialDots = document.querySelectorAll('.carousel-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  const getGap = () => {
    const width = window.innerWidth;
    return width <= 768 ? 5 : width <= 1024 ? 8 : 10; // Match CSS margins
  };

  const showTestimonial = index => {
    if (index < 0 || index >= testimonialSlides.length) return;
    const slideWidth = testimonialSlides[0].offsetWidth;
    const gap = getGap();
    testimonialCarousel.scrollTo({
      left: index * (slideWidth + gap * 2),
      behavior: 'smooth',
    });
    testimonialDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentTestimonial = index;
  };

  const startTestimonial = () => {
    testimonialInterval = setInterval(
      () => showTestimonial((currentTestimonial + 1) % testimonialSlides.length),
      6000
    );
  };

  const stopTestimonial = () => clearInterval(testimonialInterval);

  if (testimonialSlides.length) {
    showTestimonial(0);
    testimonialCarousel.scrollLeft = 0;
    startTestimonial();
    window.addEventListener('resize', () => showTestimonial(currentTestimonial));

    testimonialDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopTestimonial();
        showTestimonial(i);
        startTestimonial();
      });
    });

    testimonialCarousel.addEventListener('mouseenter', stopTestimonial);
    testimonialCarousel.addEventListener('mouseleave', startTestimonial);

    // Swipe Support
    let tStartX = 0;
    testimonialCarousel.addEventListener('touchstart', e => (tStartX = e.changedTouches[0].screenX));
    testimonialCarousel.addEventListener(
      'touchend',
      debounce(e => {
        const tEndX = e.changedTouches[0].screenX;
        if (tStartX - tEndX > 75) {
          stopTestimonial();
          showTestimonial((currentTestimonial + 1) % testimonialSlides.length);
          startTestimonial();
        } else if (tEndX - tStartX > 75) {
          stopTestimonial();
          showTestimonial((currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length);
          startTestimonial();
        }
      }, 100)
    );

    // Keyboard Navigation
    testimonialCarousel.setAttribute('tabindex', '0');
    testimonialCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        stopTestimonial();
        showTestimonial((currentTestimonial + 1) % testimonialSlides.length);
        startTestimonial();
      } else if (e.key === 'ArrowLeft') {
        stopTestimonial();
        showTestimonial((currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length);
        startTestimonial();
      }
    });
  }

  // Brand Carousel
  const brandCarousel = document.querySelector('#brandCarousel');
  const brandSlides = brandCarousel?.querySelectorAll('.brand-slide') || [];
  let currentBrand = 0;
  let brandInterval;

  const showBrand = index => {
    if (index < 0 || index >= brandSlides.length) return;
    const slideWidth = brandSlides[0].offsetWidth;
    const gap = getGap();
    brandCarousel.scrollTo({
      left: index * (slideWidth + gap * 2),
      behavior: 'smooth',
    });
    currentBrand = index;
  };

  const startBrand = () => {
    brandInterval = setInterval(
      () => showBrand((currentBrand + 1) % brandSlides.length),
      4000
    );
  };

  const stopBrand = () => clearInterval(brandInterval);

  if (brandCarousel && brandSlides.length) {
    brandCarousel.style.display = 'flex';
    showBrand(0);
    brandCarousel.scrollLeft = 0;
    startBrand();
    window.addEventListener('resize', () => showBrand(currentBrand));

    brandCarousel.addEventListener('mouseenter', stopBrand);
    brandCarousel.addEventListener('mouseleave', startBrand);

    // Drag-to-Scroll and Momentum


    // Keyboard Navigation
    brandCarousel.setAttribute('tabindex', '0');
    brandCarousel.addEventListener('keydown', e => {
      const slideWidth = brandSlides[0].offsetWidth;
      const gap = getGap();
      const step = slideWidth + gap * 2;
      if (e.key === 'ArrowRight') {
        stopBrand();
        brandCarousel.scrollBy({ left: step, behavior: 'smooth' });
        startBrand();
      } else if (e.key === 'ArrowLeft') {
        stopBrand();
        brandCarousel.scrollBy({ left: -step, behavior: 'smooth' });
        startBrand();
      } else if (e.key === 'Home') {
        stopBrand();
        showBrand(0);
        startBrand();
      } else if (e.key === 'End') {
        stopBrand();
        showBrand(brandSlides.length - 1);
        startBrand();
      }
    });
  }

  // Prevent Image Context Menu and Drag (Exclude Brand Links)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => {
      if (!e.target.closest('[data-brand-link]')) {
        e.preventDefault();
      }
    });
    img.addEventListener('dragstart', e => {
      if (!e.target.closest('[data-brand-link]')) {
        e.preventDefault();
      }
    });
  });
});
