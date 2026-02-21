/* ===========================
   ADAM — Ultra-Modern Script
   Three.js + GSAP ScrollTrigger
   =========================== */

'use strict';

// ── Register GSAP Plugin ──
gsap.registerPlugin(ScrollTrigger);

// ── Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbar();
  initMobileMenu();
  initHeroCanvas();
  initSkillOrbs();
  initTypingEffect();
  initHeroEntrance();
  initParticleCursor();
  initMagneticButtons();
  initComparisonSection();
  initSkillCards();
  initHowSteps();
  initPricingCard();
  initSecurityCards();
  initParallax();
  initContactForm();
  setTimeout(() => ScrollTrigger.refresh(), 500);
});

/* =====================
   1. SCROLL PROGRESS
   ===================== */
function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* =====================
   2. NAVBAR
   ===================== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Smooth nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu if open
        document.getElementById('mobile-menu').classList.remove('open');
      }
    });
  });
}

/* =====================
   3. MOBILE MENU
   ===================== */
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

/* =====================
   4. THREE.JS HERO CANVAS
   ===================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 5;

  function resize() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Particle Network ──
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 18;
    positions[i3 + 1] = (Math.random() - 0.5) * 12;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    // Cyan to purple color mix
    const t = Math.random();
    colors[i3]     = t * 0.44 + (1 - t) * 0;
    colors[i3 + 1] = t * 0.31 + (1 - t) * 0.96;
    colors[i3 + 2] = t * 1    + (1 - t) * 1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ── Connecting Lines (sparse grid) ──
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.05,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // Create a sparse set of lines between nearby particles
  const linePositions = [];
  const lineThreshold = 2.0;
  const maxLines = 300;
  let lineCount = 0;

  for (let i = 0; i < particleCount && lineCount < maxLines; i++) {
    for (let j = i + 1; j < particleCount && lineCount < maxLines; j++) {
      const dx = positions[i*3] - positions[j*3];
      const dy = positions[i*3+1] - positions[j*3+1];
      const dz = positions[i*3+2] - positions[j*3+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < lineThreshold) {
        linePositions.push(
          positions[i*3], positions[i*3+1], positions[i*3+2],
          positions[j*3], positions[j*3+1], positions[j*3+2]
        );
        lineCount++;
      }
    }
  }

  if (linePositions.length > 0) {
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);
  }

  // ── Mouse Parallax ──
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Animate ──
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    particles.rotation.y += 0.0008;
    particles.rotation.x += 0.0003;

    // Gentle camera drift toward mouse
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    // Pulse opacity
    mat.opacity = 0.55 + Math.sin(frame * 0.02) * 0.15;

    renderer.render(scene, camera);
  }
  animate();
}

/* =====================
   5. SKILL ORBS ANIMATION
   ===================== */
function initSkillOrbs() {
  const orbs = document.querySelectorAll('.skill-orb');
  if (!orbs.length) return;

  // Random starting positions spread across the whole container
  const startPositions = [
    { x: 8,  y: 12 }, { x: 88, y: 8  }, { x: 15, y: 78 },
    { x: 82, y: 72 }, { x: 45, y: 5  }, { x: 5,  y: 45 },
    { x: 92, y: 38 }, { x: 50, y: 85 }, { x: 28, y: 55 },
    { x: 70, y: 25 }, { x: 35, y: 20 }, { x: 60, y: 65 },
    { x: 18, y: 35 }, { x: 78, y: 55 }, { x: 42, y: 70 },
  ];

  orbs.forEach((orb, i) => {
    const startPos = startPositions[i % startPositions.length];

    // Each orb gets a unique random drift path
    const driftX1 = (Math.random() - 0.5) * 60;
    const driftY1 = (Math.random() - 0.5) * 40;
    const driftX2 = (Math.random() - 0.5) * 60;
    const driftY2 = (Math.random() - 0.5) * 40;
    const driftX3 = (Math.random() - 0.5) * 60;
    const driftY3 = (Math.random() - 0.5) * 40;

    const duration = 12 + Math.random() * 10;
    const delay = i * 0.15;

    gsap.set(orb, {
      position: 'absolute',
      left: startPos.x + '%',
      top: startPos.y + '%',
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
      scale: 0,
    });

    // Entrance animation
    gsap.to(orb, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      delay: 1.5 + delay,
      ease: 'back.out(2)',
    });

    // Random floating animation — looping through random waypoints
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const randomFlight = () => {
      const nx = clamp(startPos.x + driftX1 + (Math.random() - 0.5) * 30, 3, 96);
      const ny = clamp(startPos.y + driftY1 + (Math.random() - 0.5) * 20, 3, 93);
      gsap.to(orb, {
        left: nx + '%',
        top: ny + '%',
        duration: duration * (0.7 + Math.random() * 0.6),
        ease: 'sine.inOut',
        delay: 1.5 + delay,
        onComplete: randomFlight,
      });
    };
    // Start slightly offset so they don't all move at once
    gsap.delayedCall(1.5 + delay + Math.random() * 2, randomFlight);
  });
}

/* =====================
   6. TYPING EFFECT
   ===================== */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Automatisiert. Intelligent. Immer verfügbar.',
    '💬 WhatsApp — immer erreichbar.',
    '✈️ Telegram — blitzschnell.',
    '🔒 Signal — sicher & privat.',
    '🎮 Discord — für jede Community.',
    '📱 Alle Messenger. Ein Assistent.',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let delay = 80;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        delay = 2000;
      } else {
        delay = 55 + Math.random() * 40;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        delay = 400;
      } else {
        delay = 30;
      }
    }
    setTimeout(type, delay);
  }

  setTimeout(type, 2000);
}

/* =====================
   7. HERO ENTRANCE
   ===================== */
function initHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    .fromTo('.hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, '-=0.4')
    .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .fromTo('.hero-stats', { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-ctas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo('.hero-scroll-hint', { opacity: 0 }, { opacity: 0.5, duration: 1 }, '-=0.2');
}

/* =====================
   8. PARTICLE CURSOR
   ===================== */
function initParticleCursor() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, { passive: true });

  let particles = [];
  let mouse = { x: -200, y: -200 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn particles
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 10,
        y: mouse.y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        life: 1,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '0,245,255' : '180,79,255',
      });
    }
  }, { passive: true });

  function animateCursor() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      p.size *= 0.96;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.life * 0.7})`;
      ctx.fill();
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

/* =====================
   9. MAGNETIC BUTTONS
   ===================== */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* =====================
   10. COMPARISON SECTION
   ===================== */
function initComparisonSection() {
  // Slide in cards
  gsap.fromTo('#comp-old',
    { opacity: 0, x: -100, rotation: -5 },
    {
      opacity: 1, x: 0, rotation: 0, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#comparison',
        start: 'top 85%',
      }
    }
  );

  gsap.fromTo('#comp-new',
    { opacity: 0, x: 100, rotation: 5 },
    {
      opacity: 1, x: 0, rotation: 0, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#comparison',
        start: 'top 85%',
      }
    }
  );

  // Counter animations
  const counterOld = document.getElementById('counter-old');
  const counterNew = document.getElementById('counter-new');
  const counterSavings = document.getElementById('counter-savings');

  function animateCounter(el, target, duration, suffix) {
    gsap.to({ val: 0 }, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: function() {
        const v = Math.round(this.targets()[0].val);
        el.textContent = v.toLocaleString('de-DE') + (suffix || '');
      }
    });
  }

  ScrollTrigger.create({
    trigger: '#comparison',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      animateCounter(counterOld, 4000, 2.5, '');
      setTimeout(() => animateCounter(counterNew, 650, 2, ''), 400);
      setTimeout(() => animateCounter(counterSavings, 40200, 2.2, ''), 800);
    }
  });
}

/* =====================
   11. SKILL CARDS
   ===================== */
function initSkillCards() {
  const cards = document.querySelectorAll('.skill-card');
  const origins = [
    [-200, -200, -15], [200, -200, 15], [-200, -150, -10], [200, -150, 10],
    [-200, 200, -15],  [200, 200, 15],  [-200, 150, -8],   [200, 150, 8],
    [0, -250, -20],    [0, 250, 20],
  ];

  cards.forEach((card, i) => {
    const origin = origins[i] || [0, 0, 0];
    gsap.set(card, {
      x: origin[0],
      y: origin[1],
      rotation: origin[2],
      opacity: 0,
    });

    gsap.to(card, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1,
      ease: 'back.out(1.5)',
      delay: i * 0.08,
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 85%',
      }
    });
  });

  // 3D Tilt on hover
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = (e.clientY - cy) / (rect.height / 2) * -12;
      const ry = (e.clientX - cx) / (rect.width / 2) * 12;
      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });

      // Move shine
      const shine = card.querySelector('.card-shine');
      if (shine) {
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.08), transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/* =====================
   12. HOW STEPS
   ===================== */
function initHowSteps() {
  const steps = document.querySelectorAll('.step-item');
  steps.forEach((step, i) => {
    gsap.fromTo(step,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0,
        duration: 0.8,
        delay: i * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#how',
          start: 'top 85%',
        }
      }
    );
  });
}

/* =====================
   13. PRICING CARD
   ===================== */
function initPricingCard() {
  gsap.fromTo('#pricing-card',
    { opacity: 0, y: 80, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#pricing',
        start: 'top 85%',
      }
    }
  );

  gsap.fromTo('.pricing-comparison-mini',
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#pricing',
        start: 'top 85%',
      }
    }
  );
}

/* =====================
   14. SECURITY CARDS
   ===================== */
function initSecurityCards() {
  const cards = document.querySelectorAll('.security-card');
  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '#security',
          start: 'top 85%',
        }
      }
    );
  });
}

/* =====================
   15. PARALLAX
   ===================== */
function initParallax() {
  document.querySelectorAll('.bg-orb').forEach((orb, i) => {
    const speed = 0.2 + i * 0.1;
    gsap.to(orb, {
      y: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: orb.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });
}

/* =====================
   16. CONTACT FORM
   ===================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit span');
    if (btn) {
      btn.textContent = '✓ Gesendet!';
      gsap.to(form.querySelector('.form-submit'), {
        background: 'linear-gradient(135deg, #00cc88, #00f5cc)',
        duration: 0.5,
      });
    }
    // Open mailto
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;
    const subject = encodeURIComponent('ADAM Erstgespräch — ' + name);
    const body = encodeURIComponent(`Name: ${name}\nE-Mail: ${email}\n\n${message}`);
    window.location.href = `mailto:a.d.a.m@agentmail.to?subject=${subject}&body=${body}`;
  });

  // Animate form in
  gsap.fromTo('.contact-form',
    { opacity: 0, x: -60 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    }
  );

  gsap.fromTo('.contact-direct',
    { opacity: 0, x: 60 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      delay: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 85%',
      }
    }
  );
}

/* =====================
   SECTION TITLE ANIMATIONS
   ===================== */
document.querySelectorAll('.section-title, .section-eyebrow').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      }
    }
  );
});

document.querySelectorAll('.section-desc').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      delay: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      }
    }
  );
});

