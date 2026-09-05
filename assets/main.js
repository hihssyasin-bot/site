/**
 * Yasin Cheraghcheshm — Kinetic Editorial Engine
 * Vanilla JavaScript v2.4 (No dependencies, Cloudflare Pages ready)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTehranClock();
  initMobileNav();
  initFilterChips();
  initColorSwatches();
  initTelegramOrderBuilder();
  initCopyButtons();
  initSmoothAnchorScroll();
});

/* 1. Real-Time Tehran Clock (IRST / IRDT) */
function initTehranClock() {
  const clockElement = document.getElementById('tehran-clock');
  if (!clockElement) return;

  function updateTime() {
    try {
      const now = new Date();
      // Format time in Asia/Tehran timezone with 24-hour display
      const options = {
        timeZone: 'Asia/Tehran',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      clockElement.textContent = formatter.format(now) + ' IRST';
    } catch (e) {
      // Fallback
      const now = new Date();
      clockElement.textContent = now.toTimeString().split(' ')[0] + ' UTC';
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* 2. Mobile Navigation Toggle */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.innerHTML = isOpen
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  });
}

/* 3. Category Filter for Products / Interests Page */
function initFilterChips() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.interest-card');

  if (!filterChips.length || !cards.length) return;

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* 4. Interactive Color Palette Swatches */
function initColorSwatches() {
  const swatches = document.querySelectorAll('.palette-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      const name = swatch.getAttribute('data-name') || color;
      if (color) {
        copyToClipboard(color, `کد رنگ ${name} (${color}) کپی شد.`);
      }
    });
  });
}

/* 5. Interactive Telegram Order Builder */
function initTelegramOrderBuilder() {
  const form = document.getElementById('telegram-order-form');
  const previewBox = document.getElementById('telegram-preview-text');
  const submitBtn = document.getElementById('telegram-submit-action');
  const copyBtn = document.getElementById('copy-telegram-msg');

  if (!form || !previewBox || !submitBtn) return;

  function generateMessage() {
    const projectTypeInput = form.querySelector('input[name="project_type"]:checked');
    const projectType = projectTypeInput ? projectTypeInput.value : 'همکاری عمومی';

    const clientName = (document.getElementById('client-name')?.value || '').trim() || 'نامشخص';
    const clientContact = (document.getElementById('client-contact')?.value || '').trim() || 'نامشخص';
    const clientBudget = (document.getElementById('client-budget')?.value || '').trim() || 'توافقی';
    const clientTimeline = (document.getElementById('client-timeline')?.value || '').trim() || 'منعطف';
    const clientDesc = (document.getElementById('client-desc')?.value || '').trim() || 'گفتگوی مقدماتی و بررسی ابعاد همکاری';

    const message = 
`درود یاسین عزیز،
درخواست ثبت‌شده از وب‌سایت شخصی:

• موضوع همکاری: ${projectType}
• متقاضی: ${clientName}
• شناسه تماس / تلگرام: ${clientContact}
• بودجه برآوردی: ${clientBudget}
• زمان‌بندی مدنظر: ${clientTimeline}

• شرح خلاصه نیاز:
${clientDesc}

— ارسال شده از طریق سیستم پرونده تحلیلی`;

    previewBox.textContent = message;

    // Telegram Direct URL (URL encoded)
    const telegramUsername = 'yasin_cheraghcheshm';
    const encodedMsg = encodeURIComponent(message);
    submitBtn.href = `https://t.me/${telegramUsername}?text=${encodedMsg}`;
  }

  // Bind live change events
  form.addEventListener('input', generateMessage);
  form.addEventListener('change', generateMessage);

  // Initialize first preview
  generateMessage();

  // Copy Preview Button
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(previewBox.textContent, 'متن پیام آماده برای ارسال در تلگرام کپی شد.');
    });
  }
}

/* 6. Copy Buttons for Handles & Emails */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || text;
      copyToClipboard(text, `${label} با موفقیت در کلیپ‌بورد کپی شد.`);
    });
  });
}

/* Helper: Copy to Clipboard + Toast */
function copyToClipboard(text, successMessage) {
  if (!navigator.clipboard) {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch (err) {
      showToast('خطا در کپی متن');
    }
    document.body.removeChild(textarea);
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage);
  }).catch(() => {
    showToast('خطا در دسترسی به کلیپ‌بورد');
  });
}

/* Toast System */
let toastTimeout = null;
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* 7. Smooth Anchor Scroll */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
