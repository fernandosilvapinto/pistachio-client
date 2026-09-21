import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Fixado em 2.x de propósito: a partir da 3.0 o protocolo de prova de
// trabalho mudou por completo (deixa de ser sal+número com SHA-256 e passa a
// derivação de chave com prefixo-alvo) — incompatível com o que o backend
// implementa. Nunca atualizar sem trocar os dois lados ao mesmo tempo.
import 'altcha';
import { api, ApiError, API_BASE } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SlotPicker from '../components/booking/SlotPicker';
import { fmtEuros, fmtDuracao, fmtDataHora } from '../lib/format';

/**
 * Marcação a partir do site público.
 *
 * Não pede conta nenhuma: nome, email e telefone chegam para marcar. O email
 * identifica a pessoa — uma segunda marcação com o mesmo email junta-se ao
 * mesmo histórico do lado do negócio, sem a pessoa ter de fazer nada por
 * isso. A confirmação e o link para cancelar ou reagendar vão por email.
 */
const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [servicos, setServicos] = useState([]);
  const [servicoId, setServicoId] = useState(
    location.state?.serviceId ? Number(location.state.serviceId) : null,
  );
  const [slot, setSlot] = useState(null);

  const [contacto, setContacto] = useState({ nome: '', email: '', telefone: '' });
  // Armadilha para bots: escondida de gente por CSS, visível para quem só lê
  // o HTML e preenche tudo o que encontra. Uma pessoa nunca a vê nem a toca.
  const [website, setWebsite] = useState('');
  const [erro, setErro] = useState('');
  const [aMarcar, setAMarcar] = useState(false);
  const [confirmada, setConfirmada] = useState(null);

  // Prova de que quem está do outro lado é uma pessoa, resolvida em segundo
  // plano no browser — sem imagens para acertar, na maioria das vezes sem a
  // pessoa reparar que aconteceu.
  const altchaRef = useRef(null);
  const [altchaPayload, setAltchaPayload] = useState(null);
  const [altchaPronto, setAltchaPronto] = useState(false);

  useEffect(() => {
    api.get('/services')
      .then((lista) => setServicos((Array.isArray(lista) ? lista : []).filter((s) => s.isActive)))
      .catch(() => setServicos([]));
  }, []);

  const servico = servicos.find((s) => s.id === servicoId);

  useEffect(() => {
    const widget = altchaRef.current;
    if (!widget) return undefined;

    const aoMudarEstado = (e) => {
      const { state, payload } = e.detail;
      setAltchaPronto(state === 'verified');
      setAltchaPayload(state === 'verified' ? payload : null);
    };

    widget.addEventListener('statechange', aoMudarEstado);
    return () => widget.removeEventListener('statechange', aoMudarEstado);
  }, [slot, servico]);

  const marcar = async (e) => {
    e.preventDefault();
    setErro('');

    if (!contacto.nome.trim() || !contacto.email.trim()) {
      setErro('Nome e email são obrigatórios.');
      return;
    }

    if (!altchaPronto) {
      setErro('Aguarda só mais um instante — a confirmar que não és um robô.');
      return;
    }

    setAMarcar(true);

    try {
      const criada = await api.post('/schedulings', {
        serviceId: servicoId,
        startsAt: slot.startsAt,
        customerName: contacto.nome.trim(),
        customerEmail: contacto.email.trim(),
        customerPhone: contacto.telefone.trim() || null,
        website,
        altcha: altchaPayload,
      });

      setConfirmada(criada);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Não foi possível marcar. Tenta outra vez.');
    } finally {
      setAMarcar(false);
    }
  };

  if (confirmada) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Marcação confirmada</h1>
        <p className="text-sm text-gray-500 max-w-sm">
          {confirmada.serviceName} — {fmtDataHora(confirmada.startsAt)}
        </p>
        <p className="text-sm text-gray-400 max-w-sm">
          Enviámos os detalhes para <strong>{contacto.email}</strong>, com um link
          para cancelares ou reagendares, se precisares.
        </p>
        <Button variant="primary" onClick={() => navigate('/welcome')} className="mt-2">
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Marcar</h1>
        <p className="text-sm text-gray-400 mt-1">Escolhe o serviço e vê as horas livres.</p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Serviço</p>

        <div className="flex flex-col gap-2">
          {servicos.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { setServicoId(s.id); setSlot(null); }}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-left
                transition-colors cursor-pointer
                ${s.id === servicoId
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'}`}
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-gray-900 truncate">{s.name}</span>
                <span className="block text-xs text-gray-400">{fmtDuracao(s.durationMinutes)}</span>
              </span>
              <span className="text-sm font-semibold text-gray-900 shrink-0">{fmtEuros(s.price)}</span>
            </button>
          ))}

          {servicos.length === 0 && (
            <p className="text-sm text-gray-400">Não há serviços disponíveis de momento.</p>
          )}
        </div>
      </section>

      {servicoId && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <SlotPicker serviceId={servicoId} value={slot?.startsAt} onChange={setSlot} />
        </section>
      )}

      {slot && servico && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">A tua escolha</p>
            <p className="text-sm text-gray-900 mt-2">{servico.name}</p>
            <p className="text-sm text-gray-500">{fmtDataHora(slot.startsAt)}</p>
          </div>

          <form onSubmit={marcar} className="flex flex-col gap-3">
            <p className="text-xs text-gray-400">
              Só para te avisarmos e para poderes cancelar ou reagendar sozinho — sem conta, sem password.
            </p>

            <Input
              label="Nome"
              value={contacto.nome}
              onChange={(e) => setContacto((c) => ({ ...c, nome: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={contacto.email}
              onChange={(e) => setContacto((c) => ({ ...c, email: e.target.value }))}
              required
            />
            <Input
              label="Telefone (opcional)"
              type="tel"
              value={contacto.telefone}
              onChange={(e) => setContacto((c) => ({ ...c, telefone: e.target.value }))}
            />

            {/* Armadilha para bots — invisível e inalcançável para uma pessoa:
                fora do ecrã, sem tab, sem preenchimento automático, e um rótulo
                que um leitor de ecrã também ignora. */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label htmlFor="website">Não preencher</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <altcha-widget
              ref={altchaRef}
              challengeurl={`${API_BASE}/anti-bot/challenge`}
              hidefooter
              hidelogo
              style={{ '--altcha-max-width': '100%' }}
            />

            {erro && <p className="text-xs text-red-500">{erro}</p>}

            <div className="flex justify-end pt-1">
              <Button type="submit" variant="primary" disabled={aMarcar || !altchaPronto}>
                {aMarcar ? 'A marcar…' : 'Confirmar marcação'}
              </Button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => navigate('/welcome')}
        className="text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ← Voltar ao início
      </button>
    </div>
  );
};

export default Book;
