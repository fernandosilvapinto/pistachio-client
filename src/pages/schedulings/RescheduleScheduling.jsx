import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import SlotPicker from '../../components/booking/SlotPicker';
import { fmtDataHora, fmtDuracao } from '../../lib/format';

const RescheduleScheduling = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [marcacao, setMarcacao] = useState(null);
  const [slot, setSlot] = useState(null);
  const [aGravar, setAGravar] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get(`/schedulings/${id}`)
      .then(setMarcacao)
      .catch((e) => setErro(e.message ?? 'Marcação não encontrada.'));
  }, [id]);

  const confirmar = async () => {
    if (!slot) return;

    setAGravar(true);
    setErro('');

    try {
      await api.post(`/schedulings/${id}/reschedule`, {
        startsAt: slot.startsAt,
        resourceId: null,
      });

      showToast('Marcação reagendada.');
      navigate('/schedulings');
    } catch (e) {
      setErro(e.message ?? 'Não foi possível reagendar.');
      setSlot(null);
    } finally {
      setAGravar(false);
    }
  };

  if (erro && !marcacao) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <p className="text-sm text-red-500">{erro}</p>
        <div><Button onClick={() => navigate('/schedulings')}>Voltar</Button></div>
      </div>
    );
  }

  if (!marcacao) return <p className="text-sm text-gray-400">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reagendar</h1>
        <p className="text-sm text-gray-400 mt-1">
          {marcacao.serviceName} · {fmtDuracao(marcacao.durationMinutes)}
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-medium text-gray-400">Marcação atual</p>
        <p className="text-sm text-gray-900 mt-1">{fmtDataHora(marcacao.startsAt)}</p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <SlotPicker
          serviceId={marcacao.serviceId}
          value={slot?.startsAt}
          onChange={setSlot}
        />
      </section>

      {erro && <p className="text-xs text-red-500">{erro}</p>}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
        <Button onClick={() => navigate('/schedulings')}>Cancelar</Button>
        <Button variant="primary" onClick={confirmar} disabled={!slot || aGravar}>
          {aGravar ? 'A reagendar…' : 'Confirmar nova hora'}
        </Button>
      </div>
    </div>
  );
};

export default RescheduleScheduling;
