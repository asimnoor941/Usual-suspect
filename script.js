/* ============================================================
   THE USUAL SUSPECTS: script.js
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
    // Fallback for old browsers: just show everything
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
      }, 3400);   // wait for the neon sign to finish switching on
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
    el.classList.add('typing');   // hides the pink dot until this line has been typed
    el.style.cssText = 'opacity:1;transform:none;transition:none;';
  });
  // Polaroids + the "come see" link: each carries data-line and appears
  // when that line has finished typing (the last line also gets its glow).
  function lineDone(i) {
    section.querySelectorAll('[data-line="' + i + '"]').forEach(function (x) { x.classList.add('shown'); });
    if (i === els.length - 1) els[i].classList.add('landed');
  }
  if (reducedMotion) {
    els.forEach(function (el, i) { el.textContent = texts[i]; el.classList.remove('typing'); lineDone(i); });
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
        setTimeout(function () { cur.remove(); el.classList.remove('typing'); if (onDone) onDone(); }, 380);
      }
    }, 48);
  }
  function runSeq(i) {
    if (i >= els.length) return;
    typeEl(els[i], texts[i], function () { lineDone(i); setTimeout(function () { runSeq(i + 1); }, 180); });
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

/* ---- CHRISTMAS THEME · SNOW + STRING LIGHTS ----
   Runs only when <body class="xmas">. Remove that class to switch it off. */
(function () {
  if (!document.body.classList.contains('xmas')) return;

  // String lights, hung just under the pink ticker tape
  var tape = document.querySelector('.tape');
  var lights = document.createElement('div');
  lights.className = 'xmas-lights';
  lights.setAttribute('aria-hidden', 'true');
  document.body.appendChild(lights);
  function placeLights() {
    if (tape) lights.style.top = tape.offsetHeight + 'px';
  }
  placeLights();
  window.addEventListener('resize', placeLights);

  // Falling snow (skipped for visitors who prefer reduced motion)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var snow = document.createElement('div');
  snow.className = 'xmas-snow';
  snow.setAttribute('aria-hidden', 'true');
  var count = window.innerWidth < 768 ? 22 : 45;
  for (var i = 0; i < count; i++) {
    var f = document.createElement('span');
    var isCrystal = i % 4 === 0;
    var size, dur = 9 + Math.random() * 12;
    if (isCrystal) {
      size = 12 + Math.random() * 12;
      f.className = 'xmas-flake' + (i % 8 === 0 ? ' pink' : '');
      f.textContent = '❄';
      f.style.fontSize = size + 'px';
    } else {
      size = 2 + Math.random() * 4;
      f.className = 'xmas-flake dot';
      f.style.width = f.style.height = size + 'px';
    }
    f.style.left = (Math.random() * 100) + '%';
    f.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);
    f.style.animationDuration = dur.toFixed(1) + 's';
    f.style.animationDelay = (-Math.random() * dur).toFixed(1) + 's';
    f.style.setProperty('--drift', Math.round(Math.random() * 160 - 80) + 'px');
    f.style.setProperty('--spin', Math.round(Math.random() * 360 - 180) + 'deg');
    snow.appendChild(f);
  }
  document.body.appendChild(snow);
})();
/* ---- SCROLL ANIMATIONS ----
   1. Progress bar across the top as you scroll
   2. Sections slide / fade / zoom in as they enter the screen
   3. Parallax: hero headline, hero photo and big images drift with the scroll
   All skipped for visitors who prefer reduced motion. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* -- 2. reveal on scroll -- */
  var plan = [
    // selector, effect, columns to stagger across (0 = no stagger)
    ['.wall-head',              'sa-up',    0],
    ['.wall-foot',              'sa-up',    0],
    ['.menu-head h2',           'sa-up',    0],
    ['.menu-cta',               'sa-up',    0],
    ['.door-img',               'sa-left',  0],
    ['.door-body',              'sa-right', 0],
    ['.live-head h2',           'sa-up',    0],
    ['.live-head p',            'sa-up',    0],
    ['.promo',                  'sa-zoom',  5],
    ['.private-img',            'sa-left',  0],
    ['.private-body',           'sa-right', 0],
    ['footer .foot-mark',       'sa-up',    0]
  ];

  function show(el) {
    el.classList.add('sa-in');
    var delay = parseFloat(el.style.getPropertyValue('--sa-delay')) || 0;
    // Once it has landed, hand the element back to its normal hover styles
    setTimeout(function () {
      el.classList.remove('sa', 'sa-up', 'sa-left', 'sa-right', 'sa-zoom', 'sa-in');
      el.style.removeProperty('--sa-delay');
    }, (delay + 1) * 1000);
  }

  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      revealIO.unobserve(e.target);
      show(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  plan.forEach(function (row) {
    document.querySelectorAll(row[0]).forEach(function (el, i) {
      el.classList.remove('reveal');
      el.classList.add('sa', row[1]);
      if (row[2]) el.style.setProperty('--sa-delay', ((i % row[2]) * 0.12) + 's');
      revealIO.observe(el);
    });
  });

  // Photo wall: deal the polaroids out one after another when the wall arrives
  var wallTrack = document.getElementById('wallTrack');
  if (wallTrack) {
    var pols = wallTrack.querySelectorAll('.polaroid');
    pols.forEach(function (el, i) {
      el.classList.add('sa', 'sa-up');
      el.style.setProperty('--sa-delay', (Math.min(i, 6) * 0.09) + 's');
    });
    var wallIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      wallIO.disconnect();
      pols.forEach(show);
    }, { threshold: 0.2 });
    wallIO.observe(wallTrack);
  }

  /* -- 1 + 3. progress bar and parallax -- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var hero    = document.querySelector('.hero');
  var row1    = document.querySelector('.hero-headline .row1');
  var row2    = document.querySelector('.hero-headline .row2');
  var photo   = document.querySelector('.hero-photo');
  var heroBg  = document.querySelector('.hero-bg');
  var arrow   = document.querySelector('.hero-arrow');

  var drifters = [];
  var doorImg = document.querySelector('.door-img img');
  if (doorImg) { doorImg.classList.add('px-zoom'); drifters.push({ el: doorImg, range: 44 }); }
  var privImg = document.querySelector('.private-img img');
  if (privImg) drifters.push({ el: privImg, range: 30 });

  var ticking = false;
  function update() {
    ticking = false;
    var y = window.pageYOffset;
    var vh = window.innerHeight;
    var wide = window.innerWidth > 900;
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';

    if (hero && y < hero.offsetHeight) {
      var k = wide ? 0.14 : 0.06;
      if (row1) row1.style.translate = (-y * k) + 'px 0';
      if (row2) row2.style.translate = (y * k) + 'px 0';
      if (photo) photo.style.translate = wide ? '0 ' + (-y * 0.12) + 'px' : '';
      // 3-D: the hero photo turns away as you scroll past it
      if (photo) photo.style.rotate = wide ? 'y ' + Math.min(y * 0.05, 28).toFixed(1) + 'deg' : '';
      if (heroBg) heroBg.style.translate = '0 ' + (y * 0.25) + 'px';
      if (arrow) arrow.style.opacity = Math.max(0, 1 - y / 220);
    }

    drifters.forEach(function (d) {
      var r = d.el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var pos = ((r.top + r.height / 2) - vh / 2) / vh;   // -0.5 … 0.5 while on screen
      d.el.style.translate = '0 ' + (pos * -d.range).toFixed(1) + 'px';
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
/* ---- CHRISTMAS POPUP · TWINKLING TREE LIGHTS ----
   Each entry is [left %, top %, colour], placed over a bulb in the tree photo. */
(function () {
  var tree = document.getElementById('popupTree');
  if (!tree) return;
  var G = '#5dff9b', Y = '#ffe27a', O = '#ffb347', C = '#7fe9ff', W = '#ffffff';
  var bulbs = [
    [26.6,  8.2, G], [68.0,  7.8, G], [47.7, 15.6, Y], [31.3, 20.5, C],
    [52.0, 29.3, W], [36.8, 35.6, Y], [72.0, 36.1, O], [33.0, 48.5, C],
    [28.6, 52.7, O], [57.3, 52.5, W], [36.0, 62.5, Y], [83.3, 64.5, G],
    [77.6, 67.2, O], [61.6, 67.4, O], [12.2, 72.3, O], [87.7, 79.6, O],
    [79.9, 80.9, G], [86.3, 85.9, G], [16.5, 87.6, Y], [69.1, 87.2, Y],
    [42.2, 91.8, G]
  ];
  bulbs.forEach(function (b) {
    var dot = document.createElement('span');
    dot.className = 'tree-light';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.left = b[0] + '%';
    dot.style.top = b[1] + '%';
    dot.style.setProperty('--c', b[2]);
    dot.style.setProperty('--d', (1.2 + Math.random() * 1.6).toFixed(2) + 's');
    dot.style.setProperty('--w', (-Math.random() * 2.5).toFixed(2) + 's');
    tree.appendChild(dot);
  });
})();

/* ---- 3-D FOOD WHEEL ----
   Lays the menu dishes along the rim of a very large wheel, so you only see
   a gentle arc of it and the dishes roll off both sides of the screen.
   Spin it by dragging, swiping, two-finger sideways scroll, the arrow
   buttons, or the left/right keys. It loops forever. Without JavaScript the
   dishes simply stay in their normal grid. */
(function () {
  var grid = document.querySelector('.menu-grid');
  if (!grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.dish-card'));
  var N = cards.length;
  if (N < 5) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WHEEL SIZE: radius = photo width x this number. Bigger = flatter, wider wheel.
  var RADIUS_FACTOR = 3;
  // Gap between dishes along the rim, as a multiple of the photo width.
  var SPACING = 1.12;

  // Build: grid > stage > cards
  var ring = document.createElement('div');
  ring.className = 'wheel-ring';
  cards.forEach(function (c) {
    c.classList.remove('reveal', 'in');
    var img = c.querySelector('img');
    if (img) { img.setAttribute('draggable', 'false'); img.loading = 'eager'; }
    ring.appendChild(c);
  });
  grid.appendChild(ring);
  grid.classList.add('wheel');
  grid.setAttribute('tabindex', '0');
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', 'Dishes. Use the arrow keys or drag to spin.');

  // Arrows + counter
  var nav = document.createElement('div');
  nav.className = 'wheel-nav';
  var prev = document.createElement('button');
  prev.className = 'wheel-btn'; prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous dish'); prev.textContent = '←';
  var hint = document.createElement('span');
  hint.className = 'wheel-hint'; hint.setAttribute('aria-live', 'polite');
  var next = document.createElement('button');
  next.className = 'wheel-btn'; next.type = 'button';
  next.setAttribute('aria-label', 'Next dish'); next.textContent = '→';
  nav.appendChild(prev); nav.appendChild(hint); nav.appendChild(next);
  grid.parentNode.insertBefore(nav, grid.nextSibling);

  var W = 340, R = 1020;                 // photo width, wheel radius (set in layout)
  var stepDeg = SPACING / RADIUS_FACTOR * 180 / Math.PI;   // degrees between dishes
  var pos = 0;                           // which dish is in front (can be fractional mid-drag)
  var lastOff = [];                      // each card's last slot, to spot wrap-arounds
  var half = N / 2;

  // Slot of card i relative to the front: 0 = front, -1 = one to the left, ...
  function slot(i) {
    var o = (i - pos) % N;
    if (o < -half) o += N;
    if (o >= half) o -= N;
    return o;
  }
  function place(c, o) {
    c.style.transform = 'rotateY(' + (o * stepDeg).toFixed(2) + 'deg) translateZ(' + R + 'px)';
    var a = Math.abs(o);
    c.style.opacity = a <= 2 ? 1 : Math.max(0, 1 - (a - 2) / 0.7).toFixed(2);
    c.style.filter = 'brightness(' + (1 - 0.26 * Math.min(a, 2.5)).toFixed(2) + ')';
  }

  function render() {
    ring.style.transform = 'translateZ(' + (-R) + 'px)';
    var front = ((Math.round(pos) % N) + N) % N;
    cards.forEach(function (c, i) {
      var o = slot(i);
      // A card that loops round the back must not fly across the screen:
      // jump it (no animation) to the far side first, then let it roll in.
      if (lastOff[i] !== undefined && Math.abs(o - lastOff[i]) > half) {
        c.style.transition = 'none';
        place(c, lastOff[i] + (o > lastOff[i] ? N : -N));
        void c.offsetWidth;
        c.style.transition = '';
      }
      place(c, o);
      lastOff[i] = o;
      c.classList.toggle('is-front', i === front);
      c.setAttribute('aria-hidden', i === front ? 'false' : 'true');
    });
    hint.innerHTML = 'drag or swipe &nbsp;<b>' + (front + 1) + ' / ' + N + '</b>';
  }

  function layout() {
    W = Math.round(Math.min(340, grid.clientWidth * 0.68));
    R = Math.round(W * RADIUS_FACTOR);
    grid.style.setProperty('--wheel-w', W + 'px');
    var tallest = 0;
    cards.forEach(function (c) { tallest = Math.max(tallest, c.offsetHeight); });
    grid.style.setProperty('--wheel-h', (tallest + 20) + 'px');
    render();
  }

  function snap() { pos = Math.round(pos); render(); }
  function go(dir) { pos = Math.round(pos) + dir; render(); }

  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  grid.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { go(-1); e.preventDefault(); }
  });

  // Drag / swipe
  var down = false, dragging = false, startX = 0, startPos = 0;
  grid.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    down = true; dragging = false; startX = e.clientX; startPos = pos;
  });
  window.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (!dragging && Math.abs(dx) > 6) { dragging = true; grid.classList.add('dragging'); }
    if (!dragging) return;
    pos = startPos - dx / (W * SPACING);   // dishes follow your finger
    render();
  });
  function release() {
    if (!down) return;
    down = false;
    if (dragging) { dragging = false; grid.classList.remove('dragging'); snap(); }
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);

  // Two-finger sideways scroll on a trackpad (up/down still scrolls the page)
  var wheelTimer = null;
  grid.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    grid.classList.add('dragging');
    pos += e.deltaX / (W * SPACING);
    render();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { grid.classList.remove('dragging'); snap(); }, 140);
  }, { passive: false });

  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);

  // Scrolling down to the menu rolls the wheel into place
  if (!reduced && 'IntersectionObserver' in window) {
    pos = -2;
    grid.classList.add('dragging');   // no animation while we pre-roll
    layout();
    var spinIO = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      spinIO.disconnect();
      grid.classList.remove('dragging');
      grid.classList.add('rolling-in');
      pos = 0; render();
      setTimeout(function () { grid.classList.remove('rolling-in'); }, 1700);
    }, { threshold: 0.35 });
    spinIO.observe(grid);
  } else {
    layout();
  }
})();

/* ---- NEON SIGN · ONE BUZZING LETTER ----
   Splits "USUAL" into letters so a single tube can keep flickering after
   the sign has switched on (the switch-on itself is pure CSS). */
(function () {
  var row = document.querySelector('.hero-headline .row1');
  var h1 = document.getElementById('heroHeadline');
  if (!row || !h1) return;
  var text = row.textContent;
  h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
  row.textContent = '';
  for (var i = 0; i < text.length; i++) {
    var s = document.createElement('span');
    s.className = 'neon-letter' + (i === text.length - 2 ? ' buzz' : '');
    s.setAttribute('aria-hidden', 'true');
    s.textContent = text[i];
    row.appendChild(s);
  }
})();

/* ---- LIVE "OPEN NOW" BADGE ----
   A small pill beside the logo that reads the real time in New Jersey and
   says whether the bar is open, when it closes or next opens, and what is
   on tonight. EDIT THE HOURS AND EVENTS HERE if they change
   (hours are 24-hour clock: 12 = noon, 22 = 10 PM, 24 = midnight). */
(function () {
  var nav = document.querySelector('nav');
  var logo = nav && nav.querySelector('.logo-mark');
  if (!nav || !logo || !window.Intl) return;

  //            Sun       Mon   Tue       Wed       Thu       Fri       Sat
  var HOURS  = [[12, 20], null, [12, 22], [12, 22], [12, 22], [12, 24], [12, 24]];
  var EVENTS = ['NFL Sunday', '', '', 'Karaoke 8 PM', 'Single Ladies 8 PM',
                'Espresso Martini Night', 'Live Acoustic 8–11'];
  var DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  var pill = document.createElement('a');
  pill.className = 'open-pill';
  pill.href = '#location';
  pill.innerHTML = '<span class="open-dot" aria-hidden="true"></span>' +
                   '<span class="open-text"></span><span class="open-extra"></span>';
  logo.parentNode.insertBefore(pill, logo.nextSibling);
  var textEl = pill.querySelector('.open-text');
  var extraEl = pill.querySelector('.open-extra');

  function clock(h) {            // 22 -> "10 PM", 24 -> "midnight", 12 -> "noon"
    if (h === 24 || h === 0) return 'midnight';
    if (h === 12) return 'noon';
    return (h > 12 ? h - 12 : h) + (h >= 12 ? ' PM' : ' AM');
  }

  function njNow() {             // current day + time at the bar, wherever the visitor is
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', weekday: 'short',
      hour: 'numeric', minute: 'numeric', hour12: false
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: DAYS.indexOf(o.weekday), t: (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60 };
  }

  function update() {
    var now = njNow();
    if (now.day < 0) return;
    var today = HOURS[now.day];
    var open = !!today && now.t >= today[0] && now.t < today[1];
    var text, extra = '';

    if (open) {
      var left = today[1] - now.t;
      text = left <= 1 ? 'Open · closing at ' + clock(today[1])
                       : 'Open now · till ' + clock(today[1]);
      extra = EVENTS[now.day];
    } else if (today && now.t < today[0]) {
      text = 'Opens today at ' + clock(today[0]);
      extra = EVENTS[now.day];
    } else {
      var d = now.day, n = 0;
      do { d = (d + 1) % 7; n++; } while (!HOURS[d] && n < 8);
      text = 'Closed · opens ' + (n === 1 ? 'tomorrow' : DAYS[d]) + ' at ' + clock(HOURS[d][0]);
    }

    pill.classList.toggle('is-open', open);
    textEl.textContent = text;
    extraEl.textContent = extra ? ' · ' + extra : '';
    pill.setAttribute('aria-label', text + (extra ? ', tonight: ' + extra : ''));
  }

  update();
  setInterval(update, 60000);
})();

/* ---- TONIGHT'S EVENT CARD LIGHTS UP ----
   Each event card in "Live this week" has data-day="0-6" (0 = Sunday).
   The card for today (New Jersey time) glows and gets a TONIGHT tag.
   On a day with no event, the next one coming up is tagged instead. */
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.promo[data-day]'));
  if (!cards.length || !window.Intl) return;
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var wd = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short' }).format(new Date());
  var today = DAYS.indexOf(wd);
  if (today < 0) return;

  var pick = null, isTonight = false;
  for (var ahead = 0; ahead < 7 && !pick; ahead++) {
    var day = (today + ahead) % 7;
    for (var i = 0; i < cards.length; i++) {
      if (parseInt(cards[i].getAttribute('data-day'), 10) === day) { pick = cards[i]; isTonight = ahead === 0; break; }
    }
  }
  if (!pick) return;

  var tag = document.createElement('span');
  tag.className = 'tonight-tag';
  if (isTonight) {
    pick.classList.add('tonight');
    tag.textContent = 'Tonight';
  } else {
    pick.classList.add('next-up');
    tag.textContent = 'Next up · ' + DAYS[parseInt(pick.getAttribute('data-day'), 10)];
  }
  pick.appendChild(tag);
})();

/* ---- PHOTO LIGHTBOX · "INSIDE THE HOUSE" ----
   Tap or click a polaroid to open it full screen. Then swipe, use the
   arrows, or the left/right keys to move through the photos. Esc, the X,
   or a tap on the dark background closes it. */
(function () {
  var track = document.getElementById('wallTrack');
  if (!track) return;
  var items = Array.prototype.slice.call(track.querySelectorAll('.polaroid'));
  if (!items.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Photo viewer');
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML =
    '<button class="lb-btn lb-close" type="button" aria-label="Close photo">×</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="Previous photo">←</button>' +
    '<figure class="lb-frame"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
    '<button class="lb-btn lb-next" type="button" aria-label="Next photo">→</button>' +
    '<div class="lb-count" aria-hidden="true"></div>';
  document.body.appendChild(box);

  var img = box.querySelector('.lb-img');
  var cap = box.querySelector('.lb-cap');
  var count = box.querySelector('.lb-count');
  var frame = box.querySelector('.lb-frame');
  var closeBtn = box.querySelector('.lb-close');
  var index = 0, lastFocus = null;

  function show(i, dir) {
    index = (i + items.length) % items.length;
    var src = items[index].querySelector('img');
    var c = items[index].querySelector('.cap');
    frame.classList.remove('lb-in-left', 'lb-in-right');
    void frame.offsetWidth;                      // restart the slide-in animation
    if (dir) frame.classList.add(dir > 0 ? 'lb-in-right' : 'lb-in-left');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = c ? c.textContent : '';
    count.textContent = (index + 1) + ' / ' + items.length;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i, 0);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Open on click, but not when the click was really the end of a drag
  var downX = 0, downY = 0;
  track.addEventListener('pointerdown', function (e) { downX = e.clientX; downY = e.clientY; });
  items.forEach(function (el, i) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Open photo: ' + ((el.querySelector('.cap') || {}).textContent || ''));
    el.addEventListener('click', function (e) {
      if (Math.abs(e.clientX - downX) > 8 || Math.abs(e.clientY - downY) > 8) return;
      open(i);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  closeBtn.addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1, -1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1, 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1, 1);
    if (e.key === 'ArrowLeft') show(index - 1, -1);
  });

  // Swipe on phones
  var sx = null, sy = 0;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });
})();

/* ---- DISCO BALL · PRIVATE ROOM ----
   Hangs a small mirror ball in the Private Room section. Moving the mouse
   over the section makes it swing gently on its string. */
(function () {
  var section = document.querySelector('.private');
  if (!section) return;

  var ball = document.createElement('div');
  ball.className = 'disco-ball';
  ball.setAttribute('aria-hidden', 'true');
  section.appendChild(ball);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;
  section.addEventListener('mousemove', function (e) {
    var r = section.getBoundingClientRect();
    var mx = (e.clientX - r.left) / r.width - 0.5;
    ball.style.rotate = (mx * 14).toFixed(1) + 'deg';
  });
  section.addEventListener('mouseleave', function () { ball.style.rotate = ''; });
})();

/* ---- SCROLL MARTINI ----
   A martini glass in the bottom-right corner that fills with pink as you
   scroll down the page (it replaces the thin gold progress bar).
   Click it to glide back to the top. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'scroll-glass';
  btn.setAttribute('aria-label', 'Back to top');
  btn.title = 'Back to top';
  btn.innerHTML =
    '<svg viewBox="0 0 60 84" width="60" height="84" aria-hidden="true">' +
      '<defs><clipPath id="glassBowl"><path d="M6 10 L54 10 L30 42 Z"/></clipPath></defs>' +
      '<g clip-path="url(#glassBowl)">' +
        '<rect class="glass-liquid" x="0" y="42" width="60" height="0"/>' +
        '<rect class="glass-shine" x="0" y="42" width="60" height="1.6"/>' +
      '</g>' +
      '<path class="glass-line" d="M4 8 L56 8 L30 43 Z"/>' +
      '<path class="glass-line" d="M30 43 L30 74 M17 76 L43 76"/>' +
      '<path class="glass-pick" d="M27 30 L50 2"/>' +
      '<circle class="glass-olive" cx="38" cy="17" r="4.6"/>' +
      '<circle class="glass-pimento" cx="39.4" cy="15.6" r="1.4"/>' +
    '</svg>';
  document.body.appendChild(btn);
  document.body.classList.add('has-scroll-glass');

  var liquid = btn.querySelector('.glass-liquid');
  var shine = btn.querySelector('.glass-shine');
  var TOP = 12, BOTTOM = 42;      // liquid level range inside the bowl
  var ticking = false;

  function update() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(Math.max(window.pageYOffset / max, 0), 1) : 0;
    var h = (BOTTOM - TOP) * p;
    liquid.setAttribute('y', (BOTTOM - h).toFixed(2));
    liquid.setAttribute('height', h.toFixed(2));
    shine.setAttribute('y', (BOTTOM - h).toFixed(2));
    shine.style.opacity = p > 0.03 ? 1 : 0;
    btn.classList.toggle('is-visible', window.pageYOffset > 120);
    btn.classList.toggle('is-full', p > 0.985);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  btn.addEventListener('click', function () {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
})();

/* ---- FIND US · HIGHLIGHT TODAY'S HOURS ----
   Marks today's row in the hours list (New Jersey time) and adds an
   "open now" / "closed now" tag to it. Hours themselves: see the
   LIVE "OPEN NOW" BADGE block above. */
(function () {
  var rows = document.querySelectorAll('.hours-row[data-days]');
  if (!rows.length || !window.Intl) return;
  var HOURS = [[12, 20], null, [12, 22], [12, 22], [12, 22], [12, 24], [12, 24]];
  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function update() {
    var o = {};
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short',
      hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date())
      .forEach(function (p) { o[p.type] = p.value; });
    var day = DAYS.indexOf(o.weekday);
    var t = (parseInt(o.hour, 10) % 24) + parseInt(o.minute, 10) / 60;
    var h = HOURS[day];
    var open = !!h && t >= h[0] && t < h[1];
    rows.forEach(function (row) {
      var mine = row.getAttribute('data-days').split(',').indexOf(String(day)) > -1;
      row.classList.toggle('today', mine);
      var tag = row.querySelector('.now');
      if (!mine) { if (tag) tag.remove(); return; }
      if (!tag) { tag = document.createElement('span'); tag.className = 'now'; row.querySelector('.d').appendChild(tag); }
      tag.textContent = open ? 'Open now' : (h && t < h[0] ? 'Opens at noon' : 'Closed now');
      tag.classList.toggle('shut', !open);
    });
  }
  update();
  setInterval(update, 60000);
})();

/* ---- SEO · UPCOMING EVENTS FOR GOOGLE AND AI ASSISTANTS ----
   Search engines only understand events that have real dates. This writes
   the next four weeks of each weekly night into the page as structured
   data, so the dates never go stale. EDIT THE WEEKLY NIGHTS HERE. */
(function () {
  var NIGHTS = [
    // day (0 = Sunday), name, start, end, description
    [3, 'Karaoke Wednesdays', '20:00', '', 'Karaoke with DJ Melly Mel every Wednesday from 8 PM. No cover. Kitchen open till 10.'],
    [4, 'Single Ladies Night', '20:00', '', 'Half off pours from 8 PM every Thursday.'],
    [5, 'Espresso Martini Night', '', '', 'Espresso martinis, cocktails and music every Friday.'],
    [6, 'Live Acoustic Night', '20:00', '23:00', 'Live acoustic music every Saturday from 8 to 11 PM.'],
    [0, 'NFL Sundays', '', '', 'Every NFL game on the screens with the volume up, every Sunday.']
  ];
  var place = {
    '@type': 'BarOrPub', '@id': 'https://usualsuspectsnj.com/#business', name: 'The Usual Suspects',
    address: { '@type': 'PostalAddress', streetAddress: '46 Thompson Street', addressLocality: 'Raritan',
               addressRegion: 'NJ', postalCode: '08869', addressCountry: 'US' }
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  var today = new Date(), events = [];
  for (var d = 0; d < 28; d++) {
    var day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d);
    NIGHTS.forEach(function (n) {
      if (day.getDay() !== n[0]) return;
      var date = day.getFullYear() + '-' + pad(day.getMonth() + 1) + '-' + pad(day.getDate());
      var ev = {
        '@type': 'Event', name: n[1] + ' at The Usual Suspects', description: n[4],
        startDate: n[2] ? date + 'T' + n[2] : date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: place, organizer: { '@id': 'https://usualsuspectsnj.com/#business' },
        image: 'https://usualsuspectsnj.com/images/' + (n[0] === 6 ? 'acoustic-night.jpg' : 'hero.jpg'),
        url: 'https://usualsuspectsnj.com/#events'
      };
      if (n[3]) ev.endDate = date + 'T' + n[3];
      events.push(ev);
    });
  }
  var tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.id = 'ldEvents';
  tag.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': events });
  document.head.appendChild(tag);
})();
