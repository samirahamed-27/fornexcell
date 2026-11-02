/**
 * NEXCELL CLUB — NEO-BRUTALIST INTERACTIVE SCRIPTS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initLightbox();
  initReviewLivePreview();
  initTeamFilters();
});

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
