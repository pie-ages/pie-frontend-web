# Mockups — pie-frontend-web

Mockups estáticos (HTML autossuficiente, inline `<style>`, sem scripts, sem assets externos) que refletem a implementação atual do frontend web.

> **Nota:** Pontos mockados/não implementados estão sinalizados em `../frontend-web.md` §13.

## Índice

| Arquivo                                                        | Página                     | Rota               | Estado mostrado                                          | Finalidade                          |
| -------------------------------------------------------------- | -------------------------- | ------------------ | -------------------------------------------------------- | ----------------------------------- |
| [login.html](login.html)                                       | Login                      | `/login`           | Formulário pronto                                        | Referência visual do estado inicial |
| [register.html](register.html)                                 | Cadastro de loja           | `/register`        | Formulário pronto                                        | Referência visual do estado inicial |
| [forgot-password.html](forgot-password.html)                   | Recuperar acesso — passo 1 | `/forgot-password` | E-mail                                                   | Referência visual do passo 1        |
| [forgot-password-code.html](forgot-password-code.html)         | Recuperar acesso — passo 2 | `/forgot-password` | Código 6 dígitos                                         | Referência visual do passo 2        |
| [forgot-password-password.html](forgot-password-password.html) | Recuperar acesso — passo 3 | `/forgot-password` | Nova senha                                               | Referência visual do passo 3        |
| [pending.html](pending.html)                                   | Cadastro em análise        | `/pending`         | Tela única                                               | Referência visual                   |
| [products.html](products.html)                                 | Produtos                   | `/products`        | Pronto (3+ linhas, métricas, filtros, tabela, paginação) | Estado principal da listagem        |
| [products-empty.html](products-empty.html)                     | Produtos                   | `/products`        | Vazio sem filtros                                        | Estado vazio inicial                |
| [products-error.html](products-error.html)                     | Produtos                   | `/products`        | Erro de carregamento                                     | Estado de erro                      |
| [product-form-validation.html](product-form-validation.html)   | Novo produto               | `/products/new`    | Erros de validação por campo                             | Referência de validação             |
| [import.html](import.html)                                     | Importar produtos          | `/import`          | Estado "done" com relatório de erros                     | Estado final mockado                |
| [store-requests.html](store-requests.html)                     | Solicitações de lojas      | `/store-requests`  | Fila com cartas + aprovar/recusar                        | Estado principal                    |
| [admin.html](admin.html)                                       | Empresas parceiras         | `/admin`           | Lista de empresas, filtro Pendentes                      | Estado principal                    |
| [admin-new.html](admin-new.html)                               | Novo administrador         | `/admin/new`       | Formulário pronto                                        | Referência visual do estado inicial |

## Como visualizar

Abra qualquer arquivo `.html` diretamente no browser (duplo clique ou `file://...`). Não requer servidor, build ou dependências.
