/* ══════════════════════════════════════════
   MAIN.JS — Jantar Pré-Casamento
   Cursor (duas alianças), Header, utilitários
   ══════════════════════════════════════════ */

// ── CURSOR — DUAS ALIANÇAS ────────────────
const cursorRings = document.querySelector('.cursor-rings');
const cursorDot   = document.querySelector('.cursor-dot');

if (cursorRings && window.matchMedia('(pointer:fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  // Dot segue o mouse instantaneamente
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    }
  });

  // Alianças seguem com suavidade (lag luxuoso)
  const moveCursor = () => {
    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;
    cursorRings.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%))`;
    requestAnimationFrame(moveCursor);
  };
  moveCursor();

  // Glow ao hover em elementos interativos
  const hoverEls = document.querySelectorAll('a, button, .info-card, .gallery-item, label, select');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRings.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRings.classList.remove('hover'));
  });

  // Oculta cursor ao sair da janela
  document.addEventListener('mouseleave', () => { cursorRings.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursorRings.style.opacity = '1'; });
}

// ── HEADER SCROLL ─────────────────────────
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ── MODAL TRIGGERS ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const modalTriggers = document.querySelectorAll('#hero-cta, #header-cta, #cta-final-btn');
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof window.openModal === 'function') window.openModal();
    });
  });
});

// Expõe globalmente (preenchido em modal.js)
window.openModal  = null;
window.closeModal = null;
