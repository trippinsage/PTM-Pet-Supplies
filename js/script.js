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
    try {
      const hamburger = document.getElementById('hamburger');
      const mobileNav = document.getElementById('mobileNav');

      if (!hamburger || !mobileNav) {
        console.warn('Hamburger menu or mobile navigation element missing.');
        return;
      }

      hamburger.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const isExpanded = mobileNav.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        hamburger.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
        if (!isExpanded) hamburger.focus();
      });

      // Close mobile nav when clicking outside
      document.addEventListener('click', e => {
        if (!mobileNav.contains(e.target) && !hamburger.contains(e.target) && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open menu');
          hamburger.focus();
        }
      });
    } catch (error) {
      console.error('Error setting up hamburger menu:', error);
    }
  };

  // Loading Spinner
  const setupLoadingSpinner = () => {
    try {
      const loadingSpinner = document.querySelector('.loading-spinner');
      if (!loadingSpinner) {
        console.warn('Loading spinner element missing.');
        return;
      }

      window.addEventListener('load', () => {
        requestAnimationFrame(() => {
          loadingSpinner.style.opacity = '0';
          loadingSpinner.setAttribute('aria-hidden', 'true');
          setTimeout(() => {
            loadingSpinner.style.display = 'none';
          }, 500);
        });
      });
    } catch (error) {
      console.error('Error setting up loading spinner:', error);
    }
  };

  // Carousel Functionality (Testimonials and Gallery)
  const setupCarousels = () => {
    try {
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

        // Create navigation dots
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

        // Touch swipe with debouncing
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

        // Keyboard navigation
        carousel.addEventListener('keydown', e => {
          if (e.key === 'ArrowRight') {
            nextSlide();
          } else if (e.key === 'ArrowLeft') {
            prevSlide();
          }
        });

        // Auto-play pause on interaction
        if (isTestimonial) {
          carousel.addEventListener('mouseenter', stopAutoPlay);
          carousel.addEventListener('mouseleave', resetAutoPlay);
          dots.forEach(dot => {
            dot.addEventListener('focus', stopAutoPlay);
            dot.addEventListener('blur', resetAutoPlay);
          });
        }

        // Lazy initialization with IntersectionObserver
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
    } catch (error) {
      console.error('Error setting up carousels:', error);
    }
  };

  // Brand Carousel
  const setupBrandCarousel = () => {
    try {
      const brandCarousel = document.getElementById('brandCarousel');
      if (!brandCarousel) {
        console.warn('Brand carousel element missing.');
        return;
      }

      const inner = brandCarousel.querySelector('.brand-inner');
      const slides = brandCarousel.querySelectorAll('.brand-slide');

      if (!inner || !slides.length) {
        console.warn('Brand carousel is missing required elements.');
        return;
      }

      // Add ARIA roles for accessibility
      brandCarousel.setAttribute('role', 'region');
      brandCarousel.setAttribute('aria-label', 'Brands carousel');
      slides.forEach((slide, index) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-label', `Brand ${index + 1}`);
      });

      // Track brand link clicks
      slides.forEach(slide => {
        const link = slide.querySelector('a[data-brand-link]');
        if (link) {
          link.addEventListener('click', () => {
            const brandName = slide.getAttribute('aria-label').replace(' brand', '');
            console.log(`Clicked brand: ${brandName}`); // Replace with analytics tracking
          });
        }
      });

      // Responsive animation duration to match CSS
      const setAnimationDuration = () => {
        const width = window.innerWidth;
        const totalSlides = slides.length / 2; // Account for duplicated slides
        let duration;
        if (width <= 400) {
          duration = totalSlides * 0.36; // Matches CSS 20s for 56 slides
        } else if (width <= 768) {
          duration = totalSlides * 0.43; // Matches CSS 24s for 56 slides
        } else {
          duration = totalSlides * 0.71; // Matches CSS 40s for 56 slides
        }
        inner.style.animation = `brandSlide ${duration}s linear infinite`;
      };

      // Initial animation setup
      setAnimationDuration();
      inner.style.transform = 'translateX(0)';

      // Update animation duration on resize
      window.addEventListener('resize', debounce(setAnimationDuration, 100));

      // Seamless reset with smooth transition
      inner.addEventListener('animationiteration', () => {
        inner.style.transition = 'none';
        inner.style.transform = 'translateX(0)';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inner.style.transition = 'transform 0.1s linear';
            inner.style.transform = 'translateX(0)';
          });
        });
      });

      // Pause on interaction
      const resumeAnimation = debounce(() => {
        inner.style.animationPlayState = 'running';
      }, 1000);

      brandCarousel.addEventListener('mouseenter', () => {
        inner.style.animationPlayState = 'paused';
      });

      brandCarousel.addEventListener('mouseleave', resumeAnimation);

      brandCarousel.addEventListener('touchstart', () => {
        inner.style.animationPlayState = 'paused';
      });

      brandCarousel.addEventListener('touchend', resumeAnimation);

      // Keyboard navigation for accessibility
      brandCarousel.setAttribute('tabindex', '0');
      brandCarousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          inner.style.animationPlayState = 'paused';
          resumeAnimation();
        }
      });

      // Lazy initialization
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            inner.style.animationPlayState = 'running';
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(brandCarousel);
    } catch (error) {
      console.error('Error setting up brand carousel:', error);
    }
  };

  // Smooth Scroll for Nav Links
  const setupSmoothScroll = () => {
    try {
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
    } catch (error) {
      console.error('Error setting up smooth scroll:', error);
    }
  };

  // Reduced Motion Handling
  const setupReducedMotion = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.brand-inner').forEach(inner => {
        inner.style.animation = 'none';
      });
      document.querySelectorAll('.carousel-inner').forEach(inner => {
        inner.style.transition = 'none';
      });
    }
  };

  // Initialize all features
  try {
    setupHamburgerMenu();
    setupLoadingSpinner();
    setupCarousels();
    setupBrandCarousel();
    setupSmoothScroll();
    setupReducedMotion();
  } catch (error) {
    console.error('Error initializing features:', error);
  }
});