const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('theme-toggle');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const html = document.documentElement;

// Dark Mode Theme
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    if (html.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Burger Functions
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });
}

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        // Scroll Down
        navbar.style.transform = 'translateY(-100%)';
        // Close mobile menu on scroll down
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        }
    } else {
        // Scroll Up
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
});

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 2s ease-out forwards',
            }
        }
    }
}

const container = document.getElementById('works-container');

if (container) {
    const arrows = document.querySelectorAll('.arrow');
    const leftArrow = arrows.length > 0 ? arrows[0] : null;
    const rightArrow = arrows.length > 1 ? arrows[1] : null;
    const scrollAmount = 344; // 320px card + 24px gap (gap-6)

    // State
    let autoScrollInterval;
    let restartTimeout;
    let isUserInteracting = false;

    // Helpers
    function interactionHandler() {
        isUserInteracting = true;
        clearInterval(autoScrollInterval);
        clearTimeout(restartTimeout);
    }

    function interactionEndHandler() {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
            isUserInteracting = false;
            startAutoScroll();
        }, 5000);
    }

    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(() => {
            if (!isUserInteracting && container) {
                const maxScroll = container.scrollWidth - container.clientWidth;
                if (container.scrollLeft >= maxScroll - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }, 3000);
    }

    function resetAutoScroll() {
        interactionHandler();
        interactionEndHandler();
    }

    // Event Listeners
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            resetAutoScroll();
        });
    }

    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            resetAutoScroll();
        });
    }

    container.addEventListener('mousedown', interactionHandler);
    container.addEventListener('touchstart', interactionHandler);
    container.addEventListener('wheel', () => {
        interactionHandler();
        interactionEndHandler();
    });

    container.addEventListener('mouseup', interactionEndHandler);
    container.addEventListener('touchend', interactionEndHandler);

    startAutoScroll();
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('statusMessage');

    const logToConsole = (data) => {
        console.table(data);
    };

    const saveToLocalStorage = (data) => {
        const existingSubmissions = JSON.parse(localStorage.getItem('contact_submissions')) || [];
        const submissionWithDate = { ...data, submittedAt: new Date().toLocaleString() };
        existingSubmissions.push(submissionWithDate);
        localStorage.setItem('contact_submissions', JSON.stringify(existingSubmissions));
        console.log(`Stored! Total submissions: ${existingSubmissions.length}`);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            saveToLocalStorage(data);
            logToConsole(data);

            if (formMessage) {
                formMessage.classList.remove('hidden');
                formMessage.querySelector('p').textContent = 'Thank you! Your message has been saved.';
                formMessage.querySelector('p').classList.add('text-green-500');

                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 3000);
            }

            contactForm.reset();
        });
    }
});