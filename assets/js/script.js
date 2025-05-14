document.addEventListener('DOMContentLoaded', () => {
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
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.add('hidden');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

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
  }
});
