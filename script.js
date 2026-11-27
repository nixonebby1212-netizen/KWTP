
console.log("KWTP JavaScript is connected!");

// =====================================
// 1. MOBILE NAVIGATION
// =====================================

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && navbar) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navbar.classList.toggle("show");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });

    // Close menu after clicking a link
    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");

        });

    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {

        const clickedInsideMenu = navbar.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {

            navbar.classList.remove("show");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");

        }

    });

}

// =====================================
// 2. ACTIVE NAVIGATION ON SCROLL
// =====================================

const pageSections = document.querySelectorAll(
    "#home, #about, #mission, #vision, #program, #contact"
);

const navigationLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
);

if ("IntersectionObserver" in window) {

    const activeSectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const sectionId = entry.target.id;

                    navigationLinks.forEach((link) => {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${sectionId}`
                        );

                    });

                }

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        activeSectionObserver.observe(section);
    });

}

// =====================================
// 3. AUTOMATIC COPYRIGHT YEAR
// =====================================

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// =====================================
// 4. SCROLL REVEAL ANIMATIONS
// =====================================

const animatedSections = document.querySelectorAll(
    ".about-section, .mission-section, .vision-section, .program-section, .contact-section"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show-section");

                sectionObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });

} else {

    animatedSections.forEach(section => {
        section.classList.add("show-section");
    });

}


// =====================================
// 5. KWTP CONTACT FORM
// =====================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    const submitBtn = document.getElementById("submit-btn");
    const formStatus = document.getElementById("form-status");
    const formStatusText = document.getElementById("form-status-text");
    const formStatusIcon = document.getElementById("form-status-icon");

    // Display success or error messages
    function showFormStatus(type, message) {

        if (!formStatus || !formStatusText || !formStatusIcon) return;

        formStatus.hidden = false;
        formStatus.className = `form-status ${type}`;
        formStatusText.textContent = message;

        formStatusIcon.className = type === "success"
            ? "fa-solid fa-circle-check"
            : "fa-solid fa-circle-exclamation";
    }

    // Hide previous messages
    function hideFormStatus() {

        if (!formStatus) return;

        formStatus.hidden = true;
        formStatus.className = "form-status";
    }

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        hideFormStatus();

        // Validate required fields
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Collect form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Check for empty spaces
        if (!name || !email || !subject || !message) {
            showFormStatus("error", "Please complete all fields.");
            return;
        }

        // Validate email address
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFormStatus("error", "Please enter a valid email address.");
            return;
        }

        // Disable button during processing
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
        }

        // Detect local development environment
        const isLocal =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.protocol === "file:";

        // Local testing
        if (isLocal) {

            showFormStatus(
                "success",
                "Validation successful! Actual message delivery will be enabled after deployment."
            );

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <span>→</span>';
            }

            return;
        }

        // Prepare form data for Netlify
        const formData = new FormData(contactForm);
        const encodedData = new URLSearchParams(formData).toString();

        try {

            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: encodedData
            });

            if (!response.ok) {
                throw new Error("Submission failed");
            }

            showFormStatus(
                "success",
                "Your message has been sent successfully! We'll get back to you soon."
            );

            contactForm.reset();

        } catch (error) {

            console.error("KWTP Form Error:", error);

            showFormStatus(
                "error",
                "Something went wrong. Please try again later."
            );

        } finally {

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <span>→</span>';
            }

        }

    });

} 
// =====================================
// 6. KWTP AUTHENTICATION
// =====================================

// LOGIN — FORM VALIDATION

const loginForm = document.getElementById("login-form");

if (loginForm) {

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const message = document.getElementById("login-message");

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Clear previous messages
        message.hidden = true;
        message.textContent = "";
        message.className = "auth-message";

        // Check empty fields
        if (!emailInput.value.trim() || !passwordInput.value.trim()) {

            message.textContent =
                "Please fill in all fields before signing in.";

            message.classList.add("error");
            message.hidden = false;

            return;
        }

        // Check email format
        if (!emailInput.checkValidity()) {

            message.textContent =
                "Please enter a valid email address.";

            message.classList.add("error");
            message.hidden = false;

            return;
        }

        // Navigate to homepage
        window.location.href = "index.html";

    });

}


// PASSWORD VISIBILITY — LOGIN AND SIGNUP

const passwordToggles = document.querySelectorAll(
    "[data-password-toggle]"
);

passwordToggles.forEach((toggle) => {

    toggle.addEventListener("click", () => {

        const inputId = toggle.dataset.passwordToggle;
        const input = document.getElementById(inputId);

        if (!input) return;

        const showPassword = input.type === "password";

        input.type = showPassword ? "text" : "password";

        toggle.innerHTML = showPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        toggle.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );

    });

});