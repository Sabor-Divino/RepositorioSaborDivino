import Link from 'next/link';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (redirectToHome) {
      window.location.href = '/home'; 
    }
  }, [redirectToHome]);

  const handleLogin = () => {
    if (!username || !password) {
      alert('Por favor, preencha todos os campos para concluir o cadastro');;
      return;
    }

    setRedirectToHome(true);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <>
      <Head>
        <title>Cadastro Sabor Divino</title>
        <meta name="description" content="Gerado pelo create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="max-width bg" id="login">
        <div className="container">
          <div className="login-form">
            <img src="/imagens/saborDivino-removebg-preview.png" alt="Sabor Divino Logo" />
            <h2 className="text-gd color-cinza"></h2>
            <form>
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="username">Insira um nome de usuário</label>
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
                <label htmlFor="password">Insira uma senha</label>
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
                Cadastrar
              </button>
            </form>
          </div>
        </div>
      </section>

      {redirectToHome && <Link href="/home"></Link>}
    </>
  );
}
