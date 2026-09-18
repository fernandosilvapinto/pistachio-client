import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import SchedulingCard from '../../components/ui/SchedulingCard';

const FILTROS = [
  { chave: 'Todas', estados: null },
  { chave: 'Por confirmar', estados: ['Pending'] },
  { chave: 'Confirmadas', estados: ['Confirmed'] },
  { chave: 'Concluídas', estados: ['Completed'] },
  { chave: 'Canceladas', estados: ['Cancelled'] },
];

const SchedulingList = () => {
  const [marcacoes, setMarcacoes] = useState([]);
  const [aCarregar, setACarregar] = useState(true);
  const [filtro, setFiltro] = useState('Todas');
  const [aCancelar, setACancelar] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const carregar = useCallback(async () => {
    await Promise.resolve();

    try {
      const lista = await api.get('/schedulings/mine');
      setMarcacoes(Array.isArray(lista) ? lista : []);
    } catch {
      setMarcacoes([]);
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => {
  // `carregar` só escreve estado depois do primeiro await, ou seja, já noutro
  // microtask: não há a cascata de renders síncronos que a regra apanha.
  // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  const cancelar = async (marcacao) => {
    setACancelar(marcacao.id);

    try {
      await api.post(`/schedulings/${marcacao.id}/cancel`);
      showToast('Marcação cancelada.');
      await carregar();
    } catch (e) {
      // A janela de cancelamento fechada devolve uma mensagem explicativa da
      // API. Mostrá-la é melhor do que inventar uma aqui.
      showToast(e.message ?? 'Não foi possível cancelar.', 'error');
    } finally {
      setACancelar(null);
    }
  };

  const estados = FILTROS.find((f) => f.chave === filtro)?.estados;
  const visiveis = estados ? marcacoes.filter((m) => estados.includes(m.status)) : marcacoes;

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">As minhas marcações</h1>
          <p className="text-sm text-gray-400 mt-1">{marcacoes.length} no total</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/schedulings/new')}>
          Nova marcação
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTROS.map(({ chave }) => (
          <button
            key={chave}
            type="button"
            onClick={() => setFiltro(chave)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer
              ${filtro === chave
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
          >
            {chave}
          </button>
        ))}
      </div>

      {aCarregar ? (
        <p className="text-sm text-gray-400">A carregar…</p>
      ) : visiveis.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">Nenhuma marcação para mostrar.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visiveis.map((m) => (
            <SchedulingCard
              key={m.id}
              scheduling={m}
              onCancel={aCancelar === m.id ? undefined : cancelar}
              onReschedule={(marcacao) => navigate(`/schedulings/${marcacao.id}/reschedule`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulingList;
