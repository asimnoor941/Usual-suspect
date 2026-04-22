/* ============================================================
   THE USUAL SUSPECTS — script.js
   Vanilla JavaScript. No libraries. No dependencies.
   ============================================================ */

(function () {
  'use strict';

  /* ---- SCROLL REVEAL ---- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    // Fallback for old browsers — just show everything
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- MOBILE MENU ---- */
  var menu = document.getElementById('mobileMenu');
  var burger = document.getElementById('hamburgerBtn');
  var closeBtn = document.getElementById('mobileCloseBtn');

  function openMenu() {
    menu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-close]').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  /* ---- DRAG-TO-SCROLL PHOTO WALL ---- */
  var wall = document.getElementById('wallTrack');
  if (wall) {
    var isDown = false, startX = 0, scrollLeft = 0;

    wall.addEventListener('mousedown', function (e) {
      isDown = true;
      startX = e.pageX - wall.offsetLeft;
      scrollLeft = wall.scrollLeft;
      wall.style.cursor = 'grabbing';
    });
    wall.addEventListener('mouseleave', function () {
      isDown = false;
      wall.style.cursor = 'grab';
    });
    wall.addEventListener('mouseup', function () {
      isDown = false;
      wall.style.cursor = 'grab';
    });
    wall.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - wall.offsetLeft;
      wall.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
    wall.style.cursor = 'grab';

    // Keyboard scroll support (a11y)
    wall.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { wall.scrollLeft += 320; e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { wall.scrollLeft -= 320; e.preventDefault(); }
    });
  }

  /* ---- CURRENT YEAR IN FOOTER (keeps © date fresh automatically) ---- */
  var yearEl = document.querySelector('.foot-meta');
  if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace(/©\s*\d{4}/, '© ' + new Date().getFullYear());
  }

  /* ---- MONTHLY POPUP ---- */
  var popup = document.getElementById('popupOverlay');
  var popupCloseBtn = document.getElementById('popupClose');

  if (popup && !popup.classList.contains('disabled')) {
    // Only show once per browser session
    var seen = false;
    try { seen = sessionStorage.getItem('popupSeen') === '1'; } catch (e) {}

    if (!seen) {
      setTimeout(function () {
        popup.classList.add('open');
        popup.setAttribute('aria-hidden', 'false');
      }, 1000);
    }

    function closePopup() {
      popup.classList.remove('open');
      popup.setAttribute('aria-hidden', 'true');
      try { sessionStorage.setItem('popupSeen', '1'); } catch (e) {}
    }

    if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
    // Close on backdrop click (but not card click)
    popup.addEventListener('click', function (e) {
      if (e.target === popup) closePopup();
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('open')) closePopup();
    });
  }

})();
