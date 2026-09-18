import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import SlotPicker from '../components/booking/SlotPicker';
import { fmtEuros, fmtDuracao, fmtDataHora } from '../lib/format';

/**
 * Marcação a partir do site público.
 *
 * A escolha de dia e hora é a mesma de quem tem sessão — quem chega de fora vê
 * a agenda real antes de decidir criar conta. A conta só é pedida no fim, e a
 * hora escolhida viaja com a pessoa até ao regresso do Anvil.
 *
 * Marcar sem conta nenhuma fica para quando o endpoint de convidado tiver
 * limitação de pedidos: sem isso, é uma máquina de criar contas à solta na
 * internet.
 */
const Book = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn, register } = useAuth();

  const [servicos, setServicos] = useState([]);
  const [servicoId, setServicoId] = useState(
    location.state?.serviceId ? Number(location.state.serviceId) : null,
  );
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    api.get('/services')
      .then((lista) => setServicos((Array.isArray(lista) ? lista : []).filter((s) => s.isActive)))
      .catch(() => setServicos([]));
  }, []);

  const servico = servicos.find((s) => s.id === servicoId);

  // A escolha viaja no estado do pedido de autenticação e é retomada do outro
  // lado, para que ninguém tenha de repetir o que já escolheu.
  const continuar = (accao) => {
    const destino = servicoId
      ? `/schedulings/new?serviceId=${servicoId}${slot ? `&startsAt=${encodeURIComponent(slot.startsAt)}` : ''}`
      : '/schedulings/new';

    if (isAuthenticated) {
      navigate(destino);
      return;
    }

    accao(destino);
  };

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

          <p className="text-xs text-gray-400">
            Falta só a conta, para te podermos avisar de qualquer alteração e para
            poderes cancelar ou reagendar sozinho.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button onClick={() => continuar(signIn)}>Já tenho conta</Button>
            <Button variant="primary" onClick={() => continuar(register)}>
              Criar conta e marcar
            </Button>
          </div>
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
