/* ════════════════════════════════════════════
   ADMIN.JS — Painel de Confirmações
   Jantar Pré-Casamento
   ════════════════════════════════════════════ */

const CONFIG = {
  supabaseUrl:      'https://ydvahupqdmicydwjlggn.supabase.co',
  serviceRoleKey:   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkdmFodXBxZG1pY3lkd2psZ2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQwMTI5MywiZXhwIjoyMDg5OTc3MjkzfQ.HTpT10wvBi3IShPUcbffdBzChU4rnHFoSUwwms9fZyQ',
  table:            'confirmacoes',
  adminPassword:    'jantar2025',
  sessionKey:       'admin_auth_jantar',
};

/* ─── Estado ─────────────────────────────── */
let allRows = [];

/* ─── Helpers ────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function fmtCurrency(v) {
  return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');
}

/* ─── Supabase delete ────────────────────── */
async function deleteConfirmacao(id) {
  const res = await fetch(
    `${CONFIG.supabaseUrl}/rest/v1/${CONFIG.table}?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        'apikey':        CONFIG.serviceRoleKey,
        'Authorization': `Bearer ${CONFIG.serviceRoleKey}`,
      }
    }
  );
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
}

/* ─── Supabase fetch ─────────────────────── */
async function fetchConfirmacoes() {
  const res = await fetch(
    `${CONFIG.supabaseUrl}/rest/v1/${CONFIG.table}?select=*&order=created_at.desc`,
    {
      headers: {
        'apikey':        CONFIG.serviceRoleKey,
        'Authorization': `Bearer ${CONFIG.serviceRoleKey}`,
      }
    }
  );
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
  return res.json();
}

/* ─── Auth ───────────────────────────────── */
function isLoggedIn() {
  return sessionStorage.getItem(CONFIG.sessionKey) === '1';
}

function login(password) {
  return password === CONFIG.adminPassword;
}

function logout() {
  sessionStorage.removeItem(CONFIG.sessionKey);
  location.reload();
}

/* ─── Render stats ───────────────────────── */
function renderStats(rows) {
  const totalPessoas = rows.reduce((acc, r) => acc + (r.convidados || 1), 0);
  const totalValor   = rows.reduce((acc, r) => acc + Number(r.valor_total || 0), 0);

  document.getElementById('stat-confirmacoes').textContent = rows.length;
  document.getElementById('stat-pessoas').textContent      = totalPessoas;
  document.getElementById('stat-valor').textContent        = fmtCurrency(totalValor);
}

/* ─── Render table ───────────────────────── */
function renderTable(rows) {
  const tbody = document.getElementById('tbody-main');
  tbody.innerHTML = '';

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state__icon">◇</div>
            <div class="empty-state__text">Nenhuma confirmação encontrada</div>
          </div>
        </td>
      </tr>`;
    return;
  }

  rows.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.dataset.id = r.id;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escHtml(r.nome || '—')}</td>
      <td class="td-phone">${escHtml(r.telefone || '—')}</td>
      <td><span class="badge badge--guests">${r.convidados || 1} pessoa${r.convidados > 1 ? 's' : ''}</span></td>
      <td><span class="badge badge--value">${fmtCurrency(r.valor_total)}</span></td>
      <td class="td-date">${fmtDate(r.created_at)}</td>
      <td class="td-actions">
        <button class="btn-delete" data-id="${r.id}" data-nome="${escHtml(r.nome || 'este convidado')}" title="Excluir">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"/>
          </svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Delegação de eventos nos botões de excluir
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id   = btn.dataset.id;
      const nome = btn.dataset.nome;
      if (!confirm(`Excluir ${nome}?\n\nEsta ação não pode ser desfeita.`)) return;

      btn.disabled = true;
      btn.classList.add('deleting');
      try {
        await deleteConfirmacao(id);
        allRows = allRows.filter(r => String(r.id) !== String(id));
        renderStats(allRows);
        renderTable(allRows);
      } catch (err) {
        alert('Erro ao excluir: ' + err.message);
        btn.disabled = false;
        btn.classList.remove('deleting');
      }
    });
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── Filtro busca ───────────────────────── */
function filterRows(query) {
  const q = query.toLowerCase().trim();
  if (!q) return allRows;
  return allRows.filter(r =>
    (r.nome     || '').toLowerCase().includes(q) ||
    (r.telefone || '').toLowerCase().includes(q)
  );
}

/* ─── Load data ──────────────────────────── */
async function loadData() {
  const tbody = document.getElementById('tbody-main');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="7"><div class="spinner"></div></td></tr>`;

  try {
    allRows = await fetchConfirmacoes();
    renderStats(allRows);
    renderTable(allRows);

    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) lastUpdate.textContent = fmtDate(new Date().toISOString());
  } catch (err) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <div class="empty-state__icon">⚠</div>
          <div class="empty-state__text">Erro ao carregar: ${escHtml(err.message)}</div>
        </div>
      </td></tr>`;
    console.error('[admin]', err);
  }
}

/* ─── Init ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const loginGate  = document.getElementById('login-gate');
  const dashboard  = document.getElementById('dashboard');
  const loginForm  = document.getElementById('login-form');
  const pwdInput   = document.getElementById('login-password');
  const loginErr   = document.getElementById('login-error');
  const searchInput = document.getElementById('search-input');

  // ── Verifica sessão ────────────────────
  if (isLoggedIn()) {
    loginGate.style.display  = 'none';
    dashboard.style.display  = 'block';
    loadData();
  }

  // ── Login ──────────────────────────────
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const pwd = pwdInput.value;

    if (login(pwd)) {
      sessionStorage.setItem(CONFIG.sessionKey, '1');
      loginGate.style.display = 'none';
      dashboard.style.display = 'block';
      loginErr.classList.remove('visible');
      loadData();
    } else {
      loginErr.classList.add('visible');
      pwdInput.value = '';
      pwdInput.focus();
    }
  });

  // ── Logout ─────────────────────────────
  document.getElementById('btn-logout').addEventListener('click', logout);

  // ── Atualizar ──────────────────────────
  document.getElementById('btn-refresh').addEventListener('click', loadData);

  // ── Busca ──────────────────────────────
  searchInput.addEventListener('input', () => {
    const filtered = filterRows(searchInput.value);
    renderTable(filtered);
  });
});
