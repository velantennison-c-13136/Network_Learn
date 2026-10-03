const navLinks = Array.from(document.querySelectorAll('.sidebar-nav a[href^="#"]'));
const allNavLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
const animatedSections = document.querySelectorAll('.chapter, .intro-panel, .sidebar-card');

animatedSections.forEach((section, index) => {
    section.classList.add('fade-in');
    section.style.animationDelay = `${index * 60}ms`;
});

/**
 * Scroll the window to a target element using instant position math.
 * Uses 'instant' first to get a clean layout position, then smooth-scrolls.
 */
function scrollToTarget(target) {
    // Open <details> cards before measuring so height is accurate
    if (target.classList.contains('topic-card')) {
        target.open = true;
    }
    const rect = target.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    window.scrollTo({
        top: Math.max(0, absoluteTop - 16),
        behavior: 'smooth'
    });
}

function openTargetCard(hash) {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target && target.classList.contains('topic-card')) {
        target.open = true;
    }
}

/**
 * Update the active class in the sidebar navigator WITHOUT scrolling the
 * sidebar — that scroll would fight the page scroll animation.
 */
function syncNavigator(skipSidebarScroll) {
    const hash = window.location.hash;
    let activeLink = null;

    navLinks.forEach((link) => {
        const isActive = hash !== '' && link.getAttribute('href') === hash;
        link.classList.toggle('is-active', isActive);
        if (isActive) activeLink = link;
    });

    // Only scroll the sidebar to the active link when we're NOT in the middle
    // of a page-scroll animation (avoids interrupting the smooth scroll).
    if (activeLink && !skipSidebarScroll) {
        activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
}

allNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Open <details> cards before scrolling so layout is settled
        openTargetCard(href);

        // Scroll the page — pass skipSidebarScroll=true so the sidebar's
        // scrollIntoView() doesn't cancel our smooth scroll animation.
        scrollToTarget(target);

        // Update URL hash (uses pushState so no native jump / hashchange fires)
        history.pushState(null, '', href);

        // Sync sidebar active state; skip sidebar scroll until page scroll ends
        syncNavigator(true);

        // After smooth scroll finishes (~600 ms), scroll sidebar to active link
        setTimeout(() => syncNavigator(false), 650);
    });
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            openTargetCard(hash);
            scrollToTarget(target);
        }
    }
    syncNavigator(true);
    setTimeout(() => syncNavigator(false), 650);
});

// Handle initial page load with a hash in the URL
if (window.location.hash) {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) {
        requestAnimationFrame(() => {
            setTimeout(() => {
                openTargetCard(hash);
                scrollToTarget(target);
                syncNavigator(false);
            }, 80);
        });
    }
} else {
    syncNavigator(false);
}
