# Portus — Front-end

Interface web do sistema RDO SUAPE, desenvolvida com Next.js, TypeScript e Tailwind CSS.

## Tecnologias

- Next.js (App Router) + React
- TypeScript
- Tailwind CSS
- Docker

## Funcionalidades

- Login
- Cadastro (organização + administrador + usuários convidados)
- Gestão de usuários e permissões
- Dashboard
- Obras (mockadas no front, sem chamadas à API)
- RDOs (mockados no front — wizard de criação em etapas, equipe, equipamentos, evidências, revisão)

Login, cadastro, sessão e gestão de usuários consomem a API real (`Portus-api`). Obras e RDOs usam dados mockados em memória, mantendo a mesma arquitetura de services/hooks para serem trocados por chamadas reais no futuro.

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

```env
FRONTEND_PORT=3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Portus — RDO SUAPE"
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

- `FRONTEND_PORT` é a porta publicada pelo Docker no host.
- `NEXT_PUBLIC_API_BASE_URL` é embutida no bundle do cliente em tempo de build — ao mudar esse valor em produção, é preciso reconstruir a imagem (`docker compose up -d --build`), não basta reiniciar o container.

## Rodando com Docker em desenvolvimento

```bash
docker compose up --build
```

Sobe o front com hot reload (`next dev`). O `docker-compose.override.yml` é aplicado por padrão e não deve ser copiado para a VPS.

## Rodando em produção na VPS

```bash
cp .env.example .env   # ajuste os valores antes de seguir
docker compose -f docker-compose.yml up -d --build
```

Builda o app (`output: standalone`) e inicia com `node server.js`, sem ferramentas de desenvolvimento na imagem final.

## Comandos úteis

```bash
docker compose logs -f
docker compose down
pnpm build
pnpm lint
```

## Rodando sem Docker

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Requer a API (`Portus-api`) rodando para login, cadastro e gestão de usuários.

## Projeto relacionado

API: [Portus-api](../Portus-api/README.md)
