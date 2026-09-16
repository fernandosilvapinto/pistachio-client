import { userManager } from '../auth/userManager';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const request = async (path, options = {}) => {
  // Boa parte desta aplicação é anónima de propósito: o catálogo e a marcação
  // como convidado não exigem sessão nenhuma. Por isso o token é opcional —
  // envia-se quando existe, e o pedido segue à mesma quando não existe.
  const user = await userManager.getUser();
  const token = user && !user.expired ? user.access_token : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 401 só justifica mandar a pessoa ao Anvil se ela julgava ter sessão. Num
  // ecrã público é simplesmente a resposta a um pedido que precisava de conta.
  if (response.status === 401) {
    if (user) {
      await userManager.signinRedirect({
        state: { returnTo: window.location.pathname + window.location.search },
      });
    }
    throw new ApiError(401, 'É preciso iniciar sessão.');
  }

  if (response.status === 403) {
    throw new ApiError(403, 'Não tens permissão para esta operação.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(response.status, body.message ?? `Erro ${response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
