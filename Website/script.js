// ============================================================
//  RABINDRA KARKI — Shared script.js
//  Works on every page of the multi-page website.
//  Features: navbar scroll, mobile menu, scroll reveal,
//            project filter, contact form validation.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR — darken on scroll ──────────────────────────
  const navbar = document.getElementById('navbar');

  if (navbar && !navbar.classList.contains('always-dark')) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── 2. MOBILE MENU TOGGLE ─────────────────────────────────
  const menuToggle  = document.getElementById('menuToggle');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      const [s1, s2, s3] = menuToggle.querySelectorAll('span');
      if (isOpen) {
        s1.style.transform = 'translateY(6.5px) rotate(45deg)';
        s2.style.opacity   = '0';
        s3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        s1.style.transform = s3.style.transform = '';
        s2.style.opacity   = '';
      }
    });

    // Close on any mobile link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove('open');
        menuToggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      }
    });
  }

  // ── 3. SCROLL REVEAL ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stagger siblings within the same parent
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
        );
        const idx   = siblings.indexOf(entry.target);
        const delay = Math.max(0, idx) * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold:   0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ── 4. PROJECT FILTER BUTTONS (projects.html) ─────────────
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectItems.forEach(item => {
          const cat = item.dataset.category || '';
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ── 5. CONTACT FORM ───────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formNote    = document.getElementById('formNote');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm && formNote && submitBtn) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = document.getElementById('name')?.value.trim();
      const email   = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        formNote.textContent  = '⚠ Please fill in all required fields.';
        formNote.style.color  = '#e07a5f';
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formNote.textContent  = '⚠ Please enter a valid email address.';
        formNote.style.color  = '#e07a5f';
        return;
      }

      // Simulate sending (replace this block with Formspree or EmailJS)
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;
      formNote.textContent  = '';

      setTimeout(() => {
        formNote.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formNote.style.color = '#b8975a';
        contactForm.reset();
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled    = false;

        // Clear success message after 6 seconds
        setTimeout(() => { formNote.textContent = ''; }, 6000);
      }, 1400);

      // ── TO CONNECT A REAL BACKEND, REPLACE THE ABOVE TIMEOUT WITH: ──
      //
      // fetch('https://formspree.io/f/YOUR_FORM_ID', {
      //   method:  'POST',
      //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      //   body:    JSON.stringify({ name, email, message })
      // })
      // .then(res => {
      //   if (res.ok) {
      //     formNote.textContent = '✓ Message sent!';
      //     formNote.style.color = '#b8975a';
      //     contactForm.reset();
      //   } else {
      //     formNote.textContent = '✗ Something went wrong. Please email directly.';
      //     formNote.style.color = '#e07a5f';
      //   }
      //   submitBtn.textContent = 'Send Message →';
      //   submitBtn.disabled    = false;
      // });
    });
  }

  // ── 6. SMOOTH SCROLL for anchor links on index.html ───────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 7. ACTIVE NAV HIGHLIGHT on index.html (section spy) ───
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.style.color = '');
          const active = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (active) active.style.color = 'var(--gold)';
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  console.log(
    '%cRabindra Karki · Geology Portfolio',
    'color:#b8975a; font-family:serif; font-size:1.1rem; font-style:italic;'
  );

});
