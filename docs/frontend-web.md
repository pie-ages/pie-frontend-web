# pie-frontend-web — Documentação da Aplicação Web

## Visão geral

Painel web para lojas (perfil **COMPANY**) e administrador (perfil **ADMIN**). Utiliza **Next.js App Router** com **client components**. As rotas são protegidas por middleware que verifica cookie `pie_session` e role `pie_role`.

## Tecnologias

| Dependência           | Versão   |
| --------------------- | -------- |
| next                  | 16.3.3   |
| react                 | 19.2.8   |
| react-dom             | ^19.2.8  |
| typescript            | ^6.0.3   |
| axios                 | ^1.20.0  |
| @tanstack/react-query | ^5.107.1 |
| react-hook-form       | ^7.91.0  |
| @hookform/resolvers   | ^7.0.3   |
| zod                   | ^4.6.7   |
| sonner                | ^2.0.8   |
| lucide-react          | ^1.40.0  |

**Estilização:** CSS Modules, `next/font` Archivo.

**Scripts (package.json):**

- `dev` — `next dev`
- `dev-web` — `next dev --webpack`
- `build` — `next build`
- `start` — `next start`
- `lint` — `eslint .`
- `format` — `prettier --write .`

## Estrutura de pastas

```
src/
  app/           ← Rotas e páginas (Next.js App Router)
  components/
    ui/          ← Botão, Input, Select, Textarea, FormHeader, FormFooterLink, ConfirmDialog
    layout/      ← AuthLayout, StoreHeader, UserMenu, Avatar, EditProfileModal
    products/    ← ProductForm, ProductImagesField, ProductsTable, ProductsFilter,
                   ProductsMetrics, ProductsPagination, StatusBadge
  contexts/      ← AuthContext
  hooks/         ← useDebounce, useCreateCompany
  lib/           ← Services (ProductsService, CompanyService, AdminService, AuthService,
                   TaxonomyService, StoreRequestsService), API client, validações
  providers/     ← QueryProvider
  shared/        ← auth.ts, user.ts, api-error.ts, auth-storage.ts
  styles/        ← colors.css (tokens)
  types/         ← Product, ProductFilters, AdminCompany, StoreRequest, AdminForm, etc.
  utils/         ← date, api-error
public/
env.local.example
Dockerfile
```

## Instalação e execução local

- **Node:** 22 (Dockerfile usa `node:22-alpine`)
- `npm ci`
- `cp env.local.example .env.local` — preencher `NEXT_PUBLIC_API_URL` (padrão `http://localhost:8080/api`) e `NEXT_PUBLIC_COMPANY_ID` (opcional)
- `npm run dev` → http://localhost:3000
- Comandos Docker descritos em `README.md` (seção **Docker**)
- Deploy: link `docs/deploy.md`

## Rotas, layouts e permissões

| Rota                  | Página             | Auth        | Role    | Observações                                        |
| --------------------- | ------------------ | ----------- | ------- | -------------------------------------------------- |
| `/login`              | LoginPage          | Opcional    | —       | Middleware: PUBLIC_PATHS inclui `/login`           |
| `/register`           | RegisterPage       | Opcional    | —       | Middleware: PUBLIC_PATHS inclui `/register`        |
| `/forgot-password`    | ForgotPasswordPage | Opcional    | —       | Middleware: PUBLIC_PATHS inclui `/forgot-password` |
| `/pending`            | PendingPage        | Opcional    | —       | Middleware: PUBLIC_PATHS inclui `/pending`         |
| `/products`           | ProductsPage       | Obrigatório | COMPANY | Redirect pós-login se não ADMIN                    |
| `/products/new`       | NewProductPage     | Obrigatório | COMPANY |                                                    |
| `/products/[id]/edit` | EditProductPage    | Obrigatório | COMPANY |                                                    |
| `/import`             | ImportPage         | Obrigatório | COMPANY |                                                    |
| `/store-requests`     | StoreRequestsPage  | Obrigatório | ADMIN   |                                                    |
| `/admin`              | AdminPage          | Obrigatório | ADMIN   |                                                    |
| `/admin/new`          | NewAdminPage       | Obrigatório | ADMIN   |                                                    |

**Regras do middleware** (`src/middleware.ts:4-8,10-24`):

- `PUBLIC_PATHS = ['/login','/register','/pending','/forgot-password']` — sem auth, segue adiante.
- Se não houver cookie `pie_session` → redirect `/login`.
- Se caminho for `/admin` e `pie_role` ≠ `ADMIN` → redirect `/products`.

**Layouts:**

- `AuthLayout` (login/register/forgot-password/pending) — usado nas rotas públicas protegidas.
- `StoreHeader` (demais rotas) — contém navegação perfil-dependente.

## Autenticação e sessão

- **localStorage:** `pie_auth_token`, `pie_refresh_token`, `pie_expires_at`.
- **Cookies:** `pie_session` (obrigatório), `pie_role` com `max-age=expiresIn`.
- **Refresh:** 30s antes de expirar (`contexts/AuthContext.tsx:29-40`).
- **Interceptor 401** (`lib/api.ts:24-52`): faz retry com `/auth/refresh` e redireciona `/login` falhando.
- **GET /auth/me** na inicialização do app (`app/layout.tsx:21-23`).

## Perfis

- **COMPANY:** nav exibe **Produtos** e **Importar** (`StoreHeader.tsx:9-14,22`).
- **ADMIN:** nav exibe **Empresas** (`StoreHeader.tsx:22`).
- **Redirect pós-login:**
  - Status `PENDING` → `/pending`
  - Role `ADMIN` → `/admin`
  - Senão → `/products`

## Jornadas por página

### `/login`

- Formulário e-mail/senha, toggle de visibilidade.
- Validação cliente (campos vazios, regex e-mail).
- Toasts com id `login-error`.
- Links para `/register` e `/forgot-password`.

### `/register`

- 8 campos (nome, CNPJ mascarado, site, razão social, responsável, e-mail, senha, confirmar senha).
- Máscara CNPJ.
- Validação campos obrigatórios + e-mail + senhas iguais.
- `POST /companies`, toast + redirect `/login`.

### `/forgot-password`

- 3 passos: e-mail → código 6 dígitos com reenvio → nova senha.
- Validações em `lib/auth/password-recovery.validation.ts`.
- Toasts com id `recovery-error`.

### `/pending`

- Aviso de cadastro em análise.
- Botão volta ao login (`signOut` + `/login`).

### `/products`

- Métricas: publicados/rascunhos via `getProductCount`; "Salvos no closet" e "Cliques para a loja" fixos `—`.
- Filtros: busca debounce 400ms, estilo, peça, status.
- Tabela com paginação (5/10/20 por página, persistido em `products:perPage`).
- Ações: publicar/retirar (ConfirmDialog), duplicar, excluir (ConfirmDialog), editar via link.
- Botão "Importar CSV" sem handler.

### `/products/new` e `/products/[id]/edit`

- `ProductForm` modo create/edit.
- Taxonomy carregada de `/taxonomy` (cache em módulo).
- Tamanhos por peça via `SIZES_BY_CATEGORY`.
- Upload de imagens.
- Ações: Publicar/Salvar rascunho (create), Salvar/Pausar/Publicar na Vitrine/Excluir (edit).
- Validações `validateDraftForm`/`validateProductForm`.

### `/import`

- Dropzone CSV, estados idle/uploading/done.
- Relatório de erros mockado (`MOCK_ERROR_ROWS` fixos + `setTimeout` 1500ms, sem upload real).

### `/store-requests`

- Fila de solicitações, stats (aguardando/aprovadas/recusadas hoje).
- Cartas com aprovar/recusar e link externo (site/Instagram).
- Botão recarregar.

### `/admin`

- Filtro de status (Todas/Pendentes/Ativas/Inativas).
- Cards de empresa, aprovar/recusar/desativar/reativar.
- Modal cadastrar empresa (react-hook-form + zod).

### `/admin/new`

- Formulário nome/e-mail/senha/confirmar.
- Validação `validateAdminForm` (senha ≥ 8).
- `POST /admins`, redirect `/admin`.

## Estados de interface

- **Loading:** "Carregando produtos…", "Carregando solicitações…", "Carregando empresas…", skeleton no UserMenu.
- **Vazio:** "Nenhum produto cadastrado ainda.", "Nenhum produto encontrado com esses filtros." + botão Limpar filtros, "Nenhuma solicitação aguardando aprovação.", "Nenhuma empresa encontrada com este filtro."
- **Erro:** classe `noticeError`.
- **Sucesso:** toasts sonner com strings exatas.
- **Validação:** mensagens por campo dos validadores + toast "Corrija os campos destacados."

## Padrões visuais e componentes reutilizáveis

**Tokens** em `src/styles/colors.css`:

- `--color-brand-primary: #661414` (e variantes)
- `--color-text-primary: #000000`, `--color-text-secondary: #201e1d`, etc.
- `--color-background-default: #ffffff`, etc.
- `--color-state-error: #ff383c`

**Catálogo de componentes:**

- `ui/`: Button, Input, Select, Textarea, FormHeader, FormFooterLink, ConfirmDialog
- `layout/`: AuthLayout, StoreHeader, UserMenu, Avatar, EditProfileModal
- `products/`: ProductForm, ProductImagesField, ProductsTable, ProductsFilter, ProductsMetrics, ProductsPagination, StatusBadge

## Comportamento responsivo

| Breakpoint | Componentes afetados        |
| ---------- | --------------------------- |
| 768px      | products, admin             |
| 760px      | StoreHeader, UserMenu       |
| 900px      | ProductForm, ProductsFilter |
| 1024/640px | ProductsMetrics             |
| 600px      | CreateCompanyModal          |
| 480px      | EditProfileModal            |
| 40rem      | register, admin/new         |
| 48rem      | AuthLayout                  |

## Integrações com API

| Método | Path                                       | Fonte                                                  | Usado por                                |
| ------ | ------------------------------------------ | ------------------------------------------------------ | ---------------------------------------- |
| POST   | /auth/company/login                        | lib/auth/AuthService.ts:8                              | /login                                   |
| POST   | /auth/refresh                              | AuthService.ts:17, lib/api.ts:36                       | refresh de sessão                        |
| POST   | /auth/logout                               | AuthService.ts:25, :50                                 | signOut; revoga recovery                 |
| POST   | /auth/recover                              | AuthService.ts:30                                      | /forgot-password passo 1                 |
| POST   | /auth/recover/verify                       | AuthService.ts:34                                      | passo 2                                  |
| PUT    | /auth/password                             | AuthService.ts:42                                      | passo 3                                  |
| GET    | /auth/me                                   | contexts/AuthContext.tsx:52                            | init da app                              |
| GET    | /products/company/{companyId}              | lib/products/ProductsService.ts:78, :112               | /products (lista + contagens)            |
| PATCH  | /products/{id}/publish?companyId=          | ProductsService.ts:107                                 | /products, ProductForm                   |
| PATCH  | /products/{id}/unpublish?companyId=        | ProductsService.ts:107                                 | /products, ProductForm                   |
| DELETE | /products/{id}                             | ProductsService.ts:117                                 | /products, ProductForm                   |
| GET    | /products/{id}                             | ProductsService.ts:140                                 | /products/[id]/edit                      |
| POST   | /products                                  | ProductsService.ts:188                                 | /products/new                            |
| PUT    | /products/{id}                             | ProductsService.ts:218                                 | /products/[id]/edit                      |
| POST   | /products/{id}/images?companyId=           | ProductsService.ts:241                                 | ProductForm                              |
| DELETE | /products/{id}/images/{imageId}?companyId= | ProductsService.ts:249                                 | ProductForm                              |
| GET    | /taxonomy                                  | lib/taxonomy/TaxonomyService.ts:8                      | ProductForm, mapeamento de labels        |
| POST   | /companies                                 | app/register/page.tsx:87, hooks/useCreateCompany.ts:10 | /register, modal /admin                  |
| GET    | /companies?status=                         | lib/company/CompanyService.ts:28                       | /admin                                   |
| GET    | /companies/{id}                            | CompanyService.ts:21                                   | definido, sem uso de página identificado |
| PATCH  | /companies/{id}/status                     | CompanyService.ts:36                                   | /admin                                   |
| POST   | /admins                                    | lib/admin/AdminService.ts:19                           | /admin/new                               |

## Pontos não implementados / mockados

- `/import` totalmente mockada: `MOCK_ERROR_ROWS` fixos + `setTimeout` 1500ms, sem upload real (`app/import/page.tsx:26,60,68`).
- `/store-requests` com dados fictícios: `MOCK_STORE_REQUESTS` + latência 600ms simulada (`lib/store-requests/StoreRequestsService.ts:8-19`, `store-requests.mock.ts`).
- Botão "Importar CSV" em `/products` sem handler (`app/products/page.tsx:233`).
- "Editar perfil" abre modal mas `onUpdateProfile` é no-op (`components/layout/StoreHeader/StoreHeader.tsx:62`).
- ProductsMetrics: "Salvos no closet" e "Cliques para a loja" fixos como `—` (`components/products/ProductsMetrics/index.tsx:17-18`).
- `QueryProvider` definido mas não montado em `app/layout.tsx`; `useCreateCompany` (useMutation) depende de contexto React Query — comportamento em runtime não verificado; documentar como ponto de atenção.

## Mockups

Ver [`docs/mockups/README.md`](mockups/README.md) para o índice completo.

### Índice de mockups

| Arquivo                       | Página           | Rota                                                 | Estado mostrado |
| ----------------------------- | ---------------- | ---------------------------------------------------- | --------------- |
| login.html                    | /login           | formulário pronto                                    |
| register.html                 | /register        | formulário pronto                                    |
| forgot-password.html          | /forgot-password | passo 1 e-mail                                       |
| forgot-password-code.html     | /forgot-password | passo 2 código                                       |
| forgot-password-password.html | /forgot-password | passo 3 nova senha                                   |
| pending.html                  | /pending         | tela única                                           |
| products.html                 | /products        | pronto, 3+ linhas, métricas/filtros/tabela/paginação |
| products-empty.html           | /products        | vazio sem filtros                                    |
| products-error.html           | /products        | erro de carregamento                                 |
| product-form-validation.html  | /products/new    | erros de validação por campo                         |
| import.html                   | /import          | estado "done" com relatório de erros                 |
| store-requests.html           | /store-requests  | fila com cartas + aprovar/recusar                    |
| admin.html                    | /admin           | lista de empresas, filtro Pendentes                  |
| admin-new.html                | /admin/new       | formulário novo administrador                        |

Mockups estáticos refletem a implementação atual; pontos mockados sinalizados em §13.
