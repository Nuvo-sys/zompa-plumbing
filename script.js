/* =============================================
   ZOMPA PLUMBING & HEATING — Script
   ============================================= */

// === IAB DETECTION ===
(function () {
  const ua = navigator.userAgent;
  const isIAB = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|BytedanceWebview|Snapchat|Twitter|Pinterest|LinkedInApp/i.test(ua);
  const banner = document.getElementById('iab-banner');
  const closeBtn = document.getElementById('iab-banner-close');
  if (isIAB && banner) {
    try { if (sessionStorage.getItem('iab-banner-dismissed')) return; } catch (e) {}
    banner.style.display = 'flex';
    closeBtn.addEventListener('click', function () {
      banner.style.display = 'none';
      try { sessionStorage.setItem('iab-banner-dismissed', '1'); } catch (e) {}
    });
  }
})();

// === NAV SCROLL ===
(function () {
  const nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// === HAMBURGER MENU ===
(function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const links = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });

    links.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }
})();

// === GALLERY ===
(function () {
  const galleryItems = [
    { src: 'images/luxury-bathroom.jpg', cat: 'bathroom', label: 'Luxury Bathroom Remodel', alt: 'Completed luxury bathroom with freestanding tub and glass shower by Zompa Plumbing' },
    { src: 'images/shower-marble.jpg', cat: 'bathroom', label: 'Custom Marble Shower', alt: 'Chrome rain shower fixture on marble arabesque tile installed by Zompa Plumbing' },
    { src: 'images/bathroom-gold.jpg', cat: 'bathroom', label: 'Bathroom Renovation', alt: 'Finished bathroom with gold fixtures, white vanity and tub' },
    { src: 'images/bathroom-navy.jpg', cat: 'bathroom', label: 'Modern Bathroom', alt: 'Modern bathroom with navy blue vanity and custom tile floor' },
    { src: 'images/navien-install-1.jpg', cat: 'heating', label: 'Navien Tankless System', alt: 'Navien tankless water heater professionally installed by Zompa Plumbing & Heating' },
    { src: 'images/navien-install-2.jpg', cat: 'heating', label: 'Combi Boiler System', alt: 'Navien combi boiler system with copper pipe installation' },
    { src: 'images/mini-split.jpg', cat: 'heating', label: 'Bosch Mini-Split Install', alt: 'Bosch heat pump outdoor unit installed on residential home' },
    { src: 'images/commercial-roughin.jpg', cat: 'commercial', label: 'Commercial Rough-In', alt: 'Commercial plumbing rough-in in steel stud framing' },
  ];

  const grid = document.getElementById('gallery-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentFilter = 'all';
  let visibleItems = [];

  function catLabel(cat) {
    if (cat === 'bathroom') return 'Plumbing';
    if (cat === 'heating') return 'Heating';
    if (cat === 'commercial') return 'Commercial';
    return cat;
  }

  function renderGallery(filter) {
    grid.innerHTML = '';
    visibleItems = [];
    const filtered = filter === 'all' ? galleryItems : galleryItems.filter(function (i) { return i.cat === filter; });
    filtered.forEach(function (item, idx) {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.setAttribute('role', 'listitem');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'View ' + item.label);

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.draggable = false;

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';
      const inner = document.createElement('div');
      const catEl = document.createElement('div');
      catEl.className = 'gallery-item-cat';
      catEl.textContent = catLabel(item.cat);
      const labelEl = document.createElement('div');
      labelEl.className = 'gallery-item-label';
      labelEl.textContent = item.label;
      inner.appendChild(catEl);
      inner.appendChild(labelEl);
      overlay.appendChild(inner);

      el.appendChild(img);
      el.appendChild(overlay);

      const itemIdx = visibleItems.length;
      el.addEventListener('click', function () { openLightbox(itemIdx); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(itemIdx);
        }
      });

      grid.appendChild(el);
      visibleItems.push(item);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderGallery(currentFilter);
    });
  });

  renderGallery('all');

  // === LIGHTBOX ===
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = visibleItems[currentIdx];
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.label + ' · ' + catLabel(item.cat) + ' · ' + (currentIdx + 1) + ' of ' + visibleItems.length;
  }

  lbClose.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', function () {
    currentIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length;
    updateLightbox();
  });

  lbNext.addEventListener('click', function () {
    currentIdx = (currentIdx + 1) % visibleItems.length;
    updateLightbox();
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % visibleItems.length; updateLightbox(); }
  });
})();

// === CUSTOM SELECT ===
(function () {
  const selectWrapper = document.getElementById('service-select');
  const trigger = selectWrapper ? selectWrapper.querySelector('.custom-select-trigger') : null;
  const options = selectWrapper ? selectWrapper.querySelectorAll('.custom-select-option') : [];
  const display = document.getElementById('select-display');
  const hidden = document.getElementById('service-hidden');

  if (!selectWrapper || !trigger) return;

  function open() {
    selectWrapper.classList.add('open');
    selectWrapper.setAttribute('aria-expanded', 'true');
  }
  function close() {
    selectWrapper.classList.remove('open');
    selectWrapper.setAttribute('aria-expanded', 'false');
  }

  trigger.addEventListener('click', function () {
    selectWrapper.classList.contains('open') ? close() : open();
  });

  trigger.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectWrapper.classList.contains('open') ? close() : open(); }
    if (e.key === 'Escape') close();
  });

  options.forEach(function (opt) {
    opt.addEventListener('click', function () {
      options.forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      display.textContent = opt.textContent;
      hidden.value = opt.getAttribute('data-value');
      close();
    });
  });

  document.addEventListener('click', function (e) {
    if (!selectWrapper.contains(e.target)) close();
  });
})();

// === FAQ ACCORDION ===
(function () {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      items.forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// === CONTACT FORM → SMS ===
(function () {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = (document.getElementById('name').value || '').trim();
    const phone   = (document.getElementById('phone').value || '').trim();
    const email   = (document.getElementById('email').value || '').trim();
    const service = document.getElementById('service-hidden').value;
    const message = (document.getElementById('message').value || '').trim();

    if (!name) { document.getElementById('name').focus(); return; }
    if (!phone) { document.getElementById('phone').focus(); return; }
    if (!service) {
      document.getElementById('select-display').style.outline = '2px solid #dc3726';
      return;
    }
    if (!message) { document.getElementById('message').focus(); return; }

    const serviceLabel = document.getElementById('select-display').textContent;
    const body = [
      'Hi Zompa Plumbing! I found your website and would like to request service.',
      'Name: ' + name,
      'Phone: ' + phone,
      email ? 'Email: ' + email : '',
      'Service: ' + serviceLabel,
      'Details: ' + message
    ].filter(Boolean).join('\n');

    const encoded = encodeURIComponent(body);
    const isAndroid = /android/i.test(navigator.userAgent);
    const smsHref = isAndroid
      ? 'sms:4012472040?body=' + encoded
      : 'sms:4012472040&body=' + encoded;

    const a = document.createElement('a');
    a.href = smsHref;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    form.reset();
    document.getElementById('select-display').textContent = 'Select a service...';
    document.getElementById('service-hidden').value = '';
    if (successMsg) { successMsg.style.display = 'block'; }
    submitBtn.textContent = 'Opening your messages...';
    setTimeout(function () {
      submitBtn.textContent = 'Send My Request';
      submitBtn.disabled = false;
    }, 3000);
  });
})();

// === SCROLL REVEAL ===
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (el) { observer.observe(el); });
})();

// === FOOTER YEAR ===
(function () {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// === SMOOTH SCROLL ===
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('nav').offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
