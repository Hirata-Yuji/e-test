/**
 * En Journey - Main Script
 */
document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Menu ────────────────────────────────
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('.nav-main');

  // Build mobile nav
  const mobileNav = document.createElement('div');
  mobileNav.className = 'nav-mobile';
  if (nav) {
    nav.querySelectorAll('li').forEach(li => {
      const clone = document.createElement('div');
      clone.className = 'nav-mobile-item';
      clone.innerHTML = li.innerHTML;
      mobileNav.appendChild(clone);
    });
  }
  // Add lang switcher to mobile nav
  const langWrap = document.createElement('div');
  langWrap.className = 'nav-mobile-lang';
  ['ja','en','zh','th','ko'].forEach(lang => {
    const labels = { ja:'JP', en:'EN', zh:'中文', th:'ภาษาไทย', ko:'한국어' };
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.dataset.lang = lang;
    btn.textContent = labels[lang];
    btn.addEventListener('click', () => {
      if (typeof setLang === 'function') setLang(lang);
      closeMobileNav();
    });
    langWrap.appendChild(btn);
  });
  mobileNav.appendChild(langWrap);
  document.body.appendChild(mobileNav);

  function openMobileNav()  { mobileNav.classList.add('open');  toggle && toggle.classList.add('open');  document.body.style.overflow = 'hidden'; }
  function closeMobileNav() { mobileNav.classList.remove('open'); toggle && toggle.classList.remove('open'); document.body.style.overflow = ''; }

  if (toggle) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
  }

  // Close on backdrop click
  mobileNav.addEventListener('click', e => {
    if (e.target === mobileNav) closeMobileNav();
  });

  // ── Header Scroll ──────────────────────────────
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (header) {
      header.style.boxShadow = window.scrollY > 60
        ? '0 4px 24px rgba(0,0,0,0.1)'
        : '0 2px 12px rgba(0,0,0,0.06)';
    }
  }, { passive: true });

  // ── Scroll Animations ──────────────────────────
  const animTargets = document.querySelectorAll(
    '.feature-card, .service-card, .news-item, .officer-card, ' +
    '.value-card, .target-card, .recruit-card, .flow-step'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    animTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
      io.observe(el);
    });
  }

  // ── Smooth Scroll ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id === '#' || !id) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = (header ? header.offsetHeight : 72) + 16;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ── Active Nav Link ────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-main a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── Contact Form ───────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = form.querySelector('#cont_name')?.value.trim();
      const email   = form.querySelector('#cont_email')?.value.trim();
      const message = form.querySelector('#cont_msg')?.value.trim();
      const privacy = form.querySelector('#privacy')?.checked;
      const errors  = [];

      if (!name)    errors.push(currentLang === 'ja' ? 'お名前を入力してください。' : 'Please enter your name.');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                    errors.push(currentLang === 'ja' ? '正しいメールアドレスを入力してください。' : 'Please enter a valid email.');
      if (!message) errors.push(currentLang === 'ja' ? 'お問い合わせ内容を入力してください。' : 'Please enter your message.');
      if (!privacy) errors.push(currentLang === 'ja' ? 'プライバシーポリシーに同意してください。' : 'Please agree to the privacy policy.');

      if (errors.length) {
        alert(errors.join('\n'));
      } else {
        const successMsg = {
          ja: 'お問い合わせを送信しました。\n3営業日以内にご返信いたします。',
          en: 'Your message has been sent.\nWe will reply within 3 business days.',
          zh: '您的咨询已发送。\n我们将在3个工作日内回复。',
          th: 'ส่งข้อความของคุณแล้ว\nเราจะตอบกลับภายใน 3 วันทำการ',
          ko: '문의가 전송되었습니다.\n영업일 3일 이내에 답변드립니다.',
        };
        alert(successMsg[currentLang] || successMsg.ja);
        form.reset();
      }
    });
  }

  // ── Page Fade In ───────────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
});
