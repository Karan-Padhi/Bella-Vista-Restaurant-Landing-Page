// Bella Vista Restaurant - Main JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initDarkMode();
  initSpecialBadge();
  initGalleryModal();
  initFormValidation();
  initSmoothScrolling();
});

/**
 * Navigation functionality
 */
function initNavigation() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Handle scroll effect on navbar
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = "rgba(44, 24, 16, 0.98)";
    } else {
      navbar.style.backgroundColor = "rgba(44, 24, 16, 0.95)";
    }
  });

  // Update active nav link based on scroll position
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const toggleButton = document.querySelector(".navbar-toggler");
        toggleButton.click();
      }
    });
  });
}

/**
 * Dark Mode functionality
 */
function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const icon = darkModeToggle.querySelector("i");

  // Check for saved dark mode preference or default to light mode
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  if (isDarkMode) {
    body.classList.add("dark-mode");
    icon.classList.remove("bi-moon-fill");
    icon.classList.add("bi-sun-fill");
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    // Update icon
    if (body.classList.contains("dark-mode")) {
      icon.classList.remove("bi-moon-fill");
      icon.classList.add("bi-sun-fill");
      localStorage.setItem("darkMode", "true");
    } else {
      icon.classList.remove("bi-sun-fill");
      icon.classList.add("bi-moon-fill");
      localStorage.setItem("darkMode", "false");
    }
  });
}

/**
 * Today's Special Badge functionality
 */
function initSpecialBadge() {
  const specialBadge = document.getElementById("specialBadge");
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Show special badge on specific days (e.g., weekends)
  if (today === 5 || today === 6 || today === 0) {
    // Friday, Saturday, Sunday
    specialBadge.classList.add("show");

    // Add click handler to hide badge
    specialBadge.addEventListener("click", function () {
      specialBadge.classList.remove("show");
    });

    // Auto-hide after 10 seconds
    setTimeout(function () {
      specialBadge.classList.remove("show");
    }, 10000);
  }
}

/**
 * Gallery Modal functionality
 */
function initGalleryModal() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modalImage = document.getElementById("modalImage");

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const imageSrc = this.getAttribute("data-bs-image");
      const imageAlt = this.querySelector("img").getAttribute("alt");

      modalImage.src = imageSrc;
      modalImage.alt = imageAlt;
    });
  });
}

/**
 * Form Validation functionality
 */
function initFormValidation() {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (validateForm()) {
        // Simulate form submission
        showSuccessMessage();
        form.reset();
        form.classList.remove("was-validated");
      } else {
        form.classList.add("was-validated");
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input[required], select[required]");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          validateField(this);
        }
      });
    });
  }

  function validateForm() {
    let isValid = true;
    const fields = [
      { id: "firstName", min: 2, max: 50 },
      { id: "lastName", min: 2, max: 50 },
      { id: "email", type: "email" },
      { id: "date", type: "date" },
      { id: "time", type: "select" },
      { id: "guests", type: "select" },
    ];

    fields.forEach((field) => {
      const element = document.getElementById(field.id);
      if (!validateField(element)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Check if required field is empty
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = `${getFieldLabel(field)} is required.`;
    }

    // Specific validations
    if (value && field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address.";
      }
    }

    if (
      value &&
      field.id === "firstName" &&
      (value.length < 2 || value.length > 50)
    ) {
      isValid = false;
      errorMessage = "First name must be between 2 and 50 characters.";
    }

    if (
      value &&
      field.id === "lastName" &&
      (value.length < 2 || value.length > 50)
    ) {
      isValid = false;
      errorMessage = "Last name must be between 2 and 50 characters.";
    }

    if (value && field.id === "phone") {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        isValid = false;
        errorMessage = "Please enter a valid phone number.";
      }
    }

    if (value && field.type === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        isValid = false;
        errorMessage = "Please select a future date.";
      }
    }

    // Update field validation state
    const feedback = field.parentNode.querySelector(".invalid-feedback");
    if (isValid) {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    } else {
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
      if (feedback) {
        feedback.textContent = errorMessage;
      }
    }

    return isValid;
  }

  function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(" *", "") : field.name;
  }

  function showSuccessMessage() {
    successMessage.style.display = "block";
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

    // Hide success message after 5 seconds
    setTimeout(function () {
      successMessage.style.display = "none";
    }, 5000);
  }
}

/**
 * Smooth Scrolling functionality
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip if href is just '#'
      if (href === "#") return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();

        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Utility Functions
 */

// Throttle function for scroll events
function throttle(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Debounce function for input events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Animation on scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".menu-card, .gallery-item, .testimonial-card"
  );
  animatedElements.forEach((el) => observer.observe(el));
}

// Initialize scroll animations when DOM is loaded
//document.addEventListener('DOMContentLoaded', function() {
// Add CSS for fade-in animation
//  const style = document.createElement('
