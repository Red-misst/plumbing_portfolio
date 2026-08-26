// ─── Section definitions (used for local dev dynamic loading only) ───────────
const SECTIONS = [
  { id: 'section-nav',      file: 'sections/nav.html'      },
  { id: 'section-hero',     file: 'sections/hero.html'     },
  { id: 'section-services', file: 'sections/services.html' },
  { id: 'section-about',    file: 'sections/about.html'    },
  { id: 'section-reviews',  file: 'sections/reviews.html'  },
  { id: 'section-projects', file: 'sections/projects.html' },
  { id: 'section-contact',  file: 'sections/contact.html'  },
  { id: 'section-footer',   file: 'sections/footer.html'   },
];

// Sections are inlined in index.html for production (Netlify).
// This fetch fallback only runs locally when the page is served via a
// dev server and sections are NOT already present in the DOM.
async function loadSections() {
  const results = await Promise.all(
    SECTIONS.map(async ({ id, file }) => {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
        const html = await res.text();
        return { id, html };
      } catch (err) {
        console.error(`[Plumbing] Section load error: ${err.message}`);
        return { id, html: '' };
      }
    })
  );
  // Inject in document order to preserve layout stability
  for (const { id, html } of results) {
    const container = document.getElementById(id);
    if (container && html) container.innerHTML = html;
  }
}

// SVG path data for theme icon states
const THEME_ICON_PATHS = {
  dark_mode:  'M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z',
  light_mode: 'M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z',
};

function updateThemeIcons(isDark) {
  const iconKey = isDark ? 'light_mode' : 'dark_mode';
  const pathD   = THEME_ICON_PATHS[iconKey];
  ['theme-icon', 'theme-icon-mobile'].forEach(id => {
    const svg = document.getElementById(id);
    if (svg) {
      const pathEl = svg.querySelector('path');
      if (pathEl) pathEl.setAttribute('d', pathD);
    }
  });
}


function initTheme() {
  const html = document.getElementById('html-root');
  const saved = localStorage.getItem('theme-plumbing');
  const isDark = saved === 'dark';

  if (isDark) html.classList.add('dark');
  else html.classList.remove('dark');

  updateThemeIcons(isDark);

  function toggle() {
    const nowDark = html.classList.toggle('dark');
    localStorage.setItem('theme-plumbing', nowDark ? 'dark' : 'light');
    updateThemeIcons(nowDark);
  }

  const btn = document.getElementById('theme-toggle');
  const btnMobile = document.getElementById('theme-toggle-mobile');
  if (btn) btn.addEventListener('click', toggle);
  if (btnMobile) btnMobile.addEventListener('click', toggle);
}

function initNav() {
    const openBtn = document.getElementById('mobile-menu-open');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menu = document.getElementById('mobile-menu');
    
    if (openBtn && closeBtn && menu) {
        openBtn.addEventListener('click', () => {
            menu.classList.remove('translate-x-full');
        });

        closeBtn.addEventListener('click', () => {
            menu.classList.add('translate-x-full');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('translate-x-full');
            });
        });
    }
}

function initAnimations() {
    // Scroll Entrance Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up-element:not(.visible)').forEach(element => {
        observer.observe(element);
    });

    // Parallax Effect for Mosaic
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const layers = document.querySelectorAll('.parallax-layer');

        layers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            if (speed) {
                const yPos = -(scrolled * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

function initLazyImages() {
    function revealImage(img, parent) {
        parent.classList.add('img-loaded');
        img.style.opacity = '1';
    }

    // Eager images: start fetching immediately after DOM insertion.
    function handleEager(img) {
        const parent = img.parentElement;
        if (!parent) return;
        if (img.complete && img.naturalWidth > 0) {
            revealImage(img, parent);
        } else {
            img.style.opacity = '0';
            img.addEventListener('load',  () => revealImage(img, parent), { once: true });
            img.addEventListener('error', () => revealImage(img, parent), { once: true });
        }
    }

    // Lazy images: the browser won't fetch until the image enters the viewport.
    // Only set opacity:0 AFTER the IntersectionObserver fires (meaning fetch has begun),
    // so images never get stuck invisible before they've even started loading.
    function handleLazy(img) {
        const parent = img.parentElement;
        if (!parent) return;
        if (img.complete && img.naturalWidth > 0) {
            revealImage(img, parent);
            return;
        }
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                if (img.complete && img.naturalWidth > 0) {
                    revealImage(img, parent);
                } else {
                    img.style.opacity = '0';
                    img.addEventListener('load',  () => revealImage(img, parent), { once: true });
                    img.addEventListener('error', () => revealImage(img, parent), { once: true });
                }
            });
        }, { rootMargin: '120px' });
        io.observe(img);
    }

    document.querySelectorAll('img[loading="lazy"]').forEach(handleLazy);
    document.querySelectorAll('img[loading="eager"], img:not([loading])').forEach(handleEager);
}

function initReviewsSlider() {
    const slider = document.getElementById('reviews-slider');
    if (!slider) return;
    
    const originalCount = slider.children.length;
    
    // Duplicate children for infinite scroll
    const children = Array.from(slider.children);
    children.forEach(child => {
        const clone = child.cloneNode(true);
        slider.appendChild(clone);
    });

    let autoScrollInterval;
    let isTransitioning = false;

    const scrollNext = () => {
        if (isTransitioning) return;
        
        const slides = slider.children;
        if (slides.length <= originalCount) return;

        // Calculate scroll amount (one slide + gap)
        const slideWidth = slides[0].offsetWidth;
        let gap = 0;
        if (slides.length > 1) {
            gap = slides[1].offsetLeft - (slides[0].offsetLeft + slides[0].offsetWidth);
        }
        const scrollAmount = slideWidth + (gap > 0 ? gap : 0);

        slider.style.scrollBehavior = 'smooth';
        slider.scrollLeft += scrollAmount;

        isTransitioning = true;
        // Wait for smooth scroll to finish before checking reset
        setTimeout(() => {
            isTransitioning = false;
            const resetPoint = slides[originalCount].offsetLeft - slides[0].offsetLeft;
            if (slider.scrollLeft >= resetPoint) {
                slider.style.scrollBehavior = 'auto';
                slider.scrollLeft -= resetPoint;
            }
        }, 800);
    };

    const startAutoScroll = () => {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(scrollNext, 5000); // 5 seconds interval for slower reading pace
    };

    startAutoScroll();

    // Pause on interaction
    slider.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    slider.addEventListener('mouseleave', startAutoScroll);
    slider.addEventListener('touchstart', () => clearInterval(autoScrollInterval), {passive: true});
    slider.addEventListener('touchend', startAutoScroll);
    
    // Handle manual swiping infinite loop
    slider.addEventListener('scroll', () => {
        if (isTransitioning) return;
        const slides = slider.children;
        if (slides.length <= originalCount) return;
        
        const resetPoint = slides[originalCount].offsetLeft - slides[0].offsetLeft;
        
        if (slider.scrollLeft >= resetPoint) {
            slider.style.scrollBehavior = 'auto';
            slider.scrollLeft -= resetPoint;
        } else if (slider.scrollLeft <= 0) {
            slider.style.scrollBehavior = 'auto';
            // Snap to the end of the original set if scrolled backward from start
            slider.scrollLeft += resetPoint;
        }
    }, {passive: true});
}

async function init() {
    // Apply saved theme immediately to avoid flash of unstyled content
    const html = document.getElementById('html-root');
    const saved = localStorage.getItem('theme-plumbing');
    if (saved === 'dark') html.classList.add('dark');

    // Sections are inlined into index.html on production (Netlify).
    // When running locally via a dev server the section containers will be
    // empty divs, so we detect that and fall back to fetching them.
    const heroContainer = document.getElementById('section-hero');
    const sectionsAreInlined = heroContainer && heroContainer.children.length > 0;

    if (!sectionsAreInlined) {
        await loadSections();
    }

    initTheme();
    initNav();
    initAnimations();
    initLazyImages();
    initReviewsSlider();
}

document.addEventListener('DOMContentLoaded', init);
