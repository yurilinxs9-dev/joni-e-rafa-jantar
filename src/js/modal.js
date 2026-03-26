/* ══════════════════════════════════════════
   MODAL.JS — Confirmação de Presença
   Fluxo: PIX → Formulário → Sucesso
   ══════════════════════════════════════════ */

/* ── Supabase config ── */
const SUPA_URL = 'https://ydvahupqdmicydwjlggn.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdmFodXBxZG1pY3lkd2psZ2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDEyOTMsImV4cCI6MjA4OTk3NzI5M30.CucPNT8GHKXuzq4M_lkxJWS-BiiMmR5ppkE-pcuytLE';

async function salvarConfirmacao(nome, telefone, convidados, valorTotal) {
  const res = await fetch(`${SUPA_URL}/rest/v1/confirmacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPA_ANON,
      'Authorization': `Bearer ${SUPA_ANON}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ nome, telefone, convidados, valor_total: valorTotal }),
  });
  if (!res.ok) throw new Error(await res.text());
}

document.addEventListener('DOMContentLoaded', () => {
  const overlay   = document.getElementById('modal-overlay');
  const modal     = document.getElementById('modal');
  const closeBtn  = document.getElementById('modal-close');
  const stepPix   = document.getElementById('step-pix');
  const stepForm  = document.getElementById('step-form');
  const stepOk    = document.getElementById('step-success');
  const btnPaid   = document.getElementById('btn-paid');
  const form      = document.getElementById('confirm-form');
  const copyBtn   = document.getElementById('pix-copy');
  const pixKey    = document.getElementById('pix-key');

  let currentStep = 1;

  // ── OPEN ──────────────────────────────────
  function openModal() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    showStep(1);

    // Animação de entrada GSAP
    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(modal,
          { scale: 0.88, y: 30, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' },
          '-=0.1'
        )
        .from(
          '#step-pix .modal__ornament, #step-pix .modal__title, #step-pix .modal__subtitle, .pix-box, .modal__actions',
          { opacity: 0, y: 15, stagger: 0.07, duration: 0.4 },
          '-=0.2'
        );
    }

    // Focus trap
    setTimeout(() => closeBtn.focus(), 100);
  }

  // ── CLOSE ─────────────────────────────────
  function closeModal() {
    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to(modal,   { scale: 0.92, y: 20, opacity: 0, duration: 0.25 })
        .to(overlay, { opacity: 0, duration: 0.25 }, '-=0.1')
        .then(() => {
          overlay.hidden = true;
          document.body.style.overflow = '';
          resetModal();
        });
    } else {
      overlay.hidden = true;
      document.body.style.overflow = '';
      resetModal();
    }
  }

  // ── STEPS ─────────────────────────────────
  function showStep(n) {
    currentStep = n;
    [stepPix, stepForm, stepOk].forEach((s, i) => {
      s.hidden = (i + 1 !== n);
    });

    if (typeof gsap !== 'undefined' && n > 1) {
      const stepEl = n === 2 ? stepForm : stepOk;
      gsap.fromTo(stepEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }

  function resetModal() {
    showStep(1);
    form.reset();
    form.querySelectorAll('.form-field__input').forEach(i => i.classList.remove('error'));
    form.querySelectorAll('.form-field__error').forEach(e => e.textContent = '');
  }

  // ── COPY PIX ──────────────────────────────
  copyBtn.addEventListener('click', async () => {
    const key = pixKey.textContent.trim();
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      // Fallback para browsers sem clipboard API
      const ta = document.createElement('textarea');
      ta.value = key;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    copyBtn.classList.add('copied');
    copyBtn.querySelector('span').textContent = 'Copiado!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('span').textContent = 'Copiar';
    }, 2500);
  });

  // ── STEP 1 → 2 ────────────────────────────
  btnPaid.addEventListener('click', () => showStep(2));

  // ── FORM SUBMIT ───────────────────────────
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const textSpan  = submitBtn.querySelector('.btn-cta__text');
    const origText  = textSpan.textContent;
    textSpan.textContent = 'Confirmando...';
    submitBtn.disabled = true;

    // Coleta dados do formulário
    const nome       = document.getElementById('field-name').value.trim();
    const telefone   = document.getElementById('field-phone').value.trim();
    const convidados = parseInt(document.getElementById('field-guests').value, 10) || 1;
    const valorTotal = convidados * 150;

    salvarConfirmacao(nome, telefone, convidados, valorTotal)
      .catch(err => console.warn('[modal] Erro ao salvar:', err))
      .finally(() => {
        submitBtn.disabled = false;
        textSpan.textContent = origText;
        showStep(3);

        // Animação de sucesso
        if (typeof gsap !== 'undefined') {
          gsap.from('.success-icon', {
            scale: 0, rotation: -90, opacity: 0,
            duration: 0.6, ease: 'back.out(1.7)'
          });
          gsap.from('#step-success .modal__title, #step-success .modal__subtitle, .success-event-info, .success-note', {
            opacity: 0, y: 15, stagger: 0.1, duration: 0.5, delay: 0.3
          });
        }

        // 🎉 Confetti dourado!
        setTimeout(() => {
          if (typeof window.launchConfetti === 'function') window.launchConfetti();
        }, 400);
      });
  });

  // ── VALIDAÇÃO ─────────────────────────────
  function validateForm() {
    let valid = true;
    const nameInput  = document.getElementById('field-name');
    const phoneInput = document.getElementById('field-phone');

    // Nome
    const nameErr = nameInput.nextElementSibling;
    if (nameInput.value.trim().length < 3) {
      nameInput.classList.add('error');
      nameErr.textContent = 'Por favor, insira seu nome completo';
      valid = false;
    } else {
      nameInput.classList.remove('error');
      nameErr.textContent = '';
    }

    // Telefone
    const phoneErr = phoneInput.nextElementSibling;
    const phoneClean = phoneInput.value.replace(/\D/g, '');
    if (phoneClean.length < 10) {
      phoneInput.classList.add('error');
      phoneErr.textContent = 'Insira um número de telefone válido';
      valid = false;
    } else {
      phoneInput.classList.remove('error');
      phoneErr.textContent = '';
    }

    return valid;
  }

  // ── CALCULADORA DE VALOR ──────────────────
  const guestsSelect  = document.getElementById('field-guests');
  const calcTotal     = document.getElementById('calc-total');
  const calcDetail    = document.getElementById('calc-detail');
  const PRICE_PER     = 150;

  function updateCalculator() {
    const n     = parseInt(guestsSelect.value, 10) || 1;
    const total = n * PRICE_PER;
    const fmt   = v => 'R$ ' + v.toFixed(2).replace('.', ',');
    calcTotal.textContent  = fmt(total);
    calcDetail.textContent = `(${n} pessoa${n > 1 ? 's' : ''} × ${fmt(PRICE_PER)})`;
  }

  if (guestsSelect) {
    guestsSelect.addEventListener('change', updateCalculator);
    updateCalculator(); // estado inicial
  }

  // Máscara de telefone
  const phoneInput = document.getElementById('field-phone');
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
    }
    phoneInput.value = v;
  });

  // ── EVENT LISTENERS ───────────────────────
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // ── FOCUS TRAP ────────────────────────────
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  // Expõe globalmente para main.js
  window.openModal  = openModal;
  window.closeModal = closeModal;
});
