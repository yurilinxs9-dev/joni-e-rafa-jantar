/* ══════════════════════════════════════════
   MAIN.JS — Jantar Pré-Casamento
   Cursor (duas alianças), Header, utilitários
   ══════════════════════════════════════════ */

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
