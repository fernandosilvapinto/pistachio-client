import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, login, token } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const me = await api.get('/users/me').catch(() => null);
      if (me) {
        setForm({ name: me.name ?? '', email: me.email ?? '', password: '' });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!form.name) { showToast('O nome é obrigatório.', 'error'); return; }
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await api.put(`/users/${user?.id}`, payload);
      login(token, { ...user, name: form.name, email: form.email });
      showToast('Perfil atualizado com sucesso.');
      setForm(f => ({ ...f, password: '' }));
    } catch (e) {
      showToast(e.message ?? 'Erro ao atualizar perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-400">A carregar…</p>;

  return (
    <div className="flex flex-col gap-6 max-w-md">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">O meu perfil</h1>
        <p className="text-sm text-gray-400 mt-1">Gere os teus dados pessoais.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <Input
          label="Nome"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          placeholder="O teu nome"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="o-teu-email@exemplo.com"
        />
        <Input
          label="Nova password (deixa vazio para manter)"
          type="password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          placeholder="••••••••"
        />
        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'A guardar…' : 'Guardar alterações'}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Profile;