/* ============================================================
   SAYOOJYA DAS — PORTFOLIO SCRIPT v2
   Three.js 3D Background + All Interactivity
   ============================================================ */

'use strict';

/* ═══════════════════════════════════════════
   THREE.JS 3D BACKGROUND
   Floating wireframe geometries, glowing lines
   ═══════════════════════════════════════════ */
function initThreeBackground() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.z = 30;

  // ── Solar Teal color palette for 3D meshes
  const colors = [0x00c9b1, 0xff7b2c, 0xb8ff00, 0x38bdf8, 0xff4757, 0xffc125];

  // ── Floating Wireframe Geometries
  const meshes = [];
  const geoTypes = [
    () => new THREE.IcosahedronGeometry(1.4, 0),
    () => new THREE.OctahedronGeometry(1.2, 0),
    () => new THREE.TetrahedronGeometry(1.3, 0),
    () => new THREE.DodecahedronGeometry(1.2, 0),
    () => new THREE.TorusGeometry(1.0, 0.35, 8, 16),
    () => new THREE.TorusKnotGeometry(0.8, 0.28, 80, 8),
    () => new THREE.BoxGeometry(1.6, 1.6, 1.6),
    () => new THREE.ConeGeometry(0.9, 1.8, 6),
  ];

  const positions = [
    [-14, 8, -8], [12, 10, -12], [-8, -9, -6],
    [10, -8, -10], [-16, 2, -14], [16, -3, -10],
    [0, 12, -15], [-4, -12, -12], [14, 5, -6],
    [-11, -5, -8], [6, -14, -8], [-18, -8, -16],
  ];

  positions.forEach((pos, i) => {
    const geoFn = geoTypes[i % geoTypes.length];
    const geo = geoFn();
    const color = colors[i % colors.length];

    // Wireframe
    const wireMat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      opacity: 0.18 + (i % 3) * 0.06,
      transparent: true,
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.position.set(...pos);
    wireMesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.008,
      rotSpeedY: (Math.random() - 0.5) * 0.012,
      rotSpeedZ: (Math.random() - 0.5) * 0.006,
      floatAmp: 0.6 + Math.random() * 0.8,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: pos[1],
    };
    scene.add(wireMesh);
    meshes.push(wireMesh);

    // Solid glow overlay (semi-transparent faces)
    if (i % 3 === 0) {
      const solidMat = new THREE.MeshBasicMaterial({
        color,
        opacity: 0.04,
        transparent: true,
      });
      const solidMesh = new THREE.Mesh(geo.clone(), solidMat);
      solidMesh.position.set(...pos);
      scene.add(solidMesh);
    }
  });

  // ── Particle Field
  const particleCount = 300;
  const particleGeo = new THREE.BufferGeometry();
  const positions3 = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions3[i * 3]     = (Math.random() - 0.5) * 80;
    positions3[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions3[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    pColors[i * 3]     = c.r;
    pColors[i * 3 + 1] = c.g;
    pColors[i * 3 + 2] = c.b;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions3, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ── Glowing Connecting Lines (sparse grid)
  const lineGeo = new THREE.BufferGeometry();
  const lineVerts = [];
  const lineColorArr = [];
  for (let i = 0; i < 30; i++) {
    const x1 = (Math.random() - 0.5) * 60, y1 = (Math.random() - 0.5) * 40, z1 = -10 - Math.random() * 10;
    const x2 = x1 + (Math.random() - 0.5) * 15;
    const y2 = y1 + (Math.random() - 0.5) * 10;
    const z2 = z1 + (Math.random() - 0.5) * 5;
    lineVerts.push(x1, y1, z1, x2, y2, z2);
    const c = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
    lineColorArr.push(c.r, c.g, c.b, c.r * 0.3, c.g * 0.3, c.b * 0.3);
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lineVerts), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColorArr), 3));
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 });
  const lineSet = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSet);

  // ── Big Background Torus (subtle)
  const bgTorus = new THREE.Mesh(
    new THREE.TorusGeometry(14, 0.3, 6, 60),
    new THREE.MeshBasicMaterial({ color: 0x8b2fc9, wireframe: true, opacity: 0.06, transparent: true })
  );
  bgTorus.rotation.x = Math.PI / 4;
  bgTorus.position.z = -18;
  scene.add(bgTorus);

  const bgTorus2 = new THREE.Mesh(
    new THREE.TorusGeometry(20, 0.2, 4, 80),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, opacity: 0.05, transparent: true })
  );
  bgTorus2.rotation.y = Math.PI / 3;
  bgTorus2.position.z = -22;
  scene.add(bgTorus2);

  // ── Large icosphere in background
  const bgIco = new THREE.Mesh(
    new THREE.IcosahedronGeometry(8, 1),
    new THREE.MeshBasicMaterial({ color: 0x4f35d2, wireframe: true, opacity: 0.045, transparent: true })
  );
  bgIco.position.set(12, -5, -20);
  scene.add(bgIco);

  // ── Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── Animate
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    // Camera subtle parallax
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Rotate & float geometries
    meshes.forEach(m => {
      m.rotation.x += m.userData.rotSpeedX;
      m.rotation.y += m.userData.rotSpeedY;
      m.rotation.z += m.userData.rotSpeedZ;
      m.position.y = m.userData.baseY +
        Math.sin(t * m.userData.floatSpeed + m.userData.floatOffset) * m.userData.floatAmp;
    });

    // Slowly rotate particle cloud
    particles.rotation.y = t * 0.025;
    particles.rotation.x = t * 0.01;

    // Rotate bg rings
    bgTorus.rotation.z  = t * 0.04;
    bgTorus2.rotation.x = t * 0.03;
    bgIco.rotation.y    = t * 0.012;

    renderer.render(scene, camera);
  }
  animate();
}
/* ═══════════════════════════════════════════
   TAB SYSTEM
   ═══════════════════════════════════════════ */
function switchTab(tabId) {
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const section = document.getElementById(tabId);
  if (section) {
    section.style.display = tabId === 'home' ? 'flex' : 'block';
    requestAnimationFrame(() => section.classList.add('active'));
  }
  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(t => t.classList.add('active'));

  if (tabId === 'skills')   setTimeout(animateSkillBars, 500);
  if (tabId === 'projects') setTimeout(() => applyTilt('.proj-card'), 300);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(checkReveal, 250);
}

/* ═══════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════ */
function toggleMobileMenu() {
  document.getElementById('mobile-nav').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobile-nav').classList.remove('open');
}

/* ═══════════════════════════════════════════
   ABOUT CARD FLIP
   ═══════════════════════════════════════════ */
let aboutFlipped = false;
function flipAbout() {
  aboutFlipped = !aboutFlipped;
  document.getElementById('about-inner').style.transform = aboutFlipped ? 'rotateY(180deg)' : '';
}

/* ═══════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════ */
let toastTimer;
function showToast(msg, ms = 2600) {
  clearTimeout(toastTimer);
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

function copyToClipboard(text) {
  const fn = () => showToast('📋 Copied: ' + text);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(fn).catch(fn);
  } else {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    fn();
  }
}
function copyEmail() { copyToClipboard('sayoojyadas323@gmail.com'); }

/* ═══════════════════════════════════════════
   TYPEWRITER
   ═══════════════════════════════════════════ */
const phrases = [
  'B.Tech CSE Student 🎓',
  'Problem Solver 🧩',
  'Tech Enthusiast 💻',
  'Strategic Thinker ♟️',
  'Future Developer 🚀',
  'Team Collaborator 🤝',
];
let pi = 0, ci = 0, deleting = false;

function typeWrite() {
  const el = document.getElementById('tw-text');
  if (!el) return;
  const phrase = phrases[pi];
  el.textContent = deleting ? phrase.slice(0, ci - 1) : phrase.slice(0, ci + 1);
  deleting ? ci-- : ci++;
  if (!deleting && ci === phrase.length) {
    deleting = true;
    setTimeout(typeWrite, 2200);
    return;
  }
  if (deleting && ci === 0) {
    deleting = false;
    pi = (pi + 1) % phrases.length;
  }
  setTimeout(typeWrite, deleting ? 55 : 85);
}

/* ═══════════════════════════════════════════
   CURSOR
   ═══════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  dot.style.left  = '-100px';
  dot.style.top   = '-100px';
  ring.style.left = '-100px';
  ring.style.top  = '-100px';

  function moveCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(moveCursor);
  }
  moveCursor();
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════ */
function checkReveal() {
  document.querySelectorAll('.section.active .reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50)
      el.classList.add('visible');
  });
}

/* ═══════════════════════════════════════════
   3D TILT ON CARDS
   ═══════════════════════════════════════════ */
function applyTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* ═══════════════════════════════════════════
   SKILLS DATA
   ═══════════════════════════════════════════ */
const techSkills = [
  { icon:'🐛', name:'Debugging',               cat:'Technical', level:80, color:'#8b2fc9',
    backTitle:'Logical Analysis', backDesc:'Debugging and logical problem solving for efficient code — identifying and resolving issues systematically.' },
  { icon:'🧩', name:'Problem Solving',          cat:'Technical', level:85, color:'#00d4ff',
    backTitle:'Algorithmic Thinking', backDesc:'Applying computational thinking to break complex problems into manageable, elegant solutions.' },
  { icon:'💬', name:'Technical Communication', cat:'Technical', level:78, color:'#ff3e6c',
    backTitle:'Clear Articulation', backDesc:'Ability to explain technical concepts clearly to both technical and non-technical audiences.' },
  { icon:'💻', name:'Software & Tools',         cat:'Technical', level:75, color:'#ffb731',
    backTitle:'Digital Proficiency', backDesc:'Excellent technical abilities with software tools and applications across multiple platforms.' },
];

const softSkills = [
  { icon:'🪞', name:'Self Awareness',    cat:'Soft Skill', level:90, color:'#8b2fc9',
    backTitle:'Emotional Intelligence', backDesc:'Deep understanding of personal strengths and growth areas, leading to continuous self-improvement.' },
  { icon:'💪', name:'Resilience',         cat:'Soft Skill', level:88, color:'#00e5a0',
    backTitle:'Bouncing Back', backDesc:'Ability to recover from setbacks and adapt to challenging circumstances with a positive mindset.' },
  { icon:'♟️', name:'Strategic Thinking', cat:'Soft Skill', level:82, color:'#00d4ff',
    backTitle:'Big Picture View', backDesc:'Planning ahead to achieve goals effectively, always considering long-term implications.' },
  { icon:'⚖️', name:'Decision Making',   cat:'Soft Skill', level:80, color:'#ff3e6c',
    backTitle:'Decisive Action', backDesc:'Evaluating options carefully and making informed decisions confidently even under pressure.' },
  { icon:'🤝', name:'Integrity',          cat:'Soft Skill', level:95, color:'#ffb731',
    backTitle:'Trustworthy', backDesc:'Unwavering commitment to honesty and ethical conduct in all professional and personal interactions.' },
  { icon:'⏰', name:'Time Management',    cat:'Soft Skill', level:85, color:'#d42bcc',
    backTitle:'Organised & Efficient', backDesc:'Excellent ability to prioritise tasks and manage time across diverse settings for maximum productivity.' },
];

function skillCardHTML(sk, i) {
  return `
    <div class="sk-card reveal rd${(i%5)+1} clickable"
         style="--sk-color:${sk.color}"
         onclick="toggleFlip(this)"
         title="Click or hover to flip"
         id="sk-${i}">
      <div class="sk-inner">
        <div class="sk-face sk-front">
          <div>
            <div class="sk-icon">${sk.icon}</div>
            <div class="sk-name">${sk.name}</div>
            <div class="sk-cat">${sk.cat}</div>
          </div>
          <div>
            <div class="sk-pct" style="text-align:left;margin-bottom:4px">${sk.name}</div>
            <div class="sk-bar-wrap"><div class="sk-bar" data-level="${sk.level}" style="background:${sk.color}"></div></div>
            <div class="sk-pct">${sk.level}%</div>
          </div>
        </div>
        <div class="sk-face sk-back">
          <div class="sk-back-title">${sk.backTitle}</div>
          <div class="sk-back-desc">${sk.backDesc}</div>
          <button class="btn btn-ghost btn-sm clickable" onclick="event.stopPropagation();this.closest('.sk-card').classList.remove('flipped')" style="margin-top:0.5rem;align-self:flex-start">↩ Back</button>
        </div>
      </div>
    </div>`;
}

function toggleFlip(card) { card.classList.toggle('flipped'); }

function renderSkills() {
  const tg = document.getElementById('tech-skills-grid');
  const sg = document.getElementById('soft-skills-grid');
  if (tg) tg.innerHTML = techSkills.map((s,i) => skillCardHTML(s,i)).join('');
  if (sg) sg.innerHTML = softSkills.map((s,i) => skillCardHTML(s, i + techSkills.length)).join('');
}

function animateSkillBars() {
  document.querySelectorAll('.sk-bar').forEach(bar => {
    bar.style.width = bar.dataset.level + '%';
  });
}

/* ═══════════════════════════════════════════
   EXPERIENCE DATA
   ═══════════════════════════════════════════ */
const experiences = [
  {
    icon: '⚙️',
    title: 'Tech Activities Participant',
    org: 'Technical Community Events',
    date: '2024 – Present',
    desc: 'Participated in various tech-related activities and team events, gaining hands-on exposure to real-world technical challenges and collaborative problem-solving environments.',
    tags: ['Tech Events', 'Problem Solving', 'Innovation', 'Learning'],
  },
  {
    icon: '🤝',
    title: 'Team Collaboration',
    org: 'Academic & Extracurricular Projects',
    date: '2023 – Present',
    desc: 'Worked successfully with diverse groups to accomplish goals and address issues related to products and services — fostering communication, strategic planning, and collective problem resolution.',
    tags: ['Teamwork', 'Communication', 'Goal Setting', 'Leadership'],
  },
];

function renderExperience() {
  const el = document.getElementById('timeline');
  if (!el) return;
  el.innerHTML = experiences.map((e, i) => `
    <div class="tl-item reveal rd${i+1}">
      <div class="tl-dot clickable" onclick="showToast('📌 ${e.title}')"></div>
      <div class="exp-card clickable" onclick="showToast('💼 ${e.title}')" id="ec-${i}">
        <div class="exp-icon">${e.icon}</div>
        <div class="exp-top">
          <div>
            <div class="exp-title">${e.title}</div>
            <div class="exp-org">${e.org}</div>
          </div>
          <div class="exp-date">${e.date}</div>
        </div>
        <div class="exp-desc">${e.desc}</div>
        <div class="exp-tags">
          ${e.tags.map(t => `<span class="exp-tag clickable" onclick="event.stopPropagation();showToast('🏷️ ${t}')">${t}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
  applyTilt('.exp-card');
}

/* ═══════════════════════════════════════════
   EDUCATION DATA
   ═══════════════════════════════════════════ */
const eduData = [
  {
    icon: '🎓',
    degree: 'Bachelor of Technology — Computer Science & Engineering',
    inst: 'LBSITW',
    period: '2025 – 2029',
    desc: 'Currently pursuing B.Tech CSE with an expected graduation in 2029. Focusing on core CS fundamentals, software engineering, algorithms, and emerging technologies.',
    status: 'active',
    badge: '🟢 Currently Enrolled',
    toast: '🎓 B.Tech CSE @ LBSITW — Expected 2029!',
  },
  {
    icon: '🏫',
    degree: 'Higher Secondary Schooling',
    inst: 'IMNSGHSS MAYYIL',
    period: 'Completed',
    desc: 'Completed schooling at IMNSGHSS MAYYIL, building a strong academic foundation before pursuing higher education in computer science.',
    status: 'done',
    badge: '✅ Completed',
    toast: '🏫 Schooling completed at IMNSGHSS MAYYIL!',
  },
];

function renderEducation() {
  const el = document.getElementById('edu-grid');
  if (!el) return;
  el.innerHTML = eduData.map((e, i) => `
    <div class="edu-card clickable reveal rd${i+1}" onclick="showToast('${e.toast}')" id="edu-${i}">
      <div class="edu-icon-wrap">${e.icon}</div>
      <div class="edu-degree">${e.degree}</div>
      <div class="edu-inst">${e.inst}</div>
      <div class="edu-period">📅 ${e.period}</div>
      <div class="edu-desc">${e.desc}</div>
      <div class="edu-badge ${e.status}"><span class="dot"></span> ${e.badge}</div>
    </div>`).join('');
  applyTilt('.edu-card');
}

/* ═══════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-success').classList.add('show');
    showToast('🎉 Message sent!');
  }, 1600);
}

function resetForm() {
  document.getElementById('contact-form').reset();
  document.getElementById('contact-form').style.display = 'block';
  document.getElementById('form-success').classList.remove('show');
  const btn = document.getElementById('submit-btn');
  btn.textContent = '🚀 Send Message';
  btn.disabled = false;
}

/* ═══════════════════════════════════════════
   ORB PARALLAX
   ═══════════════════════════════════════════ */
function initOrbParallax() {
  const orb = document.getElementById('orb-scene');
  if (!orb) return;
  document.addEventListener('mousemove', e => {
    if (!document.getElementById('home').classList.contains('active')) return;
    const dx = (e.clientX / window.innerWidth  - 0.5) * 18;
    const dy = (e.clientY / window.innerHeight - 0.5) * 14;
    orb.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}

/* ═══════════════════════════════════════════
   BUTTON RIPPLE
   ═══════════════════════════════════════════ */
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement('span');
      span.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - r.left}px;
        top:${e.clientY - r.top}px;
        transform:translate(-50%,-50%) scale(0);
        background:rgba(255,255,255,0.22);
        border-radius:50%;
        pointer-events:none;
        animation:ripple-anim 0.65s ease-out forwards;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });
  });

  const s = document.createElement('style');
  s.textContent = `@keyframes ripple-anim{to{transform:translate(-50%,-50%) scale(3.5);opacity:0}}`;
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Three.js background
  initThreeBackground();
  // Custom cursor
  initCursor();
  // Typewriter
  typeWrite();
  // Orb parallax
  initOrbParallax();
  // Render dynamic sections
  renderSkills();
  renderExperience();
  renderEducation();
  // Initial reveal
  setTimeout(checkReveal, 350);
  // Button ripples
  setTimeout(initRipple, 500);

  // Scroll + resize
  window.addEventListener('scroll', () => {
    checkReveal();
    updateScrollProgress();
  });
  window.addEventListener('resize', () => {
    checkReveal();
    updateScrollProgress();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    const tabs = ['home','about','skills','projects','experience','education','contact'];
    const active = document.querySelector('.nav-tab.active');
    if (!active) return;
    const idx = tabs.indexOf(active.dataset.tab);
    if (e.key === 'ArrowRight' && idx < tabs.length - 1) switchTab(tabs[idx + 1]);
    if (e.key === 'ArrowLeft'  && idx > 0)               switchTab(tabs[idx - 1]);
  });

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    const mn = document.getElementById('mobile-nav');
    const mb = document.getElementById('mob-btn');
    if (mn.classList.contains('open') && !mn.contains(e.target) && e.target !== mb)
      closeMobileMenu();
  });
});

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════ */
function updateScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const h = document.documentElement;
  const st = h.scrollTop || document.body.scrollTop;
  const sh = h.scrollHeight || document.body.scrollHeight;
  const percent = (st / (sh - h.clientHeight)) || 0;
  bar.style.transform = `scaleX(${percent})`;
}
