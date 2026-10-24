# Deploy — Frontend Web

## Visão geral

O pipeline de CI/CD está definido em `.github/workflows/dev.yml` e é executado automaticamente pelo GitHub Actions em toda push para qualquer branch. O deploy para AWS ocorre apenas quando há push na branch `dev` ou por execução manual.

```
lint-and-build → push-image-to-ecr → deploy-ecs
```

Falhas em qualquer etapa anterior bloqueiam as seguintes.

## Etapas do pipeline

| Job                 | Gatilho                              | O que faz                                              |
| ------------------- | ------------------------------------ | ------------------------------------------------------ |
| `lint-and-build`    | Todo push e PR                       | Instala dependências, executa lint e build de produção |
| `mirror`            | Push (qualquer branch)               | Espelha o repositório para o GitLab                    |
| `push-image-to-ecr` | Push em `dev` ou `workflow_dispatch` | Gera imagem Docker e publica no Amazon ECR             |
| `deploy-ecs`        | Após `push-image-to-ecr`             | Atualiza o serviço ECS Express com a nova imagem       |

## Secrets necessários

Configure os secrets no ambiente `development` do repositório (Settings → Environments → development → Secrets):

| Secret                  | Descrição                                                                  |
| ----------------------- | -------------------------------------------------------------------------- |
| `AWS_REGION`            | Região AWS (ex: `us-east-1`)                                               |
| `AWS_ACCESS_KEY_ID`     | Access key do IAM com permissão para ECR e ECS                             |
| `AWS_SECRET_ACCESS_KEY` | Secret key correspondente                                                  |
| `ECR_REPOSITORY`        | Nome do repositório ECR para o frontend web                                |
| `ECS_SERVICE_ARN`       | ARN do serviço ECS Express do frontend web                                 |
| `NEXT_PUBLIC_API_URL`   | URL base da API do backend em produção (ex: `https://api.exemplo.com/api`) |
| `GITLAB_USERNAME`       | Usuário para espelhamento no GitLab                                        |
| `GITLAB_TOKEN`          | Token de acesso ao GitLab                                                  |

`NEXT_PUBLIC_API_URL` é passado como build arg para o Docker — o valor fica embutido no bundle gerado pelo Next.js.

## Deploy manual

Para disparar um deploy sem fazer push:

1. Acesse **Actions → CI → Run workflow**
2. Escolha a branch desejada
3. Marque **Publish the first image without updating ECS** se quiser apenas publicar a imagem no ECR sem atualizar o serviço

## Infraestrutura necessária

Os recursos AWS abaixo devem existir antes do primeiro deploy e não são provisionados pelo pipeline:

- Repositório ECR para o frontend web
- Serviço ECS Express com task definition configurada (porta 3000, arquitetura X86_64)

## Variáveis de ambiente da aplicação

| Variável                 | Escopo     | Descrição                                   |
| ------------------------ | ---------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Build time | URL base da API do backend                  |
| `NEXT_PUBLIC_COMPANY_ID` | Build time | ID de empresa fixo, quando aplicável        |
| `NODE_ENV`               | Runtime    | Definido como `production` na imagem Docker |
| `PORT`                   | Runtime    | Porta do servidor Next.js (padrão: `3000`)  |
