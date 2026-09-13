import { useAuth } from '../context/AuthContext';
import { accountConsoleUrl } from '../auth/userManager';
import Button from '../components/ui/Button';

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-400">{label}</span>
    <span className="text-sm text-gray-900">{value || '—'}</span>
  </div>
);

/**
 * Vista apenas de leitura.
 *
 * Nome, email e password são dados de identidade e pertencem ao provider. Se
 * esta aplicação os pudesse alterar, passaria a haver duas versões da mesma
 * pessoa e uma delas estaria sempre errada — e, pior, esta aplicação voltaria a
 * ter uma caixa de password, que é precisamente o que deixou de ter.
 */
const Profile = () => {
  const { user, profile } = useAuth();

  const name = user?.name || profile?.name || '';
  const email = user?.email || profile?.email || '';

  return (
    <div className="flex flex-col gap-6 max-w-md">

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">A minha conta</h1>
        <p className="text-sm text-gray-400 mt-1">Os teus dados de acesso.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
        <Field label="Nome" value={name} />
        <Field label="Email" value={email} />
        <Field
          label="Email verificado"
          value={profile?.email_verified ? 'Sim' : 'Não'}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
        <p className="text-sm text-gray-700">
          Alterar o nome, o email ou a password, ativar verificação em dois
          passos e terminar sessões noutros dispositivos faz-se na tua conta.
        </p>
        <div>
          <Button
            variant="primary"
            onClick={() => window.open(accountConsoleUrl, '_blank', 'noopener')}
          >
            Gerir a minha conta
          </Button>
        </div>
      </div>

    </div>
  );
};

export default Profile;
