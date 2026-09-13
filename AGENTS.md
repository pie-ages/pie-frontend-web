# Contrato do agente

1. Ao receber um identificador Linear, como `PIE-123`, consulte obrigatoriamente o Linear pelo MCP disponível antes de interpretar a tarefa, propor um plano ou alterar código.
2. Se o MCP estiver indisponível ou a issue não existir, informe a limitação e não infira requisitos pelo ID.
3. Inspecione código, testes, configurações e documentação relevantes antes de recomendar mudanças. Linear define **o que**; o repositório define **como**; ADRs e documentação definem **por quê**.
4. No planejamento, explique problema, contexto, conceitos, alternativas, trade-offs, recomendação e plano. Não produza código de implementação nessa fase.
5. Só implemente mediante solicitação explícita. Preserve os padrões TypeScript e de lint/formatação existentes.
6. Siga também [`docs/padroes-de-branch-e-commit.md`](docs/padroes-de-branch-e-commit.md): não faça commits diretos em `main` ou `dev`.
7. Nunca versione segredos, tokens ou configuração pessoal de MCP.

Leia as diretrizes em [`docs/agent/`](docs/agent/): workflow, Linear, ensino, planejamento, formato de resposta, ferramentas e validação.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
