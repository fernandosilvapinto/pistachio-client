import { UserManager, WebStorageStateStore, InMemoryWebStorage } from 'oidc-client-ts';

const authority = import.meta.env.VITE_ANVIL_AUTHORITY;
const clientId = import.meta.env.VITE_ANVIL_CLIENT_ID;

if (!authority || !clientId) {
  throw new Error(
    'VITE_ANVIL_AUTHORITY e VITE_ANVIL_CLIENT_ID têm de estar definidos. Copia .env.example para .env.',
  );
}

if (!window.crypto?.subtle) {
  throw new Error(
    `Esta página está em ${window.location.origin}, que o browser não considera um contexto seguro, ` +
      'por isso crypto.subtle não existe e o PKCE não pode ser calculado. ' +
      'Serve a aplicação em http://localhost, em http://127.0.0.1, ou sobre HTTPS.',
  );
}

/**
 * O cliente de consumidor fala com o realm `customers`, não com o `workforce`.
 *
 * É o mesmo Anvil e o mesmo protocolo, mas outra população: registo aberto,
 * email verificado à entrada, sessões longas. E, sobretudo, outra fronteira —
 * uma sessão aqui nunca se transforma numa sessão do lado interno, por mais
 * que alguém a peça.
 */
export const userManager = new UserManager({
  authority,
  client_id: clientId,

  response_type: 'code',
  scope: 'openid profile email',

  redirect_uri: `${window.location.origin}/callback`,
  post_logout_redirect_uri: `${window.location.origin}/welcome`,

  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
  stateStore: new WebStorageStateStore({ store: window.sessionStorage }),

  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,

  monitorSession: false,
});

/** O ecrã de conta do Anvil: password, email, sessões, dispositivos. */
export const accountConsoleUrl = `${authority.replace(/\/$/, '')}/account`;

// signoutRedirect() remove o utilizador do armazenamento ANTES de navegar, e
// isso dispara `userUnloaded`. Qualquer guarda que mande anónimos ao provider
// reage nesse instante e inicia um redirecionamento de ENTRADA por cima do de
// SAÍDA que já ia a caminho — o browser recebe duas navegações, a primeira
// morre, e o botão parece não fazer nada.
//
// Esta bandeira existe para as guardas se manterem quietas enquanto uma saída
// está em curso. É um módulo e não estado do React de propósito: tem de ficar
// verdadeira no mesmo instante da chamada, sem esperar por uma renderização.
let leaving = false;

export const isSigningOut = () => leaving;

export const signOutRedirect = () => {
  leaving = true;
  return userManager.signoutRedirect().catch((error) => {
    leaving = false;
    throw error;
  });
};
