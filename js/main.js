/**
 * NEXCELL CLUB — NEO-BRUTALIST INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initLightbox();
  initReviewLivePreview();
  initTeamFilters();
  initCrimeSceneTapeScroll();
  initTiltedCards();
});

/* --------------------------------------------------------------------------
   CRIME SCENE TAPE: STRICT OPPOSITE-DIRECTION PULL-BACK SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initCrimeSceneTapeScroll() {
  const wrapper = document.getElementById('heroPinnedWrapper');
  const tapeEls = [
    document.getElementById('crimeTape1'),
    document.getElementById('crimeTape2'),
    document.getElementById('crimeTape3'),
    document.getElementById('crimeTape4'),
    document.getElementById('crimeTape5')
  ];
  const siteHeader = document.getElementById('siteHeader');

  if (!tapeEls[0] && !tapeEls[1]) return;

  // Strict collinear tape configurations:
  // Each tape's movement is 100% locked to its exact physical strip angle (angle in deg).
  // dirSign = -1 pulls back towards the negative end along the strip (Top-Left / Bottom-Left).
  // dirSign = +1 pulls back towards the positive end along the strip (Bottom-Right / Top-Right).
  const tapeConfigs = [
    {
      baseY: -65,
      angle: 6,     // Slanted Top-Left to Bottom-Right (+6deg)
      dirSign: -1   // STRICT PULL-BACK: Retracts along length towards Top-Left (-X, -Y)
    },
    {
      baseY: 45,
      angle: -7,    // Slanted Bottom-Left to Top-Right (-7deg)
      dirSign: -1   // STRICT PULL-BACK: Retracts along length towards Bottom-Left (-X, +Y)
    },
    {
      baseY: -10,
      angle: 3.5,   // Slanted Top-Left to Bottom-Right (+3.5deg)
      dirSign: 1    // STRICT PULL-BACK: Retracts along length towards Bottom-Right (+X, +Y)
    },
    {
      baseY: 20,
      angle: -4.5,  // Slanted Bottom-Left to Top-Right (-4.5deg)
      dirSign: 1    // STRICT PULL-BACK: Retracts along length towards Top-Right (+X, -Y)
    },
    {
      baseY: 80,
      angle: 8,     // Slanted Top-Left to Bottom-Right (+8deg)
      dirSign: -1   // STRICT PULL-BACK: Retracts along length towards Top-Left (-X, -Y)
    }
  ];

  const tapes = tapeEls.map((el, i) => ({ el, cfg: tapeConfigs[i] })).filter(t => t.el);

  let isIntroAnimating = false;
  let ticking = false;

  function updateTape() {
    if (isIntroAnimating) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    let progress = 0;
    if (wrapper) {
      const wrapperTop = wrapper.offsetTop;
      const scrollDistance = wrapper.offsetHeight - window.innerHeight;
      if (scrollDistance > 0) {
        progress = Math.max(0, Math.min(1, (scrollY - wrapperTop) / scrollDistance));
      }
    } else {
      progress = Math.max(0, Math.min(1, scrollY / 600));
    }

    // Travel distance: sized so tapes retract 100% past the viewport edges along their strip
    const travelDistance = Math.max(window.innerWidth * 1.95, 2700);

    // STRICT OPPOSITE-DIRECTION RETRACTION:
    // Move vector (dx, dy) is strictly collinear with the tape strip angle (cos(rad), sin(rad)).
    // Rotation remains fixed at cfg.angle so tape reels back purely along its length.
    tapes.forEach(({ el, cfg }) => {
      const rad = (cfg.angle * Math.PI) / 180;
      const move = cfg.dirSign * progress * travelDistance;
      const x = move * Math.cos(rad);
      const y = cfg.baseY + (move * Math.sin(rad));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${cfg.angle}deg)`;
    });

    // Reveal top navigation bar as the tapes leave
    if (siteHeader && siteHeader.classList.contains('reveal-on-tape')) {
      const navProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.65));
      siteHeader.style.transform = `translate3d(0, ${(-100 * (1 - navProgress)).toFixed(1)}%, 0)`;
      siteHeader.style.opacity = navProgress.toFixed(2);
      siteHeader.style.pointerEvents = navProgress > 0.4 ? 'auto' : 'none';
    }

    ticking = false;
  }

  // Entrance animation on page load: tapes enter along their exact strip trajectories from diverse directions
  function playEntrance() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 40) {
      // User refreshed while scrolled down, skip intro entrance
      updateTape();
      return;
    }

    isIntroAnimating = true;
    const travelDistance = Math.max(window.innerWidth * 1.6, 2200);

    // 1. Initial offscreen position strictly along each tape's strip trajectory
    tapes.forEach(({ el, cfg }) => {
      const rad = (cfg.angle * Math.PI) / 180;
      const startMove = cfg.dirSign * travelDistance;
      const startX = startMove * Math.cos(rad);
      const startY = cfg.baseY + (startMove * Math.sin(rad));
      el.style.transition = 'none';
      el.style.transform = `translate3d(${startX.toFixed(1)}px, ${startY.toFixed(1)}px, 0) rotate(${cfg.angle}deg)`;
      el.style.opacity = '0';
    });

    // 2. Staggered slam-in entrance along the strip
    tapes.forEach(({ el, cfg }, index) => {
      const delay = 60 + index * 95;
      setTimeout(() => {
        el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease';
        el.style.transform = `translate3d(0px, ${cfg.baseY}px, 0) rotate(${cfg.angle}deg)`;
        el.style.opacity = '1';
      }, delay);
    });

    // 3. Once entrance animation finishes, hand control over to scroll scrubbing
    const totalDuration = 60 + (tapes.length * 95) + 700;
    setTimeout(() => {
      tapes.forEach(({ el }) => {
        el.style.transition = '';
      });
      isIntroAnimating = false;
      updateTape();
    }, totalDuration);
  }

  window.addEventListener('scroll', () => {
    if (isIntroAnimating) {
      // If user scrolls during intro, cancel intro instantly and scrub smoothly
      isIntroAnimating = false;
      tapes.forEach(({ el }) => { el.style.transition = ''; });
    }
    if (!ticking) {
      window.requestAnimationFrame(updateTape);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateTape);
      ticking = true;
    }
  }, { passive: true });

  // Trigger entrance on initial load
  playEntrance();
}

/* --------------------------------------------------------------------------
   MOBILE NAVIGATION DRAWER
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close drawer on link click
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      
      // Close other open items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
        }
      });

      item.classList.toggle('is-open', !isOpen);
    });
  });
}

/* --------------------------------------------------------------------------
   LIGHTBOX MODAL FOR GALLERY
   -------------------------------------------------------------------------- */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');

  if (!modal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'NexCell Event Photo';
        modal.classList.add('is-open');
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('is-open');
    lightboxImg.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   REVIEWS: LIVE PREVIEW & INTERACTIVE STARS
   -------------------------------------------------------------------------- */
function initReviewLivePreview() {
  const form = document.getElementById('reviewForm');
  if (!form) return;

  const nameInput = document.getElementById('reviewName');
  const roleInput = document.getElementById('reviewRole');
  const textInput = document.getElementById('reviewText');
  const ratingInput = document.getElementById('reviewRating');
  const starBtns = document.querySelectorAll('.star-btn');

  // Preview elements
  const prevAuthor = document.getElementById('previewAuthor');
  const prevRole = document.getElementById('previewRole');
  const prevText = document.getElementById('previewText');
  const prevStars = document.getElementById('previewStars');

  // Interactive stars
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-value') || '5', 10);
      if (ratingInput) ratingInput.value = val;

      starBtns.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value') || '0', 10);
        s.classList.toggle('selected', sVal <= val);
        s.textContent = sVal <= val ? '★' : '☆';
      });

      if (prevStars) {
        prevStars.textContent = '★'.repeat(val) + '☆'.repeat(5 - val);
      }
    });
  });

  // Real-time input binding
  if (nameInput && prevAuthor) {
    nameInput.addEventListener('input', () => {
      prevAuthor.textContent = nameInput.value.trim() || 'Your Name Here';
    });
  }

  if (roleInput && prevRole) {
    roleInput.addEventListener('input', () => {
      prevRole.textContent = roleInput.value.trim() || 'Student / Innovator';
    });
  }

  if (textInput && prevText) {
    textInput.addEventListener('input', () => {
      prevText.textContent = textInput.value.trim() ? `"${textInput.value.trim()}"` : '"Start typing below to see your review preview card in real-time..."';
    });
  }
}

/* --------------------------------------------------------------------------
   TEAM SEARCH & CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initTeamFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('teamSearch');
  const cards = document.querySelectorAll('.team-card');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    cards.forEach(card => {
      const category = card.getAttribute('data-category') || 'member';
      const name = (card.querySelector('.team-name')?.textContent || '').toLowerCase();
      const role = (card.querySelector('.team-role')?.textContent || '').toLowerCase();
      
      const matchesCategory = (currentCategory === 'all') || (category === currentCategory);
      const matchesSearch = !currentSearch || name.includes(currentSearch) || role.includes(currentSearch);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/* --------------------------------------------------------------------------
   TILTED CARD COMPONENT (PORTED FROM REACT BITS JAVASCRIPT + CSS)
   -------------------------------------------------------------------------- */
const tcClamp = (value, min, max) => Math.min(max, Math.max(min, value));

const tcStep = (state, key, target, omega, zeta, dt) => {
  const velocity = `v${key}`;
  const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
  const h = dt / steps;
  for (let index = 0; index < steps; index++) {
    state[velocity] += (omega * omega * (target - state[key]) - 2 * zeta * omega * state[velocity]) * h;
    state[key] += state[velocity] * h;
  }
  const settled = Math.abs(target - state[key]) < 0.001 && Math.abs(state[velocity]) < 0.01;
  if (settled) {
    state[key] = target;
    state[velocity] = 0;
  }
  return !settled;
};

function initTiltedCards() {
  const cards = document.querySelectorAll('.team-card');
  if (!cards.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  cards.forEach(card => {
    if (card.dataset.tiltedInit) return;
    card.dataset.tiltedInit = 'true';
    card.classList.add('tilted-card');

    // Props configuration based on React Bits specification
    const config = {
      amplitude: 14,       // rotateAmplitude: 14deg
      scale: 1.04,         // scaleOnHover: 1.04
      smoothness: 0.6,     // smoothness: 0.6
      glare: 0.5,          // glare: 0.5
      shadow: 0.5,         // shadow: 0.5
      parallax: 1.0,       // parallax: 1.0
      showTooltip: true,   // showTooltip: true
      gyroscope: true
    };

    // Extract caption info from existing member DOM
    const name = card.querySelector('.team-name')?.textContent?.trim() || '';
    const role = card.querySelector('.team-role')?.textContent?.trim() || '';
    const captionText = role ? `${name} ✦ ${role}` : name;

    // Create shadow element
    const shadow = document.createElement('div');
    shadow.className = 'tilted-card__shadow';
    shadow.setAttribute('aria-hidden', 'true');

    // Create body element and transfer existing card children into it
    const body = document.createElement('div');
    body.className = 'tilted-card__body';

    while (card.firstChild) {
      body.appendChild(card.firstChild);
    }

    // Append glare, rim, and edge overlays
    const glare = document.createElement('span');
    glare.className = 'tilted-card__glare';
    glare.setAttribute('aria-hidden', 'true');

    const rim = document.createElement('span');
    rim.className = 'tilted-card__rim';
    rim.setAttribute('aria-hidden', 'true');

    const edge = document.createElement('span');
    edge.className = 'tilted-card__edge';
    edge.setAttribute('aria-hidden', 'true');

    body.appendChild(glare);
    body.appendChild(rim);
    body.appendChild(edge);

    // Create caption tooltip tag
    const caption = document.createElement('figcaption');
    caption.className = 'tilted-card__caption';
    caption.textContent = captionText;

    card.appendChild(shadow);
    card.appendChild(body);
    card.appendChild(caption);

    // Physics state
    const state = {
      rx: 0, vrx: 0, ry: 0, vry: 0,
      lift: 0, vlift: 0, ty: 0, vty: 0,
      press: 0, vpress: 0, tip: 0, vtip: 0,
      shown: 0, vshown: 0, tx: 0, tyy: 0
    };
    const pointer = { nx: 0, ny: 0, x: 0, y: 0, inside: false, mouse: false, vx: 0, last: 0 };
    const press = { active: false, x: 0, y: 0 };
    const tilt = { gamma: 0, beta: 0, baseGamma: 0, baseBeta: 0, calibrated: false, live: false };
    let raf = 0;
    let last = 0;
    let visible = true;

    const frame = now => {
      raf = 0;
      const dt = tcClamp((now - last) / 1000 || 0, 0, 0.05);
      last = Math.max(last, now);
      let busy = false;

      const amplitude = config.amplitude * (reduced ? 0.3 : 1);
      const hovering = pointer.inside && pointer.mouse;
      const touching = press.active && !pointer.mouse;
      const following = hovering || touching;

      let inputX = 0;
      let inputY = 0;
      if (following) {
        inputX = pointer.nx;
        inputY = pointer.ny;
      } else if (tilt.live && config.gyroscope) {
        inputX = tcClamp((tilt.gamma - tilt.baseGamma) / 22, -1, 1);
        inputY = tcClamp((tilt.beta - tilt.baseBeta) / 22, -1, 1);
        tilt.baseGamma += (tilt.gamma - tilt.baseGamma) * (1 - Math.exp(-dt / 4));
        tilt.baseBeta += (tilt.beta - tilt.baseBeta) * (1 - Math.exp(-dt / 4));
        busy = true;
      }

      const omega = 20 * Math.pow(0.2, config.smoothness);
      const zeta = 1 - 0.3 * config.smoothness;
      const lifted = hovering || touching ? 1 : 0;

      busy = tcStep(state, 'rx', -inputY * amplitude, omega, zeta, dt) || busy;
      busy = tcStep(state, 'ry', inputX * amplitude, omega, zeta, dt) || busy;
      busy = tcStep(state, 'ty', 0, omega * 0.8, 0.9, dt) || busy;
      busy = tcStep(state, 'lift', lifted, omega, Math.max(zeta, 0.85), dt) || busy;
      busy = tcStep(state, 'press', press.active ? 1 : 0, 26, 0.8, dt) || busy;

      const active = lifted > 0 || state.lift > 0.01;
      if (active !== card.hasAttribute('data-active')) card.toggleAttribute('data-active', active);

      const scale = 1 + (config.scale - 1) * state.lift - 0.02 * state.press;
      const rx = state.rx;
      const ry = state.ry;
      const radiansX = (rx * Math.PI) / 180;
      const radiansY = (ry * Math.PI) / 180;

      body.style.transform = `translate3d(0, ${state.ty.toFixed(2)}px, 0) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
      body.style.setProperty('--tc-px', (Math.sin(radiansY) * config.parallax).toFixed(4));
      body.style.setProperty('--tc-py', (-Math.sin(radiansX) * config.parallax).toFixed(4));

      const reach = Math.max(amplitude, 1);
      body.style.setProperty('--tc-gx', `${(50 + (ry / reach) * 46).toFixed(2)}%`);
      body.style.setProperty('--tc-gy', `${(50 - (rx / reach) * 46).toFixed(2)}%`);
      const energy = Math.min(1, Math.hypot(rx, ry) / reach);
      body.style.setProperty('--tc-glare', (config.glare * Math.max(state.lift, energy)).toFixed(3));

      // Dynamic soft shadow tracking
      const strength = config.shadow;
      const offsetX = -Math.sin(radiansY) * 20;
      const offsetY = 10 + 16 * state.lift + Math.sin(radiansX) * 16;
      const spread = scale * (0.88 + 0.04 * state.lift);
      shadow.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0) scale(${spread.toFixed(4)})`;
      shadow.style.opacity = (strength * (0.6 + 0.4 * state.lift)).toFixed(3);

      // Tooltip caption tracking & swinging
      const show = config.showTooltip && hovering ? 1 : 0;
      busy = tcStep(state, 'shown', show, 16, 1, dt) || busy;
      const follow = 1 - Math.exp(-dt / 0.035);
      state.tx += (pointer.x - state.tx) * follow;
      state.tyy += (pointer.y - state.tyy) * follow;
      if (Math.abs(pointer.x - state.tx) + Math.abs(pointer.y - state.tyy) > 0.2) busy = true;
      pointer.vx *= Math.exp(-dt / 0.08);
      busy = tcStep(state, 'tip', reduced ? 0 : tcClamp(-pointer.vx * 0.012, -14, 14), 18, 0.62, dt) || busy;
      caption.style.transform = `translate3d(${state.tx.toFixed(1)}px, ${state.tyy.toFixed(1)}px, 0) rotate(${state.tip.toFixed(2)}deg)`;
      caption.style.opacity = Math.max(0, state.shown).toFixed(3);

      if (busy && visible) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const locate = event => {
      const rect = card.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height)
      };
    };

    const track = event => {
      const spot = locate(event);
      const now = performance.now();
      const elapsed = Math.max(8, now - (pointer.last || now - 16)) / 1000;
      const dx = spot.x - pointer.x;
      pointer.vx += (dx / elapsed - pointer.vx) * 0.5;
      pointer.last = now;
      pointer.x = spot.x;
      pointer.y = spot.y;
      pointer.nx = tcClamp((spot.x - spot.width / 2) / (spot.width / 2), -1, 1);
      pointer.ny = tcClamp((spot.y - spot.height / 2) / (spot.height / 2), -1, 1);
    };

    card.addEventListener('pointerenter', event => {
      pointer.inside = true;
      pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
      const spot = locate(event);
      pointer.x = spot.x;
      pointer.y = spot.y;
      state.tx = spot.x;
      state.tyy = spot.y;
      pointer.vx = 0;
      track(event);
      wake();
    });

    card.addEventListener('pointermove', event => {
      pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
      if (!pointer.inside && pointer.mouse) {
        pointer.inside = true;
        const spot = locate(event);
        pointer.x = spot.x;
        pointer.y = spot.y;
        state.tx = spot.x;
        state.tyy = spot.y;
        pointer.vx = 0;
      }
      track(event);
      wake();
    });

    card.addEventListener('pointerleave', () => {
      pointer.inside = false;
      pointer.vx = 0;
      wake();
    });

    card.addEventListener('pointerdown', event => {
      press.active = true;
      press.x = event.clientX;
      press.y = event.clientY;
      pointer.mouse = event.pointerType === 'mouse' || event.pointerType === 'pen';
      if (!pointer.mouse) {
        pointer.inside = true;
        track(event);
      }
      wake();
    });

    window.addEventListener('pointerup', event => {
      if (!press.active) return;
      press.active = false;
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') pointer.inside = false;
      wake();
    }, { passive: true });

    window.addEventListener('pointercancel', () => {
      press.active = false;
      pointer.inside = false;
      wake();
    }, { passive: true });

    // Gyroscope orientation
    window.addEventListener('deviceorientation', event => {
      if (event.gamma == null || event.beta == null) return;
      tilt.gamma = event.gamma;
      tilt.beta = event.beta;
      if (!tilt.calibrated) {
        tilt.baseGamma = event.gamma;
        tilt.baseBeta = event.beta;
        tilt.calibrated = true;
      }
      tilt.live = coarse;
      wake();
    });

    // Observer to pause RAF when out of viewport
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      wake();
    });
    observer.observe(card);
  });
}

