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

async function loadSections() {
  const loadPromises = SECTIONS.map(async ({ id, file }) => {
    const container = document.getElementById(id);
    if (!container) return;

    try {
      const res  = await fetch(file);
      if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
      const html = await res.text();
      container.innerHTML = html;
    } catch (err) {
      console.error(`[Plumbing] Section load error: ${err.message}`);
    }
  });

  await Promise.all(loadPromises);
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

async function init() {
    // Apply saved theme before sections load to avoid flash
    const html = document.getElementById('html-root');
    const saved = localStorage.getItem('theme-plumbing');
    if (saved === 'dark') html.classList.add('dark');

    await loadSections();
    initTheme();
    initNav();
    initAnimations();
    initLazyImages();
}

document.addEventListener('DOMContentLoaded', init);
