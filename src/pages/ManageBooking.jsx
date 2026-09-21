import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useToast } from '../context/useToast';
import Button from '../components/ui/Button';
import SchedulingCard from '../components/ui/SchedulingCard';
import SlotPicker from '../components/booking/SlotPicker';

/**
 * Gerir uma marcação sem conta — a chave é o próprio link do email. Não há
 * login aqui: um token inválido ou de uma marcação que já não existe dá
 * simplesmente "não encontrada", como daria um id errado em qualquer API.
 */
const ManageBooking = () => {
  const { token } = useParams();
  const { showToast } = useToast();

  const [scheduling, setScheduling] = useState(null);
  const [aCarregar, setACarregar] = useState(true);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [aReagendar, setAReagendar] = useState(false);
  const [novoSlot, setNovoSlot] = useState(null);
  const [aGuardar, setAGuardar] = useState(false);

  const carregar = useCallback(async () => {
    // Perder a corrida com um StrictMode remount é o preço de não montar o
    // estado de forma síncrona dentro do efeito.
    await Promise.resolve();

    setACarregar(true);
    try {
      const s = await api.get(`/schedulings/manage/${token}`);
      setScheduling(s);
      setNaoEncontrada(false);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        setNaoEncontrada(true);
      } else {
        showToast('Não foi possível carregar a marcação.', 'error');
      }
    } finally {
      setACarregar(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    // `carregar` só escreve estado depois do primeiro await, ou seja, já
    // noutro microtask: não há a cascata de renders síncronos que a regra apanha.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregar();
  }, [carregar]);

  const cancelar = async () => {
    setAGuardar(true);
    try {
      const s = await api.post(`/schedulings/manage/${token}/cancel`, {});
      setScheduling(s);
      showToast('Marcação cancelada.');
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Não foi possível cancelar.', 'error');
    } finally {
      setAGuardar(false);
    }
  };

  const reagendar = async () => {
    if (!novoSlot) return;

    setAGuardar(true);
    try {
      const s = await api.post(`/schedulings/manage/${token}/reschedule`, {
        startsAt: novoSlot.startsAt,
      });
      setScheduling(s);
      setAReagendar(false);
      setNovoSlot(null);
      showToast('Marcação reagendada.');
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Não foi possível reagendar.', 'error');
    } finally {
      setAGuardar(false);
    }
  };

  if (aCarregar) {
    return <p className="max-w-2xl mx-auto px-4 py-16 text-sm text-gray-400">A carregar…</p>;
  }

  if (naoEncontrada) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col gap-2">
        <h1 className="text-xl font-semibold text-gray-900">Marcação não encontrada</h1>
        <p className="text-sm text-gray-400">
          Este link já não é válido. Se precisares de ajuda, contacta-nos diretamente.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">A tua marcação</h1>
        <p className="text-sm text-gray-400 mt-1">{scheduling.customerName}</p>
      </div>

      <SchedulingCard
        scheduling={scheduling}
        onCancel={() => cancelar()}
        onReschedule={() => setAReagendar((v) => !v)}
      />

      {aReagendar && scheduling.canCancel && (
        <section className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-700">Nova data e hora</p>
          <SlotPicker serviceId={scheduling.serviceId} value={novoSlot?.startsAt} onChange={setNovoSlot} />

          <div className="flex justify-end gap-2 pt-1">
            <Button onClick={() => { setAReagendar(false); setNovoSlot(null); }}>Cancelar</Button>
            <Button variant="primary" disabled={!novoSlot || aGuardar} onClick={reagendar}>
              {aGuardar ? 'A guardar…' : 'Confirmar novo horário'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default ManageBooking;
