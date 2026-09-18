import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api/client';
import { fmtDiaCurto, fmtNumeroDoDia, fmtMesCurto, fmtHora, isoDoDia } from '../../lib/format';

const DIAS_POR_PAGINA = 14;

/**
 * Escolha de dia e hora a partir do que a API diz estar livre.
 *
 * Nunca há um campo de data livre: o que aparece é o que existe. Um dia sem
 * vagas aparece apagado e não se pode carregar nele — ao contrário de metade
 * dos sistemas de marcação por aí, que deixam escolher e só depois dizem que
 * não há nada.
 */
const SlotPicker = ({ serviceId, resourceId, value, onChange }) => {
  const [inicio, setInicio] = useState(() => new Date());
  const [dias, setDias] = useState([]);
  const [diaAberto, setDiaAberto] = useState(null);
  const [aCarregar, setACarregar] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async (vivo = () => true) => {
    if (!serviceId) return;

    await Promise.resolve();
    if (!vivo()) return;

    setACarregar(true);
    setErro('');

    const fim = new Date(inicio);
    fim.setDate(fim.getDate() + DIAS_POR_PAGINA - 1);

    const params = new URLSearchParams({
      serviceId: String(serviceId),
      from: isoDoDia(inicio),
      to: isoDoDia(fim),
    });

    if (resourceId) params.set('resourceId', String(resourceId));

    try {
      const resposta = await api.get(`/availability?${params}`);
      if (!vivo()) return;

      const lista = Array.isArray(resposta) ? resposta : [];
      setDias(lista);

      // Abrir no primeiro dia com vagas poupa um clique a quem só quer o
      // mais cedo possível, que é quase toda a gente.
      setDiaAberto((atual) => {
        if (atual && lista.some((d) => d.date === atual)) return atual;
        return lista.find((d) => d.slots.length > 0)?.date ?? null;
      });
    } catch (e) {
      if (!vivo()) return;
      setErro(e.message ?? 'Não foi possível obter os horários.');
      setDias([]);
    } finally {
      if (vivo()) setACarregar(false);
    }
  }, [serviceId, resourceId, inicio]);

  // Um pedido que já não interessa — porque o serviço ou a quinzena mudaram
  // entretanto — não escreve por cima do que interessa agora.
  useEffect(() => {
    let vivo = true;
  // `carregar` só escreve estado depois do primeiro await, ou seja, já noutro
  // microtask: não há a cascata de renders síncronos que a regra apanha.
  // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar(() => vivo);
    return () => { vivo = false; };
  }, [carregar]);

  const grelha = [];
  for (let i = 0; i < DIAS_POR_PAGINA; i++) {
    const data = new Date(inicio);
    data.setDate(data.getDate() + i);
    const iso = isoDoDia(data);
    grelha.push({ iso, vagas: dias.find((d) => d.date === iso)?.slots ?? [] });
  }

  const slotsDoDia = grelha.find((d) => d.iso === diaAberto)?.vagas ?? [];
  const primeiroDia = isoDoDia(inicio) <= isoDoDia(new Date());

  const andar = (passos) => {
    const proximo = new Date(inicio);
    proximo.setDate(proximo.getDate() + passos * DIAS_POR_PAGINA);
    const hoje = new Date();
    setInicio(proximo < hoje ? hoje : proximo);
  };

  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Escolhe o dia</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => andar(-1)}
            disabled={primeiroDia}
            className="px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg
                       hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Antes
          </button>
          <button
            type="button"
            onClick={() => andar(1)}
            className="px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg
                       hover:bg-gray-50 cursor-pointer"
          >
            Depois →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {grelha.map(({ iso, vagas }) => {
          const temVagas = vagas.length > 0;
          const aberto = iso === diaAberto;

          return (
            <button
              key={iso}
              type="button"
              disabled={!temVagas}
              onClick={() => setDiaAberto(iso)}
              title={temVagas ? `${vagas.length} horários` : 'Sem vagas'}
              className={`flex flex-col items-center py-2 rounded-lg border text-xs transition-colors
                ${aberto
                  ? 'bg-gray-900 text-white border-gray-900'
                  : temVagas
                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer'
                    : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'}`}
            >
              <span className="uppercase tracking-wide">{fmtDiaCurto(iso)}</span>
              <span className="text-base font-semibold leading-tight">{fmtNumeroDoDia(iso)}</span>
              <span>{fmtMesCurto(iso)}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">Escolhe a hora</p>

        {aCarregar && <p className="text-sm text-gray-400">A procurar horários…</p>}
        {erro && <p className="text-sm text-red-500">{erro}</p>}

        {!aCarregar && !erro && slotsDoDia.length === 0 && (
          <p className="text-sm text-gray-400">
            Nenhum dia desta quinzena tem vagas. Experimenta mais à frente.
          </p>
        )}

        {slotsDoDia.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {slotsDoDia.map((slot) => {
              const escolhido = value === slot.startsAt;

              return (
                <button
                  key={slot.startsAt}
                  type="button"
                  onClick={() => onChange(slot)}
                  className={`py-2 rounded-lg border text-sm transition-colors cursor-pointer
                    ${escolhido
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                >
                  {fmtHora(slot.startsAt)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotPicker;
