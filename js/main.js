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

