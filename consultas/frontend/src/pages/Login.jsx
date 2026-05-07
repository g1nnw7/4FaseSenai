import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Faz o post na rota de login (certifique-se de criar essa rota no backend)
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.erro || 'Erro ao logar');

      // Salva o token no navegador
      localStorage.setItem('token', data.token);

      // Redireciona com base no perfil
      if (data.usuario.perfil === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/agendar');
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white border-b border-neutral-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="text-xl tracking-tighter font-semibold mb-8">AGND</div>
        <h2 className="text-2xl font-medium tracking-tight text-center text-neutral-900">Acesse sua conta</h2>
        <p className="mt-2 text-sm text-neutral-500">ou crie uma nova para agendar</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[360px]">
        <div className="bg-white py-8 px-4 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">E-mail</label>
              <div className="mt-1">
                <input 
                  id="email" type="email" required 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none border-b border-neutral-200 px-0 py-2 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none sm:text-sm transition-colors bg-transparent" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Senha</label>
              <div className="mt-1">
                <input 
                  id="password" type="password" required 
                  value={senha} onChange={(e) => setSenha(e.target.value)}
                  className="block w-full appearance-none border-b border-neutral-200 px-0 py-2 text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none sm:text-sm transition-colors bg-transparent" 
                />
              </div>
            </div>

            <div>
              <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-neutral-900 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all">
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}