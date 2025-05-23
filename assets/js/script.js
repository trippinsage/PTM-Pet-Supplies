document.addEventListener('DOMContentLoaded', () => {
  // Utility to debounce functions for performance
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Hamburger Menu Toggle
  const setupHamburgerMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (!hamburger || !mobileNav) {
      console.warn('Hamburger menu or mobile navigation element missing.');
      return;
    }

    hamburger.addEventListener('click', () => {
      const isExpanded = mobileNav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isExpanded);
      hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
      if (!isExpanded) hamburger.focus();
    });

    document.addEventListener('click', e => {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target) && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        hamburger.focus();
      }
    });
  };

  // Loading Spinner
  const setupLoadingSpinner = () => {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (!loadingSpinner) {
      console.warn('Loading spinner element missing.');
      return;
    }

    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        loadingSpinner.classList.add('hidden');
        loadingSpinner.setAttribute('aria-hidden', 'true');
      });
    });
  };

  // Carousel Functionality (Testimonials and Gallery)
  const setupCarousels = () => {
    const carousels = document.querySelectorAll('.carousel');
    if (!carousels.length) {
      console.warn('No carousels found on the page.');
      return;
    }

    carousels.forEach(carousel => {
      const inner = carousel.querySelector('.carousel-inner');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      if (!inner || !slides.length || !dotsContainer) {
        console.warn(`Carousel ${carousel.id || 'unknown'} is missing required elements.`);
        return;
      }

      let currentIndex = 0;
      let touchStartX = 0;
      let touchEndX = 0;
      let autoPlayInterval = null;
      const isTestimonial = carousel.id === 'testimonialCarousel';

      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dot.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goToSlide(index);
          }
        });
        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll('.carousel-dot');

      const updateCarousel = () => {
        requestAnimationFrame(() => {
          inner.style.transform = `translateX(-${currentIndex * 100}%)`;
          inner.style.transition = 'transform 0.5s ease';
          slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== currentIndex);
          });
          dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
            dot.setAttribute('aria-selected', index === currentIndex);
          });
        });
      };

      const goToSlide = index => {
        currentIndex = (index + slides.length) % slides.length;
        updateCarousel();
        if (isTestimonial) resetAutoPlay();
      };

      const nextSlide = () => goToSlide(currentIndex + 1);
      const prevSlide = () => goToSlide(currentIndex - 1);

      const startAutoPlay = () => {
        if (isTestimonial && !autoPlayInterval) {
          autoPlayInterval = setInterval(nextSlide, 5000);
        }
      };

      const stopAutoPlay = () => {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      };

      const resetAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      const handleTouchEnd = debounce(() => {
        if (touchStartX - touchEndX > 50) {
          nextSlide();
        } else if (touchEndX - touchStartX > 50) {
          prevSlide();
        }
        if (isTestimonial) resetAutoPlay();
      }, 100);

      carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      });

      carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleTouchEnd();
      });

      carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
        }
      });

      if (isTestimonial) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', resetAutoPlay);
        dots.forEach(dot => {
          dot.addEventListener('focus', stopAutoPlay);
          dot.addEventListener('blur', resetAutoPlay);
        });
      }

      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            updateCarousel();
            startAutoPlay();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(carousel);
    });
  };

  // Brand Carousel
  const setupBrandCarousel = () => {
    const brandCarousel = document.getElementById('brandCarousel');
    if (!brandCarousel) {
      console.warn('Brand carousel element missing.');
      return;
    }

    const inner = brandCarousel.querySelector('.brand-inner');
    const slides = brandCarousel.querySelectorAll('.brand-slide');
    const prevButton = brandCarousel.querySelector('.carousel-control.prev');
    const nextButton = brandCarousel.querySelector('.carousel-control.next');

    if (!inner || !slides.length || !prevButton || !nextButton) {
      console.warn('Brand carousel is missing required elements.');
      return;
    }

    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoScrollInterval = null;

    const updateCarousel = () => {
      const slideWidth = slides[0].offsetWidth + 20; // Including margin
      const visibleSlides = Math.floor(brandCarousel.offsetWidth / slideWidth);
      const maxIndex = Math.max(0, slides.length - visibleSlides);
      currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

      requestAnimationFrame(() => {
        const translateX = -currentIndex * slideWidth;
        inner.style.transform = `translateX(${translateX}px)`;
        inner.style.transition = 'transform 0.5s ease-in-out';
        slides.forEach((slide, index) => {
          slide.setAttribute('aria-hidden', index < currentIndex || index >= currentIndex + visibleSlides);
        });
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;
      });
    };

    const goToSlide = index => {
      currentIndex = index;
      updateCarousel();
      resetAutoScroll();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const startAutoScroll = () => {
      if (!autoScrollInterval) {
        autoScrollInterval = setInterval(() => {
          const slideWidth = slides[0].offsetWidth + 20;
          const visibleSlides = Math.floor(brandCarousel.offsetWidth / slideWidth);
          const maxIndex = Math.max(0, slides.length - visibleSlides);
          if (currentIndex < maxIndex) {
            nextSlide();
          } else {
            goToSlide(0);
          }
        }, 3000);
      }
    };

    const stopAutoScroll = () => {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    };

    const resetAutoScroll = () => {
      stopAutoScroll();
      startAutoScroll();
    };

    const handleTouchEnd = debounce(() => {
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      resetAutoScroll();
    }, 100);

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    brandCarousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoScroll();
    });

    brandCarousel.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleTouchEnd();
    });

    brandCarousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    });

    brandCarousel.addEventListener('mouseenter', stopAutoScroll);
    brandCarousel.addEventListener('mouseleave', resetAutoScroll);

    window.addEventListener('resize', debounce(updateCarousel, 100));

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          updateCarousel();
          startAutoScroll();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(brandCarousel);
  };

  // Smooth Scroll for Nav Links
  const setupSmoothScroll = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.substring(1);
        const targetElement = targetId ? document.getElementById(targetId) : null;
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          const mobileNav = document.getElementById('mobileNav');
          const hamburger = document.getElementById('hamburger');
          if (mobileNav && hamburger) {
            mobileNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open menu');
            hamburger.focus();
          }
        } else {
          console.warn(`Navigation target ${targetId} not found.`);
        }
      });
    });
  };

  // Initialize all features
  try {
    setupHamburgerMenu();
    setupLoadingSpinner();
    setupCarousels();
    setupBrandCarousel();
    setupSmoothScroll();
  } catch (error) {
    console.error('Error initializing features:', error);
  }
});