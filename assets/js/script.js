document.addEventListener('DOMContentLoaded', () => {
  // Utility to debounce functions for performance
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
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

  // Initialize loading spinner
  try {
    setupLoadingSpinner();
  } catch (error) {
    console.error('Error initializing loading spinner:', error);
  }
});