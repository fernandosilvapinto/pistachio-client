import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const NewScheduling = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId:     location.state?.serviceId ? String(location.state.serviceId) : '',
    scheduledDate: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const s = await api.get('/services').catch(() => []);
      setServices(Array.isArray(s) ? s.filter(s => s.isActive) : []);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!form.serviceId)     { setError('Seleciona um serviço.');     return; }
    if (!form.scheduledDate) { setError('Escolhe uma data e hora.');  return; }

    setSaving(true); setError('');
    try {
      await api.post('/schedulings', {
        serviceId:     parseInt(form.serviceId),
        userId:        user?.id,
        scheduledDate: new Date(form.scheduledDate).toISOString(),
      });
      showToast('Agendamento criado com sucesso.');
      navigate('/schedulings');
    } catch (e) {
      setError(e.message ?? 'Erro ao criar agendamento.');
      showToast('Erro ao criar agendamento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Novo agendamento</h1>
        <p className="text-sm text-gray-400 mt-1">Escolhe o serviço e a data pretendida.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <Select
          label="Serviço"
          value={form.serviceId}
          onChange={e => setForm(f => ({ ...f, serviceId: e.target.value }))}
        >
          <option value="">— seleciona um serviço —</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name} — €{Number(s.price).toFixed(2)}</option>
          ))}
        </Select>
        <Input
          label="Data e hora"
          type="datetime-local"
          value={form.scheduledDate}
          onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-2">
          <Button onClick={() => navigate('/schedulings')}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'A criar…' : 'Criar agendamento'}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default NewScheduling;