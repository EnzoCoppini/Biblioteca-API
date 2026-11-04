/**
 * BIBLIOTECA-API - MAIN CONTROLLER & APPLICATION LOGIC
 * Framework-free vanilla JavaScript (ES6+)
 */

// Global Application State
const state = {
  livros: [],
  usuarios: [],
  emprestimos: [],
  currentTab: 'dashboard',
  currentEditingLivroId: null,
  currentEditingUsuarioId: null
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupModals();
  setupFormSubmissions();
  setupFilters();
  setupHeaderDate();

  // Load initial dataset
  loadAllData();
});

function setupHeaderDate() {
  const badge = document.getElementById('current-date-badge');
  if (badge) {
    const today = new Date();
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    badge.textContent = today.toLocaleDateString('pt-BR', options);
  }

  const refreshBtn = document.getElementById('btn-refresh-all');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadAllData(true);
    });
  }
}

// ============================================================================
// DATA LOADING & SYNCHRONIZATION
// ============================================================================

async function loadAllData(showNotification = false) {
  setConnectionStatus('loading');

  try {
    const [livrosData, usuariosData, emprestimosData] = await Promise.all([
      api.getLivros(),
      api.getUsuarios(),
      api.getEmprestimos()
    ]);

    state.livros = Array.isArray(livrosData) ? livrosData : [];
    state.usuarios = Array.isArray(usuariosData) ? usuariosData : [];
    state.emprestimos = Array.isArray(emprestimosData) ? emprestimosData : [];

    setConnectionStatus('online');

    // Update UI counters and views
    updateNavigationCounters();
    populateGenreFilter();
    renderActiveTab();

    if (showNotification) {
      showToast('Dados sincronizados', 'As informações foram atualizadas com o servidor backend.', 'success');
    }
  } catch (error) {
    console.error('Falha ao carregar dados:', error);
    setConnectionStatus('offline');
    showToast('Falha na conexão', error.message, 'error');
  }
}

function setConnectionStatus(status) {
  const dot = document.getElementById('api-status-dot');
  const text = document.getElementById('api-status-text');
  if (!dot || !text) return;

  if (status === 'online') {
    dot.className = 'status-dot';
    text.textContent = 'Backend Conectado';
  } else if (status === 'loading') {
    dot.className = 'status-dot';
    text.textContent = 'Sincronizando...';
  } else {
    dot.className = 'status-dot offline';
    text.textContent = 'Backend Offline';
  }
}

function updateNavigationCounters() {
  const countLivros = document.getElementById('nav-count-livros');
  const countUsuarios = document.getElementById('nav-count-usuarios');
  const countEmprestimos = document.getElementById('nav-count-emprestimos');

  if (countLivros) countLivros.textContent = state.livros.length;
  if (countUsuarios) countUsuarios.textContent = state.usuarios.length;
  if (countEmprestimos) {
    const ativos = state.emprestimos.filter(e => e.status === 'EM_ANDAMENTO' || e.status === 'ATRASADO').length;
    countEmprestimos.textContent = ativos;
  }

  // Update Section Badges
  const badgeLivros = document.getElementById('livros-total-badge');
  if (badgeLivros) badgeLivros.textContent = `${state.livros.length} cadastrados`;

  const badgeUsuarios = document.getElementById('usuarios-total-badge');
  if (badgeUsuarios) badgeUsuarios.textContent = `${state.usuarios.length} cadastrados`;

  const badgeEmprestimos = document.getElementById('emprestimos-total-badge');
  if (badgeEmprestimos) badgeEmprestimos.textContent = `${state.emprestimos.length} registros`;
}

// ============================================================================
// NAVIGATION & TAB MANAGEMENT
// ============================================================================

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');
      navigateToTab(targetTab);
    });
  });

  // Mobile sidebar toggle
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const closeSidebar = document.getElementById('close-sidebar-btn');
  const sidebar = document.getElementById('sidebar');

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Quick Action Buttons on Dashboard
  const quickEmp = document.getElementById('btn-quick-novo-emprestimo');
  if (quickEmp) quickEmp.addEventListener('click', openNovoEmprestimoModal);

  const quickLivro = document.getElementById('btn-quick-novo-livro');
  if (quickLivro) quickLivro.addEventListener('click', openNovoLivroModal);

  const quickUser = document.getElementById('btn-quick-novo-usuario');
  if (quickUser) quickUser.addEventListener('click', openNovoUsuarioModal);
}

function navigateToTab(tabId) {
  state.currentTab = tabId;

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Update nav links
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
  });

  // Update panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const activePane = document.getElementById(`pane-${tabId}`);
  if (activePane) activePane.classList.add('active');

  // Update Header Titles
  const title = document.getElementById('page-title');
  const subtitle = document.getElementById('page-subtitle');

  const headersMap = {
    dashboard: {
      title: 'Dashboard Geral',
      subtitle: 'Visão unificada do acervo, membros e circulação de livros'
    },
    livros: {
      title: 'Gerenciamento de Livros',
      subtitle: 'Cadastre, edite, controle o acervo e gerencie exemplares'
    },
    usuarios: {
      title: 'Gerenciamento de Usuários',
      subtitle: 'Controle de leitores, status de atividade e histórico de contatos'
    },
    emprestimos: {
      title: 'Controle de Empréstimos',
      subtitle: 'Acompanhe retiradas, devoluções e empréstimos em atraso'
    }
  };

  if (headersMap[tabId]) {
    title.textContent = headersMap[tabId].title;
    subtitle.textContent = headersMap[tabId].subtitle;
  }

  renderActiveTab();
}

function renderActiveTab() {
  switch (state.currentTab) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'livros':
      renderLivrosTable();
      break;
    case 'usuarios':
      renderUsuariosTable();
      break;
    case 'emprestimos':
      renderEmprestimosTable();
      break;
  }
}

// ============================================================================
// DASHBOARD LOGIC & RENDERING
// ============================================================================

function renderDashboard() {
  const totalLivros = state.livros.length;
  const exemplaresDisp = state.livros.reduce((acc, l) => acc + (l.quantidadeDisponivel || 0), 0);
  const totalUsuarios = state.usuarios.length;
  const usuariosAtivos = state.usuarios.filter(u => u.ativo === true).length;
  const emprestimosAtivos = state.emprestimos.filter(e => e.status === 'EM_ANDAMENTO').length;
  const emprestimosAtrasados = state.emprestimos.filter(e => e.status === 'ATRASADO').length;

  // Stat Cards
  document.getElementById('stat-total-livros').textContent = totalLivros;
  document.getElementById('stat-exemplares-disp').textContent = exemplaresDisp;
  document.getElementById('stat-total-usuarios').textContent = totalUsuarios;
  document.getElementById('stat-usuarios-ativos').textContent = usuariosAtivos;
  document.getElementById('stat-emprestimos-ativos').textContent = emprestimosAtivos;
  document.getElementById('stat-emprestimos-atrasados').textContent = emprestimosAtrasados;

  const countBadge = document.getElementById('dash-emprestimos-count');
  if (countBadge) countBadge.textContent = `${emprestimosAtivos} em andamento`;

  // Recent Loans Table
  const tbody = document.getElementById('dash-recent-loans-tbody');
  const activeLoans = state.emprestimos
    .filter(e => e.status === 'EM_ANDAMENTO' || e.status === 'ATRASADO')
    .slice(0, 5);

  if (activeLoans.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Nenhum empréstimo em aberto</h3>
          <p>Todos os exemplares emprestados foram devolvidos ao acervo.</p>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = activeLoans.map(e => `
      <tr>
        <td>
          <span class="item-title">${escapeHtml(e.tituloLivro || 'Livro #' + e.idLivro)}</span>
          <span class="item-subtitle">${escapeHtml(e.autorLivro || '')}</span>
        </td>
        <td>
          <span class="item-title">${escapeHtml(e.nomeUsuario || 'Usuário #' + e.idUsuario)}</span>
          <span class="item-subtitle">${escapeHtml(e.emailUsuario || '')}</span>
        </td>
        <td>${formatDate(e.dataDevolucaoPrevista)}</td>
        <td>${renderStatusBadge(e.status, e.dataDevolucaoPrevista)}</td>
        <td style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="confirmarDevolucao(${e.idEmprestimo})" title="Registrar devolução">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span>Devolver</span>
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Book Inventory Summary
  const booksSummary = document.getElementById('dash-books-summary');
  const lowStockBooks = state.livros.filter(l => (l.quantidadeDisponivel || 0) <= 1);

  if (state.livros.length === 0) {
    booksSummary.innerHTML = `
      <div class="empty-state" style="padding: 1.5rem 0;">
        <p>Nenhum livro cadastrado no sistema.</p>
      </div>
    `;
  } else {
    booksSummary.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 0.85rem;">
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Exemplares Emprestados:</span>
          <strong>${totalLivros ? state.livros.reduce((acc, l) => acc + (l.quantidadeTotal - l.quantidadeDisponivel), 0) : 0} un.</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
          <span style="color: var(--text-muted);">Disponibilidade Geral:</span>
          <strong style="color: var(--success);">${totalLivros ? Math.round((exemplaresDisp / state.livros.reduce((acc, l) => acc + l.quantidadeTotal, 0)) * 100) : 0}% livre</strong>
        </div>

        <div style="margin-top: 0.5rem;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em;">Atenção de Estoque</span>
          ${lowStockBooks.length === 0 ? `
            <p style="font-size: 0.825rem; color: var(--success); margin-top: 0.5rem;">
              ✓ Todos os livros contam com disponibilidade adequada.
            </p>
          ` : `
            <ul style="list-style: none; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              ${lowStockBooks.slice(0, 4).map(l => `
                <li style="display: flex; justify-content: space-between; align-items: center; font-size: 0.825rem; background: var(--bg-surface); padding: 0.45rem 0.65rem; border-radius: var(--radius-sm);">
                  <span style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;" title="${escapeHtml(l.titulo)}">${escapeHtml(l.titulo)}</span>
                  <span class="badge ${l.quantidadeDisponivel === 0 ? 'badge-inactive' : 'badge-warning'}">${l.quantidadeDisponivel} disp.</span>
                </li>
              `).join('')}
            </ul>
          `}
        </div>
      </div>
    `;
  }
}

// ============================================================================
// LIVROS MANAGEMENT
// ============================================================================

function setupFilters() {
  // Livros Filters
  const searchLivros = document.getElementById('search-livros');
  const filterGenero = document.getElementById('filter-genero');
  const filterDisp = document.getElementById('filter-disponibilidade');

  if (searchLivros) searchLivros.addEventListener('input', renderLivrosTable);
  if (filterGenero) filterGenero.addEventListener('change', renderLivrosTable);
  if (filterDisp) filterDisp.addEventListener('change', renderLivrosTable);

  // Usuários Filters
  const searchUsuarios = document.getElementById('search-usuarios');
  const filterUserStatus = document.getElementById('filter-usuario-status');

  if (searchUsuarios) searchUsuarios.addEventListener('input', renderUsuariosTable);
  if (filterUserStatus) filterUserStatus.addEventListener('change', renderUsuariosTable);

  // Empréstimos Filters
  const searchEmp = document.getElementById('search-emprestimos');
  const filterEmpStatus = document.getElementById('filter-emprestimo-status');

  if (searchEmp) searchEmp.addEventListener('input', renderEmprestimosTable);
  if (filterEmpStatus) filterEmpStatus.addEventListener('change', renderEmprestimosTable);

  // Modal Open Buttons
  document.getElementById('btn-abrir-novo-livro').addEventListener('click', openNovoLivroModal);
  document.getElementById('btn-abrir-novo-usuario').addEventListener('click', openNovoUsuarioModal);
  document.getElementById('btn-abrir-novo-emprestimo').addEventListener('click', openNovoEmprestimoModal);
}

function populateGenreFilter() {
  const select = document.getElementById('filter-genero');
  if (!select) return;

  const genres = [...new Set(state.livros.map(l => l.genero).filter(Boolean))].sort();
  const currentValue = select.value;

  select.innerHTML = '<option value="">Todos os Gêneros</option>' +
    genres.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');

  if (genres.includes(currentValue)) {
    select.value = currentValue;
  }
}

function renderLivrosTable() {
  const tbody = document.getElementById('livros-table-body');
  if (!tbody) return;

  const searchTerm = (document.getElementById('search-livros')?.value || '').toLowerCase().trim();
  const genreFilter = document.getElementById('filter-genero')?.value || '';
  const dispFilter = document.getElementById('filter-disponibilidade')?.value || '';

  let filtered = state.livros.filter(l => {
    const matchesSearch = !searchTerm ||
      (l.titulo && l.titulo.toLowerCase().includes(searchTerm)) ||
      (l.autor && l.autor.toLowerCase().includes(searchTerm)) ||
      (l.isbn && l.isbn.toLowerCase().includes(searchTerm));

    const matchesGenre = !genreFilter || l.genero === genreFilter;

    let matchesDisp = true;
    if (dispFilter === 'disponivel') {
      matchesDisp = (l.quantidadeDisponivel || 0) > 0;
    } else if (dispFilter === 'esgotado') {
      matchesDisp = (l.quantidadeDisponivel || 0) <= 0;
    }

    return matchesSearch && matchesGenre && matchesDisp;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>Nenhum livro encontrado</h3>
          <p>Tente ajustar os termos da busca ou os filtros aplicados.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(l => {
    const id = l.idLivro;
    const disp = l.quantidadeDisponivel || 0;
    const total = l.quantidadeTotal || 0;

    let stockBadgeClass = 'badge-active';
    let stockText = 'Em estoque';
    if (disp === 0) {
      stockBadgeClass = 'badge-inactive';
      stockText = 'Esgotado';
    } else if (disp <= 1) {
      stockBadgeClass = 'badge-warning';
      stockText = 'Últimos exemplares';
    }

    return `
      <tr>
        <td><strong style="color: var(--text-muted); font-size: 0.8rem;">#${id}</strong></td>
        <td>
          <span class="item-title">${escapeHtml(l.titulo)}</span>
          <span class="item-subtitle">${escapeHtml(l.autor)}</span>
        </td>
        <td><span class="badge" style="background: var(--bg-surface); border: 1px solid var(--border-color);">${escapeHtml(l.genero)}</span></td>
        <td>${l.anoPublicacao}</td>
        <td><code style="font-size: 0.8rem; background: var(--bg-surface); padding: 2px 6px; border-radius: 4px;">${escapeHtml(l.isbn)}</code></td>
        <td><strong>${total}</strong></td>
        <td>
          <strong class="${disp > 0 ? 'stock-in' : 'stock-out'}">${disp}</strong>
        </td>
        <td>
          <span class="badge ${stockBadgeClass}">
            <span class="badge-pill-dot"></span>
            ${stockText}
          </span>
        </td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn-icon edit" onclick="openEditarLivroModal(${id})" title="Editar livro completo (PUT)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon" onclick="openPatchLivroModal(${id})" title="Atualização rápida/parcial (PATCH)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="confirmarExclusaoLivro(${id}, '${escapeJs(l.titulo)}')" title="Excluir livro">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNovoLivroModal() {
  state.currentEditingLivroId = null;
  document.getElementById('modal-livro-title').textContent = 'Cadastrar Novo Livro';
  document.getElementById('form-livro').reset();
  document.getElementById('livro-form-id').value = '';

  const isbnInput = document.getElementById('livro-isbn');
  isbnInput.disabled = false;
  document.getElementById('livro-isbn-help').textContent = 'Identificador único do livro (ISBN)';

  openModal('modal-livro');
}

function openEditarLivroModal(id) {
  const livro = state.livros.find(l => l.idLivro === id);
  if (!livro) return;

  state.currentEditingLivroId = id;
  document.getElementById('modal-livro-title').textContent = `Editar Livro #${id}`;
  document.getElementById('livro-form-id').value = id;
  document.getElementById('livro-titulo').value = livro.titulo || '';
  document.getElementById('livro-autor').value = livro.autor || '';
  document.getElementById('livro-genero').value = livro.genero || '';
  document.getElementById('livro-ano').value = livro.anoPublicacao || '';
  document.getElementById('livro-quantidade').value = livro.quantidadeTotal || '';

  const isbnInput = document.getElementById('livro-isbn');
  isbnInput.value = livro.isbn || '';
  isbnInput.disabled = true; // ISBN is unchangeable via PUT in the backend
  document.getElementById('livro-isbn-help').textContent = 'O ISBN é o identificador único fixo e não pode ser alterado.';

  openModal('modal-livro');
}

function openPatchLivroModal(id) {
  const livro = state.livros.find(l => l.idLivro === id);
  if (!livro) return;

  document.getElementById('patch-livro-id').value = id;
  document.getElementById('patch-livro-titulo').placeholder = livro.titulo;
  document.getElementById('patch-livro-autor').placeholder = livro.autor;
  document.getElementById('patch-livro-genero').placeholder = livro.genero;
  document.getElementById('patch-livro-ano').placeholder = livro.anoPublicacao;
  document.getElementById('patch-livro-quantidade').placeholder = livro.quantidadeTotal;

  document.getElementById('form-patch-livro').reset();
  openModal('modal-patch-livro');
}

function confirmarExclusaoLivro(id, titulo) {
  showConfirm(
    'Excluir Livro',
    `Tem certeza que deseja remover o livro "${titulo}" (ID: ${id})? Livros vinculados a empréstimos ativos podem requerer remoção prévia do empréstimo.`,
    async () => {
      try {
        await api.deleteLivro(id);
        showToast('Livro excluído', `"${titulo}" foi removido com sucesso.`, 'success');
        await loadAllData();
      } catch (err) {
        showToast('Erro ao excluir', err.message, 'error');
      }
    },
    'Excluir Definitivamente',
    true
  );
}

// ============================================================================
// USUÁRIOS MANAGEMENT
// ============================================================================

function renderUsuariosTable() {
  const tbody = document.getElementById('usuarios-table-body');
  if (!tbody) return;

  const searchTerm = (document.getElementById('search-usuarios')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('filter-usuario-status')?.value || '';

  let filtered = state.usuarios.filter(u => {
    const nome = (u.nomeUsuario || '').toLowerCase();
    const email = (u.emailUsuario || '').toLowerCase();
    const tel = (u.telefoneUsuario || '').toLowerCase();

    const matchesSearch = !searchTerm || nome.includes(searchTerm) || email.includes(searchTerm) || tel.includes(searchTerm);

    let matchesStatus = true;
    if (statusFilter === 'ativo') matchesStatus = u.ativo === true;
    if (statusFilter === 'inativo') matchesStatus = u.ativo === false;

    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h3>Nenhum usuário encontrado</h3>
          <p>Tente ajustar a busca ou o filtro de status.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(u => {
    const id = u.idusuario ?? u.idUsuario ?? u.id;
    const isAtivo = u.ativo === true;

    return `
      <tr>
        <td><strong style="color: var(--text-muted); font-size: 0.8rem;">#${id}</strong></td>
        <td>
          <span class="item-title">${escapeHtml(u.nomeUsuario)}</span>
        </td>
        <td>${escapeHtml(u.emailUsuario)}</td>
        <td>${escapeHtml(u.telefoneUsuario)}</td>
        <td>
          <button class="badge ${isAtivo ? 'badge-active' : 'badge-inactive'}" 
                  onclick="alternarStatusUsuario(${id}, ${!isAtivo})"
                  title="Clique para alternar o status do usuário"
                  style="cursor: pointer; border-style: dashed;">
            <span class="badge-pill-dot"></span>
            ${isAtivo ? 'Ativo' : 'Inativo'} (Alternar)
          </button>
        </td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            <button class="btn-icon edit" onclick="openEditarUsuarioModal(${id})" title="Editar usuário">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete" onclick="confirmarExclusaoUsuario(${id}, '${escapeJs(u.nomeUsuario)}')" title="Excluir usuário">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNovoUsuarioModal() {
  state.currentEditingUsuarioId = null;
  document.getElementById('modal-usuario-title').textContent = 'Cadastrar Novo Usuário';
  document.getElementById('form-usuario').reset();
  document.getElementById('usuario-form-id').value = '';
  document.getElementById('usuario-ativo').checked = true;

  openModal('modal-usuario');
}

function openEditarUsuarioModal(id) {
  const usuario = state.usuarios.find(u => (u.idusuario ?? u.idUsuario ?? u.id) === id);
  if (!usuario) return;

  state.currentEditingUsuarioId = id;
  document.getElementById('modal-usuario-title').textContent = `Editar Usuário #${id}`;
  document.getElementById('usuario-form-id').value = id;
  document.getElementById('usuario-nome').value = usuario.nomeUsuario || '';
  document.getElementById('usuario-email').value = usuario.emailUsuario || '';
  document.getElementById('usuario-telefone').value = usuario.telefoneUsuario || '';
  document.getElementById('usuario-ativo').checked = usuario.ativo === true;

  openModal('modal-usuario');
}

async function alternarStatusUsuario(id, novoStatus) {
  try {
    await api.patchUsuario(id, { ativo: novoStatus });
    showToast('Status atualizado', `Usuário agora está ${novoStatus ? 'ativo' : 'inativo'}.`, 'success');
    await loadAllData();
  } catch (err) {
    showToast('Erro ao alterar status', err.message, 'error');
  }
}

function confirmarExclusaoUsuario(id, nome) {
  showConfirm(
    'Excluir Usuário',
    `Tem certeza que deseja remover o usuário "${nome}" (ID: ${id})?`,
    async () => {
      try {
        await api.deleteUsuario(id);
        showToast('Usuário excluído', `"${nome}" foi removido com sucesso.`, 'success');
        await loadAllData();
      } catch (err) {
        showToast('Erro ao excluir', err.message, 'error');
      }
    },
    'Excluir Usuário',
    true
  );
}

// ============================================================================
// EMPRÉSTIMOS MANAGEMENT
// ============================================================================

function renderEmprestimosTable() {
  const tbody = document.getElementById('emprestimos-table-body');
  if (!tbody) return;

  const searchTerm = (document.getElementById('search-emprestimos')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('filter-emprestimo-status')?.value || '';

  let filtered = state.emprestimos.filter(e => {
    const livro = (e.tituloLivro || '').toLowerCase();
    const user = (e.nomeUsuario || '').toLowerCase();

    const matchesSearch = !searchTerm || livro.includes(searchTerm) || user.includes(searchTerm);
    const matchesStatus = !statusFilter || e.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M7 15h10"></path>
            </svg>
          </div>
          <h3>Nenhum empréstimo encontrado</h3>
          <p>Tente ajustar os filtros ou registre um novo empréstimo.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(e => {
    const id = e.idEmprestimo;
    const isEmAndamento = e.status === 'EM_ANDAMENTO' || e.status === 'ATRASADO';

    return `
      <tr>
        <td><strong style="color: var(--text-muted); font-size: 0.8rem;">#${id}</strong></td>
        <td>
          <span class="item-title">${escapeHtml(e.tituloLivro || 'Livro #' + e.idLivro)}</span>
          <span class="item-subtitle">${escapeHtml(e.autorLivro || '')}</span>
        </td>
        <td>
          <span class="item-title">${escapeHtml(e.nomeUsuario || 'Usuário #' + e.idUsuario)}</span>
          <span class="item-subtitle">${escapeHtml(e.emailUsuario || '')}</span>
        </td>
        <td>${formatDate(e.dataEmprestimo)}</td>
        <td>${formatDate(e.dataDevolucaoPrevista)}</td>
        <td>${e.dataDevolucaoReal ? formatDate(e.dataDevolucaoReal) : '<span style="color: var(--text-subtle);">-</span>'}</td>
        <td>${renderStatusBadge(e.status, e.dataDevolucaoPrevista)}</td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            ${isEmAndamento ? `
              <button class="btn btn-secondary btn-sm" onclick="confirmarDevolucao(${id})" title="Registrar devolução">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span>Devolver</span>
              </button>
            ` : ''}
            <button class="btn-icon delete" onclick="confirmarExclusaoEmprestimo(${id})" title="Excluir empréstimo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function openNovoEmprestimoModal() {
  const userSelect = document.getElementById('emp-usuario-select');
  const bookSelect = document.getElementById('emp-livro-select');
  const dateInput = document.getElementById('emp-data-prevista');

  // Populate Active Users
  const activeUsers = state.usuarios.filter(u => u.ativo === true);
  if (activeUsers.length === 0) {
    userSelect.innerHTML = '<option value="">Nenhum usuário ativo disponível</option>';
  } else {
    userSelect.innerHTML = '<option value="">-- Selecione um leitor --</option>' +
      activeUsers.map(u => {
        const id = u.idusuario ?? u.idUsuario ?? u.id;
        return `<option value="${id}">${escapeHtml(u.nomeUsuario)} (${escapeHtml(u.emailUsuario)})</option>`;
      }).join('');
  }

  // Populate Books with stock > 0
  const availableBooks = state.livros.filter(l => (l.quantidadeDisponivel || 0) > 0);
  if (availableBooks.length === 0) {
    bookSelect.innerHTML = '<option value="">Nenhum livro disponível no momento</option>';
  } else {
    bookSelect.innerHTML = '<option value="">-- Selecione uma obra disponível --</option>' +
      availableBooks.map(l => `
        <option value="${l.idLivro}">${escapeHtml(l.titulo)} - ${escapeHtml(l.autor)} (${l.quantidadeDisponivel} disp.)</option>
      `).join('');
  }

  // Default expected return date: 14 days from now
  const future = new Date();
  future.setDate(future.getDate() + 14);
  dateInput.value = future.toISOString().split('T')[0];

  openModal('modal-emprestimo');
}

function confirmarDevolucao(id) {
  const emp = state.emprestimos.find(e => e.idEmprestimo === id);
  const title = emp?.tituloLivro || 'este livro';

  showConfirm(
    'Registrar Devolução',
    `Confirmar a devolução da obra "${title}"? O estoque disponível será restabelecido automaticamente.`,
    async () => {
      try {
        const result = await api.registrarDevolucao(id);
        const statusMsg = result.status === 'ATRASADO'
          ? 'Livro devolvido com registro de ATRASO.'
          : 'Livro devolvido dentro do prazo regular!';
        showToast('Devolução confirmada', statusMsg, 'success');
        await loadAllData();
      } catch (err) {
        showToast('Erro na devolução', err.message, 'error');
      }
    },
    'Confirmar Devolução',
    false
  );
}

function confirmarExclusaoEmprestimo(id) {
  showConfirm(
    'Excluir Empréstimo',
    `Deseja realmente remover o registro de empréstimo #${id}? Se o empréstimo estiver em aberto, o exemplar será estornado ao estoque.`,
    async () => {
      try {
        await api.deleteEmprestimo(id);
        showToast('Empréstimo removido', 'Registro excluído com sucesso.', 'success');
        await loadAllData();
      } catch (err) {
        showToast('Erro ao excluir', err.message, 'error');
      }
    },
    'Excluir Registro',
    true
  );
}

// ============================================================================
// FORM SUBMISSIONS & MODAL HANDLERS
// ============================================================================

function setupModals() {
  // Close modal via data-close-modal attribute
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const modalId = el.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });

  // Close modal when clicking on backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(backdrop => {
        closeModal(backdrop.id);
      });
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function setupFormSubmissions() {
  // 1. Livro Form (Create / Update via PUT)
  const formLivro = document.getElementById('form-livro');
  if (formLivro) {
    formLivro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('livro-form-id').value;
      const isEdit = !!id;

      const submitBtn = document.getElementById('btn-salvar-livro');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Salvando...';

      try {
        if (isEdit) {
          // LivroUpdateRequest: titulo, autor, genero, anoPublicacao, quantidadeTotal
          const payload = {
            titulo: document.getElementById('livro-titulo').value.trim(),
            autor: document.getElementById('livro-autor').value.trim(),
            genero: document.getElementById('livro-genero').value.trim(),
            anoPublicacao: parseInt(document.getElementById('livro-ano').value, 10),
            quantidadeTotal: parseInt(document.getElementById('livro-quantidade').value, 10)
          };
          await api.updateLivro(id, payload);
          showToast('Livro atualizado', `"${payload.titulo}" foi modificado com sucesso.`, 'success');
        } else {
          // LivroRequest: titulo, autor, genero, anoPublicacao, isbn, quantidadeTotal
          const payload = {
            titulo: document.getElementById('livro-titulo').value.trim(),
            autor: document.getElementById('livro-autor').value.trim(),
            genero: document.getElementById('livro-genero').value.trim(),
            anoPublicacao: parseInt(document.getElementById('livro-ano').value, 10),
            isbn: document.getElementById('livro-isbn').value.trim(),
            quantidadeTotal: parseInt(document.getElementById('livro-quantidade').value, 10)
          };
          await api.createLivro(payload);
          showToast('Livro cadastrado', `"${payload.titulo}" foi incluído no acervo.`, 'success');
        }

        closeModal('modal-livro');
        await loadAllData();
      } catch (err) {
        showToast('Erro ao salvar livro', err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 2. Livro Form (PATCH)
  const formPatchLivro = document.getElementById('form-patch-livro');
  if (formPatchLivro) {
    formPatchLivro.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('patch-livro-id').value;

      const patchData = {};
      const titulo = document.getElementById('patch-livro-titulo').value.trim();
      if (titulo) patchData.titulo = titulo;

      const autor = document.getElementById('patch-livro-autor').value.trim();
      if (autor) patchData.autor = autor;

      const genero = document.getElementById('patch-livro-genero').value.trim();
      if (genero) patchData.genero = genero;

      const ano = document.getElementById('patch-livro-ano').value;
      if (ano) patchData.anoPublicacao = parseInt(ano, 10);

      const qtd = document.getElementById('patch-livro-quantidade').value;
      if (qtd) patchData.quantidadeTotal = parseInt(qtd, 10);

      if (Object.keys(patchData).length === 0) {
        showToast('Nenhum campo preenchido', 'Preencha ao menos um campo para aplicar o PATCH.', 'info');
        return;
      }

      try {
        await api.patchLivro(id, patchData);
        showToast('Atualização aplicada', 'Campos parciais atualizados com sucesso.', 'success');
        closeModal('modal-patch-livro');
        await loadAllData();
      } catch (err) {
        showToast('Erro na atualização parcial', err.message, 'error');
      }
    });
  }

  // 3. Usuário Form (Create / Update via PUT)
  const formUsuario = document.getElementById('form-usuario');
  if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('usuario-form-id').value;
      const isEdit = !!id;

      const payload = {
        nomeUsuario: document.getElementById('usuario-nome').value.trim(),
        emailUsuario: document.getElementById('usuario-email').value.trim(),
        telefoneUsuario: document.getElementById('usuario-telefone').value.trim(),
        ativo: document.getElementById('usuario-ativo').checked
      };

      const submitBtn = document.getElementById('btn-salvar-usuario');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Salvando...';

      try {
        if (isEdit) {
          await api.updateUsuario(id, payload);
          showToast('Usuário atualizado', `Dados de "${payload.nomeUsuario}" foram salvos.`, 'success');
        } else {
          await api.createUsuario(payload);
          showToast('Usuário cadastrado', `"${payload.nomeUsuario}" agora é membro da biblioteca.`, 'success');
        }

        closeModal('modal-usuario');
        await loadAllData();
      } catch (err) {
        showToast('Erro ao salvar usuário', err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 4. Empréstimo Form (Create)
  const formEmprestimo = document.getElementById('form-emprestimo');
  if (formEmprestimo) {
    formEmprestimo.addEventListener('submit', async (e) => {
      e.preventDefault();

      const idUsuario = document.getElementById('emp-usuario-select').value;
      const idLivro = document.getElementById('emp-livro-select').value;
      const dataDevolucaoPrevista = document.getElementById('emp-data-prevista').value;

      if (!idUsuario || !idLivro || !dataDevolucaoPrevista) {
        showToast('Campos obrigatórios', 'Por favor, selecione o usuário, o livro e a data de devolução.', 'error');
        return;
      }

      const payload = {
        idUsuario: parseInt(idUsuario, 10),
        idLivro: parseInt(idLivro, 10),
        dataDevolucaoPrevista: dataDevolucaoPrevista
      };

      const submitBtn = document.getElementById('btn-confirmar-emprestimo');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Processando...';

      try {
        await api.createEmprestimo(payload);
        showToast('Empréstimo registrado', 'Livro emprestado com sucesso!', 'success');
        closeModal('modal-emprestimo');
        await loadAllData();
      } catch (err) {
        showToast('Erro no empréstimo', err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

// ============================================================================
// MODAL DE CONFIRMAÇÃO GENÉRICA
// ============================================================================

let currentConfirmHandler = null;

function showConfirm(title, message, onConfirm, btnText = 'Confirmar', isDanger = true) {
  const modal = document.getElementById('modal-confirm');
  const titleEl = document.getElementById('confirm-title');
  const messageEl = document.getElementById('confirm-message');
  const actionBtn = document.getElementById('confirm-btn-action');
  const iconEl = document.getElementById('confirm-icon');

  if (!modal || !titleEl || !messageEl || !actionBtn) return;

  titleEl.textContent = title;
  messageEl.textContent = message;
  actionBtn.textContent = btnText;

  if (isDanger) {
    actionBtn.className = 'btn btn-danger';
    iconEl.style.background = 'var(--danger-bg)';
    iconEl.style.color = 'var(--danger)';
  } else {
    actionBtn.className = 'btn btn-primary';
    iconEl.style.background = 'var(--primary-light)';
    iconEl.style.color = 'var(--primary)';
  }

  // Remove previous listener
  if (currentConfirmHandler) {
    actionBtn.removeEventListener('click', currentConfirmHandler);
  }

  currentConfirmHandler = async () => {
    closeModal('modal-confirm');
    if (typeof onConfirm === 'function') {
      await onConfirm();
    }
  };

  actionBtn.addEventListener('click', currentConfirmHandler);
  openModal('modal-confirm');
}

// ============================================================================
// TOAST NOTIFICATIONS
// ============================================================================

function showToast(title, message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `,
    error: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `,
    info: `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `
  };

  toast.innerHTML = `
    <div class="toast-icon">
      ${iconMap[type] || iconMap.info}
    </div>
    <div class="toast-body">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Fechar notificação">&times;</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    dismissToast(toast);
  });

  container.appendChild(toast);

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    dismissToast(toast);
  }, 5000);
}

function dismissToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// ============================================================================
// UTILITY & FORMATTING FUNCTIONS
// ============================================================================

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

function renderStatusBadge(status, dataDevolucaoPrevista) {
  let displayStatus = status;
  let badgeClass = `badge-${status}`;
  let text = status;

  if (status === 'EM_ANDAMENTO') {
    // Check if it's currently overdue based on today's date
    const today = new Date().toISOString().split('T')[0];
    if (dataDevolucaoPrevista && today > dataDevolucaoPrevista) {
      badgeClass = 'badge-ATRASADO';
      text = 'Atrasado';
    } else {
      text = 'Em Andamento';
    }
  } else if (status === 'DEVOLVIDO') {
    text = 'Devolvido';
  } else if (status === 'ATRASADO') {
    text = 'Devolvido com Atraso';
  }

  return `
    <span class="badge ${badgeClass}">
      <span class="badge-pill-dot"></span>
      ${text}
    </span>
  `;
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

