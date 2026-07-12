/* ───────────────────────────────────────────────
   MAIN.JS - Premium Redesign & JavaScript Features
   ─────────────────────────────────────────────── */

/* ── URL CLEANER (SECURITY) ─────────────────── */
if (window.location.search) {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
}

/* ── THEME SWITCHER (DEFAULT TO LIGHT) ───────── */
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const getSavedTheme = () => {
  const saved = localStorage.getItem('theme');
  return saved || 'light'; // Default to light mode as requested by user
};

const currentTheme = getSavedTheme();
htmlEl.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const activeTheme = htmlEl.getAttribute('data-theme');
  const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ── NAVBAR SCROLL & ACTIVE LINK ────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => observer.observe(s));

/* ── SCROLL PROGRESS BAR ──────────────────────── */
const progressBar = document.getElementById('scroll-progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* ── SMOOTH SLIDING NAV UNDERLINE ─────────────── */
// Creates a gliding pill indicator under the active nav link
(function initNavPill() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const pill = document.createElement('span');
  pill.id = 'nav-pill';
  pill.style.cssText = `
    position: absolute;
    bottom: -2px;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 2px;
    transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.25s ease;
    opacity: 0;
    pointer-events: none;
  `;
  nav.style.position = 'relative';
  nav.appendChild(pill);

  function movePill(linkEl) {
    if (!linkEl) { pill.style.opacity = '0'; return; }
    const navRect = nav.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();
    pill.style.left = (linkRect.left - navRect.left) + 'px';
    pill.style.width = linkRect.width + 'px';
    pill.style.opacity = '1';
  }

  const allNavLinks = nav.querySelectorAll('a');

  // On hover: slide to hovered link
  allNavLinks.forEach(a => {
    a.addEventListener('mouseenter', () => movePill(a));
  });

  // On mouse-leave nav: slide back to active
  nav.addEventListener('mouseleave', () => {
    const active = nav.querySelector('a.active');
    movePill(active || null);
  });

  // Keep pill synced with scroll-spy active link
  const pillObserver = new MutationObserver(() => {
    const active = nav.querySelector('a.active');
    if (active) movePill(active);
  });
  allNavLinks.forEach(a => pillObserver.observe(a, { attributes: true, attributeFilter: ['class'] }));

  // Init on load
  setTimeout(() => {
    const active = nav.querySelector('a.active');
    if (active) movePill(active);
  }, 300);
})();

/* ── SMOOTH ANIMATED STAT COUNTERS ───────────── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.floor(easeOutCubic(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.about-stats-minimal');
if (statsRow) statObserver.observe(statsRow);

/* ── HAMBURGER MENU ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── CUSTOM CURSOR WITH INERTIA ──────────────── */
const dot = document.getElementById('custom-cursor-dot');
const ring = document.getElementById('custom-cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let cursorInitialized = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  if (!cursorInitialized && !window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'block';
    ring.style.display = 'block';
    cursorInitialized = true;
  }
});

function animateCursor() {
  if (cursorInitialized) {
    const lerpFactor = 0.16;
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;
    
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

function initCursorHovers() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const hoverables = document.querySelectorAll('a, button, .project-card, .filter-btn, .theme-toggle-btn, .journey-card');
  hoverables.forEach(el => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = "true";

    el.addEventListener('mouseenter', () => {
      if (el.classList.contains('project-card')) {
        document.body.classList.add('cursor-project-hover');
      } else {
        document.body.classList.add('cursor-hover');
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-project-hover');
    });
  });
}

/* ── AMBIENT GRADIENT CANVAS BACKGROUND ───────── */
const canvas = document.getElementById('ambient-canvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class GradientBlob {
  constructor(x, y, radius, color, vx, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
  }
  update(mx, my) {
    this.x += this.vx;
    this.y += this.vy;

    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.hypot(dx, dy);
    if (dist < 350) {
      const force = (350 - dist) / 350;
      this.x += (dx / dist) * force * 1.5;
      this.y += (dy / dist) * force * 1.5;
    }

    if (this.x < -this.radius) this.x = width + this.radius;
    if (this.x > width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = height + this.radius;
    if (this.y > height + this.radius) this.y = -this.radius;
  }
  draw() {
    ctx.beginPath();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    grad.addColorStop(0, this.color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let blobs = [];
function initBlobs() {
  blobs = [];
  const palette = [
    'rgba(79, 70, 229, 0.12)',  // Indigo
    'rgba(244, 63, 94, 0.11)',   // Rose
    'rgba(6, 182, 212, 0.10)',  // Cyan
  ];
  const count = 4;
  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 200 + 200;
    const x = Math.random() * width;
    const y = Math.random() * height;
    const vx = (Math.random() - 0.5) * 0.35;
    const vy = (Math.random() - 0.5) * 0.35;
    const color = palette[i % palette.length];
    blobs.push(new GradientBlob(x, y, radius, color, vx, vy));
  }
}
initBlobs();

let mx = -1000, my = -1000;
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function drawBlobs() {
  ctx.clearRect(0, 0, width, height);
  blobs.forEach(b => {
    b.update(mx, my);
    b.draw();
  });
  requestAnimationFrame(drawBlobs);
}
drawBlobs();

/* ── 3D TILT EFFECT ──────────────────────────── */
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const tiltCards = document.querySelectorAll('.skill-card, .project-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ── SMOOTH TEXT CYCLING (FADE + SLIDE) ─────────── */
(function initTextCycle() {
  const el = document.getElementById('scramble-title');
  if (!el) return;

  const titles = ['UI/UX Designer', 'Frontend Developer', 'Figma Expert', 'Laravel Developer'];
  let idx = 0;

  // Base style for the element
  el.style.cssText += `
    display: inline-block;
    transition: opacity 0.45s cubic-bezier(0.4,0,0.2,1),
                transform 0.45s cubic-bezier(0.4,0,0.2,1);
  `;

  function cycleTo(text) {
    // Fade out + slide up
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      el.textContent = text;
      // Fade in from below
      el.style.transform = 'translateY(10px)';
      // Force reflow so transition fires
      void el.offsetWidth;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 460);
  }

  // Show first title immediately
  el.textContent = titles[0];
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';

  // Start cycling
  setInterval(() => {
    idx = (idx + 1) % titles.length;
    cycleTo(titles[idx]);
  }, 3000);
})();

/* ── REVEAL ON SCROLL ─────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

function refreshReveals() {
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(r => {
    if (!r.classList.contains('visible')) {
      revealObserver.observe(r);
    }
  });
}

/* ── SKILLS DATA & RENDER ─────────────────────── */
const allSkills = [
  { icon: 'devicon-figma-plain colored', name: 'Figma' },
  { icon: 'devicon-html5-plain colored', name: 'HTML' },
  { icon: 'devicon-css3-plain colored', name: 'CSS' },
  { icon: 'devicon-javascript-plain colored', name: 'JavaScript' },
  { icon: 'devicon-dot-net-plain-wordmark colored', name: '.NET' },
  { icon: 'devicon-laravel-plain colored', name: 'Laravel' },
  { icon: 'devicon-github-original', name: 'GitHub' },
  { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:2.5rem;height:2.5rem;color:#f59e0b"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`, name: 'SEO' },
  { icon: 'devicon-canva-original colored', name: 'Canva' },
  { icon: 'devicon-jira-plain colored', name: 'Jira' },
];

const skillsGrid = document.getElementById('skillsGrid');

function renderSkills() {
  skillsGrid.innerHTML = '';
  allSkills.forEach((skill, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card reveal';
    card.style.setProperty('--i', i);
    const iconHtml = skill.svg
      ? skill.svg
      : `<i class="${skill.icon}"></i>`;
    card.innerHTML = `${iconHtml}<span>${skill.name}</span>`;
    skillsGrid.appendChild(card);
  });
}

/* ── PROJECTS DATA & RENDER ───────────────────── */
const projects = [
  {
    title: 'Luxury Nepal - Travel App UI',
    desc: 'A complete Travel App UI/UX design built in Figma - featuring destination discovery, booking flows, and itinerary planning.',
    longDesc: 'Luxury Nepal is a travel discovery and booking platform targeted at premium tourists visiting Nepal. The goal was to build a visually engaging, culturally respectful interface that simplifies premium hotel bookings, custom itinerary creation, and hiring local guides.',
    stack: ['Figma', 'UI/UX Design', 'User Flows', 'Prototyping'],
    tag: 'web', 
    color: '#e0e7ff',
    liveUrl: 'https://www.figma.com/design/6PPUwGoz1CffPnE4MeCow0/Untitled?node-id=428-706&t=TnFhXAsnV08EoMuK-1',
    githubUrl: '#',
    keyFeatures: ['Interactive regional map with filtering options', 'Curated luxury accommodations booking directory', 'Custom visual day-by-day travel calendar builder', 'Offline-friendly digital travel documents vault'],
    challenges: 'Balancing cultural elements with high-end minimal styling. We chose elegant typography, fine geometric icons, and expansive card grids.'
  },
  {
    title: 'Purito - Skincare Website UI',
    desc: 'A clean and elegant Skincare Website UI designed in Figma - featuring quiz-based matching, product discovery, and ingredient tracking.',
    longDesc: 'Purito is a skincare matching website design. It helps users discover products matching their specific dermatological types using an interactive diagnostic quiz and detailed chemical ingredient analysis.',
    stack: ['Figma', 'Web UI', 'UI Design', 'Prototyping'],
    tag: 'web', 
    color: '#e0f2fe',
    liveUrl: 'https://www.figma.com/design/6PPUwGoz1CffPnE4MeCow0/Untitled?node-id=2203-7959&t=hUQ0B1TAfxttXVfx-1',
    githubUrl: '#',
    keyFeatures: ['Adaptive skincare skin type diagnosis quiz', 'Ingredient transparency catalog detailing chemical components', 'Daily habit reminder and product usage calendar tracker'],
    challenges: 'Making technical chemical terms look approachable for ordinary users. We resolved this by building clear info-bubbles and color-coded labels.'
  },
  {
    title: 'Audely - Mobile App UI',
    desc: 'A sleek and modern mobile app UI designed in Figma - featuring audio discovery flow, playlists and customized dark theme.',
    longDesc: 'Audely is an interactive mobile interface for audio exploration, podcast streaming, and playlist sharing, featuring high-fidelity screen mockups and interactive user flows.',
    stack: ['Figma', 'Mobile UI', 'Prototyping', 'User Flows'],
    tag: 'mobile', 
    color: '#f3e8ff',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=244-832&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
    keyFeatures: ['Intuitive slider swipe for audio progress tracking', 'Dynamic theme colors adjusting to album cover graphics', 'Direct offline audio sync controls'],
    challenges: 'Designing dark-mode elements with high visibility. We optimized contrast ratios to meet WCAG standards while maintaining a clean look.'
  },
  {
    title: 'Fresh Bakey - Food App UI',
    desc: 'A warm and appetizing Food Delivery & Bakery app UI - featuring menu browsing, order flows, and a delightful visual design.',
    longDesc: 'Fresh Bakey is a mobile food delivery app designed for a high-end local bakery, streamlining pastry browsing, custom cake ordering, and express delivery tracking.',
    stack: ['Figma', 'UI Design', 'Prototyping', 'Mobile UI'],
    tag: 'mobile', 
    color: '#ffedd5',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=1552-1488&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
    keyFeatures: ['Custom 3D cake builder configurator interface', 'Interactive bakery map and fresh-batch notifications', 'One-click guest checkout checkout flow'],
    challenges: 'Maintaining appetite appeal in UI icons. Used custom illustrations and warm pastel color tones to keep screens visually inviting.'
  },
  {
    title: 'Nipuna Prabidhik Sewa - Website Design',
    desc: 'A professional website design for Nipuna Prabidhik Sewa - clean layout, modern UI components, and a user-friendly structure.',
    longDesc: 'A complete corporate landing page redesign for Nipuna Prabidhik Sewa, aligning branding guidelines with a modern SaaS style to improve lead conversion metrics.',
    stack: ['Figma', 'Web Design', 'UI Design', 'Prototyping'],
    tag: 'web', 
    color: '#f1f5f9',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=0-1&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
    keyFeatures: ['Interactive service sliders detailing business models', 'Fully customizable responsive grid systems', 'Optimized booking call-to-actions'],
    challenges: 'Condensing legacy text content into a readable structure. We utilized folding accordion panels and layout columns to solve this.'
  },
  {
    title: 'Fishzone - Seafood E-Commerce UI',
    desc: 'A fresh and modern UI/UX design for Fishzone, an online seafood store - featuring intuitive navigation, category filters, and detailed product pages.',
    longDesc: 'Fishzone is a high-fidelity e-commerce mockup for fresh seafood distribution, featuring product categorization, shopping cart controls, and shipping trackers.',
    stack: ['Figma', 'Web Design', 'E-Commerce UI', 'Prototyping'],
    tag: 'web', 
    color: '#ecfeff',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=0-1&t=Y3tyuI7fO3ZQMSl4-1',
    githubUrl: '#',
    keyFeatures: ['Dynamic cart drawer previewing shipping weights', 'Responsive product slider with quick-add overlay buttons', 'Clear checkout path and order details page'],
    challenges: 'Conveying freshness through design colors. We selected a palette of ice blues and deep sea indigos alongside sharp typography.'
  },
  {
    title: 'MoodDiary - .NET Web App',
    desc: 'A mood tracking web application built with ASP.NET - lets users log daily moods, write journal entries, and visualise emotional patterns over time.',
    longDesc: 'MoodDiary is a complete web application built with ASP.NET Core MVC. It allows users to document daily journals, check emotional variables, and track psychological patterns using custom analytical dashboards.',
    stack: ['.NET', 'C#', 'ASP.NET MVC', 'SQL Server'],
    tag: 'web', 
    color: '#e0f2fe',
    liveUrl: 'https://github.com/Nirjala34/MoodDiary/tree/main',
    githubUrl: 'https://github.com/Nirjala34/MoodDiary/tree/main',
    keyFeatures: ['Interactive mood logs using custom graphic emojis', 'Progressive line charts tracking moods over weekly ranges', 'Rich text editor interface with tag-based cataloging'],
    challenges: 'Designing database structures for journal tags. We implemented a clean relational mapping in Entity Framework Core to manage tag links.'
  },
  {
    title: 'Kumari Cinemas - Cinema Booking Web App',
    desc: 'A cinema booking and management web application designed and developed independently using ASP.NET, C#, and Oracle Database.',
    longDesc: 'Kumari Cinemas is a robust seat-booking platform providing user login flows, reservation calendars, interactive seat maps, and administrator audit systems.',
    stack: ['ASP.NET', 'C#', 'Oracle Database', 'Web Application'],
    tag: 'web', 
    color: '#fae8ff',
    liveUrl: 'https://github.com/Nirjala34/portfolio',
    githubUrl: 'https://github.com/Nirjala34/portfolio',
    keyFeatures: ['SVG seat grid layout with real-time availability', 'Admin panel for movie scheduling and revenue reporting', 'Dynamic reservation receipts email generator'],
    challenges: 'Handling concurrent bookings. We implemented database locks in Oracle PL/SQL to prevent seat double-reservations.'
  },
  {
    title: 'Redesigning QMB - Mobile App UI',
    desc: 'Redesigned the mobile app UI originally created by a senior designer - improved visual hierarchy, modernised components, and enhanced user flows.',
    longDesc: 'This project is a detailed redesign of the QMB mobile app UI to improve usability, component consistency, and visual layout systems based on Figma design guidelines.',
    stack: ['Figma', 'Mobile UI', 'Prototyping', 'User Flows'],
    tag: 'mobile', 
    color: '#f0fdf4',
    liveUrl: 'https://www.figma.com/design/djJuCQnfQol4E4QeGDAxVa/QMB-Mobile-App?node-id=3311-3&t=C7StpmhLZ1zvUq6g-1',
    githubUrl: '#',
    keyFeatures: ['Unified, scalable Figma design component system', 'Modern tab navbar structures and navigation logic', 'Highly interactive screen prototypes'],
    challenges: 'Updating designs without altering core navigation routes. We preserved the layout architecture while modernizing font scale, color systems, and margins.'
  },
  {
    title: 'AI Spam Detection Filter',
    desc: 'A machine learning spam detection model built with Python in Jupyter Notebook - classifies messages using NLP techniques and email datasets.',
    longDesc: 'AI Spam Detection Filter is a statistical classification project built in Jupyter Notebook using Python. It cleans input email messages using NLP techniques and classifies them using SciKit-Learn classifiers.',
    stack: ['Python', 'Jupyter Notebook', 'Machine Learning', 'NLP'],
    tag: 'web', 
    color: '#f8fafc',
    liveUrl: 'https://github.com/Nirjala34/AICoursework2_NirjalaShrestha',
    githubUrl: 'https://github.com/Nirjala34/AICoursework2_NirjalaShrestha',
    keyFeatures: ['Text tokenization, lemmatization and vectorization pipelines', 'Comparative accuracy scores between Naive Bayes and SVM models', 'Interactive testing shell to predict inputs dynamically'],
    challenges: 'Achieving high recall rates to prevent filtering legitimate emails. We tuned classifier thresholds to balance precision-recall metrics.'
  },
  {
    title: 'QMB Vehicle Renting - Figma Design',
    desc: 'A premium mobile user interface design for vehicle renting and ride-sharing service built in Figma.',
    longDesc: 'QMB Vehicle Renting is a complete mobile application interface designed in Figma. It integrates ride-sharing features with an elegant vehicle renting platform, detailing booking calendars, custom category listing grids, maps, and transaction flows.',
    stack: ['Figma', 'UI/UX Design', 'Mobile UI', 'Prototyping'],
    tag: 'mobile', 
    color: '#e0f2fe',
    liveUrl: 'https://www.figma.com/design/aMg7ZYlSnWVT6HDl3Gnkze/QMB-Mobile-App---Ride-Sharing-App?node-id=3311-3&t=l81LMKeCOi61byez-1',
    githubUrl: '#',
    keyFeatures: ['Streamlined vehicle booking & rental workflows', 'Clean layout configurations for various ride types', 'Intuitive search and category navigation'],
    challenges: 'Designing a dense layout with multiple options (renting durations, pricing details) while keeping it clean and easy to navigate on mobile.'
  },
];

const projectsGrid = document.getElementById('projectsGrid');

function renderProjects(filter) {
  projectsGrid.innerHTML = '';
  projects.forEach((p, i) => {
    const show = filter === 'all' || p.tag === filter;
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    if (!show) card.setAttribute('data-hidden', 'true');
    card.style.setProperty('--i', i);
    card.setAttribute('data-tag', p.tag);
    
    // Inject dynamic HTML with Lucide vector icons instead of stickers
    const isMobile = p.tag === 'mobile';
    card.innerHTML = `
      <div class="project-img-wrap">
        <div class="project-img-placeholder" style="width:100%;height:100%;background:${p.color};display:flex;align-items:center;justify-content:center;">
          <i data-lucide="${isMobile ? 'smartphone' : 'monitor'}" style="width: 56px; height: 56px; stroke-width: 1; color: var(--text-muted); opacity: 0.35;"></i>
        </div>
        <div class="project-overlay">
          <button class="project-overlay-btn btn-modal" aria-label="Open project details">
            <i data-lucide="eye"></i>
          </button>
          <a href="${p.liveUrl || '#'}" target="_blank" rel="noopener" class="project-overlay-btn" aria-label="View live prototype">
            <i data-lucide="external-link"></i>
          </a>
        </div>
      </div>
      <div class="project-body">
        <span class="project-tag">
          <i data-lucide="${isMobile ? 'smartphone' : 'globe'}" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
          ${isMobile ? 'Mobile Design' : 'Web Application'}
        </span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-stack">
          ${p.stack.slice(0, 3).map(s => `<span>${s}</span>`).join('')}
          ${p.stack.length > 3 ? `<span>+${p.stack.length - 3}</span>` : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openModal(i);
    });

    projectsGrid.appendChild(card);
  });
  
  // Re-initialize dynamic icons, cursor hovers, and tilts
  if (window.lucide) window.lucide.createIcons();
  initCursorHovers();
  init3DTilt();
  refreshReveals();
}

// Filter button binds
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

/* ── PROJECT DETAIL MODAL CONTROLLER ─────────── */
const projectModalOverlay = document.getElementById('projectModalOverlay');
const projectModalContent = document.getElementById('projectModalContent');
const closeProjectModal = document.getElementById('closeProjectModal');

function openModal(projectIndex) {
  const p = projects[projectIndex];
  const isMobile = p.tag === 'mobile';
  
  const previewHtml = `
    <div style="width:100%;height:100%;background:${p.color};display:flex;align-items:center;justify-content:center;border-radius:12px;box-shadow:inset 0 0 100px rgba(0,0,0,0.05)">
      <i data-lucide="${isMobile ? 'smartphone' : 'monitor'}" style="width: 80px; height: 80px; stroke-width: 1; color: var(--text-muted); opacity: 0.25;"></i>
    </div>
  `;

  const featuresList = p.keyFeatures ? p.keyFeatures.map(f => `<li>${f}</li>`).join('') : '';
  const featuresHtml = featuresList ? `
    <div style="margin-top: 15px;">
      <h4 class="modal-meta-title">Key Features</h4>
      <ul style="margin-left: 20px; color: var(--text-secondary); font-size: 14.5px; display: flex; flex-direction: column; gap: 8px; list-style-type: square;">
        ${featuresList}
      </ul>
    </div>
  ` : '';

  const challengesHtml = p.challenges ? `
    <div style="margin-top: 15px;">
      <h4 class="modal-meta-title">Design Challenges & Solutions</h4>
      <p class="modal-desc" style="font-size: 14.5px">${p.challenges}</p>
    </div>
  ` : '';

  projectModalContent.innerHTML = `
    <div class="modal-project-img">
      ${previewHtml}
    </div>
    <div class="modal-grid">
      <div class="modal-left">
        <h3 class="modal-title">${p.title}</h3>
        <p class="modal-desc" style="font-size: 16px">${p.longDesc || p.desc}</p>
        ${featuresHtml}
        ${challengesHtml}
      </div>
      <div class="modal-right">
        <div>
          <h4 class="modal-meta-title">Tech Stack & Tools</h4>
          <div class="modal-tags">
            ${p.stack.map(s => `<span>${s}</span>`).join('')}
          </div>
        </div>
        <div>
          <h4 class="modal-meta-title">Platform Category</h4>
          <span style="font-size: 14px; font-weight: 700; color: var(--accent-primary); display: flex; align-items: center; gap: 6px;">
            <i data-lucide="${isMobile ? 'smartphone' : 'globe'}" style="width: 16px; height: 16px;"></i>
            ${isMobile ? 'Mobile App Interface' : 'Web Application'}
          </span>
        </div>
        <div class="modal-actions">
          <a href="${p.liveUrl || '#'}" target="_blank" class="btn-primary">
            View Live Prototype
            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
          </a>
          ${p.githubUrl && p.githubUrl !== '#' ? `
            <a href="${p.githubUrl}" target="_blank" class="btn-secondary">
              View Repository
              <i data-lucide="github" style="width: 16px; height: 16px;"></i>
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  projectModalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();
  initCursorHovers();
}

function closeModal() {
  projectModalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

closeProjectModal.addEventListener('click', closeModal);
projectModalOverlay.addEventListener('click', (e) => {
  if (e.target === projectModalOverlay) closeModal();
});

/* ── INTERACTIVE CV DRAWER ────────────────────── */
const viewCvBtn = document.getElementById('viewCvBtn');
const closeCvDrawer = document.getElementById('closeCvDrawer');
const cvDrawerOverlay = document.getElementById('cvDrawerOverlay');
const printCvBtn = document.getElementById('printCvBtn');

function openCvDrawer() {
  cvDrawerOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCvDrawerFunc() {
  cvDrawerOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (viewCvBtn) viewCvBtn.addEventListener('click', openCvDrawer);
if (closeCvDrawer) closeCvDrawer.addEventListener('click', closeCvDrawerFunc);
if (cvDrawerOverlay) {
  cvDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cvDrawerOverlay) closeCvDrawerFunc();
  });
}
if (printCvBtn) {
  printCvBtn.addEventListener('click', () => {
    window.print();
  });
}

// Global escape key listener
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeCvDrawerFunc();
  }
});


/* ── CONTACT FORM (Web3Forms Submission) ──────── */
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitContactBtn');
const submitBtnText = submitBtn ? submitBtn.querySelector('.btn-send-text') : null;
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    if (accessKeyInput && accessKeyInput.value === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
      alert('Please configure your Web3Forms access key in index.html before sending messages.');
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    const originalText = submitBtnText ? submitBtnText.textContent : 'Send Message';
    if (submitBtnText) submitBtnText.textContent = 'Sending...';

    const formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          if (formSuccess) {
            formSuccess.textContent = '✅ Message sent successfully! Thank you.';
            formSuccess.classList.add('show');
          }
          contactForm.reset();
          setTimeout(() => {
            if (formSuccess) formSuccess.classList.remove('show');
          }, 5000);
        } else {
          alert('Something went wrong: ' + (data.message || 'Please try again later.'));
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please check your connection and try again.');
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
      });
  });
}

/* ── INITIALIZE ALL FUNCTIONS ────────────────── */
renderSkills();
renderProjects('all');
initCursorHovers();
init3DTilt();
refreshReveals();

if (window.lucide) window.lucide.createIcons();

