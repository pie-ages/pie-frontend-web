"use client";

import { useState, FormEvent } from "react";

function CompanySignupForm() {
  const [nomeEmpresa, setNomeEmpresa] = useState<string>("");
  const [cnpj, setCnpj] = useState<string>("");
  const [site, setSite] = useState<string>("");
  const [razaoSocial, setRazaoSocial] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
  const [erro, setErro] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(false);
  const [sucesso, setSucesso] = useState<boolean>(false);

  function validarFormulario(): string {
    if (!nomeEmpresa || !cnpj || !razaoSocial || !responsavel || !email) {
      return "Preencha todos os campos obrigatórios.";
    }

    const somenteNumeros = cnpj.replace(/[^0-9]/g, "");
    if (somenteNumeros.length !== 14) {
      return "CNPJ inválido. Ele deve ter 14 números.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Digite um e-mail válido.";
    }

    if (senha.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres.";
    }

    if (senha !== confirmarSenha) {
      return "As senhas não são iguais.";
    }

    return "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mensagemErro = validarFormulario();

    if (mensagemErro) {
      setErro(mensagemErro);
      return;
    }

    setErro("");
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      setSucesso(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }, 1500);
  }

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <p style={styles.logo}>
          Piê <span style={styles.logoSlash}>/ para lojas</span>
        </p>

        <div>
          <h1 style={styles.headline}>
            Sua loja dentro
            <br />
            do closet clientes.
          </h1>
          <p style={styles.headlineText}>
            Cadastre seus produtos uma vez. Piê recomenda cada peça para as
            clientes cujo estilo e colorimetria combinam com ela.
          </p>
        </div>

        <div style={styles.stats}>
          <div>
            <p style={styles.statNumber}>32 mil</p>
            <p style={styles.statLabel}>peças na vitrine</p>
          </div>
          <div>
            <p style={styles.statNumber}>148</p>
            <p style={styles.statLabel}>lojas ativas</p>
          </div>
        </div>
      </div>

      <div style={styles.formSide}>
        <div style={styles.formBox}>
          <div style={styles.divider} />

          {sucesso ? (
            <div>
              <h2 style={styles.title}>Pedido enviado com sucesso!</h2>
              <p style={styles.subtitle}>
                Você será redirecionado para o login...
              </p>
            </div>
          ) : (
            <>
              <h2 style={styles.title}>Pedir entrada na plataforma</h2>
              <p style={styles.subtitle}>
                A equipe do Piê revisa cada loja antes de liberar o painel.
                A resposta chega por e-mail em até 2 dias úteis.
              </p>

              <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
                <label style={styles.label}>Nome da marca</label>
                <input
                  type="text"
                  placeholder="Ateliê Nove"
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  style={styles.input}
                />

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>CNPJ</label>
                    <input
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Site ou Instagram</label>
                    <input
                      type="text"
                      placeholder="@atelie.nove"
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <label style={styles.label}>Razão social</label>
                <input
                  type="text"
                  placeholder="Nove Confecções Ltda"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  style={styles.input}
                />

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Responsável</label>
                    <input
                      type="text"
                      placeholder="Marina Bezerra"
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>E-mail de contato</label>
                    <input
                      type="email"
                      placeholder="marina@atelienove.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Senha</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="••••••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        style={{ ...styles.input, paddingRight: 60 }}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        style={styles.toggleSenha}
                      >
                        {mostrarSenha ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Confirmar senha</label>
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                {erro && <p style={styles.erro}>{erro}</p>}

                <button type="submit" disabled={carregando} style={styles.botao}>
                  {carregando ? "Enviando..." : "Enviar pedido para análise"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "40%",
    minWidth: 320,
    backgroundColor: "#5A1418",
    color: "#fff",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 14,
  },
  logoSlash: {
    fontWeight: "normal",
    opacity: 0.7,
  },
  headline: {
    fontSize: 34,
    lineHeight: 1.2,
    marginBottom: 16,
  },
  headlineText: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 280,
  },
  stats: {
    display: "flex",
    gap: 40,
    borderTop: "1px solid rgba(255,255,255,0.2)",
    paddingTop: 20,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 0,
  },
  statLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    margin: 0,
  },
  formSide: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "60px 40px",
    backgroundColor: "#fff",
  },
  formBox: {
    width: "100%",
    maxWidth: 480,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: "#C9A46A",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 0,
    color: "#111",
  },
  subtitle: {
    fontSize: 13.5,
    color: "#666",
    marginTop: 8,
    lineHeight: 1.5,
  },
  row: {
    display: "flex",
    gap: 16,
  },
  col: {
    flex: 1,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    color: "#111",
    backgroundColor: "#F7F5F2",
    border: "1px solid #ddd",
    borderRadius: 6,
    boxSizing: "border-box",
  },
  toggleSenha: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#5A1418",
    fontSize: 12,
    fontWeight: "bold",
    cursor: "pointer",
  },
  erro: {
    color: "#b91c1c",
    fontSize: 13,
    marginTop: 12,
  },
  botao: {
    width: "100%",
    padding: "12px",
    marginTop: 20,
    fontSize: 15,
    color: "#fff",
    backgroundColor: "#5A1418",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default CompanySignupForm;