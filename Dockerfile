# syntax=docker/dockerfile:1

# ---- deps: instala todas as dependências (cache reaproveitado entre estágios) ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- dev: imagem usada pelo docker-compose.override.yml (hot reload) ----
FROM deps AS dev
WORKDIR /app
RUN corepack enable
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "next dev -H 0.0.0.0 -p ${PORT:-3000}"]

# ---- builder: gera o build de produção (output: standalone) ----
FROM deps AS builder
WORKDIR /app
RUN corepack enable
COPY . .

# Variáveis NEXT_PUBLIC_* são embutidas no bundle do cliente em tempo de build —
# por isso precisam chegar como build args, não apenas como env de runtime.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_USE_MOCK_DATA
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME \
    NEXT_PUBLIC_USE_MOCK_DATA=$NEXT_PUBLIC_USE_MOCK_DATA \
    NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN pnpm build

# ---- production: server Node mínimo, sem node_modules completo ----
FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER node

EXPOSE 3000
CMD ["node", "server.js"]
