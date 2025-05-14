document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle('open');
    mobileNav.classList.toggle('hidden', !isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  }

  hamburger.addEventListener('click', toggleMobileNav);

  // Smooth Scroll for Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        toggleMobileNav();
      }
    });
  });

  // Handle Brand Link Clicks
  document.querySelectorAll('[data-brand-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(link.href, '_blank');
    });
  });

  // Prevent Double Tap Zoom (Exclude Links)
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = new Date().getTime();
    const isLink = event.target.closest('[data-brand-link]');
    if (now - lastTouchEnd <= 300 && !isLink) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // Gallery Slideshow
  const slides = document.querySelectorAll('.gallery-slide');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
  // Utility: Debounce function to limit rapid event firing
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Loading Spinner: Hide after page load
  const spinner = document.querySelector('.loading-spinner');
  if (spinner) {
    window.addEventListener('load', () => {
      spinner.style.opacity = '0';
      setTimeout(() => spinner.style.display = 'none', 300);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideShow() {
    clearInterval(slideInterval);
  }

  showSlide(currentSlide);
  startSlideShow();

  prevButton.addEventListener('click', () => {
    stopSlideShow();
    prevSlide();
    startSlideShow();
  });

  nextButton.addEventListener('click', () => {
    stopSlideShow();
    nextSlide();
    startSlideShow();
  });

  document.querySelector('.gallery-carousel').addEventListener('mouseenter', stopSlideShow);
  document.querySelector('.gallery-carousel').addEventListener('mouseleave', startSlideShow);

  // Testimonial Carousel Auto-Scroll
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let testimonialIndex = 0;
  let testimonialInterval = null;

  function showTestimonial(index) {
    const slideWidth = testimonialSlides[0].offsetWidth + 32; // Include gap
    testimonialCarousel.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
  // Hamburger Menu: Toggle mobile navigation
  const hamburger = document.querySelector('#hamburger');
  const mobileNav = document.querySelector('#mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('hidden');
      hamburger.setAttribute('aria-expanded', String(!expanded));
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.add('hidden');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function nextTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonialSlides.length;
    showTestimonial(testimonialIndex);
  }

  function startTestimonialScroll() {
    testimonialInterval = setInterval(nextTestimonial, 6000);
  }

  function stopTestimonialScroll() {
    clearInterval(testimonialInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopTestimonialScroll();
      testimonialIndex = parseInt(dot.getAttribute('data-index'));
      showTestimonial(testimonialIndex);
      startTestimonialScroll();
    });
  });

  startTestimonialScroll();
  testimonialCarousel.addEventListener('mouseenter', stopTestimonialScroll);
  testimonialCarousel.addEventListener('mouseleave', startTestimonialScroll);

  // Brand Carousel Auto-Scroll and Drag-to-Scroll
  const brandCarousel = document.getElementById('brandCarousel');
  const brandSlides = document.querySelectorAll('.brand-slide');
  let brandIndex = 0;
  let brandInterval = null;
  let isDown = false;
  let startX;
  let scrollLeft;

  function showBrand(index) {
    const slideWidth = brandSlides[0].offsetWidth + 32; // Include gap
    brandCarousel.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
  // Testimonial Carousel
  const testimonialCarousel = document.querySelector('#testimonialCarousel');
  const testimonialSlides = testimonialCarousel?.querySelectorAll('.testimonial-slide') || [];
  const testimonialDots = document.querySelectorAll('.carousel-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  const showTestimonial = index => {
    if (index < 0 || index >= testimonialSlides.length) return;
    testimonialSlides.forEach(slide => slide.classList.toggle('active', slide === testimonialSlides[index]));
    testimonialDots.forEach(dot => dot.classList.toggle('active', dot === testimonialDots[index]));
    currentTestimonial = index;
  };

  const startTestimonial = () => {
    testimonialInterval = setInterval(() => showTestimonial((currentTestimonial + 1) % testimonialSlides.length), 5000);
  };
  const stopTestimonial = () => clearInterval(testimonialInterval);

  if (testimonialSlides.length) {
    showTestimonial(0);
    startTestimonial();
    testimonialDots.forEach((dot, i) => dot.addEventListener('click', () => { stopTestimonial(); showTestimonial(i); startTestimonial(); }));
    testimonialCarousel.addEventListener('mouseenter', stopTestimonial);
    testimonialCarousel.addEventListener('mouseleave', startTestimonial);
    // Swipe
    let startX = 0;
    testimonialCarousel.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX);
    testimonialCarousel.addEventListener('touchend', debounce(e => {
      const endX = e.changedTouches[0].screenX;
      if (startX - endX > 75) { stopTestimonial(); showTestimonial((currentTestimonial + 1) % testimonialSlides.length); startTestimonial(); }
      else if (endX - startX > 75) { stopTestimonial(); showTestimonial((currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length); startTestimonial(); }
    }, 100));
    testimonialCarousel.setAttribute('tabindex', '0');
    testimonialCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { stopTestimonial(); showTestimonial((currentTestimonial + 1) % testimonialSlides.length); startTestimonial(); }
      if (e.key === 'ArrowLeft') { stopTestimonial(); showTestimonial((currentTestimonial - 1 + testimonialSlides.length) % testimonialSlides.length); startTestimonial(); }
    });
  }

  function nextBrand() {
    brandIndex = (brandIndex + 1) % brandSlides.length;
    showBrand(brandIndex);
  }

  function startBrandScroll() {
    brandInterval = setInterval(nextBrand, 4000);
  }

  function stopBrandScroll() {
    clearInterval(brandInterval);
  // Gallery Carousel
  const galleryCarousel = document.querySelector('#storeSlideshow');
  const gallerySlides = galleryCarousel?.querySelectorAll('.gallery-slide') || [];
  const prevBtn = galleryCarousel?.querySelector('.carousel-prev');
  const nextBtn = galleryCarousel?.querySelector('.carousel-next');
  let currentGallery = 0;
  let galleryInterval;

  const showGallery = i => {
    if (i < 0 || i >= gallerySlides.length) return;
    gallerySlides.forEach(slide => slide.classList.toggle('active', slide === gallerySlides[i]));
    currentGallery = i;
  };
  const startGallery = () => galleryInterval = setInterval(() => showGallery((currentGallery + 1) % gallerySlides.length), 7000);
  const stopGallery = () => clearInterval(galleryInterval);

  if (gallerySlides.length) {
    showGallery(0);
    startGallery();
    prevBtn?.addEventListener('click', () => { stopGallery(); showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length); startGallery(); });
    nextBtn?.addEventListener('click', () => { stopGallery(); showGallery((currentGallery + 1) % gallerySlides.length); startGallery(); });
    galleryCarousel.addEventListener('mouseenter', stopGallery);
    galleryCarousel.addEventListener('mouseleave', startGallery);
    // Swipe
    let gStartX = 0;
    galleryCarousel.addEventListener('touchstart', e => gStartX = e.changedTouches[0].screenX);
    galleryCarousel.addEventListener('touchend', debounce(e => {
      const gEndX = e.changedTouches[0].screenX;
      if (gStartX - gEndX > 75) { stopGallery(); showGallery((currentGallery + 1) % gallerySlides.length); startGallery(); }
      else if (gEndX - gStartX > 75) { stopGallery(); showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length); startGallery(); }
    }, 100));
    galleryCarousel.setAttribute('tabindex', '0');
    galleryCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { stopGallery(); showGallery((currentGallery + 1) % gallerySlides.length); startGallery(); }
      if (e.key === 'ArrowLeft') { stopGallery(); showGallery((currentGallery - 1 + gallerySlides.length) % gallerySlides.length); startGallery(); }
    });
    [prevBtn, nextBtn].forEach(btn => btn && btn.addEventListener('focus', stopGallery) && btn.addEventListener('blur', startGallery));
  }

  startBrandScroll();
  brandCarousel.addEventListener('mouseenter', stopBrandScroll);
  brandCarousel.addEventListener('mouseleave', startBrandScroll);

  // Drag-to-Scroll for Brand Carousel
  brandCarousel.addEventListener('mousedown', (e) => {
    isDown = true;
    brandCarousel.classList.add('active');
    startX = e.pageX - brandCarousel.offsetLeft;
    scrollLeft = brandCarousel.scrollLeft;
  });

  brandCarousel.addEventListener('mouseleave', () => {
    isDown = false;
    brandCarousel.classList.remove('active');
  });

  brandCarousel.addEventListener('mouseup', () => {
    isDown = false;
    brandCarousel.classList.remove('active');
  });

  brandCarousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - brandCarousel.offsetLeft;
    const walk = (x - startX) * 2; // Adjust scroll speed
    brandCarousel.scrollLeft = scrollLeft - walk;
  });

  // Prevent Image Context Menu and Drag
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
      if (!e.target.closest('[data-brand-link]')) {
        e.preventDefault();
      }
    });
    img.addEventListener('dragstart', (e) => {
      if (!e.target.closest('[data-brand-link]')) {
        e.preventDefault();
      }
  // Brand Carousel
  const brandCarousel = document.querySelector('#brandCarousel');
  if (brandCarousel) {
    const slides = brandCarousel.querySelectorAll('.brand-slide');
    brandCarousel.style.display = slides.length ? 'flex' : 'none';

    let isDragging = false, startX = 0, scrollLeft = 0, velocity = 0, lastX = 0, lastTime = 0, raf;

    const clamp = () => {
      const max = brandCarousel.scrollWidth - brandCarousel.clientWidth;
      brandCarousel.scrollLeft = Math.max(0, Math.min(brandCarousel.scrollLeft, max));
    };
    const momentum = () => {
      if (Math.abs(velocity) < 0.5) { cancelAnimationFrame(raf); clamp(); return; }
      brandCarousel.scrollLeft += velocity / 60;
      velocity *= 0.92;
      clamp();
      raf = requestAnimationFrame(momentum);
    };
    const dragStart = e => {
      isDragging = true;
      startX = e.pageX ?? e.touches[0].pageX;
      scrollLeft = brandCarousel.scrollLeft;
      velocity = 0;
      lastX = startX;
      lastTime = Date.now();
      cancelAnimationFrame(raf);
      brandCarousel.style.scrollBehavior = 'auto';
    };
    const dragMove = e => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX ?? e.touches[0].pageX;
      const walk = (x - startX) * 1.5;
      brandCarousel.scrollLeft = scrollLeft - walk;
      const now = Date.now();
      const dx = x - lastX, dt = (now - lastTime) / 1000;
      if (dt) velocity = dx / dt;
      lastX = x;
      lastTime = now;
      clamp();
    };
    const dragEnd = () => {
      isDragging = false;
      raf = requestAnimationFrame(momentum);
      brandCarousel.style.scrollBehavior = '';
    };
    brandCarousel.addEventListener('mousedown', dragStart);
    brandCarousel.addEventListener('touchstart', dragStart);
    brandCarousel.addEventListener('mousemove', dragMove);
    brandCarousel.addEventListener('touchmove', dragMove);
    brandCarousel.addEventListener('mouseup', dragEnd);
    brandCarousel.addEventListener('mouseleave', dragEnd);
    brandCarousel.addEventListener('touchend', dragEnd);

    // Keyboard navigation
    brandCarousel.setAttribute('tabindex', '0');
    brandCarousel.addEventListener('keydown', e => {
      const step = slides[0]?.offsetWidth || 200;
      if (e.key === 'ArrowRight') brandCarousel.scrollBy({ left: step, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') brandCarousel.scrollBy({ left: -step, behavior: 'smooth' });
      if (e.key === 'Home') brandCarousel.scrollTo({ left: 0, behavior: 'smooth' });
      if (e.key === 'End') brandCarousel.scrollTo({ left: brandCarousel.scrollWidth, behavior: 'smooth' });
    });
  });
  }
});
