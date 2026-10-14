# pie-frontend-web

## Docker

Construa a imagem informando as variáveis públicas que serão incorporadas ao
bundle do Next.js:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8080/api \
  --build-arg NEXT_PUBLIC_COMPANY_ID=<company-id> \
  -t pie-frontend-web .
```

Execute o container na porta 3000:

```bash
docker run --rm -p 3000:3000 pie-frontend-web
```

As variáveis `NEXT_PUBLIC_*` são avaliadas durante o build do Next.js. Para
alterá-las, construa uma nova imagem com os valores desejados.
