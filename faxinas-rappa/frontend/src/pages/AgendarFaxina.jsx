import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import api from '../api.js';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';

const HOURS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

export default function AgendarFaxina() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clts, setClts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    cltId: '', addressId: '', scheduledDate: '', scheduledTime: '',
    durationHours: 3, propertyType: 'residencial', squareMeters: '', observations: '',
  });

  const [newAddress, setNewAddress] = useState({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: ''
  });
  const [addingAddress, setAddingAddress] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    api.get('/users/clts/available').then(r => setClts(r.data.clts || [])).catch(() => {});
    api.get('/addresses').then(r => setAddresses(r.data.addresses || [])).catch(() => {});
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // ── Auto-preenchimento via ViaCEP ──────────────────────────────────────────
  const handleCepChange = async (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    const formatted = raw.length <= 5 ? raw : raw.slice(0, 5) + '-' + raw.slice(5, 8);
    setNewAddress({ ...newAddress, zipCode: formatted });

    if (raw.length === 8) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();
        if (data.erro) {
          toast.error('CEP não encontrado.');
        } else {
          setNewAddress(prev => ({
            ...prev,
            street:       data.logradouro || '',
            neighborhood: data.bairro      || '',
            city:         data.localidade  || '',
            state:        data.uf          || '',
            zipCode:      formatted,
          }));
        }
      } catch {
        toast.error('Erro ao buscar CEP.');
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/addresses', newAddress);
      setAddresses([...addresses, res.data.address]);
      setForm({ ...form, addressId: res.data.address.id });
      setAddingAddress(false);
      setNewAddress({ street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' });
      toast.success('Endereço adicionado!');
    } catch {
      toast.error('Erro ao adicionar endereço.');
    }
  };

  const handleSubmit = async () => {
    if (!form.cltId || !form.addressId || !form.scheduledDate || !form.scheduledTime) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/faxinas', form);
      toast.success('Faxina agendada com sucesso!');
      navigate('/minhas-faxinas');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao agendar faxina.');
    } finally {
      setLoading(false);
    }
  };

  const selectedClt  = clts.find(c => c.id == form.cltId);
  const selectedAddr = addresses.find(a => a.id == form.addressId);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-gray-900">Agendar faxina</h1>
          <p className="text-gray-500 font-body mt-1">Preencha os detalhes do seu agendamento</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold transition-all ${step >= s ? 'bg-brand-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > s ? '✓' : s}
              </div>
              <span className={`text-sm font-body hidden sm:block ${step >= s ? 'text-brand-900 font-medium' : 'text-gray-400'}`}>
                {s === 1 ? 'Profissional' : s === 2 ? 'Endereço' : 'Detalhes'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand-900' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card p-6">

          {/* ── STEP 1: Escolha o CLT ── */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-4">Escolha o profissional</h2>
              {clts.length === 0 ? (
                <p className="text-center text-gray-400 font-body py-8">Nenhum profissional disponível no momento.</p>
              ) : (
                <div className="grid gap-3">
                  {clts.map(clt => (
                    <button key={clt.id} onClick={() => setForm({ ...form, cltId: clt.id })}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${form.cltId == clt.id ? 'border-brand-900 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}`}>
                      <div className="w-12 h-12 bg-brand-900 rounded-full flex items-center justify-center text-white font-display font-bold flex-shrink-0">
                        {clt.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-gray-900">{clt.name}</p>
                        {clt.bio && <p className="text-sm text-gray-500 font-body mt-0.5">{clt.bio}</p>}
                      </div>
                      <StatusBadge status={clt.clt_status} />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-end mt-6">
                <button onClick={() => setStep(2)} disabled={!form.cltId} className="btn-primary">Próximo</button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Endereço ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-4">Endereço da faxina</h2>

              {addresses.length > 0 && (
                <div className="grid gap-3 mb-4">
                  {addresses.map(addr => (
                    <button key={addr.id} onClick={() => setForm({ ...form, addressId: addr.id })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.addressId == addr.id ? 'border-brand-900 bg-brand-50' : 'border-gray-100 hover:border-brand-200'}`}>
                      <svg className="w-5 h-5 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <div>
                        <p className="font-display font-medium text-gray-900">{addr.street}, {addr.number}</p>
                        <p className="text-sm text-gray-500 font-body">{addr.neighborhood} — {addr.city}/{addr.state}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!addingAddress ? (
                <button onClick={() => setAddingAddress(true)} className="btn-secondary w-full text-sm">
                  + Adicionar novo endereço
                </button>
              ) : (
                <form onSubmit={handleAddAddress} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <p className="font-display font-semibold text-gray-800 text-sm">Novo endereço</p>

                  {/* CEP com busca automática */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">CEP</label>
                    <div className="relative">
                      <input
                        className="input-field text-sm pr-9"
                        placeholder="00000-000"
                        value={newAddress.zipCode}
                        onChange={handleCepChange}
                        maxLength={9}
                        required
                      />
                      {cepLoading && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-brand-200 border-t-brand-900 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rua</label>
                      <input className="input-field text-sm" placeholder="Rua das Flores" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Número</label>
                      <input className="input-field text-sm" placeholder="123" value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Complemento</label>
                    <input className="input-field text-sm" placeholder="Apto 2 (opcional)" value={newAddress.complement} onChange={e => setNewAddress({...newAddress, complement: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Bairro</label>
                      <input className="input-field text-sm" placeholder="Centro" value={newAddress.neighborhood} onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cidade</label>
                      <input className="input-field text-sm" placeholder="Florianópolis" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                      <input className="input-field text-sm" placeholder="SC" maxLength={2} value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value.toUpperCase()})} required />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button type="submit" className="btn-primary text-sm">Salvar endereço</button>
                    <button type="button" onClick={() => setAddingAddress(false)} className="btn-secondary text-sm">Cancelar</button>
                  </div>
                </form>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary">Voltar</button>
                <button onClick={() => setStep(3)} disabled={!form.addressId} className="btn-primary">Próximo</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Detalhes ── */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-semibold text-xl text-gray-900 mb-4">Detalhes do serviço</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Data *</label>
                    <input type="date" className="input-field" min={today} value={form.scheduledDate} onChange={set('scheduledDate')} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Horário *</label>
                    <select className="input-field" value={form.scheduledTime} onChange={set('scheduledTime')} required>
                      <option value="">Selecione</option>
                      {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Duração</label>
                    <select className="input-field" value={form.durationHours} onChange={set('durationHours')}>
                      {[2,3,4,5,6,8].map(h => <option key={h} value={h}>{h} horas</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Tipo</label>
                    <select className="input-field" value={form.propertyType} onChange={set('propertyType')}>
                      <option value="residencial">Residencial</option>
                      <option value="comercial">Comercial</option>
                      <option value="pos_obra">Pós-obra</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Metragem (m²)</label>
                  <input type="number" className="input-field" placeholder="Ex: 80" value={form.squareMeters} onChange={set('squareMeters')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-body">Observações</label>
                  <textarea className="input-field resize-none" rows={3} placeholder="Instruções especiais, chave, pets..." value={form.observations} onChange={set('observations')} />
                </div>
              </div>

              {/* Resumo */}
              <div className="mt-5 bg-brand-50 rounded-xl p-4 space-y-1.5 text-sm font-body">
                <p className="font-display font-semibold text-brand-900 text-base mb-2">Resumo</p>
                <p><span className="text-gray-500">Profissional:</span> <span className="font-medium text-gray-800">{selectedClt?.name}</span></p>
                <p><span className="text-gray-500">Endereço:</span> <span className="font-medium text-gray-800">{selectedAddr?.street}, {selectedAddr?.number}</span></p>
                {form.scheduledDate && form.scheduledTime && (
                  <p><span className="text-gray-500">Quando:</span> <span className="font-medium text-gray-800">{form.scheduledDate} às {form.scheduledTime}</span></p>
                )}
                <p><span className="text-gray-500">Duração:</span> <span className="font-medium text-gray-800">{form.durationHours}h</span></p>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary">Voltar</button>
                <button onClick={handleSubmit} disabled={loading || !form.scheduledDate || !form.scheduledTime} className="btn-primary">
                  {loading ? 'Agendando...' : 'Confirmar agendamento'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}