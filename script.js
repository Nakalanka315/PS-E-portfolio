/* ============================================================
   Professional Skills Portfolio - Interactive JavaScript
   Handles Theme Toggle, fixed student info, static images,
   Search filtering, and Interactive UI Widgets.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAvatarInitials();
  initImageLightbox();
  initWorkshopGalleryControls();
  initImageUploads();
  initSearch();
  initQuickNav();
  initInteractiveWidgets();
});

/* -------------------------------------------------------------
   1. Theme Toggle (Dark / Light Mode)
   ------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('ps_portfolio_theme') || 'light';
  
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('ps_portfolio_theme', newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('themeIcon');
  if (!themeIcon) return;
  
  if (theme === 'dark') {
    // Sun icon
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
    themeToggleBtn.setAttribute('title', 'Switch to Light Theme');
  } else {
    // Moon icon
    themeIcon.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
    themeToggleBtn.setAttribute('title', 'Switch to Dark Theme');
  }
}

/* -------------------------------------------------------------
   2. Student Avatar Initials
   ------------------------------------------------------------- */
function initAvatarInitials() {
  const avatarInitials = document.getElementById('avatarInitials');
  const studentName = document.querySelector('.val-student-name');
  if (avatarInitials && studentName) {
    const parts = studentName.textContent.trim().split(/\s+/).filter(Boolean);
    if (parts.length) {
      const initials = parts.length > 1
        ? parts[0][0] + parts[parts.length - 1][0]
        : parts[0][0];
      avatarInitials.textContent = initials.toUpperCase();
    }
  }
}

/* -------------------------------------------------------------
   3. Image Lightbox Modal
   ------------------------------------------------------------- */
function initImageLightbox() {
  const lightbox = document.getElementById('imageLightboxModal');
  const closeBtn = document.getElementById('closeLightboxBtn');

  if (!lightbox) return;

  const closeLightbox = () => {
    lightbox.classList.remove('active');
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function openImageLightbox(src, caption) {
  const lightbox = document.getElementById('imageLightboxModal');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');

  if (lightbox && img) {
    img.src = src;
    if (cap) cap.textContent = caption || '';
    lightbox.classList.add('active');
  }
}

/* -------------------------------------------------------------
   4. Workshop Gallery Orientation Controls (Portrait / Landscape)
   ------------------------------------------------------------- */
function initWorkshopGalleryControls() {
  const grid = document.getElementById('workshopGalleryGrid');
  const btnPortrait = document.getElementById('btnTogglePortrait');
  const btnLandscape = document.getElementById('btnToggleLandscape');

  if (!grid || !btnPortrait || !btnLandscape) return;

  const savedRatio = localStorage.getItem('ps_workshop_ratio') || 'portrait';
  applyRatio(savedRatio);

  btnPortrait.addEventListener('click', () => {
    applyRatio('portrait');
    localStorage.setItem('ps_workshop_ratio', 'portrait');
  });

  btnLandscape.addEventListener('click', () => {
    applyRatio('landscape');
    localStorage.setItem('ps_workshop_ratio', 'landscape');
  });

  function applyRatio(ratio) {
    if (ratio === 'landscape') {
      grid.classList.remove('portrait-grid');
      grid.classList.add('landscape-grid');
      btnLandscape.classList.add('active');
      btnPortrait.classList.remove('active');
    } else {
      grid.classList.add('portrait-grid');
      grid.classList.remove('landscape-grid');
      btnPortrait.classList.add('active');
      btnLandscape.classList.remove('active');
    }
  }
}

/* -------------------------------------------------------------
   5. Image Slot Replacement (Upload / Remove / LocalStorage)
   ------------------------------------------------------------- */
function initImageUploads() {
  // Images come from the <img src="images/..."> tags in index.html.
  // If the file exists it is shown; if not, the placeholder stays visible.
  document.querySelectorAll('.image-slot').forEach(slot => {
    const imgEl = slot.querySelector('img');
    if (!imgEl) return;

    const markLoaded = () => slot.classList.add('has-image');
    const markMissing = () => slot.classList.remove('has-image');

    imgEl.addEventListener('load', markLoaded);
    imgEl.addEventListener('error', markMissing);
    if (imgEl.complete && imgEl.naturalWidth > 0) markLoaded();

    imgEl.addEventListener('click', (e) => {
      if (slot.classList.contains('has-image')) {
        e.stopPropagation();
        const t = slot.querySelector('.image-slot-title');
        openImageLightbox(imgEl.src, t ? t.textContent : '');
      }
    });
  });
}

/* -------------------------------------------------------------
   6. Search & Filter Bar (Live Dropdown, In-Page Highlight & Filter)
   ------------------------------------------------------------- */
function initSearch() {
  const searchWrapper = document.getElementById('navSearchWrapper');
  const searchInput = document.getElementById('navSearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  const dropdown = document.getElementById('navSearchDropdown');
  const noticeBanner = document.getElementById('searchNoticeBanner');

  if (!searchInput) return;

  // Search items database
  const searchItems = [
    {
      id: 'assessment',
      pill: 'Course Scheme',
      title: 'Curriculum & Assessment Scheme',
      subtitle: 'Assignments 01 & 02, portfolio requirements & grading breakdown',
      keywords: 'curriculum overview continuous assessment criteria grading 20% 60% assignment individual group photography compulsory'
    },
    {
      id: 'lesson-01',
      pill: 'Lesson 01',
      title: 'Introduction to Professional Skills',
      subtitle: 'Employability competencies, technical vs soft skills, Johari Window',
      keywords: 'employability technical soft transferable skills values beliefs johari window blind spot open arena facade hidden unknown worksheet'
    },
    {
      id: 'lesson-02',
      pill: 'Lesson 02',
      title: 'Self-Reflection & Portfolio Development',
      subtitle: 'Gibbs cycle, SMART goals, continuous professional development (CPD)',
      keywords: 'self reflection gibbs reflective cycle cpd continuous professional development smart goals newspaper card holder practical project portfolio types showcase'
    },
    {
      id: 'lesson-03',
      pill: 'Lesson 03',
      title: 'Effective Workplace Communication',
      subtitle: '7Cs framework, verbal vs non-verbal cues, active listening',
      keywords: 'communication skills 7cs clear concise concrete correct coherent complete courteous verbal non-verbal active listening body language barriers feedback'
    },
    {
      id: 'lesson-04',
      pill: 'Lesson 04',
      title: 'Professional Email & Business Writing',
      subtitle: 'Email etiquette, subject lines, formal structure, netiquette rules',
      keywords: 'email etiquette business letters formal correspondence netiquette subject line salutation sign-off professional tone digital footprint'
    },
    {
      id: 'lesson-05',
      pill: 'Lesson 05',
      title: 'Industry-Standard Resume & ATS Optimization',
      subtitle: 'ATS keywords, resume sections, action verbs, tailoring for job roles',
      keywords: 'resume cv curriculum vitae ats applicant tracking system action verbs formatting reverse chronological cover letter projects achievements'
    },
    {
      id: 'lesson-06',
      pill: 'Lesson 06',
      title: 'Mastering the Job Interview',
      subtitle: 'STAR method, behavioral questions, grooming & professional attire',
      keywords: 'interview preparation star technique situation task action result competency behavioral questions dress code grooming posture body language elevator pitch mock interview'
    },
    {
      id: 'lesson-07',
      pill: 'Lesson 07',
      title: 'Dynamic Meeting Management & Discussion',
      subtitle: 'Meeting agendas, formal minutes of meeting (MOM), committee dynamics',
      keywords: 'meeting management agenda minutes mom chairperson secretary action items quorum group discussion role play committee rehabilitation centre'
    },
    {
      id: 'lesson-08',
      pill: 'Lesson 08',
      title: 'Emotional Intelligence & Stress Management',
      subtitle: "Daniel Goleman's 5 EQ domains, empathy, managing workplace burnout",
      keywords: 'emotional intelligence eq ei daniel goleman self-awareness self-regulation motivation empathy social skills stress management anger workplace burnout breathing technique'
    },
    {
      id: 'lesson-09',
      pill: 'Lesson 09',
      title: 'Corporate Dining Etiquette & Protocol',
      subtitle: 'Table setting, cutlery codes, napkin rules, business networking',
      keywords: 'dining etiquette table setting cutlery fork knife napkin protocol formal dinner toast social networking glassware bread plate bmich continental'
    },
    {
      id: 'workshop',
      pill: 'Group Project',
      title: 'Photography Workshop: From Basics to Better Shots',
      subtitle: 'Assignment 02: 6 portrait photos, camera controls, composition & lighting',
      keywords: 'workshop photography camera controls aperture shutter speed iso composition lighting editing turret tower assignment 02 group project organizing committee'
    },
    {
      id: 'looking-back',
      pill: 'Retrospective',
      title: 'Looking Back: Semester Reflections & Growth',
      subtitle: 'Key personal learnings, strengths identified & future career goals',
      keywords: 'looking back semester reflection retrospective personal growth career aspirations future online presence continuous improvement'
    },
    {
      id: 'acknowledgement',
      pill: 'Gratitude',
      title: 'Acknowledgements & Appreciation',
      subtitle: 'Honoring module lecturer, peers, and academic mentors',
      keywords: 'acknowledgement gratitude thanks lecturer classmates teamwork ishara weerasinghe peer support'
    }
  ];

  // Cache DOM elements
  searchItems.forEach(item => {
    item.el = document.getElementById(item.id);
  });

  const allSections = document.querySelectorAll('.lesson-card, .workshop-section, .assessment-section, #looking-back, #acknowledgement');
  const navLinks = document.querySelectorAll('.quick-nav-item');

  function handleSearch(query) {
    const q = query.toLowerCase().trim();

    if (!q) {
      if (searchWrapper) searchWrapper.classList.remove('has-query');
      if (dropdown) dropdown.classList.remove('active');
      if (noticeBanner) {
        noticeBanner.style.display = 'none';
        noticeBanner.innerHTML = '';
      }
      allSections.forEach(sec => sec.style.display = '');
      navLinks.forEach(link => link.style.opacity = '1');
      return;
    }

    if (searchWrapper) searchWrapper.classList.add('has-query');

    const matched = [];

    searchItems.forEach(item => {
      if (!item.el) return;
      const text = item.el.textContent.toLowerCase();
      const isMatch = item.title.toLowerCase().includes(q) ||
                      item.subtitle.toLowerCase().includes(q) ||
                      item.keywords.toLowerCase().includes(q) ||
                      text.includes(q);

      if (isMatch) {
        item.el.style.display = '';
        matched.push(item);
      } else {
        item.el.style.display = 'none';
      }
    });

    // Dim non-matching nav pills
    navLinks.forEach(pill => {
      const a = pill.querySelector('a');
      if (!a) return;
      const targetId = a.getAttribute('href').replace('#', '');
      const isTargetMatched = matched.some(m => m.id === targetId);
      pill.style.opacity = isTargetMatched ? '1' : '0.35';
    });

    // Render dropdown
    renderDropdown(matched, q);

    // Render notice banner
    renderBanner(matched, q);
  }

  function renderDropdown(matched, q) {
    if (!dropdown) return;

    if (matched.length === 0) {
      dropdown.innerHTML = `
        <div class="search-no-results">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.5rem; opacity:0.6;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
          <p>No topics found matching <strong>"${escapeHtml(q)}"</strong></p>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem; display:block;">Try "Johari", "ATS", "STAR", "Meeting", or "Dining"</span>
        </div>
      `;
      dropdown.classList.add('active');
      return;
    }

    let html = `<div style="padding: 0.35rem 0.5rem; font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Found ${matched.length} Match${matched.length > 1 ? 'es' : ''}</div>`;

    matched.forEach(item => {
      html += `
        <div class="search-result-item" data-target="${item.id}">
          <div class="search-result-meta">
            <span class="search-result-pill">${item.pill}</span>
            <span class="search-result-jump">Jump to card &rarr;</span>
          </div>
          <div class="search-result-title">${highlightQuery(item.title, q)}</div>
          <div class="search-result-snippet">${highlightQuery(item.subtitle, q)}</div>
        </div>
      `;
    });

    html += `
      <div class="search-dropdown-footer">
        <span>Click to jump directly</span>
        <span>Press <kbd style="background:var(--bg-surface-soft); padding:0.1rem 0.3rem; border-radius:0.25rem; border:1px solid var(--border-subtle);">Enter</kbd> for 1st result</span>
      </div>
    `;

    dropdown.innerHTML = html;
    dropdown.classList.add('active');

    // Attach click events on results
    dropdown.querySelectorAll('.search-result-item').forEach(itemEl => {
      itemEl.addEventListener('click', () => {
        const targetId = itemEl.getAttribute('data-target');
        const targetObj = searchItems.find(s => s.id === targetId);
        if (targetObj && targetObj.el) {
          jumpToSection(targetObj.el);
        }
      });
    });
  }

  function renderBanner(matched, q) {
    if (!noticeBanner) return;

    if (matched.length > 0) {
      noticeBanner.innerHTML = `
        <div class="search-notice-text">
          🔍 Showing <strong>${matched.length}</strong> matching section${matched.length > 1 ? 's' : ''} for <em>"${escapeHtml(q)}"</em>
        </div>
        <div class="search-notice-actions">
          <button type="button" class="btn-search-clear" id="bannerJumpFirst">Jump to First Result</button>
          <button type="button" class="btn-search-clear" id="bannerClearBtn">Show All Lessons</button>
        </div>
      `;
      noticeBanner.style.display = 'flex';

      const btnJump = document.getElementById('bannerJumpFirst');
      if (btnJump && matched[0] && matched[0].el) {
        btnJump.addEventListener('click', () => jumpToSection(matched[0].el));
      }

      const btnClear = document.getElementById('bannerClearBtn');
      if (btnClear) {
        btnClear.addEventListener('click', clearSearch);
      }
    } else {
      noticeBanner.innerHTML = `
        <div class="search-notice-text">
          ⚠️ No sections found matching <em>"${escapeHtml(q)}"</em>.
        </div>
        <div class="search-notice-actions">
          <button type="button" class="btn-search-clear" id="bannerClearBtn">Clear Search</button>
        </div>
      `;
      noticeBanner.style.display = 'flex';
      const btnClear = document.getElementById('bannerClearBtn');
      if (btnClear) {
        btnClear.addEventListener('click', clearSearch);
      }
    }
  }

  function jumpToSection(el) {
    if (!el) return;
    el.style.display = '';

    // Calculate position considering sticky nav
    const offset = 110;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    el.classList.remove('search-target-highlight');
    void el.offsetWidth; // reflow
    el.classList.add('search-target-highlight');
    setTimeout(() => {
      el.classList.remove('search-target-highlight');
    }, 2500);

    if (dropdown) dropdown.classList.remove('active');
  }

  function clearSearch() {
    searchInput.value = '';
    handleSearch('');
    searchInput.focus();
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function highlightQuery(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = searchInput.value.toLowerCase().trim();
      const firstMatch = searchItems.find(item => {
        if (!item.el) return false;
        const text = item.el.textContent.toLowerCase();
        return item.title.toLowerCase().includes(q) ||
               item.subtitle.toLowerCase().includes(q) ||
               item.keywords.toLowerCase().includes(q) ||
               text.includes(q);
      });
      if (firstMatch && firstMatch.el) {
        jumpToSection(firstMatch.el);
      }
    } else if (e.key === 'Escape') {
      if (dropdown) dropdown.classList.remove('active');
    }
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      handleSearch(searchInput.value);
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearSearch();
    });
  }

  document.addEventListener('click', (e) => {
    if (searchWrapper && !searchWrapper.contains(e.target) && (!noticeBanner || !noticeBanner.contains(e.target))) {
      if (dropdown) dropdown.classList.remove('active');
    }
  });
}

/* -------------------------------------------------------------
   7. Quick Navigation Active State Tracking
   ------------------------------------------------------------- */
function initQuickNav() {
  const sections = document.querySelectorAll('section[id], article[id]');
  const navLinks = document.querySelectorAll('.quick-nav-item a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
   8. Interactive Widgets & Helpers
   ------------------------------------------------------------- */
function initInteractiveWidgets() {
  // Johari Quadrants Click highlight
  const quadrants = document.querySelectorAll('.johari-quadrant');
  quadrants.forEach(q => {
    q.addEventListener('click', () => {
      quadrants.forEach(item => item.classList.remove('highlight'));
      q.classList.add('highlight');
    });
  });

  // Scroll to top
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* Scroll-reveal animation + smooth theme fade */
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.lesson-card, .hero-student-card, .section-header');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }
  const tbtn = document.getElementById('themeToggleBtn');
  if (tbtn) tbtn.addEventListener('click', () => {
    document.documentElement.classList.add('theme-fade');
    setTimeout(() => document.documentElement.classList.remove('theme-fade'), 450);
  });
});
