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
   CRIME SCENE TAPE PULL-BACK SCROLL EFFECT (PINNED UNTIL REVEALED)
   -------------------------------------------------------------------------- */
function initCrimeSceneTapeScroll() {
  const wrapper = document.getElementById('heroPinnedWrapper');
  const tape1 = document.getElementById('crimeTape1');
  const tape2 = document.getElementById('crimeTape2');
  const tape3 = document.getElementById('crimeTape3');
  const tape4 = document.getElementById('crimeTape4');
  const tape5 = document.getElementById('crimeTape5');
  const siteHeader = document.getElementById('siteHeader');

  if (!tape1 && !tape2) return;

  // Degrees to radians conversion helper
  const toRad = deg => (deg * Math.PI) / 180;

  let ticking = false;

  function updateTape() {
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

    // Travel distance: sized so tapes retract 100% past the viewport edges
    const travelDistance = Math.max(window.innerWidth * 1.85, 2500);

    // Tape 1: Slanted Top-Left to Bottom-Right (+6deg)
    // Retracts strictly along length towards Top-Left (negative X, negative Y)
    if (tape1) {
      const angle1 = 6;
      const rad1 = toRad(angle1);
      const move1 = progress * travelDistance;
      const x1 = -move1 * Math.cos(rad1);
      const y1 = -65 - (move1 * Math.sin(rad1));
      const r1 = angle1 - (progress * 2);
      tape1.style.transform = `translate3d(${x1.toFixed(1)}px, ${y1.toFixed(1)}px, 0) rotate(${r1.toFixed(2)}deg)`;
    }

    // Tape 2: Slanted Bottom-Left to Top-Right (-7deg)
    // Retracts strictly along length towards Bottom-Left (negative X, positive Y)
    if (tape2) {
      const angle2 = 7;
      const rad2 = toRad(angle2);
      const move2 = progress * travelDistance;
      const x2 = -move2 * Math.cos(rad2);
      const y2 = 45 + (move2 * Math.sin(rad2));
      const r2 = -angle2 + (progress * 2);
      tape2.style.transform = `translate3d(${x2.toFixed(1)}px, ${y2.toFixed(1)}px, 0) rotate(${r2.toFixed(2)}deg)`;
    }

    // Tape 3: Slanted Top-Left to Bottom-Right (+3.5deg)
    // Retracts strictly along length towards Top-Left (negative X, negative Y)
    if (tape3) {
      const angle3 = 3.5;
      const rad3 = toRad(angle3);
      const move3 = progress * travelDistance;
      const x3 = -move3 * Math.cos(rad3);
      const y3 = -10 - (move3 * Math.sin(rad3));
      const r3 = angle3 - (progress * 1.5);
      tape3.style.transform = `translate3d(${x3.toFixed(1)}px, ${y3.toFixed(1)}px, 0) rotate(${r3.toFixed(2)}deg)`;
    }

    // Tape 4: Slanted Bottom-Left to Top-Right (-4.5deg)
    // Retracts strictly along length towards Bottom-Left (negative X, positive Y)
    if (tape4) {
      const angle4 = 4.5;
      const rad4 = toRad(angle4);
      const move4 = progress * travelDistance;
      const x4 = -move4 * Math.cos(rad4);
      const y4 = 20 + (move4 * Math.sin(rad4));
      const r4 = -angle4 + (progress * 1.5);
      tape4.style.transform = `translate3d(${x4.toFixed(1)}px, ${y4.toFixed(1)}px, 0) rotate(${r4.toFixed(2)}deg)`;
    }

    // Tape 5: Slanted Top-Left to Bottom-Right (+8deg)
    // Retracts strictly along length towards Top-Left (negative X, negative Y)
    if (tape5) {
      const angle5 = 8;
      const rad5 = toRad(angle5);
      const move5 = progress * travelDistance;
      const x5 = -move5 * Math.cos(rad5);
      const y5 = 80 - (move5 * Math.sin(rad5));
      const r5 = angle5 - (progress * 2.5);
      tape5.style.transform = `translate3d(${x5.toFixed(1)}px, ${y5.toFixed(1)}px, 0) rotate(${r5.toFixed(2)}deg)`;
    }

    // REVEAL TOP NAVIGATION BAR AS THE TAPE GOES BACK
    if (siteHeader && siteHeader.classList.contains('reveal-on-tape')) {
      const navProgress = Math.max(0, Math.min(1, (progress - 0.20) / 0.65));
      siteHeader.style.transform = `translate3d(0, ${(-100 * (1 - navProgress)).toFixed(1)}%, 0)`;
      siteHeader.style.opacity = navProgress.toFixed(2);
      siteHeader.style.pointerEvents = navProgress > 0.4 ? 'auto' : 'none';
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
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

  // Initial position check
  updateTape();
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

