"use strict";

// Initialize site functionality after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  // Mobile Navigation Toggle
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  window.toggleMobileNav = function () {
    if (!mobileNav || !hamburger) return;
    const isOpen = mobileNav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen);
  };

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", toggleMobileNav);
    // Close nav when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
        mobileNav.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
    // Enhance keyboard accessibility for nav links
    mobileNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          link.click();
        }
      });
    });
  }

  // Auto-Scroll Carousels for Testimonials and Brands
  const carousels = [
    { id: "brandCarousel", position: 0 },
    { id: "testimonialCarousel", position: 0 }
  ];
  const scrollStep = 320;
  const scrollInterval = 4000;
  const userScrollTimeout = 5000;

  carousels.forEach(carousel => {
    const element = document.getElementById(carousel.id);
    if (!element) return;

    let userScroll = false;
    ["mousedown", "touchstart", "wheel", "focus"].forEach(evt => {
      element.addEventListener(evt, () => {
        userScroll = true;
        setTimeout(() => { userScroll = false; }, userScrollTimeout);
      });
    });

    setInterval(() => {
      if (userScroll) return;
      carousel.position += scrollStep;
      if (carousel.position >= element.scrollWidth - element.clientWidth) {
        carousel.position = 0;
      }
      element.scrollTo({ left: carousel.position, behavior: "smooth" });
    }, scrollInterval);
  });

  // Fade Slideshow for Gallery
  function initFadeSlideshow(containerId, intervalMs) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const slides = container.querySelectorAll(".gallery-slide");
    if (slides.length === 0) return;

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