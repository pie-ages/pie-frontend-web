"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { companySignupSchema } from "./company-signup.schema";
import { submitCompanySignup } from "./company-signup.service";
import { styles } from "./CompanySignupForm.styles";

const initialValues = {
  nomeEmpresa: "",
  cnpj: "",
  site: "",
  razaoSocial: "",
  responsavel: "",
  email: "",
  senha: "",
  confirmarSenha: "",
};

export default function CompanySignupForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialValues);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (field: keyof typeof initialValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (erro) setErro("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = companySignupSchema.safeParse(form);

    if (!result.success) {
      const firstError = result.error.issues[0];
      setErro(firstError?.message ?? "Dados inválidos.");
      return;
    }

    setErro("");
    setCarregando(true);

    try {
      await submitCompanySignup(form);
      setSucesso(true);
      router.push("/login");
    } catch {
      setErro("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

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
                  value={form.nomeEmpresa}
                  onChange={(e) => handleChange("nomeEmpresa", e.target.value)}
                  style={styles.input}
                />

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>CNPJ</label>
                    <input
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={form.cnpj}
                      onChange={(e) => handleChange("cnpj", e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>Site ou Instagram</label>
                    <input
                      type="text"
                      placeholder="@atelie.nove"
                      value={form.site}
                      onChange={(e) => handleChange("site", e.target.value)}
                      style={styles.input}
                    />
                  </div>
                </div>

                <label style={styles.label}>Razão social</label>
                <input
                  type="text"
                  placeholder="Nove Confecções Ltda"
                  value={form.razaoSocial}
                  onChange={(e) => handleChange("razaoSocial", e.target.value)}
                  style={styles.input}
                />

                <div style={styles.row}>
                  <div style={styles.col}>
                    <label style={styles.label}>Responsável</label>
                    <input
                      type="text"
                      placeholder="Marina Bezerra"
                      value={form.responsavel}
                      onChange={(e) => handleChange("responsavel", e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.col}>
                    <label style={styles.label}>E-mail de contato</label>
                    <input
                      type="email"
                      placeholder="marina@atelienove.com.br"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
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
                        value={form.senha}
                        onChange={(e) => handleChange("senha", e.target.value)}
                        style={{ ...styles.input, paddingRight: 60 }}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha((prev) => !prev)}
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
                      value={form.confirmarSenha}
                      onChange={(e) => handleChange("confirmarSenha", e.target.value)}
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
