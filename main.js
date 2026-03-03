/* ───────────────────────────────────────────────
   MAIN.JS — Portfolio Interactivity
─────────────────────────────────────────────── */

/* ── URL CLEANER (SECURITY) ─────────────────── */
// Removes query params immediately to prevent data/email leak in URL
if (window.location.search) {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
}

/* ── CURSOR GLOW ──────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

/* ── NAVBAR SCROLL ────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── HAMBURGER MENU ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ── SMOOTH ACTIVE NAV LINK ───────────────────── */
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
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

/* ── REVEAL ON SCROLL ─────────────────────────── */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObserver.observe(r));

/* ── COUNTER ANIMATION ────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

/* ── SKILLS DATA & RENDER ─────────────────────── */
const allSkills = [
  { icon: 'devicon-html5-plain colored', name: 'HTML' },
  { icon: 'devicon-css3-plain colored', name: 'CSS' },
  { icon: 'devicon-javascript-plain colored', name: 'JavaScript' },
  { icon: 'devicon-dot-net-plain-wordmark colored', name: '.NET' },
  { icon: 'devicon-laravel-plain colored', name: 'Laravel' },
  { icon: 'devicon-figma-plain colored', name: 'Figma' },
  { icon: 'devicon-canva-original colored', name: 'Canva' },
  { icon: 'devicon-github-original', name: 'GitHub' },
  { icon: 'devicon-jira-plain colored', name: 'Jira' },
  { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="width:2rem;height:2rem;color:#f59e0b"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>`, name: 'SEO' },
];

const skillsGrid = document.getElementById('skillsGrid');

function renderSkills() {
  skillsGrid.innerHTML = '';
  allSkills.forEach((skill, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.style.animationDelay = `${i * 0.09}s`;
    const iconHtml = skill.svg
      ? skill.svg
      : `<i class="${skill.icon}"></i>`;
    card.innerHTML = `${iconHtml}<span>${skill.name}</span>`;
    skillsGrid.appendChild(card);
  });
}



/* ── PROJECTS DATA & RENDER ───────────────────── */
// Use colored gradient backgrounds as placeholders
const projectColors = [
  'linear-gradient(135deg,#1e1b4b,#312e81,#4338ca)',
  'linear-gradient(135deg,#0f172a,#1e3a5f,#1d4ed8)',
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#1a0533,#3d1168,#7c3aed)',
  'linear-gradient(135deg,#0d1b2a,#1b4332,#059669)',
  'linear-gradient(135deg,#1c0000,#450a0a,#dc2626)',
];

const projects = [
  {
    title: 'Luxury Nepal — Travel App UI',
    desc: 'A complete Travel App UI/UX design built in Figma — featuring destination discovery, booking flows, itinerary planning, and a vibrant, modern visual identity celebrating Nepal.',
    stack: ['Figma', 'UI Design', 'Prototyping', 'User Flows'],
    tag: 'web', color: 'linear-gradient(135deg,#0f2027,#1a4a3a,#059669)',
    liveUrl: 'https://www.figma.com/design/6PPUwGoz1CffPnE4MeCow0/Untitled?node-id=428-706&t=TnFhXAsnV08EoMuK-1',
    githubUrl: '#', featured: true,
  },
  {
    title: 'Purito — Skincare App UI',
    desc: 'A clean and elegant Skincare App UI designed in Figma — featuring product discovery, skin type quiz, ingredient explorer, and a soft, premium aesthetic.',
    stack: ['Figma', 'UI Design', 'Mobile UI', 'Prototyping'],
    tag: 'web', color: 'linear-gradient(135deg,#2d1b4e,#6b2fa0,#c084fc)',
    liveUrl: 'https://www.figma.com/design/6PPUwGoz1CffPnE4MeCow0/Untitled?node-id=2203-7959&t=hUQ0B1TAfxttXVfx-1',
    githubUrl: '#',
  },
  {
    title: 'Audely — Mobile App UI',
    desc: 'A sleek and modern mobile app UI designed in Figma — thoughtfully crafted user flows, clean layouts, and an intuitive interactive prototype.',
    stack: ['Figma', 'Mobile UI', 'Prototyping', 'User Flows'],
    tag: 'mobile', color: 'linear-gradient(135deg,#0f172a,#1e3a5f,#0ea5e9)',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=244-832&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
  },
  {
    title: 'Fresh Bakey — Food App UI',
    desc: 'A warm and appetizing Food Delivery & Bakery app UI — featuring menu browsing, order flows, and a delightful visual design crafted in Figma.',
    stack: ['Figma', 'UI Design', 'Prototyping', 'Mobile UI'],
    tag: 'web', color: 'linear-gradient(135deg,#431407,#9a3412,#f97316)',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=1552-1488&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
  },
  {
    title: 'Nipuna Prabidhik Sewa — Website Design',
    desc: 'A professional website design for Nipuna Prabidhik Sewa — clean layout, modern UI components, and a user-friendly structure built in Figma.',
    stack: ['Figma', 'Web Design', 'UI Design', 'Prototyping'],
    tag: 'web', color: 'linear-gradient(135deg,#0c1445,#1e3a8a,#3b82f6)',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=0-1&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
  },
  {
    title: 'Nipuna Prabidhik Sewa — Website Design',
    desc: 'A complete supermarket e-commerce website design in Figma — product listings, categories, cart flow, and a clean, accessible shopping experience.',
    stack: ['Figma', 'Web Design', 'E-Commerce UI', 'Prototyping'],
    tag: 'web', color: 'linear-gradient(135deg,#052e16,#166534,#22c55e)',
    liveUrl: 'https://www.figma.com/design/MeQ4tExf6vHtKaoqykMHsN/Untitled?node-id=0-1&t=7Rhx7lBfD9mjq0IJ-1',
    githubUrl: '#',
  },
  {
    title: 'MoodDiary — .NET Web App',
    desc: 'A mood tracking web application built with ASP.NET — lets users log daily moods, write journal entries, and visualise emotional patterns over time.',
    stack: ['.NET', 'C#', 'ASP.NET', 'HTML/CSS'],
    tag: 'web', color: 'linear-gradient(135deg,#1a0533,#4c1d95,#7c3aed)',
    liveUrl: 'https://github.com/Nirjala34/MoodDiary/tree/main',
    githubUrl: 'https://github.com/Nirjala34/MoodDiary/tree/main',
  },
  {
    title: 'Redesigning QMB — Mobile App UI',
    desc: 'Redesigned the mobile app UI originally created by a senior designer — improved visual hierarchy, modernised components, and enhanced the overall user experience in Figma.',
    stack: ['Figma', 'Mobile UI', 'Prototyping', 'User Flows'],
    tag: 'mobile', color: 'linear-gradient(135deg,#0c1a2e,#0e4a6e,#0891b2)',
    liveUrl: 'https://www.figma.com/design/djJuCQnfQol4E4QeGDAxVa/QMB-Mobile-App?node-id=3311-3&t=C7StpmhLZ1zvUq6g-1',
    githubUrl: '#',
  },
  {
    title: 'AI Spam Detection Filter',
    desc: 'A machine learning spam detection model built with Python in Jupyter Notebook — classifies messages as spam or ham using NLP techniques and trained on real email datasets.',
    stack: ['Python', 'Jupyter Notebook', 'Machine Learning', 'NLP'],
    tag: 'web', color: 'linear-gradient(135deg,#1c1007,#78350f,#d97706)',
    liveUrl: 'https://github.com/Nirjala34/AICoursework2_NirjalaShrestha',
    githubUrl: 'https://github.com/Nirjala34/AICoursework2_NirjalaShrestha',
  },
];

const projectsGrid = document.getElementById('projectsGrid');
function renderProjects(filter) {
  projectsGrid.innerHTML = '';
  projects.forEach((p, i) => {
    const show = filter === 'all' || p.tag === filter;
    const card = document.createElement('div');
    card.className = 'project-card' + (i === 0 && filter === 'all' ? ' featured' : '');
    if (!show) card.setAttribute('data-hidden', 'true');
    card.setAttribute('data-tag', p.tag);
    card.innerHTML = `
      <div class="project-img-wrap">
        <div style="width:100%;height:100%;background:${p.color};display:flex;align-items:center;justify-content:center;">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
        <div class="project-overlay">
          <a href="${p.liveUrl || '#'}" target="_blank" rel="noopener" aria-label="View Design / Live Demo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          <a href="${p.githubUrl || '#'}" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </div>
      </div>
      <div class="project-body">
        <span class="project-tag ${p.tag}">${p.tag === 'design' ? '🎨 Design' : p.tag === 'mobile' ? '📱 Mobile' : '🌐 Web'}</span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-stack">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
      </div>`;
    projectsGrid.appendChild(card);
  });
}


document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

/* Mouse aura on project cards */
projectsGrid.addEventListener('mousemove', (e) => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
  card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
});

/* ── TESTIMONIALS ─────────────────────────────── */
const testimonials = [
  {
    text: "Nirjala's designs are stunning. She understood our brand instantly and delivered a Figma prototype that made our whole team say 'wow'. Incredibly talented designer.",
    name: 'Sarah Chen', role: 'Founder @ Luminary', stars: 5,
  },
  {
    text: "The frontend she built for our landing page was pixel-perfect from the design file. Fast, clean, and beautiful. We saw a 40% increase in conversions after launch.",
    name: 'Marcus Williams', role: 'Marketing Lead @ Bloom', stars: 5,
  },
  {
    text: "Nirjala has a rare ability to think both as a designer and a developer. The component library she built in Figma translated seamlessly into our React codebase.",
    name: 'Priya Kapoor', role: 'CTO @ Aura Studio', stars: 5,
  },
  {
    text: "She redesigned our mobile app UI from scratch and the result was breathtaking. User satisfaction scores went up 60% after the redesign. Highly recommend!",
    name: "James O'Brien", role: 'Product Manager @ Pulse', stars: 5,
  },
];

const track = document.getElementById('testimonialsTrack');
const dotsEl = document.getElementById('testimonialDots');
let currentSlide = 0;

function initTestimonials() {
  testimonials.forEach((t) => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.innerHTML = `
      <div class="tc-stars">${'★'.repeat(t.stars)}</div>
      <p class="tc-text">"${t.text}"</p>
      <div class="tc-author">
        <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#8B5CF6,#3B82F6);display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:1.1rem;">${t.name[0]}</div>
        <div><div class="tc-author-name">${t.name}</div><div class="tc-author-role">${t.role}</div></div>
      </div>`;
    track.appendChild(card);
  });

  testimonials.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });
}

function goTo(idx) {
  currentSlide = idx;
  const cardWidth = track.querySelector('.testimonial-card').offsetWidth + 24;
  track.style.transform = `translateX(-${cardWidth * idx}px)`;
  document.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}


/* Interval managed in INITIALIZE block below */

/* ── CONTACT FORM ─────────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitContactBtn');
  const txt = btn.querySelector('.btn-send-text');
  const successMsg = document.getElementById('formSuccess');
  // Using FormSubmit.co - Easy and free! 
  // No account needed, just click the confirmation link in your Gmail the FIRST time someone sends a message.
  const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/pratistha708@gmail.com';

  txt.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(FORMSUBMIT_URL, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      successMsg.classList.add('show');
      successMsg.innerHTML = '✅ Sent! Please check your Gmail (pratistha708@gmail.com) and CLICK THE CONFIRMATION LINK from FormSubmit to activate your form.';
      form.reset();
    } else {
      throw new Error('Oops! Something went wrong.');
    }
  } catch (error) {
    alert('Failed to send! Please email me directly at pratistha708@gmail.com');
  } finally {
    txt.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => successMsg.classList.remove('show'), 8000);
  }
});

/* ── INITIALIZE ──────────────────────────────── */
renderSkills();
renderProjects('all');
initTestimonials();
setInterval(() => goTo((currentSlide + 1) % testimonials.length), 4200);
