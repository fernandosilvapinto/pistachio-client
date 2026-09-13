import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userManager, signOutRedirect } from '../auth/userManager';

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // Ao contrário das aplicações internas, aqui `anonymous` é um estado normal e
  // permanente: quem chega a este site não tem conta, e a maior parte do que
  // interessa — ver serviços, marcar como convidado — funciona sem ela. Nada
  // nesta camada empurra ninguém para o Keeper; só o PrivateRoute o faz, e só
  // nas páginas que precisam.
  const [status, setStatus] = useState('loading');
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  const forget = useCallback(() => {
    setProfile(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  const adopt = useCallback(
    async (oidcUser) => {
      if (!oidcUser || oidcUser.expired) {
        forget();
        return;
      }

      setProfile(oidcUser.profile);

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${oidcUser.access_token}` },
        });
        const body = response.ok ? await response.json() : null;
        setUser(body?.user ?? null);
      } catch {
        setUser(null);
      }

      setStatus('authenticated');
    },
    [forget],
  );

  useEffect(() => {
    let active = true;

    userManager.getUser().then((oidcUser) => {
      if (active) adopt(oidcUser);
    });

    const onLoaded = (oidcUser) => adopt(oidcUser);

    userManager.events.addUserLoaded(onLoaded);
    userManager.events.addUserUnloaded(forget);
    userManager.events.addAccessTokenExpired(forget);
    userManager.events.addSilentRenewError(forget);

    return () => {
      active = false;
      userManager.events.removeUserLoaded(onLoaded);
      userManager.events.removeUserUnloaded(forget);
      userManager.events.removeAccessTokenExpired(forget);
      userManager.events.removeSilentRenewError(forget);
    };
  }, [adopt, forget]);

  const signIn = useCallback(
    (returnTo) =>
      userManager.signinRedirect({
        state: { returnTo: returnTo ?? window.location.pathname + window.location.search },
      }),
    [],
  );

  // `prompt=create` leva a pessoa ao ecrã de registo do provider em vez do de
  // início de sessão. É um parâmetro da especificação, não um truque do
  // Keycloak, e evita ter aqui um formulário de registo — ou seja, evita que
  // esta aplicação alguma vez veja uma password.
  const signUp = useCallback(
    (returnTo) =>
      userManager.signinRedirect({
        prompt: 'create',
        state: { returnTo: returnTo ?? '/dashboard' },
      }),
    [],
  );

  const signOut = useCallback(() => signOutRedirect(), []);

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === 'authenticated',
        loading: status === 'loading',
        profile,
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
