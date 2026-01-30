// DOM Elements
const sections = document.querySelectorAll('.section');
const headerTitle = document.querySelector('header h1');
const body = document.body;

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation class on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Add scroll event listener for header effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add subtle header effect on scroll
    const header = document.querySelector('header');
    if (scrollTop > 100) {
        header.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Toggle expand/collapse for methodology sections
document.querySelectorAll('.methodology').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A') {
            this.classList.toggle('expanded');
        }
    });
});

// Add copy-to-clipboard functionality for file names
document.querySelectorAll('.file-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function() {
        const text = this.textContent.trim().split(' - ')[0];
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.textContent;
            this.textContent = '✓ Copied to clipboard!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// Highlight active section based on scroll position
const sectionHeadings = document.querySelectorAll('.section h2');
window.addEventListener('scroll', () => {
    let current = '';
    sectionHeadings.forEach(heading => {
        const sectionTop = heading.parentElement.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = heading.textContent;
        }
    });
});

// Add animation to team members on load
window.addEventListener('load', () => {
    document.querySelectorAll('.team-member').forEach((member, index) => {
        setTimeout(() => {
            member.style.opacity = '0';
            member.style.transform = 'translateX(-20px)';
            requestAnimationFrame(() => {
                member.style.transition = 'all 0.5s ease';
                member.style.opacity = '1';
                member.style.transform = 'translateX(0)';
            });
        }, index * 100);
    });
});

// Count and display statistics
document.addEventListener('DOMContentLoaded', () => {
    const datasetCards = document.querySelectorAll('.dataset-card');
    const teamMembers = document.querySelectorAll('.team-member');
    const sections = document.querySelectorAll('.section');
    
    console.log(`Page initialized with:`);
    console.log(`- ${datasetCards.length} dataset cards`);
    console.log(`- ${teamMembers.length} team members`);
    console.log(`- ${sections.length} content sections`);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.methodology.expanded').forEach(el => {
            el.classList.remove('expanded');
        });
    }
});

// Dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeBtn = document.getElementById('darkModeToggle');
    if (darkModeBtn) {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            enableDarkMode();
        }
        
        darkModeBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
}

function enableDarkMode() {
    body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
}

function disableDarkMode() {
    body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
}

// Initialize on page load
window.addEventListener('load', () => {
    initDarkMode();
});

// Add loading animation
window.addEventListener('load', () => {
    const container = document.querySelector('.container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            container.style.transition = 'all 0.6s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    }
});

// Export for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        enableDarkMode,
        disableDarkMode
    };
}
