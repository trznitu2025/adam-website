/* ============================================
   ADAM Website — Ultra-Modern 2026 Scripts
   Three.js + GSAP + Custom Animations
   ============================================ */

'use strict';

// ── Custom Cursor ──────────────────────────────
function initCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(cursor);
  document.body.appendChild(follower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  // Hover effects
  document.querySelectorAll('a, button, .feature-card, .pricing-card, .skill-orb, .plan-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });
}

// ── Scroll Progress Bar ────────────────────────
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  }, { passive: true });
}

// ── Navbar ────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  btn && btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

// ── Three.js Hero Background ──────────────────
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  // ── Particle System ──
  const particleCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

    // Cyan & purple colors
    const isCyan = Math.random() > 0.4;
    if (isCyan) {
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.96;
      colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 0.66;
      colors[i * 3 + 1] = 0.33;
      colors[i * 3 + 2] = 0.97;
    }
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ── Network Lines (connecting nearby particles) ──
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
  });
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const sampleCount = 120;
  for (let i = 0; i < sampleCount; i++) {
    for (let j = i + 1; j < sampleCount; j++) {
      const ix = i * 3, jx = j * 3;
      const dx = positions[ix] - positions[jx];
      const dy = positions[ix+1] - positions[jx+1];
      const dz = positions[ix+2] - positions[jx+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < 120) {
        linePositions.push(positions[ix], positions[ix+1], positions[ix+2]);
        linePositions.push(positions[jx], positions[jx+1], positions[jx+2]);
      }
    }
  }
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lines = new THREE.LineSegments(lineGeo, lineMaterial);
  scene.add(lines);

  // ── ADAM Logo Glow Sphere ──
  const sphereGeo = new THREE.SphereGeometry(30, 32, 32);
  const sphereMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.03,
    wireframe: false,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  // Wireframe ring
  const ringGeo = new THREE.TorusGeometry(50, 0.5, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    transparent: true,
    opacity: 0.15,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.15;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(65, 0.3, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.1 })
  );
  ring2.rotation.x = -Math.PI * 0.2;
  ring2.rotation.y = Math.PI * 0.1;
  scene.add(ring2);

  // Mouse tracking
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    particles.rotation.y = time * 0.08 + mouseX * 0.1;
    particles.rotation.x = mouseY * 0.05 + Math.sin(time * 0.3) * 0.05;

    lines.rotation.y = particles.rotation.y;
    lines.rotation.x = particles.rotation.x;

    ring.rotation.z = time * 0.3;
    ring.rotation.y = time * 0.1;
    ring2.rotation.z = -time * 0.2;
    ring2.rotation.x = Math.sin(time) * 0.1 - Math.PI * 0.2;

    sphere.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

    renderer.render(scene, camera);
  }
  animate();
}

// ── Floating Skill Orbs ────────────────────────
function initFloatingOrbs() {
  const orbs = document.querySelectorAll('.skill-orb');
  if (!orbs.length) return;

  const heroRect = document.getElementById('hero');
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const orbData = Array.from(orbs).map((orb, i) => {
    const angle = (i / orbs.length) * Math.PI * 2;
    const radius = 200 + Math.random() * 60;
    return {
      el: orb,
      angle: angle,
      radius: radius,
      speed: 0.3 + Math.random() * 0.2,
      floatAmp: 10 + Math.random() * 15,
      floatSpeed: 0.8 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2,
    };
  });

  let time = 0;
  function animateOrbs() {
    time += 0.01;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    orbData.forEach(d => {
      d.angle += d.speed * 0.008;
      const x = cx + Math.cos(d.angle) * d.radius - 45;
      const y = cy + Math.sin(d.angle) * (d.radius * 0.45) + Math.sin(time * d.floatSpeed + d.floatOffset) * d.floatAmp - 45;
      d.el.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateOrbs);
  }
  animateOrbs();
}

// ── Typing Effect ──────────────────────────────
function initTypingEffect() {
  const target = document.getElementById('typing-target');
  if (!target) return;

  const texts = [
    'Automatisiere dein Business mit KI.',
    'Spare 80% Zeit bei Routineaufgaben.',
    'E-Mails, Aufmaß, Buchhaltung — erledigt.',
    'Dein digitaler Assistent, 24/7 aktiv.',
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const current = texts[textIndex];
    if (isDeleting) {
      target.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      delay = 400;
    }

    pauseTimer = setTimeout(type, delay);
  }
  type();
}

// ── Stats Counter ──────────────────────────────
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1500;
      const increment = target / (duration / 16);

      const counter = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.round(current) + suffix;
        if (current >= target) clearInterval(counter);
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

// ── GSAP Animations ────────────────────────────
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ── Feature Cards flying in ──
  const cards = document.querySelectorAll('.feature-card.gsap-fly');
  cards.forEach((card, i) => {
    const from = card.dataset.from || 'bottom';
    const rotate = parseFloat(card.dataset.rotate) || 0;

    let startX = 0, startY = 0;
    if (from === 'left')   startX = -200;
    if (from === 'right')  startX = 200;
    if (from === 'top')    startY = -150;
    if (from === 'bottom') startY = 150;

    gsap.fromTo(card,
      { x: startX, y: startY, opacity: 0, rotation: rotate, scale: 0.85 },
      {
        x: 0, y: 0, opacity: 1, rotation: 0, scale: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ── Fade Up elements ──
  document.querySelectorAll('.gsap-fade-up').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: i * 0.12,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });

  // ── Parallax Elements ──
  document.querySelectorAll('.parallax-el').forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.3;
    gsap.to(el, {
      y: () => -ScrollTrigger.maxScroll(window) * speed * 0.15,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });

  // ── Section headers ──
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.fromTo(header,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
        }
      }
    );
  });

  // ── Pricing cards stagger ──
  gsap.fromTo('.pricing-card',
    { y: 60, opacity: 0, scale: 0.95 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.pricing-grid',
        start: 'top 80%',
      }
    }
  );
  // Re-apply featured scale after GSAP
  const featuredCard = document.querySelector('.pricing-card.featured');
  if (featuredCard) {
    ScrollTrigger.create({
      trigger: '.pricing-grid',
      start: 'top 80%',
      onEnter: () => {
        setTimeout(() => {
          if (window.innerWidth > 1024) {
            featuredCard.style.transform = 'scale(1.04)';
          }
        }, 800);
      }
    });
  }
}

// ── Card Tilt Effect ───────────────────────────
function initCardTilt() {
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 12;
      const tiltY = -(x / rect.width) * 12;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });
}

// ── Magnetic Buttons ───────────────────────────
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

// ── Smooth Anchor Scroll ───────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Intersection Observer for misc reveals ─────
function initRevealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.step-item, .footer-brand').forEach(el => {
    observer.observe(el);
  });
}

// ── Orb Resize Handler ─────────────────────────
window.addEventListener('resize', () => {
  // Three.js handled inside initThreeJS
}, { passive: true });

// ── Page Load Entrance ─────────────────────────
function initPageEntrance() {
  document.body.style.opacity = '0';
  window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
}

// ── Glitch Effect on Logo ──────────────────────
function initLogoGlitch() {
  const logos = document.querySelectorAll('.logo-text');
  logos.forEach(logo => {
    setInterval(() => {
      if (Math.random() > 0.92) {
        logo.style.textShadow = '2px 0 #ff0080, -2px 0 #00f5ff';
        logo.style.letterSpacing = '5px';
        setTimeout(() => {
          logo.style.textShadow = '';
          logo.style.letterSpacing = '3px';
        }, 80);
      }
    }, 3000);
  });
}

// ── Neon Pulse on Featured Card ────────────────
function initFeaturedCardPulse() {
  const featured = document.querySelector('.pricing-card.featured');
  if (!featured) return;
  let growing = true;
  let size = 15;
  setInterval(() => {
    if (growing) { size += 0.5; if (size > 25) growing = false; }
    else { size -= 0.5; if (size < 15) growing = true; }
    featured.style.boxShadow = `0 0 ${size}px rgba(0, 245, 255, 0.15), inset 0 0 40px rgba(0, 245, 255, 0.03), 0 0 ${size * 2}px rgba(0, 245, 255, 0.05)`;
  }, 50);
}

// ── Main Init ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPageEntrance();
  initScrollProgress();
  initNavbar();
  initTypingEffect();
  initStatsCounter();
  initSmoothScroll();
  initRevealOnScroll();
  initLogoGlitch();

  // Defer heavy animations slightly
  setTimeout(() => {
    initThreeJS();
    initFloatingOrbs();
    initGSAP();
    initCardTilt();
    initMagneticButtons();
    initFeaturedCardPulse();

    // Only on non-touch devices
    if (!('ontouchstart' in window)) {
      initCursor();
    }
  }, 100);
});

// ── Performance: pause animations when tab hidden ──
document.addEventListener('visibilitychange', () => {
  // Three.js animate loop uses rAF which auto-pauses
});
