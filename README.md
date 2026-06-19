# Portus — Diário Digital de Obras e Serviços

Plataforma web institucional para registro, gestão, fiscalização, aprovação,
assinatura, emissão de PDF e auditoria de Relatórios Diários de Obra (RDO),
voltada para obras e serviços de engenharia da SUAPE — Complexo Industrial
Portuário de Pernambuco.

Projeto desenvolvido para o **Hackathon DINFRA/SUAPE 2026**, a partir dos
requisitos do desafio e do Manual de Identidade Visual institucional.

> **Etapa atual:** Cadastro (organização + Administrador do Sistema + usuários
> convidados, com senha real e permissões customizáveis), Login, sessão
> (`/auth/me`), Gestão de Usuários (com permissões por usuário), Organização,
> Meu Perfil e a feature completa de **RDO** (listagem, criação em wizard de 6
> etapas com autosave por seção, evidências com geolocalização, revisão
> fiscal externa/SUAPE, histórico e comentários) já consomem a API real
> (`Portus-api`). O restante do Dashboard (indicadores, pendências, atividade
> recente) ainda usa dados mockados — ver [Dados reais vs.
> mockados](#dados-reais-vs-mockados).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/) (tokens de tema via `@theme`)
- [lucide-react](https://lucide.dev/) para ícones
- `fetch` nativo para consumir a API (sem axios/swr) — ver [Camada de API](#camada-de-api)
- Docker / Docker Compose para ambiente de desenvolvimento

## Como rodar (front + API)

Requisitos: Node.js 22+, [pnpm](https://pnpm.io/) e Docker Desktop (para a API/Postgres).

1. Suba a API primeiro — siga o README de [`Portus-api`](../Portus-api/README.md)
   (`docker compose up -d postgres`, `npm run prisma:migrate:dev`, `npm run prisma:seed`,
   `npm run dev`). Por padrão ela fica em `http://localhost:4000`.
2. Configure o front:

   ```bash
   cp .env.example .env
   ```

   Confirme que `NEXT_PUBLIC_API_BASE_URL` aponta para a API (default
   `http://localhost:4000/api`).
3. Rode o front:

   ```bash
   pnpm install
   pnpm dev
   ```

Acesse [http://localhost:3000](http://localhost:3000). Use os dados de seed da
API (`admin@portus.dev` / `Admin@123456`) para logar direto, ou crie uma nova
organização pelo wizard de Cadastro.

Outros scripts:

```bash
pnpm build   # build de produção
pnpm start   # roda o build de produção
pnpm lint    # eslint
```

### Com Docker (apenas o front)

```bash
docker compose up --build
```

O código-fonte é montado como volume (hot reload); `node_modules`/`.next`
ficam em volumes nomeados. A API continua rodando separadamente (`Portus-api`
tem seu próprio `docker-compose.yml` com o Postgres).

## Variáveis de ambiente

| Variável | Descrição | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL da API consumida por auth/organizations/users (equivalente ao `VITE_API_URL`) | `http://localhost:4000/api` |
| `NEXT_PUBLIC_APP_URL` | URL pública da própria aplicação (metadados/links absolutos) | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Nome exibido da aplicação | `Portus` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | Indica que indicadores/pendências/RDOs/atividades do dashboard ainda são mockados | `true` |

## Fluxo de autenticação

1. **Cadastro** (`/cadastro`) — wizard de 4 etapas (Identificação do
   Administrador → Organização → Usuários convidados → Revisão). No envio,
   `lib/adapters/cadastro-to-register.ts` converte o estado do formulário
   (campos em português) no DTO esperado por `POST /auth/register`,
   normalizando CPF/CNPJ/CEP/telefone para dígitos. A organização é criada
   junto com o Administrador do Sistema e os usuários convidados (sem senha,
   status `INVITED`) numa única transação no backend. **Erros da API são
   mapeados de volta para os campos do passo correto** via
   `lib/adapters/register-error-mapper.ts`. O registro não autentica
   automaticamente — o usuário é direcionado para o login.
2. **Login** (`/login`) — `POST /auth/login` retorna um token JWT, salvo via
   `lib/api/token-storage.ts` (`localStorage` se "Manter conectado" estiver
   marcado, senão `sessionStorage`). Credenciais inválidas mostram uma
   mensagem amigável sem expor qual campo está errado.
3. **Sessão** — o `AuthProvider` (`context/auth-context.tsx`) restaura a
   sessão chamando `GET /auth/me` sempre que há um token salvo, expondo
   `{ status, user, organization }` via `useAuth()`. Enquanto restaura,
   `ProtectedRoute`/`GuestRoute` mostram um loading.
4. **Token expirado/inválido** — qualquer resposta `401` da API (exceto do
   próprio `/auth/login`) aciona um handler central registrado pelo
   `AuthProvider` (`setUnauthorizedHandler` em `lib/api/client.ts`), que limpa
   a sessão; o `ProtectedRoute` então redireciona para `/login`.
5. **Logout** — `useAuth().logout()` (Topbar e rodapé da Sidebar) limpa o
   token e o estado em memória.

`ProtectedRoute` (rotas autenticadas, grupo `app/(app)/`) e `GuestRoute`
(`/login`, `/cadastro`) ficam em `src/components/auth/`.

## Camada de API

```
src/
  lib/api/
    client.ts           # fetch wrapper: header Authorization, parse {success,data}/{success:false,...}, ApiError, suporte a FormData (upload)
    token-storage.ts     # leitura/escrita do token (local/sessionStorage)
  lib/adapters/
    cadastro-to-register.ts   # CadastroFormState -> RegisterRequest
    register-error-mapper.ts   # erros da API -> campos do wizard
  services/
    auth.service.ts            # register, login, me, updateMe
    organizations.service.ts    # getMine, updateMine
    users.service.ts             # list, create, update, remove
    permissions.service.ts        # getCatalog, getRoleDefaults, getUserPermissions, updateUserPermissions
    rdos.service.ts                # CRUD de RDO, transições de status, evidências (upload multipart), comentários, histórico
    ai.service.ts                    # generateRdoTextSuggestion, transcribeAudio
  hooks/
    use-auth.ts            # consome o AuthContext (sessão + permissões)
    use-permissions.ts       # can/canAny/canAll a partir das permissões efetivas da sessão
    use-login.ts               # mutação de login (loading/erro)
    use-register.ts              # mutação de registro (loading/erro)
    use-current-user.ts            # GET /auth/me sob demanda
    use-organization.ts              # GET/PATCH /organizations/me
    use-users.ts                       # listagem paginada + create/update/delete
    use-user-permissions.ts              # permissões efetivas de um usuário específico
    use-rdos.ts                            # listagem paginada de RDOs
    use-rdo.ts                               # um RDO + todas as mutações de ciclo de vida
    use-rdo-evidences.ts                       # upload/listagem/validação/remoção de evidências
    use-authenticated-file.ts                    # baixa um arquivo autenticado (evidência) e expõe como Object URL
```

Nenhum componente chama `fetch` diretamente — sempre via `services/*`, e os
componentes usam os hooks acima (nunca os services direto), seguindo
`loading`/`error`/`empty` em cada tela que consome dados reais. A segurança
real (quem pode fazer o quê) sempre vem do backend — `usePermissions()`/`can()`
no front é só UX (esconder/desabilitar ações).

### Endpoints consumidos (`Portus-api`)

| Método | Rota | Onde é usado |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Wizard de Cadastro |
| `POST` | `/api/auth/login` | Login |
| `GET` | `/api/auth/me` | Restauração de sessão (`AuthProvider`) |
| `PATCH` | `/api/auth/me` | Página Meu Perfil |
| `GET`/`PATCH` | `/api/organizations/me` | Página Organização |
| `GET`/`POST`/`PATCH`/`DELETE` | `/api/users` | Gestão de Usuários (`/usuarios`) |
| `GET` | `/api/permissions`, `/api/roles/:role/permissions` | Customização de permissões no Cadastro e na Gestão de Usuários |
| `GET`/`PATCH` | `/api/users/:id/permissions` | Modal de Permissões na Gestão de Usuários |
| `GET`/`POST`/`PATCH`/`DELETE` | `/api/rdos`, `/api/rdos/:id` | Listagem, wizard de criação/edição e revisão de RDO (`/rdos`) |
| `POST` | `/api/rdos/:id/submit`, `/external-review/*`, `/suape-review/*`, `/reopen` | Ações de fluxo no wizard (Revisão Final) e na tela de revisão fiscal |
| `POST`/`GET`/`PATCH`/`DELETE` | `/api/rdos/:id/evidences*` | Etapa "Evidências" do wizard e galeria na revisão |
| `POST`/`GET` | `/api/rdos/:id/comments`, `/api/rdos/:id/history` | Painel de comentários e histórico na tela de revisão |
| `POST` | `/api/ai/rdo-text-suggestion`, `/api/ai/audio-transcription` | Botões "Sugerir texto com IA" e transcrição na etapa Atividades |

## Estrutura de pastas

```
src/
  app/
    login/                 # GuestRoute + AuthShell + LoginForm
    cadastro/               # GuestRoute + CadastroShell + CadastroForm
    (app)/                  # grupo de rota autenticado (não aparece na URL)
      layout.tsx              # ProtectedRoute + DashboardShell
      dashboard/
      usuarios/                # Gestão de Usuários (CRUD real + permissões por usuário)
      organizacao/              # Edição dos dados da organização
      perfil/                     # Edição do próprio perfil/senha
      rdos/                        # Listagem, /novo (cria e redireciona) e /[id] (wizard ou revisão)
  components/
    ui/                 # componentes base (Button, Input, Modal, Card, Badge...)
    layout/             # Sidebar, Topbar, DashboardShell
    auth/                # AuthShell, LoginForm, CadastroForm, ProtectedRoute, GuestRoute
    cadastro/            # CadastroShell, steps do wizard, UserInviteCard
    permissoes/          # PermissionsChecklist, PermissionCustomizationToggle (reusados no Cadastro e na Gestão)
    usuarios/            # UsersTable, UserFormModal, DeleteUserModal, PermissionsModal
    organizacao/          # formulário de edição da organização
    perfil/                # formulário de edição do próprio perfil
    rdos/                    # RdoWizard (+ 6 steps), RdoReviewView, listagem, EvidenceCard
    dashboard/          # MetricCard, PendingList, ActivityFeed... (mockados)
    brand/              # Logo, SuapeMark, SuapePattern
  context/              # AuthProvider
  services/             # camada de API por domínio
  hooks/                # use-auth, use-permissions, use-rdo(s), use-rdo-evidences, use-authenticated-file...
  lib/
    api/                # client (JSON + FormData) + token-storage
    adapters/           # CadastroFormState <-> DTOs da API
  constants/            # roles, status, rdo (labels/badges dos 12 status), permissions, rotas, itens de navegação
  data/                 # dados mockados (dashboard + seletor de obra/contrato do RDO, ver abaixo)
  types/                # tipos de domínio + DTOs de API (User, Organization, Rdo, auth, api, permissions)
```

## Dados reais vs. mockados

| Área | Origem |
| --- | --- |
| Organização, Administrador, usuários convidados (Cadastro) | API real |
| Sessão, usuário, organização e permissões efetivas logados (Login, Topbar, Sidebar, saudação do Dashboard) | API real |
| Gestão de Usuários (`/usuarios`) e permissões por usuário | API real |
| Organização (`/organizacao`) e Meu Perfil (`/perfil`) | API real |
| RDOs — listagem, wizard de criação/edição, evidências, revisão fiscal, histórico, comentários (`/rdos`) | API real |
| Sugestão de texto / transcrição de áudio (IA) | API real (stub — texto canned, sem provedor externo) |
| Seletor de Obra/Contrato na etapa "Dados do Dia" do RDO | `src/data/mock-obras.ts` (mock — RDO grava só o nome/contrato como texto livre até existir um módulo real de Obra) |
| Indicadores, pendências, atividade recente, mapa operacional (Dashboard) | `src/data/*` (mock) — sem endpoint na API ainda |

`UserRole` (`SYSTEM_ADMIN`, `SUAPE_INSPECTOR`, `EXTERNAL_INSPECTOR`,
`SUPPLIER`, `AUDITOR`) e `UserStatus` (`ACTIVE`, `INVITED`, `INACTIVE`) em
`src/types/user.ts` são idênticos ao enum da API — não há camada de tradução
entre front e backend para esses valores. O mesmo vale para `RdoStatus` e os
demais enums de `src/types/rdo.ts`.

## Próximos passos

- Gestão de obras/contratos como entidade real (API + UI), substituindo o seletor mock do RDO por uma FK
- Permissões por obra/contrato
- Assinatura eletrônica (status `SIGNATURE_PENDING`/`SIGNED`, já reservados no enum de RDO)
- Emissão de relatórios em PDF (individual e consolidado)
- Integração de IA real (hoje `ai:generate_rdo_text`/`ai:transcribe_audio` retornam texto de exemplo)
- Suporte offline e sincronização
- Auditoria e trilha de logs completa
- Mapas/GIS para visualização georreferenciada das evidências
- Painel gerencial global
- Trocar os mocks restantes do Dashboard por endpoints reais quando existirem
