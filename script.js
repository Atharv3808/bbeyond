// Global Variables
let currentTestimonial = 0

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Hide loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 2000)

  // Initialize all features
  initializeNavigation()
  initializeScrollAnimations()
  initializeCounters()
  initializeGallery()
  initializeTestimonials()
  initializeForms()
  initializeScrollProgress()
  initializeBeforeAfterSliders()

  // Start testimonial autoplay
  startTestimonialAutoplay()
})

// Navigation Functions
function initializeNavigation() {
  const navbar = document.getElementById("navbar")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      if (targetId.startsWith("#")) {
        scrollToSection(targetId.substring(1))
      }
    })
  })
}

// Scroll Functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 50
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Scroll Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add fade-in class to elements
  const animatedElements = document.querySelectorAll(
    ".service-card, .feature, .gallery-item, .testimonial-slide, .contact-item",
  )
  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.1}s`
    observer.observe(el)
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  })

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      element.textContent = target
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Gallery Functions
function initializeGallery() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")

      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Before/After Slider
function initializeBeforeAfterSliders() {
  const sliders = document.querySelectorAll(".comparison-slider")

  sliders.forEach((slider) => {
    const container = slider.parentElement
    const afterImage = container.querySelector(".after-image")
    let isDown = false

    slider.addEventListener("mousedown", (e) => {
      isDown = true
      slider.style.cursor = "grabbing"
    })

    document.addEventListener("mouseup", () => {
      isDown = false
      slider.style.cursor = "ew-resize"
    })

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return

      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = (x / rect.width) * 100

      if (percentage >= 0 && percentage <= 100) {
        slider.style.left = percentage + "%"
        afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`
      }
    })

    // Touch events for mobile
    slider.addEventListener("touchstart", (e) => {
      isDown = true
    })

    document.addEventListener("touchend", () => {
      isDown = false
    })

    container.addEventListener("touchmove", (e) => {
      if (!isDown) return

      const rect = container.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const percentage = (x / rect.width) * 100

      if (percentage >= 0 && percentage <= 100) {
        slider.style.left = percentage + "%"
        afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`
      }
    })
  })
}

// Testimonial Functions
function initializeTestimonials() {
  showTestimonial(0)
}

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.classList.remove("active")
    testimonialDots[i].classList.remove("active")
  })

  testimonials[index].classList.add("active")
  testimonialDots[index].classList.add("active")
  currentTestimonial = index
}

function changeTestimonial(direction) {
  let newIndex = currentTestimonial + direction

  if (newIndex >= testimonials.length) {
    newIndex = 0
  } else if (newIndex < 0) {
    newIndex = testimonials.length - 1
  }

  showTestimonial(newIndex)
  resetTestimonialAutoplay()
}

function goToTestimonial(index) {
  showTestimonial(index)
  resetTestimonialAutoplay()
}

function startTestimonialAutoplay() {
  testimonialInterval = setInterval(() => {
    changeTestimonial(1)
  }, 5000)
}

function resetTestimonialAutoplay() {
  clearInterval(testimonialInterval)
  startTestimonialAutoplay()
}

// Form Functions
function initializeForms() {
  const contactForm = document.getElementById("contact-form")
  const bookingForm = document.getElementById("booking-form")
  const newsletterForm = document.getElementById("newsletter-form")

  // Contact form
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Booking form
  if (bookingForm) {
    bookingForm.addEventListener("submit", handleBookingForm)
  }

  // Newsletter form
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterForm)
  }

  // Set minimum date for booking
  const bookingDate = document.getElementById("booking-date")
  if (bookingDate) {
    const today = new Date().toISOString().split("T")[0]
    bookingDate.setAttribute("min", today)
  }
}

function handleContactForm(e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Simulate form submission
  showNotification("Thank you for your message! We'll get back to you soon.", "success")
  e.target.reset()
}

function handleBookingForm(e) {
  e.preventDefault()

  // Get form data
  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Simulate booking submission
  showNotification("Your appointment has been booked! We'll send you a confirmation email shortly.", "success")
  e.target.reset()
  closeBookingModal()
}

function handleNewsletterForm(e) {
  e.preventDefault()

  // Get email
  const email = e.target.querySelector('input[type="email"]').value

  // Simulate newsletter subscription
  showNotification("Thank you for subscribing to our newsletter!", "success")
  e.target.reset()
}

// Modal Functions
function openBookingModal() {
  const modal = document.getElementById("booking-modal")
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeBookingModal() {
  const modal = document.getElementById("booking-modal")
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  const modal = document.getElementById("booking-modal")
  if (e.target === modal) {
    closeBookingModal()
  }
})

// Notification Function
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : "#2196F3"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// Scroll Progress
function initializeScrollProgress() {
  const backToTop = document.getElementById("back-to-top")
  const progressRing = backToTop.querySelector(".progress-ring circle")
  const circumference = 2 * Math.PI * 20 // radius = 20

  progressRing.style.strokeDasharray = circumference
  progressRing.style.strokeDashoffset = circumference

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset
    const docHeight = document.body.scrollHeight - window.innerHeight
    const scrollPercent = scrollTop / docHeight
    const drawLength = circumference * scrollPercent

    progressRing.style.strokeDashoffset = circumference - drawLength

    // Show/hide back to top button
    if (scrollTop > 300) {
      backToTop.classList.add("visible")
    } else {
      backToTop.classList.remove("visible")
    }
  })
}

// Service Card Interactions
document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const service = card.getAttribute("data-service")
      openBookingModal()

      // Pre-select the service in booking form
      setTimeout(() => {
        const serviceSelect = document.getElementById("booking-service")
        if (serviceSelect) {
          serviceSelect.value = service
        }
      }, 100)
    })
  })
})

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const heroBackground = document.querySelector(".hero-background")

  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`
  }
})

// Lazy Loading for Images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => {
    imageObserver.observe(img)
  })
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", initializeLazyLoading)

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Close modal with Escape key
  if (e.key === "Escape") {
    closeBookingModal()
  }

  // Navigate testimonials with arrow keys
  if (e.key === "ArrowLeft") {
    changeTestimonial(-1)
  } else if (e.key === "ArrowRight") {
    changeTestimonial(1)
  }
})

// Performance Optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Cached DOM elements
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const backToTop = document.getElementById("back-to-top")
const progressRing = backToTop ? backToTop.querySelector(".progress-ring circle") : null
const testimonials = document.querySelectorAll(".testimonial-slide")
const testimonialDots = document.querySelectorAll(".dot")
const filterButtons = document.querySelectorAll(".filter-btn")
const galleryItems = document.querySelectorAll(".gallery-item")
const sliders = document.querySelectorAll(".comparison-slider")

// Debounced scroll handler with actual logic
const debouncedScrollHandler = debounce(() => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }

  if (progressRing) {
    const scrollTop = window.pageYOffset
    const docHeight = document.body.scrollHeight - window.innerHeight
    const scrollPercent = scrollTop / docHeight
    const circumference = 2 * Math.PI * 20 // radius = 20
    const drawLength = circumference * scrollPercent

    progressRing.style.strokeDashoffset = circumference - drawLength

    // Show/hide back to top button
    if (scrollTop > 300) {
      backToTop.classList.add("visible")
    } else {
      backToTop.classList.remove("visible")
    }
  }
}, 100)

window.removeEventListener("scroll", debouncedScrollHandler)
window.addEventListener("scroll", debouncedScrollHandler)

// Navigation Functions
function initializeNavigation() {
  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      if (targetId.startsWith("#")) {
        scrollToSection(targetId.substring(1))
      }
    })
  })
}

// Gallery Functions
function initializeGallery() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Add active class to clicked button
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")

      // Batch DOM updates for gallery items
      galleryItems.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-category") === filter) {
          item.style.display = "block"
          item.style.opacity = "1"
          item.style.transform = "scale(1)"
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          item.style.display = "none"
        }
      })
    })
  })
}

// Before/After Slider
function initializeBeforeAfterSliders() {
  sliders.forEach((slider) => {
    const container = slider.parentElement
    const afterImage = container.querySelector(".after-image")
    let isDown = false
    let animationFrameId = null

    function updateSlider(x) {
      const rect = container.getBoundingClientRect()
      const percentage = ((x - rect.left) / rect.width) * 100
      if (percentage >= 0 && percentage <= 100) {
        slider.style.left = percentage + "%"
        afterImage.style.clipPath = `polygon(${percentage}% 0%, 100% 0%, 100% 100%, ${percentage}% 100%)`
      }
    }

    function onMove(e) {
      if (!isDown) return
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      animationFrameId = requestAnimationFrame(() => updateSlider(clientX))
    }

    slider.addEventListener("mousedown", (e) => {
      isDown = true
      slider.style.cursor = "grabbing"
    })

    document.addEventListener("mouseup", () => {
      isDown = false
      slider.style.cursor = "ew-resize"
    })

    container.addEventListener("mousemove", onMove)

    // Touch events for mobile
    slider.addEventListener("touchstart", (e) => {
      isDown = true
    })

    document.addEventListener("touchend", () => {
      isDown = false
    })

    container.addEventListener("touchmove", onMove)
  })
}

// Testimonial Functions
let testimonialInterval = null

function startTestimonialAutoplay() {
  if (testimonialInterval) return
  testimonialInterval = setInterval(() => {
    changeTestimonial(1)
  }, 5000)
}

function resetTestimonialAutoplay() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval)
    testimonialInterval = null
  }
  startTestimonialAutoplay()
}

// Animation Improvements
function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  let start = null
  let current = 0

  function step(timestamp) {
    if (!start) start = timestamp
    const progress = timestamp - start
    current = Math.min(target, Math.floor((progress / duration) * target))
    element.textContent = current
    if (progress < duration) {
      requestAnimationFrame(step)
    } else {
      element.textContent = target
    }
  }

  requestAnimationFrame(step)
}

// Preload critical images
function preloadImages() {
  const criticalImages = ["/placeholder.svg?height=800&width=1200", "/placeholder.svg?height=400&width=500"]

  criticalImages.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// Initialize preloading
document.addEventListener("DOMContentLoaded", preloadImages)

// Error Handling
window.addEventListener("error", (e) => {
  console.error("An error occurred:", e.error)
  // You could send this to an error tracking service
})

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
