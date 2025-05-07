"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================
   *  COOKIE CONSENT
   * ========================== */
  const cookieConsent = document.getElementById("cookie-consent");
  const acceptCookies = document.getElementById("accept-cookies");

  if (cookieConsent && acceptCookies) {
    if (!localStorage.getItem("ptm-cookie-consent")) {
      cookieConsent.classList.remove("hidden");
    }
    acceptCookies.addEventListener("click", () => {
      try {
        localStorage.setItem("ptm-cookie-consent", "true");
      } catch (err) {
        console.warn("Unable to use localStorage:", err);
      }
      cookieConsent.classList.add("hidden");
    });
  }

  /* ==========================
   *  MOBILE NAVIGATION
   * ========================== */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  window.toggleMobileNav = function () {
    if (mobileNav) {
      mobileNav.classList.toggle("open");
    }
  };

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      toggleMobileNav();
    });
    document.addEventListener("click", (e) => {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNav.classList.remove("open");
      }
    });
  }

  /* ==========================
   *  BACK TO TOP BUTTON
   * ========================== */
  const backToTopBtn = document.getElementById("backToTop");
  let previousScrollY = window.scrollY;

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      // Show the button if user scrolls up & has scrolled >150px
      if (currentScrollY < previousScrollY && currentScrollY > 150) {
        backToTopBtn.classList.remove("hidden");
        backToTopBtn.style.opacity = "1";
      } else {
        backToTopBtn.classList.add("hidden");
        backToTopBtn.style.opacity = "0";
      }
      previousScrollY = currentScrollY;
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================
   *  AUTO-SCROLL CAROUSELS
   * ========================== */
  const brandCarousel = document.getElementById("brandCarousel");
  const testimonialCarousel = document.getElementById("testimonialCarousel");

  let brandPosition = 0, testimonialPosition = 0;
  const scrollStep = 300, scrollInterval = 4000, userScrollTimeout = 5000;

  let brandUserScroll = false;
  let testimonialUserScroll = false;

  function handleUserInteraction(carouselType) {
    if (carouselType === "brand") {
      brandUserScroll = true;
      setTimeout(() => { brandUserScroll = false; }, userScrollTimeout);
    } else {
      testimonialUserScroll = true;
      setTimeout(() => { testimonialUserScroll = false; }, userScrollTimeout);
    }
  }

  if (brandCarousel) {
    ["mousedown", "touchstart", "wheel"].forEach(evt => {
      brandCarousel.addEventListener(evt, () => handleUserInteraction("brand"));
    });
  }

  if (testimonialCarousel) {
    ["mousedown", "touchstart", "wheel"].forEach(evt => {
      testimonialCarousel.addEventListener(evt, () => handleUserInteraction("testimonial"));
    });
  }

  function autoScrollBrands() {
    if (!brandCarousel || brandUserScroll) return;
    brandPosition += scrollStep;
    if (brandPosition > brandCarousel.scrollWidth - brandCarousel.clientWidth) {
      brandPosition = 0;
    }
    brandCarousel.scrollTo({ left: brandPosition, behavior: "smooth" });
  }

  function autoScrollTestimonials() {
    if (!testimonialCarousel || testimonialUserScroll) return;
    testimonialPosition += scrollStep;
    if (testimonialPosition > testimonialCarousel.scrollWidth - testimonialCarousel.clientWidth) {
      testimonialPosition = 0;
    }
    testimonialCarousel.scrollTo({ left: testimonialPosition, behavior: "smooth" });
  }

  setInterval(autoScrollBrands, scrollInterval);
  setInterval(autoScrollTestimonials, scrollInterval);

  /* ==========================
   *  FADE SLIDESHOWS
   * ========================== */
  function initFadeSlideshow(containerId, intervalMs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const viewport = container.querySelector(".slideshow-viewport");
    const slides = container.querySelectorAll(".gallery-slide");

    viewport.style.minHeight = "400px"; // fallback if JS disabled

    let currentIndex = 0;
    slides[currentIndex].classList.add("active");

    setInterval(() => {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
    }, intervalMs);
  }

  initFadeSlideshow("storeSlideshow", 3000);
});