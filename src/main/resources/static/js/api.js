/**
 * BIBLIOTECA-API - REST CLIENT LAYER
 * Vanilla JavaScript using Fetch API with robust error handling
 */

const API_BASE_URL = (window.location.protocol === 'file:' || (window.location.port !== '8080' && window.location.port !== ''))
  ? 'http://localhost:8080'
  : '';

class ApiService {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      // Check if response has JSON body
      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        let errorMessage = 'Erro ao processar requisição';
        if (data && typeof data === 'object') {
          // Standard GlobalExceptionHandler ErrorResponse format (note: 'menssage' in backend ErrorResponse)
          errorMessage = data.menssage || data.message || data.error || errorMessage;
        } else if (typeof data === 'string' && data.length > 0) {
          errorMessage = data;
        }
        const error = new Error(errorMessage);
        error.status = response.status;
        error.details = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao servidor backend (http://localhost:8080). Verifique se a aplicação Spring Boot está em execução.');
      }
      throw err;
    }
  }

  // ==========================================
  // LIVROS ENDPOINTS
  // ==========================================

  getLivros() {
    return this.request('/livros', { method: 'GET' });
  }

  getLivroById(id) {
    return this.request(`/livros/${id}`, { method: 'GET' });
  }

  getLivroByTitulo(titulo) {
    return this.request(`/livros/titulo/${encodeURIComponent(titulo)}`, { method: 'GET' });
  }

  createLivro(livroData) {
    return this.request('/livros', {
      method: 'POST',
      body: JSON.stringify(livroData)
    });
  }

  updateLivro(id, livroData) {
    return this.request(`/livros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(livroData)
    });
  }

  patchLivro(id, patchData) {
    return this.request(`/livros/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patchData)
    });
  }

  deleteLivro(id) {
    return this.request(`/livros/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // USUÁRIOS ENDPOINTS
  // ==========================================

  getUsuarios() {
    return this.request('/usuarios', { method: 'GET' });
  }

  getUsuarioById(id) {
    return this.request(`/usuarios/${id}`, { method: 'GET' });
  }

  createUsuario(usuarioData) {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(usuarioData)
    });
  }

  updateUsuario(id, usuarioData) {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuarioData)
    });
  }

  patchUsuario(id, patchData) {
    return this.request(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patchData)
    });
  }

  deleteUsuario(id) {
    return this.request(`/usuarios/${id}`, { method: 'DELETE' });
  }

  // ==========================================
  // EMPRÉSTIMOS ENDPOINTS
  // ==========================================

  getEmprestimos() {
    return this.request('/emprestimos', { method: 'GET' });
  }

  getEmprestimoById(id) {
    return this.request(`/emprestimos/${id}`, { method: 'GET' });
  }

  createEmprestimo(emprestimoData) {
    return this.request('/emprestimos', {
      method: 'POST',
      body: JSON.stringify(emprestimoData)
    });
  }

  registrarDevolucao(id) {
    return this.request(`/emprestimos/${id}/devolucao`, {
      method: 'PATCH'
    });
  }

  deleteEmprestimo(id) {
    return this.request(`/emprestimos/${id}`, { method: 'DELETE' });
  }

  // Check health / connectivity
  async checkConnection() {
    try {
      await this.getLivros();
      return true;
    } catch {
      return false;
    }
  }
}

const api = new ApiService();
