// Smooth scrolling and navigation
function scrollToFeatures() {
  document.getElementById("features").scrollIntoView({
    behavior: "smooth",
  });
}

// Demo modal functionality
function openDemo() {
  document.getElementById("demoModal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeDemo() {
  document.getElementById("demoModal").style.display = "none";
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("demoModal");
  if (event.target === modal) {
    closeDemo();
  }
};

// ROI Calculator
function calculateROI() {
  const hours = document.getElementById("hoursSlider").value;
  const cost = document.getElementById("costSlider").value;

  // Update display values
  document.getElementById("hoursValue").textContent = hours;
  document.getElementById("costValue").textContent = cost;

  // Calculate values
  const currentCost = hours * cost;
  const savings = currentCost * 0.8; // 80% savings
  const monthlySavings = savings;
  const annualSavings = monthlySavings * 12;
  const adeConnectCost = 199 * 12; // Professional plan annual cost
  const roi = (
    ((annualSavings - adeConnectCost) / adeConnectCost) *
    100
  ).toFixed(0);

  // Update display
  document.getElementById(
    "currentCost"
  ).textContent = `€${currentCost.toLocaleString()}`;
  document.getElementById(
    "savings"
  ).textContent = `€${monthlySavings.toLocaleString()}`;
  document.getElementById("roi").textContent = `${roi}%`;
}

// Demo form submission
document.getElementById("demoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  // Add loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
  submitBtn.disabled = true;

  // Send to Discord webhook
  const webhookUrl =
    "https://discord.com/api/webhooks/1386689690878607480/oHkY6psivm7mroG3SrCrtT7llLIzttpi5N7bzOr45OBnOjfeBPqTN6U9wBD1M2VAaSLI";

  // Format message for Discord
  const discordMessage = {
    embeds: [
      {
        title: "🎯 Nuova Richiesta Demo AdeConnect",
        color: 6772970, // Blue color
        fields: [
          {
            name: "👤 Nome",
            value: data.name || "Non specificato",
            inline: true,
          },
          {
            name: "📧 Email",
            value: data.email || "Non specificato",
            inline: true,
          },
          {
            name: "🏢 Azienda",
            value: data.company || "Non specificato",
            inline: true,
          },
          {
            name: "💼 Ruolo",
            value: data.role || "Non specificato",
            inline: true,
          },
          {
            name: "👥 Dipendenti",
            value: data.employees || "Non specificato",
            inline: true,
          },
          {
            name: "📝 Note",
            value: data.message || "Nessuna nota aggiuntiva",
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "AdeConnect Landing Page" },
      },
    ],
  };

  // Send to Discord
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discordMessage),
  })
    .then((response) => {
      if (response.ok) {
        // Show success message
        alert("Grazie! Ti contatteremo entro 24 ore per programmare la demo.");

        // Reset form and close modal
        this.reset();
        closeDemo();
      } else {
        throw new Error("Errore nell'invio");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Si è verificato un errore nell'invio. Riprova più tardi.");
    })
    .finally(() => {
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
});

// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)";
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.boxShadow = "none";
  }
});

// Mobile menu toggle
document
  .querySelector(".mobile-menu-toggle")
  .addEventListener("click", function () {
    const navLinks = document.querySelector(".nav-links");
    navLinks.classList.toggle("active");
  });

// Animated counters for metrics
function animateCounters() {
  const counters = document.querySelectorAll(".metric-value, .roi-value");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace(/[^\d]/g, ""));
    const duration = 2000;
    const start = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(progress * target);
      const originalText = counter.textContent;
      const prefix = originalText.match(/^[^\d]*/)[0];
      const suffix = originalText.match(/[^\d]*$/)[0];

      counter.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    // Start animation when element is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(updateCounter);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// Intersection Observer for animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe animated elements
  const animatedElements = document.querySelectorAll(
    ".feature-card, .problem-card, .benefit-item, .target-card, .pricing-card"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Pricing card hover effects
function setupPricingEffects() {
  const pricingCards = document.querySelectorAll(".pricing-card");

  pricingCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(-10px) scale(1.02)";
        this.style.boxShadow = "0 20px 40px rgba(102, 126, 234, 0.2)";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("featured")) {
        this.style.transform = "translateY(0) scale(1)";
        this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
      }
    });
  });
}

// Feature card interactions
function setupFeatureInteractions() {
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Add ripple effect
      const ripple = document.createElement("div");
      ripple.style.position = "absolute";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(102, 126, 234, 0.3)";
      ripple.style.transform = "scale(0)";
      ripple.style.animation = "ripple 0.6s linear";
      ripple.style.left = "50%";
      ripple.style.top = "50%";
      ripple.style.width = "100px";
      ripple.style.height = "100px";
      ripple.style.marginLeft = "-50px";
      ripple.style.marginTop = "-50px";

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Smooth reveal on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");

  reveals.forEach((reveal) => {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    }
  });
}

// Progress bar for features
function createProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");

  progressBars.forEach((bar) => {
    const progress = bar.getAttribute("data-progress");
    const fill = bar.querySelector(".progress-fill");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            fill.style.width = progress + "%";
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(bar);
  });
}

// Testimonial slider (if added later)
function setupTestimonialSlider() {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".testimonial-slide");
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "block" : "none";
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  }

  // Auto-advance slides
  setInterval(nextSlide, 5000);

  // Initialize
  if (totalSlides > 0) {
    showSlide(0);
  }
}

// FAQ accordion (if added later)
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all other items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("open");
        otherItem.querySelector(".faq-answer").style.maxHeight = "0";
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize ROI calculator
  calculateROI();

  // Setup animations and interactions
  setupScrollAnimations();
  setupPricingEffects();
  setupFeatureInteractions();
  animateCounters();

  // Add ripple CSS
  const style = document.createElement("style");
  style.textContent = rippleCSS;
  document.head.appendChild(style);

  // Initialize other components
  createProgressBars();
  setupTestimonialSlider();
  setupFAQAccordion();

  // Setup scroll events
  window.addEventListener("scroll", revealOnScroll);

  // Initialize reveal elements
  revealOnScroll();

  // Preload critical images
  const criticalImages = ["ade-logo.svg"];

  criticalImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
});

// Utility functions
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance optimizations
const debouncedScroll = debounce(revealOnScroll, 10);
const throttledScroll = throttle(() => {
  // Scroll-based animations
}, 16);

window.addEventListener("scroll", debouncedScroll);
window.addEventListener("scroll", throttledScroll);

// Error handling
window.addEventListener("error", function (e) {
  console.error("JavaScript error:", e.error);
  // In production, send error to logging service
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
  // In production, integrate with Google Analytics, Mixpanel, etc.
  console.log("Event:", { category, action, label });
}

// Track user interactions
document.addEventListener("click", function (e) {
  const target = e.target;

  if (target.matches(".btn-primary")) {
    trackEvent("Engagement", "Click", "Primary Button");
  }

  if (target.matches(".pricing-btn")) {
    trackEvent("Conversion", "Click", "Pricing Button");
  }

  if (target.matches(".nav-links a")) {
    trackEvent("Navigation", "Click", target.textContent);
  }
});

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#e74c3c";
      isValid = false;
    } else {
      field.style.borderColor = "#f0f0f0";
    }

    if (field.type === "email" && field.value && !validateEmail(field.value)) {
      field.style.borderColor = "#e74c3c";
      isValid = false;
    }
  });

  return isValid;
}

// Enhanced form submission
document.getElementById("demoForm").addEventListener("input", function (e) {
  const field = e.target;
  if (field.hasAttribute("required") && field.value.trim()) {
    field.style.borderColor = "#27ca3f";
  }
});
