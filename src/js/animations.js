/* ══════════════════════════════════════════
   ANIMATIONS.JS — GSAP Premium
   Jantar Pré-Casamento · Versão 2.0
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── FALLBACK sem GSAP ──────────────────
  if (typeof gsap === 'undefined') {
    console.warn('[ANIMATIONS] GSAP não encontrado — animações desabilitadas');
    document.querySelectorAll(
      '.hero__label,.hero__title-line,.hero__meta,.hero__ornament,.hero .btn-cta,.info-card,.gallery-item'
    ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Respeita prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll(
      '.hero__label,.hero__title-line,.hero__meta,.hero__ornament,.hero .btn-cta,.info-card,.gallery-item'
    ).forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  /* ═══════════════════════════════════════
     1. HERO ENTRANCE TIMELINE
     ═══════════════════════════════════════ */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('.hero__ornament', { opacity: 0.7, duration: 1, delay: 0.3 })
    .to('.hero__label',    { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.hero__title-line', {
      opacity: 1, y: 0, duration: 1, stagger: 0.2
    }, '-=0.5')
    .to('.hero__meta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .from('.hero .btn-cta', { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
    .from('.hero__scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.3');

  /* ═══════════════════════════════════════
     1b. TRANSIÇÃO HERO → SEÇÃO EVENTO
     Scrub: hero escurece + seção fade-in
     ═══════════════════════════════════════ */
  // Intensifica o overlay do hero conforme aproxima da info-section
  gsap.to('.hero__overlay', {
    background: 'linear-gradient(to bottom, rgba(9,9,9,0.6) 0%, rgba(9,9,9,0.8) 50%, rgba(9,9,9,1) 100%)',
    ease: 'none',
    scrollTrigger: {
      trigger: '.info-section',
      start: 'top 90%',
      end:   'top 20%',
      scrub: 1.5,
    }
  });

  // Info-section: começa com leve opacidade reduzida e eleva
  gsap.fromTo('.info-section',
    { opacity: 0.4 },
    {
      opacity: 1,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.info-section',
        start: 'top 85%',
        end:   'top 30%',
        scrub: 1,
      }
    }
  );

  /* ═══════════════════════════════════════
     2. PARALLAX HERO
     ═══════════════════════════════════════ */
  gsap.to('.hero__bg-img', {
    y: '25%', ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top', end: 'bottom top',
      scrub: 1.2,
    }
  });

  /* ═══════════════════════════════════════
     3. CARDS — STAGGER COM BACK.OUT (POP)
     ═══════════════════════════════════════ */
  gsap.to('.info-card', {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: {
      amount: 0.5,
      ease: 'power1.inOut',
    },
    ease: 'back.out(1.7)', /* pop luxuoso */
    scrollTrigger: {
      trigger: '.cards-grid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  /* ═══════════════════════════════════════
     4. GALERIA — DESTAQUE + HOVER (desktop) / AUTO (mobile)
     ═══════════════════════════════════════ */
  const galleryMain = document.getElementById('gallery-main');
  const galleryGrid = document.getElementById('gallery-grid');

  // Detecção real: touch device OU largura mobile
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const isMobile      = isTouchDevice || window.innerWidth <= 768;

  // Imagem principal aparece ao scroll
  gsap.to('.gallery-main', {
    opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.gallery-container', start: 'top 82%' }
  });

  if (galleryMain && galleryGrid) {

    if (!isMobile) {
      /* ── DESKTOP: hover abre galeria UMA VEZ (não fecha) ── */
      let galleryOpened = false;

      const hoverTL = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });

      hoverTL
        .call(() => {
          galleryGrid.classList.add('is-open');
          galleryGrid.style.overflow = 'visible';
        })
        .to('.gallery-main__img', { scale: 0.92, duration: 0.55, ease: 'power2.inOut' }, 0)
        .to(galleryGrid,          { opacity: 1,  duration: 0.5  }, 0.05)
        .to('.gallery-item', {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5, stagger: 0.07,
          ease: 'back.out(1.2)'
        }, 0.12);

      galleryMain.addEventListener('mouseenter', () => {
        if (!galleryOpened) {
          hoverTL.play();
          galleryOpened = true; // trava: nunca mais fecha
        }
      });
      // mouseleave removido — galeria permanece aberta

    } else {
      /* ── MOBILE: galeria aparece automaticamente após 2s ── */
      galleryGrid.classList.add('is-open');
      galleryGrid.style.overflow = 'visible';
      galleryGrid.style.pointerEvents = 'auto';

      // Aguarda imagem principal aparecer, depois anima o grid
      ScrollTrigger.create({
        trigger: '.gallery-container',
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(galleryGrid, {
            opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.8
          });
          gsap.to('.gallery-item', {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5, stagger: 0.07,
            ease: 'back.out(1.1)', delay: 2,
          });
        }
      });
    }

    /* ── LIGHTBOX (desktop + mobile) ── */
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Foto ampliada');
    lightbox.innerHTML = `
      <img class="gallery-lightbox__img" src="" alt="Foto ampliada">
      <button class="gallery-lightbox__close" aria-label="Fechar">✕</button>
    `;
    document.body.appendChild(lightbox);

    const lbImg   = lightbox.querySelector('.gallery-lightbox__img');
    const lbClose = lightbox.querySelector('.gallery-lightbox__close');

    const openLightbox = src => {
      lbImg.src = src;
      lightbox.classList.add('is-open');
      gsap.fromTo(lbImg,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }
      );
    };
    const closeLightbox = () => {
      gsap.to(lbImg, { scale: 0.9, opacity: 0, duration: 0.25,
        onComplete: () => lightbox.classList.remove('is-open')
      });
    };

    document.querySelectorAll('.gallery-item img').forEach(img => {
      img.addEventListener('click', () => openLightbox(img.src));
    });
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ═══════════════════════════════════════
     5. RESTAURANTE — BLUR REVEAL + ORNAMENTO
     (slide via .slide-in-left/.slide-in-right)
     ═══════════════════════════════════════ */

  /* Blur reveal na imagem do restaurante */
  gsap.fromTo('.restaurant-img',
    { filter: 'blur(8px)', opacity: 0.5, scale: 1.06 },
    {
      filter: 'blur(0px)', opacity: 1, scale: 1,
      duration: 1.2, ease: 'sine.inOut',
      scrollTrigger: { trigger: '.restaurant-visual', start: 'top 75%' }
    }
  );

  gsap.from('.restaurant-ornament', {
    opacity: 0, rotation: -30, scale: 0.7, duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.restaurant-visual', start: 'top 75%' }
  });

  /* ═══════════════════════════════════════
     6. SPLIT TEXT — CTA "Sua presença"
     ═══════════════════════════════════════ */
  const ctaTitle = document.querySelector('.cta-title');
  if (ctaTitle) {
    /* Divide por linhas (cada <br> = linha separada) */
    const rawHTML  = ctaTitle.innerHTML;
    const lines    = rawHTML.split(/<br\s*\/?>/i);
    ctaTitle.innerHTML = lines.map(
      (line, i) => `<span class="split-line" style="display:block;overflow:hidden"><span class="split-inner" style="display:block" data-li="${i}">${line}</span></span>`
    ).join('');

    gsap.from('.split-inner', {
      y: '110%', opacity: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
      scrollTrigger: { trigger: ctaTitle, start: 'top 85%' }
    });
  }

  /* ═══════════════════════════════════════
     7. CTA SECTION — Fade geral
     ═══════════════════════════════════════ */
  gsap.from('.cta-ornament, .cta-desc, .cta-value, .cta-section .btn-cta', {
    opacity: 0, y: 30,
    duration: 0.8, stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
  });

  /* ═══════════════════════════════════════
     8. SECTION HEADERS
     ═══════════════════════════════════════ */
  gsap.utils.toArray('.section-header').forEach(hdr => {
    gsap.from(hdr.querySelectorAll('.section-label, .section-title, .section-divider'), {
      opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: hdr, start: 'top 85%' }
    });
  });

  /* ═══════════════════════════════════════
     9. RESTAURANT DETAILS STAGGER
     ═══════════════════════════════════════ */
  gsap.from('.restaurant-detail-item', {
    opacity: 0, x: -20, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.restaurant-details', start: 'top 85%' }
  });

  /* ═══════════════════════════════════════
     10. FOOTER
     ═══════════════════════════════════════ */
  gsap.from('.footer-logo, .footer-message, .footer-event, .footer-copy', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.footer', start: 'top 90%' }
  });

  /* ═══════════════════════════════════════
     11. INFO SECTION — PARALLAX FUNDO
     ═══════════════════════════════════════ */
  gsap.to('.info-section', {
    backgroundPositionY: '10%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.info-section',
      start: 'top bottom', end: 'bottom top',
      scrub: 2,
    }
  });

  /* ═══════════════════════════════════════
     12. ASSINATURA — Cormorant Garamond 300
         letra por letra · loop infinito
         write ~3s → wait 2s → fade 0.5s → repeat
     ═══════════════════════════════════════ */
  const sigSection = document.getElementById('signature-section');
  const sigLabel   = document.querySelector('.signature-label');
  const sigLetters = document.querySelectorAll('.signature-text span');
  const sigDot     = document.querySelector('.signature-dot');

  if (sigSection && sigLetters.length) {

    // Estado inicial — tudo invisível
    gsap.set(sigLetters, { opacity: 0, y: 20 });
    if (sigLabel) gsap.set(sigLabel, { opacity: 0 });
    if (sigDot)   gsap.set(sigDot,   { opacity: 0 });

    let isInViewport = false;
    let isAnimating  = false;
    let loopTimer    = null;

    // Label aparece uma vez e fica
    let labelShown = false;
    function showLabel() {
      if (labelShown || !sigLabel) return;
      labelShown = true;
      gsap.to(sigLabel, { opacity: 0.85, duration: 0.7, ease: 'power2.out' });
    }

    function animateSignature() {
      if (isAnimating || !isInViewport) return;
      isAnimating = true;

      showLabel();

      // ── ESCREVER: letra por letra ──────────────────
      const writeTL = gsap.timeline({
        onComplete: () => {
          // Dot desaparece suavemente ao terminar
          if (sigDot) gsap.to(sigDot, { opacity: 0, duration: 0.5, delay: 0.2 });

          // Espera 2s, depois apaga e reinicia
          loopTimer = setTimeout(() => {
            if (!isInViewport) { isAnimating = false; return; }

            // ── APAGAR: stagger reverso suave ────────────
            gsap.killTweensOf(sigLetters);
            gsap.to(sigLetters, {
              opacity: 0,
              y: 12,
              duration: 0.1,
              stagger: { each: 0.03, from: 'end' },
              ease: 'power2.in',
              onComplete: () => {
                isAnimating = false;
                if (isInViewport) loopTimer = setTimeout(animateSignature, 500);
              }
            });
          }, 2200);
        }
      });

      // Cada letra: fade-in + slide-up suave, sequencial
      writeTL.to(sigLetters, {
        opacity: 1,
        y: 0,
        duration: 0.18,   // mais lento e suave
        stagger: { each: 0.07, ease: 'none' },  // espaçamento maior entre letras
        ease: 'power2.out',  // suave, sem bounce
      });

      // Dot aparece junto com a primeira letra
      if (sigDot) {
        gsap.to(sigDot, { opacity: 1, duration: 0.3, delay: 0.2 });
      }
    }

    function stopLoop() {
      isInViewport = false;
      isAnimating  = false;
      clearTimeout(loopTimer);
      // Mata tweens em andamento para evitar conflitos ao reentrar
      gsap.killTweensOf(sigLetters);
      if (sigDot) gsap.killTweensOf(sigDot);
    }

    function startLoop() {
      if (isInViewport) return;
      isInViewport = true;
      // Garante estado limpo antes de começar
      gsap.killTweensOf(sigLetters);
      gsap.set(sigLetters, { opacity: 0, y: 20 });
      if (sigDot) { gsap.killTweensOf(sigDot); gsap.set(sigDot, { opacity: 0 }); }
      loopTimer = setTimeout(animateSignature, 400);
    }

    ScrollTrigger.create({
      trigger: sigSection,
      start: 'top 78%',
      onEnter:     startLoop,
      onLeave:     stopLoop,
      onEnterBack: startLoop,
      onLeaveBack: stopLoop,
    });
  }

  /* ═══════════════════════════════════════
     13. SCROLL EFFECTS GENÉRICOS
         .fade-in-section / .scale-on-scroll
         .slide-in-left / .slide-in-right
     ═══════════════════════════════════════ */

  // Fade-in para seções com classe utilitária
  gsap.utils.toArray('.fade-in-section').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 50, duration: 1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none none' }
    });
  });

  // Scale-up (cards, boxes)
  gsap.utils.toArray('.scale-on-scroll').forEach(el => {
    gsap.from(el, {
      scale: 0.85, opacity: 0, duration: 0.85, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Slide left
  gsap.utils.toArray('.slide-in-left').forEach(el => {
    gsap.from(el, {
      x: -80, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Slide right
  gsap.utils.toArray('.slide-in-right').forEach(el => {
    gsap.from(el, {
      x: 80, opacity: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Parallax em textos com classe .parallax-text
  gsap.utils.toArray('.parallax-text').forEach(el => {
    gsap.to(el, {
      y: -60, ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top center', end: 'bottom top',
        scrub: 1.2,
      }
    });
  });

  /* ═══════════════════════════════════════
     14. FRAMES — GTA-style scrubbing
         CSS sticky · canvas rendering
         16 frames trocam com o scroll
     ═══════════════════════════════════════ */
  const framesSection = document.getElementById('frames-section');
  const frameDisplay  = document.querySelector('.frame-display');
  const frameBg       = document.querySelector('.frame-bg');

  if (framesSection && frameDisplay) {

    const TOTAL    = 16;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const frameSrcs = Array.from({ length: TOTAL }, (_, i) =>
      `assets/frames/frame_${String(i + 1).padStart(2, '0')}.png`
    );

    // Pré-carrega E decodifica todos os frames antecipadamente
    const cache = frameSrcs.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    cache.forEach(img => { if (img.decode) img.decode().catch(() => {}); });

    // Fundo estático — nunca atualizado durante scroll
    if (frameBg) frameBg.src = cache[0].src;

    // ── Canvas setup ──────────────────────────────────────────────────────
    // frameDisplay é um <canvas> — drawImage() é ~5-10x mais rápido que
    // img.src swap no mobile: sem ciclo de decode/upload de textura por frame.
    const canvas = frameDisplay;
    const ctx    = canvas.getContext('2d', { alpha: true });

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();

    function drawToCanvas(img) {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.width,  ch = canvas.height;
      const iw = img.naturalWidth, ih = img.naturalHeight;
      ctx.clearRect(0, 0, cw, ch);
      if (isMobile) {
        // cover + object-position: center top
        const scale = Math.max(cw / iw, ch / ih);
        ctx.drawImage(img, (cw - iw * scale) / 2, 0, iw * scale, ih * scale);
      } else {
        // contain — letterbox transparente mostra frame-bg atrás
        const scale = Math.min(cw / iw, ch / ih);
        ctx.drawImage(img,
          (cw - iw * scale) / 2,
          (ch - ih * scale) / 2,
          iw * scale,
          ih * scale
        );
      }
    }

    window.addEventListener('resize', () => {
      resizeCanvas();
      if (current >= 0) drawToCanvas(cache[current]);
    });

    let current = -1;

    function showFrame(index) {
      const i = Math.min(Math.max(Math.floor(index), 0), TOTAL - 1);
      if (i === current) return;
      current = i;
      const img = cache[i];
      if (img.complete && img.naturalWidth) {
        drawToCanvas(img);
      } else {
        img.addEventListener('load', () => { if (current === i) drawToCanvas(img); }, { once: true });
      }
    }

    showFrame(0);

    const proxy       = { f: 0 };
    const frameSticky = framesSection.querySelector('.frames-sticky');

    const fadeOverlay = document.createElement('div');
    fadeOverlay.className = 'frames-fade-out';
    frameSticky.appendChild(fadeOverlay);

    gsap.to(proxy, {
      f: TOTAL - 1,
      ease: 'none',
      onUpdate() {
        showFrame(proxy.f);
        const t = proxy.f / (TOTAL - 1);
        fadeOverlay.style.opacity = t > 0.78 ? ((t - 0.78) / 0.22).toFixed(3) : '0';
      },
      scrollTrigger: {
        /*
          CSS sticky elimina GSAP pin:true — sem spacer JS, sem cálculo de
          posição, sem pulo no release. A seção já tem height: calc(100vh + 2400px)
          e .frames-sticky tem position:sticky top:0.

          trigger: framesSection (não frameSticky) — anima enquanto a seção
          inteira passa pelo viewport.
          end: 'bottom bottom' = section.bottom chega ao viewport.bottom
                               = exatamente 2400px de scroll percorridos.
        */
        trigger: framesSection,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   isMobile ? 0.3 : 1,
        invalidateOnRefresh: true,
      },
    });
  }

  // Refresh após todos os assets — double rAF garante layout final estabilizado
  window.addEventListener('load', () => {
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()));
  });

});

/* ═══════════════════════════════════════════
   CONFETTI — Exportado para uso em modal.js
   ═══════════════════════════════════════════ */
window.launchConfetti = function () {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  const colors  = ['#D4AF37', '#F0D080', '#C9A84C', '#FAFAFA', '#E8D5B0'];
  const shapes  = ['■', '◆', '●', '▲', '✦'];
  const count   = 60;
  const pieces  = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = shapes[Math.floor(Math.random() * shapes.length)];

    Object.assign(el.style, {
      position:    'absolute',
      top:         '-20px',
      left:        Math.random() * 100 + 'vw',
      color:       colors[Math.floor(Math.random() * colors.length)],
      fontSize:    (Math.random() * 14 + 8) + 'px',
      opacity:     '0',
      pointerEvents: 'none',
      userSelect:  'none',
    });

    container.appendChild(el);
    pieces.push(el);
  }

  if (typeof gsap !== 'undefined') {
    gsap.to(pieces, {
      y:         () => window.innerHeight + 80,
      x:         () => (Math.random() - 0.5) * 300,
      rotation:  () => (Math.random() - 0.5) * 720,
      opacity:   gsap.utils.wrap([1, 0.8, 0.9]),
      duration:  () => 2.5 + Math.random() * 1.5,
      ease:      'power1.out',
      stagger:   { amount: 1.5, from: 'random' },
      onComplete: () => {
        pieces.forEach(p => p.remove());
      }
    });

    /* Fade out no final */
    gsap.to(pieces, {
      opacity: 0, duration: 0.8, delay: 2.4,
      stagger: { amount: 0.5, from: 'random' }
    });
  } else {
    setTimeout(() => pieces.forEach(p => p.remove()), 3000);
  }
};
