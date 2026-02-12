/* ============================================================
   Meme Valentine — script.js
   Funny · Interactive · Chaotic · Sweet
   ============================================================ */

(() => {
  'use strict';

  /* ── Reduced-motion preference ─────────────────────────── */
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── State ─────────────────────────────────────────────── */
  let noClickCount = 0;
  const extraYesBtns = [];
  let confettiRAF = null;
  let floatingInterval = null;

  /* ── DOM shorthand ─────────────────────────────────────── */
  const $ = (s) => document.querySelector(s);
  const intro          = $('#intro');
  const playBtn        = $('#play-btn');
  const content        = $('#content');
  const bgAudio        = $('#bg-audio');
  const yesBtn         = $('#yes-btn');
  const noBtn          = $('#no-btn');
  const buttonRow      = $('#button-row');
  const scoreboard     = $('#scoreboard');
  const photoViewer    = $('#photo-viewer');
  const viewerImage    = $('#viewer-image');
  const viewerClose    = $('#viewer-close');
  const analysisOvl    = $('#analysis-overlay');
  const errorOvl       = $('#error-overlay');
  const celebration    = $('#celebration');
  const confettiCanvas = $('#confetti-canvas');

  /* ── No-button text + behavior labels ──────────────────── */
  const noReactions = [
    { text: 'are you sure?',                            vibe: 'polite doubt' },
    { text: 'really?',                                  vibe: 'raised eyebrow' },
    { text: 'wrong answer bestie',                      vibe: 'sassy' },
    { text: 'the disrespect',                           vibe: 'dramatic' },
    { text: 'my therapist will hear about this',        vibe: 'tech meme' },
    { text: "I'm telling your mom",                     vibe: 'escalation' },
    { text: "you're breaking my heart and my code",     vibe: 'data meme' },
    { text: 'fine. I didn\'t want you anyway',          vibe: 'tsundere' },
    { text: 'this is cyberbullying',                    vibe: 'dramatic victim' },
    { text: 'goodbye cruel world',                      vibe: 'dramatic exit' },
  ];

  const extraYesLabels = [
    'Yes', 'Also Yes', 'Definitely', 'Absolutely', 'Obviously', 'Yep', 'Yes please',
  ];

  /* ════════════════════════════════════════════════════════
     INTRO — PLAY BUTTON STARTS EVERYTHING
     ════════════════════════════════════════════════════════ */
  function initIntro() {
    playBtn.addEventListener('click', function () {
      /* Start music — triggered by user click so browsers allow it */
      bgAudio.play();

      /* Fade out intro */
      if (!prefersReducedMotion) {
        gsap.to(intro, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: function () {
            intro.style.display = 'none';
            revealContent();
          },
        });
      } else {
        intro.style.display = 'none';
        revealContent();
      }
    });
  }

  function revealContent() {
    content.classList.remove('hidden');
    content.style.opacity = '0';

    if (!prefersReducedMotion) {
      gsap.to(content, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      setupScrollAnimations();
    } else {
      content.style.opacity = '1';
    }

    /* Scroll to first card after a beat */
    setTimeout(function () {
      var firstCard = $('#card-1');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    }, 600);
  }

  /* ════════════════════════════════════════════════════════
     SCROLL-TRIGGERED ANIMATIONS (GSAP + ScrollTrigger)
     ════════════════════════════════════════════════════════ */
  function setupScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* Each meme card fades in + slides up */
    document.querySelectorAll('.meme-card').forEach(function (card) {
      gsap.from(card.querySelector('.meme-inner'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power2.out',
      });
    });

    /* Drake panels slide in from sides */
    var drakeReject = $('.drake-panel.reject');
    var drakeApprove = $('.drake-panel.approve');
    if (drakeReject) {
      gsap.from(drakeReject, {
        scrollTrigger: { trigger: drakeReject, start: 'top 80%' },
        x: -80, opacity: 0, duration: 0.6, ease: 'power2.out',
      });
    }
    if (drakeApprove) {
      gsap.from(drakeApprove, {
        scrollTrigger: { trigger: drakeApprove, start: 'top 80%' },
        x: 80, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.2,
      });
    }

    /* Expanding brain rows light up sequentially */
    document.querySelectorAll('.brain-row').forEach(function (row, i) {
      gsap.from(row, {
        scrollTrigger: { trigger: row, start: 'top 85%' },
        opacity: 0, x: -40, duration: 0.5,
        delay: i * 0.15,
        ease: 'power2.out',
        onComplete: function () {
          if (row.classList.contains('level-4')) {
            row.classList.add('glow');
          }
        },
      });
    });

    /* Photos: slight tilt/rotation on reveal */
    document.querySelectorAll('.meme-photo').forEach(function (photo) {
      gsap.from(photo, {
        scrollTrigger: { trigger: photo, start: 'top 85%' },
        opacity: 0, scale: 0.9, rotation: (Math.random() - 0.5) * 6,
        duration: 0.7, ease: 'power2.out',
      });
    });

    /* Genuine moment: slower, softer */
    var genuine = $('.meme-card.genuine .meme-inner');
    if (genuine) {
      gsap.from(genuine, {
        scrollTrigger: { trigger: genuine, start: 'top 80%' },
        opacity: 0, y: 40, duration: 1.2, ease: 'power2.out',
        overwrite: true,
      });
    }

    /* Proposal section */
    gsap.from('.proposal-setup', {
      scrollTrigger: { trigger: '#proposal', start: 'top 72%' },
      opacity: 0, y: 30, duration: 0.7, ease: 'power2.out',
    });

    gsap.from('.proposal-question', {
      scrollTrigger: { trigger: '#proposal', start: 'top 62%' },
      opacity: 0, y: 40, duration: 0.8, ease: 'power3.out',
    });

    gsap.from('#button-row', {
      scrollTrigger: { trigger: '#proposal', start: 'top 55%' },
      opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
    });

    /* Distracted boyfriend items */
    document.querySelectorAll('.distracted-item').forEach(function (item, i) {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 85%' },
        opacity: 0, y: 30, scale: 0.9,
        duration: 0.5, delay: i * 0.1, ease: 'power2.out',
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     PHOTO VIEWER (lightbox)
     ════════════════════════════════════════════════════════ */
  function setupPhotoViewer() {
    document.querySelectorAll('[data-viewer]').forEach(function (img) {
      img.addEventListener('click', function (e) {
        e.stopPropagation();
        openViewer(img.src);
      });
    });

    viewerClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeViewer();
    });

    photoViewer.addEventListener('click', closeViewer);
    viewerImage.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  function openViewer(src) {
    viewerImage.src = src;
    photoViewer.classList.remove('hidden');
    photoViewer.classList.add('visible');

    if (!prefersReducedMotion) {
      gsap.from(viewerImage, { scale: 0.9, opacity: 0, duration: 0.35, ease: 'power3.out' });
    }
  }

  function closeViewer() {
    photoViewer.classList.remove('visible');
    photoViewer.classList.add('hidden');
    viewerImage.src = '';
  }

  /* ════════════════════════════════════════════════════════
     PHOTO PLACEHOLDERS (graceful missing-image handling)
     ════════════════════════════════════════════════════════ */
  function setupPhotoPlaceholders() {
    document.querySelectorAll('.meme-photo').forEach(function (img) {
      img.addEventListener('error', function () {
        var placeholder = document.createElement('div');
        placeholder.className = 'photo-placeholder';
        placeholder.innerHTML =
          '<div class="placeholder-icon">+</div>' +
          '<span>' + (img.alt || 'photo') + '</span>';
        img.replaceWith(placeholder);
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     YES BUTTON → CELEBRATION
     ════════════════════════════════════════════════════════ */
  yesBtn.addEventListener('click', triggerCelebration);

  function triggerCelebration() {
    celebration.classList.remove('hidden');
    celebration.classList.add('visible');

    /* Keep music playing through the celebration */

    if (!prefersReducedMotion) {
      /* Phase 1: title + confetti */
      gsap.from('.celebration-title', {
        opacity: 0, y: 40, scale: 0.9,
        duration: 0.8, ease: 'power3.out', delay: 0.15,
      });
      gsap.from('.celebration-sub', {
        opacity: 0, y: 20,
        duration: 0.6, ease: 'power2.out', delay: 0.55,
      });
      launchConfetti();

      /* Phase 2: transition to message wall */
      setTimeout(function () {
        startMessageWall();
      }, 3500);
    } else {
      /* Reduced motion: show everything immediately */
      var wall = celebration.querySelector('.message-wall');
      wall.classList.remove('hidden');
      wall.classList.add('visible');
      wall.querySelectorAll('.msg-line').forEach(function (line) {
        line.style.opacity = '1';
      });
    }

    /* Cleanup stray yes buttons */
    extraYesBtns.forEach(function (b) { b.remove(); });
    extraYesBtns.length = 0;
  }

  /* ════════════════════════════════════════════════════════
     MESSAGE WALL — Phase 2 of celebration
     ════════════════════════════════════════════════════════ */
  function startMessageWall() {
    var title = celebration.querySelector('.celebration-title');
    var sub = celebration.querySelector('.celebration-sub');
    var wall = celebration.querySelector('.message-wall');
    var lines = wall.querySelectorAll('.msg-line');
    var finalLine = wall.querySelector('.msg-final');

    /* Fade out Phase 1 title + subtitle */
    gsap.to([title, sub], {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: function () {
        title.style.display = 'none';
        sub.style.display = 'none';
      },
    });

    /* Reveal message wall container */
    wall.classList.remove('hidden');
    wall.classList.add('visible');

    /* Start floating hearts + photos */
    setTimeout(function () {
      spawnFloatingElements();
    }, 500);

    /* Stagger message lines */
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.8,
      delay: 1.0,
      onComplete: function () {
        /* Pulse glow on the final line */
        if (finalLine) {
          finalLine.classList.add('glow-pulse');
          gsap.from(finalLine, {
            scale: 0.9,
            duration: 0.5,
            ease: 'back.out(2)',
          });
        }
      },
    });

    /* Set initial state for stagger animation */
    gsap.set(lines, { opacity: 0, y: 15 });
  }

  /* ════════════════════════════════════════════════════════
     FLOATING ELEMENTS — Hearts + Photos
     ════════════════════════════════════════════════════════ */
  function spawnFloatingElements() {
    var container = $('#floating-container');
    var heartColors = ['#ff6b9d', '#ff85b1', '#ef4444', '#f472b6', '#fb7185'];
    var floatingPhotos = [
      'photos/photo1.jpeg', 'photos/photo2.jpeg', 'photos/photo3.jpg',
      'photos/photo4.jpeg', 'photos/photo6.jpeg', 'photos/photo7.jpeg',
      'photos/photo8.jpeg',
    ];
    var startTime = Date.now();

    floatingInterval = setInterval(function () {
      /* Stop after ~30s */
      if (Date.now() - startTime > 30000) {
        clearInterval(floatingInterval);
        floatingInterval = null;
        return;
      }

      var isPhoto = Math.random() < 0.3;

      if (isPhoto) {
        var img = document.createElement('img');
        img.src = floatingPhotos[Math.floor(Math.random() * floatingPhotos.length)];
        img.alt = '';
        img.className = 'floating-photo';
        img.style.left = (Math.random() * 90 + 5) + '%';
        img.style.setProperty('--float-duration', (Math.random() * 6 + 6) + 's');
        img.style.setProperty('--float-opacity', (Math.random() * 0.3 + 0.4).toFixed(2));

        /* On error, replace with a heart */
        img.addEventListener('error', function () {
          var heart = createFloatingHeart(heartColors);
          heart.style.left = img.style.left;
          heart.style.setProperty('--float-duration', img.style.getPropertyValue('--float-duration'));
          container.appendChild(heart);
          img.remove();
          heart.addEventListener('animationend', function () { heart.remove(); });
        });

        img.addEventListener('animationend', function () { img.remove(); });
        container.appendChild(img);
      } else {
        var heart = createFloatingHeart(heartColors);
        heart.addEventListener('animationend', function () { heart.remove(); });
        container.appendChild(heart);
      }
    }, 400);
  }

  function createFloatingHeart(colors) {
    var el = document.createElement('div');
    el.className = 'floating-heart';
    el.textContent = '\u2665';
    el.style.left = (Math.random() * 90 + 5) + '%';
    el.style.setProperty('--float-size', (Math.random() * 2 + 1).toFixed(1) + 'rem');
    el.style.setProperty('--float-duration', (Math.random() * 6 + 6) + 's');
    el.style.setProperty('--float-color', colors[Math.floor(Math.random() * colors.length)]);
    el.style.setProperty('--float-opacity', (Math.random() * 0.4 + 0.4).toFixed(2));
    return el;
  }

  /* ════════════════════════════════════════════════════════
     NO BUTTON — THE MAIN EVENT (10 meme reactions)
     ════════════════════════════════════════════════════════ */
  noBtn.addEventListener('click', handleNo);

  /* Runner: flee from cursor on hover (desktop, after 2 clicks) */
  if (!isTouchDevice()) {
    noBtn.addEventListener('mouseenter', function () {
      if (noClickCount >= 2 && noClickCount < 10) runAway();
    });
  }

  function handleNo() {
    noClickCount++;
    updateScoreboard();

    /* Update button text */
    var idx = Math.min(noClickCount - 1, noReactions.length - 1);
    noBtn.textContent = noReactions[idx].text;

    switch (noClickCount) {
      /* 1 — "are you sure?" — slight shrink */
      case 1:
        gsap.to(noBtn, { scale: 0.9, duration: 0.3, ease: 'power2.out' });
        break;

      /* 2 — "really?" — shrinks more */
      case 2:
        gsap.to(noBtn, { scale: 0.8, duration: 0.3, ease: 'power2.out' });
        break;

      /* 3 — "wrong answer bestie" — runs away from cursor */
      case 3:
        gsap.to(noBtn, { scale: 0.7, duration: 0.3, ease: 'power2.out' });
        runAway();
        break;

      /* 4 — "the disrespect" — screen shake + extra Yes spawns */
      case 4:
        shakeScreen();
        spawnExtraYes();
        spawnExtraYes();
        break;

      /* 5 — "my therapist will hear about this" — fake error popup */
      case 5:
        showError();
        break;

      /* 6 — "I'm telling your mom" — spins + more Yes buttons */
      case 6:
        noBtn.classList.add('spinning');
        setTimeout(function () { noBtn.classList.remove('spinning'); }, 1500);
        shakeScreen();
        spawnExtraYes();
        spawnExtraYes();
        break;

      /* 7 — "you're breaking my heart and my code" — analysis popup */
      case 7:
        showAnalysis();
        break;

      /* 8 — "fine. I didn't want you anyway" then "jk please say yes" */
      case 8:
        tiltScreen();
        spawnExtraYes();
        spawnExtraYes();
        spawnExtraYes();
        /* Quick text switch after a beat */
        setTimeout(function () {
          noBtn.textContent = 'jk please say yes';
        }, 1200);
        break;

      /* 9 — "this is cyberbullying" — shrinks to tiny */
      case 9:
        gsap.to(noBtn, { scale: 0.3, duration: 0.4, ease: 'power2.out' });
        break;

      /* 10 — "goodbye cruel world" — falls off screen + self-destructs */
      case 10:
        noBtn.classList.add('falling');
        noBtn.style.pointerEvents = 'none';
        setTimeout(function () {
          noBtn.style.display = 'none';
          setTimeout(selfDestruct, 700);
        }, 1000);
        break;

      /* 11+ — just celebrate */
      default:
        triggerCelebration();
        break;
    }

    /* Progressively grow the Yes button */
    var s = Math.min(1 + noClickCount * 0.08, 1.6);
    gsap.to(yesBtn, { scale: s, duration: 0.4, ease: 'power2.out' });
  }

  /* ── Scoreboard ────────────────────────────────────────── */
  function updateScoreboard() {
    scoreboard.classList.remove('hidden');
    scoreboard.classList.add('visible');

    var willToLive;
    if (noClickCount <= 2) willToLive = 'declining';
    else if (noClickCount <= 4) willToLive = 'concerning';
    else if (noClickCount <= 6) willToLive = 'critical';
    else if (noClickCount <= 8) willToLive = 'flatlined';
    else willToLive = 'nonexistent';

    scoreboard.innerHTML =
      'attempts: <span class="score-pink">' + noClickCount + '</span>' +
      ' | successful rejections: 0' +
      ' | my will to live: ' + willToLive;
  }

  /* ── Run away (reposition randomly) ────────────────────── */
  function runAway() {
    var parentRect = buttonRow.getBoundingClientRect();
    var maxX = (parentRect.width - noBtn.offsetWidth) / 2;
    var maxY = Math.min(window.innerHeight * 0.1, 80);
    var rx = (Math.random() - 0.5) * maxX * 2;
    var ry = (Math.random() - 0.5) * maxY * 2;

    gsap.to(noBtn, { x: rx, y: ry, duration: 0.18, ease: 'power4.out' });
  }

  /* ── Screen shake ──────────────────────────────────────── */
  function shakeScreen() {
    if (prefersReducedMotion) return;
    document.body.classList.add('shaking');
    setTimeout(function () { document.body.classList.remove('shaking'); }, 400);
  }

  /* ── Screen tilt ───────────────────────────────────────── */
  function tiltScreen() {
    if (prefersReducedMotion) return;
    document.body.classList.add('tilted');
    setTimeout(function () {
      document.body.classList.remove('tilted');
      document.body.classList.add('tilted-back');
      setTimeout(function () { document.body.classList.remove('tilted-back'); }, 1500);
    }, 1200);
  }

  /* ── Spawn extra Yes button ────────────────────────────── */
  function spawnExtraYes() {
    var btn = document.createElement('button');
    btn.className = 'btn-extra';
    btn.textContent = extraYesLabels[Math.floor(Math.random() * extraYesLabels.length)];
    btn.addEventListener('click', triggerCelebration);

    var spread = Math.min(window.innerWidth * 0.4, 160);
    btn.style.left = 'calc(50% + ' + ((Math.random() - 0.5) * spread) + 'px)';
    btn.style.top = ((Math.random() - 0.5) * 100) + 'px';
    btn.style.transform = 'translateX(-50%)';

    buttonRow.appendChild(btn);
    extraYesBtns.push(btn);

    if (!prefersReducedMotion) {
      gsap.from(btn, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)' });
    }
  }

  /* ── Self-destruct (particle explosion) ────────────────── */
  function selfDestruct() {
    var rect = noBtn.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var colors = ['#ff6b9d', '#a1a1aa', '#242424', '#ef4444', '#fbbf24'];

    for (var i = 0; i < 24; i++) {
      var p = document.createElement('div');
      p.className = 'destruct-particle';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--tx', ((Math.random() - 0.5) * 300) + 'px');
      p.style.setProperty('--ty', ((Math.random() - 0.5) * 300) + 'px');
      document.body.appendChild(p);
      setTimeout(removeEl(p), 1000);
    }

    noBtn.remove();
    shakeScreen();
  }

  function removeEl(el) {
    return function () { if (el.parentNode) el.parentNode.removeChild(el); };
  }

  /* ════════════════════════════════════════════════════════
     ERROR OVERLAY (click 5)
     ════════════════════════════════════════════════════════ */
  function showError() {
    errorOvl.classList.remove('hidden');
    errorOvl.classList.add('visible');
    if (!prefersReducedMotion) {
      gsap.from('.error-card', { scale: 0.9, opacity: 0, duration: 0.35, ease: 'power3.out' });
    }
  }

  function hideError() {
    errorOvl.classList.remove('visible');
    errorOvl.classList.add('hidden');
  }

  $('#error-x').addEventListener('click', hideError);
  $('#error-ok').addEventListener('click', function () { hideError(); triggerCelebration(); });
  $('#error-retry').addEventListener('click', function () { hideError(); triggerCelebration(); });

  /* ════════════════════════════════════════════════════════
     ANALYSIS OVERLAY (click 7)
     ════════════════════════════════════════════════════════ */
  function showAnalysis() {
    analysisOvl.classList.remove('hidden');
    analysisOvl.classList.add('visible');

    if (!prefersReducedMotion) {
      gsap.from('.analysis-card', { scale: 0.9, opacity: 0, duration: 0.4, ease: 'power3.out' });
      gsap.from('.analysis-body .row, .analysis-body .rec', {
        opacity: 0, x: -15,
        duration: 0.3, stagger: 0.12, delay: 0.3, ease: 'power2.out',
      });
    }
  }

  $('.analysis-dismiss').addEventListener('click', function () {
    analysisOvl.classList.remove('visible');
    analysisOvl.classList.add('hidden');
  });

  /* ════════════════════════════════════════════════════════
     CONFETTI (canvas-based, capped particles)
     ════════════════════════════════════════════════════════ */
  function launchConfetti() {
    var ctx = confettiCanvas.getContext('2d');
    var colors = ['#ff6b9d', '#ff85b1', '#fbbf24', '#22c55e', '#ffffff', '#a78bfa'];
    var COUNT = 180;
    var w, h;

    function resize() {
      w = confettiCanvas.width = window.innerWidth;
      h = confettiCanvas.height = window.innerHeight;
    }
    resize();

    var particles = [];
    for (var i = 0; i < COUNT; i++) {
      /* Mix of confetti rectangles and hearts */
      var isHeart = i < 30;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        w: Math.random() * 8 + 4,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        spin: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        gravity: 0.04 + Math.random() * 0.02,
        opacity: 1,
        heart: isHeart,
      });
    }

    var elapsed = 0;

    function drawHeart(ctx, x, y, size, color, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      var s = size * 0.6;
      ctx.moveTo(x, y + s / 4);
      ctx.quadraticCurveTo(x, y, x + s / 4, y);
      ctx.quadraticCurveTo(x + s / 2, y, x + s / 2, y + s / 4);
      ctx.quadraticCurveTo(x + s / 2, y, x + s * 3 / 4, y);
      ctx.quadraticCurveTo(x + s, y, x + s, y + s / 4);
      ctx.quadraticCurveTo(x + s, y + s / 2, x + s / 2, y + s * 3 / 4);
      ctx.quadraticCurveTo(x, y + s / 2, x, y + s / 4);
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      elapsed++;

      var alive = 0;

      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        if (elapsed > 180) p.opacity = Math.max(0, p.opacity - 0.012);
        if (p.opacity <= 0 || p.y > h + 50) continue;

        alive++;

        if (p.heart) {
          drawHeart(ctx, p.x, p.y, p.w * 2, p.color, p.opacity);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      }

      if (alive > 0) {
        confettiRAF = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
        confettiRAF = null;
      }
    }

    draw();

    /* Resize handler scoped to confetti lifetime */
    var onResize = function () { resize(); };
    window.addEventListener('resize', onResize);

    /* Hard stop after 8s */
    setTimeout(function () {
      if (confettiRAF) { cancelAnimationFrame(confettiRAF); confettiRAF = null; }
      ctx.clearRect(0, 0, w, h);
      window.removeEventListener('resize', onResize);
    }, 8000);
  }

  /* ════════════════════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ════════════════════════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    /* Escape closes overlays */
    if (e.key === 'Escape') {
      closeViewer();
      hideError();
      analysisOvl.classList.remove('visible');
      analysisOvl.classList.add('hidden');
    }

  });

  /* ════════════════════════════════════════════════════════
     UTILITIES
     ════════════════════════════════════════════════════════ */
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /* Debounced ScrollTrigger refresh */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
        ScrollTrigger.refresh();
      }
    }, 150);
  });

  /* ════════════════════════════════════════════════════════
     CLEANUP
     ════════════════════════════════════════════════════════ */
  window.addEventListener('beforeunload', function () {
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    if (floatingInterval) clearInterval(floatingInterval);
    extraYesBtns.forEach(function (b) { b.remove(); });
    document.querySelectorAll('.destruct-particle').forEach(function (p) { p.remove(); });
  });

  /* ════════════════════════════════════════════════════════
     INIT
     ════════════════════════════════════════════════════════ */
  initIntro();
  setupPhotoViewer();
  setupPhotoPlaceholders();
})();
