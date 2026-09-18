import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import SlotPicker from '../../components/booking/SlotPicker';
import { fmtEuros, fmtDuracao, fmtDataHora } from '../../lib/format';

/**
 * Marcar: escolher o serviço, opcionalmente quem o presta, e uma hora que
 * existe. A hora nunca é escrita à mão — vem da disponibilidade real.
 */
const NewScheduling = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [servicos, setServicos] = useState([]);
  const [recursos, setRecursos] = useState([]);

  // O serviço pode vir do painel (estado de navegação) ou do site público
  // (query string, que sobrevive à ida ao Anvil e ao regresso).
  const [servicoId, setServicoId] = useState(() => {
    const doEstado = location.state?.serviceId;
    const daQuery = params.get('serviceId');
    return doEstado ? Number(doEstado) : daQuery ? Number(daQuery) : null;
  });
  const [recursoId, setRecursoId] = useState(null);
  const [slot, setSlot] = useState(null);
  const [notas, setNotas] = useState('');

  const [aGravar, setAGravar] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/services')
      .then((lista) => setServicos((Array.isArray(lista) ? lista : []).filter((s) => s.isActive)))
      .catch(() => setServicos([]));
  }, []);

  // Quem presta este serviço. Com um só, não se pergunta nada a ninguém.
  useEffect(() => {
    if (!servicoId) return;

    let vivo = true;

    api.get(`/resources?serviceId=${servicoId}`)
      .then((lista) => { if (vivo) setRecursos(Array.isArray(lista) ? lista : []); })
      .catch(() => { if (vivo) setRecursos([]); });

    return () => { vivo = false; };
  }, [servicoId]);

  // Mudar de serviço invalida o que já estava escolhido. Fica aqui, no gesto
  // que o causa, e não num efeito a reagir depois do facto.
  const escolherServico = (id) => {
    setServicoId(id);
    setRecursoId(null);
    setRecursos([]);
    setSlot(null);
  };

  const servico = servicos.find((s) => s.id === servicoId);

  const confirmar = async () => {
    if (!servicoId || !slot) return;

    setAGravar(true);
    setErro('');

    try {
      await api.post('/schedulings', {
        serviceId: servicoId,
        resourceId: recursoId,
        startsAt: slot.startsAt,
        notes: notas.trim() || null,
      });

      showToast('Marcação criada.');
      navigate('/schedulings');
    } catch (e) {
      setErro(e.message ?? 'Não foi possível criar a marcação.');
      showToast('Não foi possível criar a marcação.', 'error');
      setSlot(null);
    } finally {
      setAGravar(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Nova marcação</h1>
        <p className="text-sm text-gray-400 mt-1">Escolhe o serviço e uma hora livre.</p>
      </div>

      {/* Serviço */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-700">Serviço</p>

        <div className="flex flex-col gap-2">
          {servicos.map((s) => {
            const escolhido = s.id === servicoId;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => escolherServico(s.id)}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg border text-left
                  transition-colors cursor-pointer
                  ${escolhido
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'}`}
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900 truncate">{s.name}</span>
                  <span className="block text-xs text-gray-400">{fmtDuracao(s.durationMinutes)}</span>
                </span>
                <span className="text-sm font-semibold text-gray-900 shrink-0">{fmtEuros(s.price)}</span>
              </button>
            );
          })}

          {servicos.length === 0 && (
            <p className="text-sm text-gray-400">Não há serviços disponíveis de momento.</p>
          )}
        </div>
      </section>

      {/* Quem presta — só se houver escolha a fazer */}
      {servicoId && recursos.length > 1 && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-700">Preferência</p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => { setRecursoId(null); setSlot(null); }}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer
                ${recursoId === null
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              Sem preferência
            </button>

            {recursos.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setRecursoId(r.id); setSlot(null); }}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors cursor-pointer
                  ${recursoId === r.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Dia e hora */}
      {servicoId && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <SlotPicker
            serviceId={servicoId}
            resourceId={recursoId}
            value={slot?.startsAt}
            onChange={setSlot}
          />
        </section>
      )}

      {/* Confirmação */}
      {slot && servico && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">A tua marcação</p>
            <p className="text-sm text-gray-900 mt-2">{servico.name}</p>
            <p className="text-sm text-gray-500">{fmtDataHora(slot.startsAt)}</p>
            <p className="text-xs text-gray-400 mt-1">
              {fmtDuracao(servico.durationMinutes)} · {fmtEuros(servico.price)}
            </p>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-400">Alguma nota? (opcional)</span>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </label>

          {erro && <p className="text-xs text-red-500">{erro}</p>}

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button onClick={() => navigate('/schedulings')}>Voltar</Button>
            <Button variant="primary" onClick={confirmar} disabled={aGravar}>
              {aGravar ? 'A confirmar…' : 'Confirmar marcação'}
            </Button>
          </div>
        </section>
      )}

    </div>
  );
};

export default NewScheduling;
