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

function updateThemeIcons(isDark) {
  const icon = document.getElementById('theme-icon');
  const iconMobile = document.getElementById('theme-icon-mobile');
  const label = isDark ? 'light_mode' : 'dark_mode';
  if (icon) icon.textContent = label;
  if (iconMobile) iconMobile.textContent = label;
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
