import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (redirectToHome) {
      router.push('/home');
    }
  }, [redirectToHome, router]);

  const handleLogin = () => {
    if (!username || !password) {
      alert('Por favor, preencha todos os campos para concluir o login');
      return;
    }

    setRedirectToHome(true);
    setUsername('');
    setPassword('');
    setError('');
  };

  const handleSignUp = () => {
    // Navegar para a página de cadastro
    router.push('/cadastro');
  };

  return (
    <>
      <Head></Head>
      <section className="max-width bg" id="login">
        <div className="container">
          <div className="login-form">
            <img src="/imagens/saborDivino-removebg-preview.png" alt="Sabor Divino Logo" />
            <h2 className="text-gd color-cinza"></h2>
            <form>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="username">Usuário</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="button" onClick={handleLogin}>
                Entrar
              </button>
            </form>
            <button type="button" onClick={handleSignUp}>
              Cadastre-se
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
