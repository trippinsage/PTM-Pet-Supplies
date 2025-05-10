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
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
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
    });
  });
});
