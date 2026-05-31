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

/* ---- CURSOR GLOW ---- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  var mx = 0, my = 0, gx = 0, gy = 0, started = false;
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!started) { gx = mx; gy = my; started = true; }
  });
  (function tick() {
    if (started) {
      gx += (mx - gx) * 0.07;
      gy += (my - gy) * 0.07;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
    }
    requestAnimationFrame(tick);
  })();
})();

/* ---- 3-D TILT · POLAROIDS ---- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.polaroid').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r  = card.getBoundingClientRect();
      var nx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      var ny = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transition = 'transform 0s';
      card.style.setProperty('transform',
        'perspective(600px) rotateX(' + (-ny * 14) + 'deg) rotateY(' + (nx * 18) + 'deg) translateY(-10px) scale(1.04)',
        'important');
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = '';
      card.style.removeProperty('transform');
    });
  });
})();

/* ---- MAGNETIC BUTTONS ---- */
(function () {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      btn.style.transition = 'background-color .25s, color .25s, border-color .25s, box-shadow .25s';
    });
    btn.addEventListener('mousemove', function (e) {
      var r  = btn.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
      var dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
      btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transition = '';
      btn.style.transform  = '';
    });
  });
})();

/* ---- STAT COUNTERS · PRIVATE ROOM ---- */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var section = document.querySelector('.private-stats');
  if (!section) return;
  function countUp(el, target) {
    var duration = 1400;
    function tick(now) {
      if (!tick.start) tick.start = now;
      var p    = Math.min((now - tick.start) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    section.querySelectorAll('.stat b').forEach(function (el) {
      var val = parseInt(el.textContent, 10);
      if (isNaN(val) || reducedMotion) return;
      countUp(el, val);
    });
  }, { threshold: 0.5 });
  io.observe(section);
})();

/* ---- TYPEWRITER · MANIFESTO ---- */
(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var section = document.querySelector('.manifesto');
  if (!section) return;
  var els = section.querySelectorAll('.reveal');
  var texts = [];
  els.forEach(function (el) {
    texts.push(el.textContent.trim());
    el.textContent = '';
    el.style.cssText = 'opacity:1;transform:none;transition:none;';
  });
  if (reducedMotion) {
    els.forEach(function (el, i) { el.textContent = texts[i]; });
    return;
  }
  function typeEl(el, text, onDone) {
    var i = 0;
    var cur = document.createElement('span');
    cur.className = 'tw-cursor';
    cur.textContent = '|';
    el.appendChild(cur);
    var iv = setInterval(function () {
      if (i < text.length) {
        cur.insertAdjacentText('beforebegin', text[i++]);
      } else {
        clearInterval(iv);
        setTimeout(function () { cur.remove(); if (onDone) onDone(); }, 380);
      }
    }, 48);
  }
  function runSeq(i) {
    if (i >= els.length) return;
    typeEl(els[i], texts[i], function () { setTimeout(function () { runSeq(i + 1); }, 180); });
  }
  if ('IntersectionObserver' in window) {
    var twIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { twIO.disconnect(); runSeq(0); }
    }, { threshold: 0.35 });
    twIO.observe(section);
  } else {
    runSeq(0);
  }
})();

