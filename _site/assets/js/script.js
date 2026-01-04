// Smooth scroll and auto-close mobile menu
document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Logic ---
  const mobileMenuButton = document.querySelector("button.md\\:hidden");
  if (mobileMenuButton) {
    const mobileMenu = document.createElement("div");
    mobileMenu.id = "mobile-menu";
    mobileMenu.className =
      "hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center";
    mobileMenu.innerHTML = `
        <button id="close-mobile-menu" class="absolute top-4 right-4 text-gray-600">
          <i class="fas fa-times text-2xl"></i>
        </button>
        <div id="mobile-links" class="space-y-8 text-center">
          <a href="/#features" class="block text-2xl font-medium text-gray-900 hover:text-indigo-600">Features</a>
          <a href="/#scripts" class="block text-2xl font-medium text-gray-900 hover:text-indigo-600">Our Solutions</a>
          <a href="/#testimonials" class="block text-2xl font-medium text-gray-900 hover:text-indigo-600">Testimonials</a>
          <a href="/#pricing" class="block text-2xl font-medium text-gray-900 hover:text-indigo-600">Pricing</a>
          <a href="/#contact" class="block text-2xl font-medium text-gray-900 hover:text-indigo-600">Contact</a>
        </div>
      `;
    document.body.appendChild(mobileMenu);

    const closeMobileMenuButton = document.getElementById("close-mobile-menu");
    const mobileLinks = document.getElementById("mobile-links");

    const closeMenu = () => {
      mobileMenu.classList.add("hidden");
      document.body.style.overflow = "auto";
    };

    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });

    closeMobileMenuButton.addEventListener("click", closeMenu);

    mobileLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        closeMenu();
      }
    });
  }

  // --- Animate on Scroll Logic ---
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".animate-fade-in-up:not(.animated)"
    );
    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      if (elementPosition < screenPosition) {
        element.classList.add("animated");
      }
    });
  };
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Trigger on initial load

  // --- Contact Email Obfuscation ---
  // This prevents basic spam bots from scraping the email address
  // by building it with JavaScript after the page loads.
  const emailUser = "contact";
  const emailDomain = "viabolat.com";
  const fullEmail = emailUser + "@" + emailDomain;

  const contactLink = document.getElementById("contact-link");
  const contactEmailDisplay = document.getElementById("contact-email");

  if (contactLink) {
    contactLink.href = "mailto:" + fullEmail;
  }
  if (contactEmailDisplay) {
    contactEmailDisplay.textContent = fullEmail;
  }
});
