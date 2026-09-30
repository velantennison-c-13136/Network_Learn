const topicCards = Array.from(document.querySelectorAll('.topic-card'));
const navLinks = Array.from(document.querySelectorAll('.sidebar-nav a[href^="#"]'));
const animatedSections = document.querySelectorAll('.chapter, .intro-panel, .sidebar-card');

animatedSections.forEach((section, index) => {
    section.classList.add('fade-in');
    section.style.animationDelay = `${index * 60}ms`;
});

function syncNavigator() {
    const hash = window.location.hash;
    let activeLink = null;

    navLinks.forEach((link) => {
        const isActive = hash !== '' && link.getAttribute('href') === hash;
        link.classList.toggle('is-active', isActive);
        if (isActive) {
            activeLink = link;
        }
    });

    if (activeLink) {
        activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (hash === '') {
        return;
    }

    const target = document.querySelector(hash);
    if (target && target.classList.contains('topic-card')) {
        target.open = true;
    }
}

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target && target.classList.contains('topic-card')) {
            target.open = true;
        }
    });
});

window.addEventListener('hashchange', syncNavigator);

syncNavigator();