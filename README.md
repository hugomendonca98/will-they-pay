# Will They Pay

Template de starter SaaS para o Hugo (e para os próximos produtos). UI em **português brasileiro**. Código, identificadores e comentários em **inglês**.

Stack: **Next.js 16** (App Router, pin 16.3.8 — ver nota abaixo) + **Cloudflare Workers** (`@opennextjs/cloudflare`) + **Drizzle / D1** + **Tailwind CSS** + **shadcn/ui** + **Mercado Pago Checkout Pro**.

Este repositório é público. **Nenhum token, secret, account id ou database id real entra no git.**

## O que já vem pronto

- Captura de leads (nome, e-mail, telefone e mensagem) com validação Zod no servidor, `server action` e persistência no D1.
- Checkout Pro: cria o pedido no D1, cria a preferência no Mercado Pago, redireciona para o checkout e trata as URLs de `success` / `failure` / `pending`.
- Webhook `POST /api/webhooks/mercadopago` que valida o header `x-signature` (HMAC-SHA256) e atualiza pedido/pagamento.
- Camada de pagamentos tipada e testável, separada das rotas.
- Vitest + MSW (sem credenciais reais).
- CI no GitHub Actions: lint, typecheck e testes.

## Pré-requisitos

- Node.js 22+
- [pnpm](https://pnpm.io/)
- Conta [Cloudflare](https://dash.cloudflare.com/) com Workers
- Aplicação no [painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel/app)

```bash
pnpm install
cp .dev.vars.example .dev.vars
cp .env.example .env.local   # opcional; o Worker lê `.dev.vars`
```

Preencha `.dev.vars` com tokens de **teste**. Esse arquivo está no `.gitignore`.

## Secrets e variáveis

| Nome | Tipo | Onde configurar |
| --- | --- | --- |
| `MERCADOPAGO_ACCESS_TOKEN` | **secret** | `.dev.vars` local; `pnpm wrangler secret put MERCADOPAGO_ACCESS_TOKEN` em produção |
| `MERCADOPAGO_WEBHOOK_SECRET` | **secret** | `.dev.vars` local; `pnpm wrangler secret put MERCADOPAGO_WEBHOOK_SECRET` em produção |
| `APP_URL` | var pública | `.dev.vars` local; `vars` em `wrangler.jsonc` no deploy |
| `MERCADOPAGO_SANDBOX` | var pública | `"true"` (sandbox) ou `"false"` (live) |
| `NEXTJS_ENV` | var local | `development` no `.dev.vars` para o `next dev` |

O CI **não** usa credenciais reais. Se você adicionar um job de deploy, leia tokens só de **GitHub Actions secrets** (`Settings → Secrets and variables → Actions`), por exemplo:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID` (não commitar)
- `CLOUDFLARE_D1_DATABASE_ID` (não commitar)

Nunca cole esses valores em `wrangler.jsonc`, workflows ou README.

## Banco D1

`wrangler.jsonc` usa um **placeholder** de `database_id` (`00000000-0000-0000-0000-000000000000`). Ele não é um recurso real da Cloudflare. O D1 **local** funciona assim. Antes do deploy:

```bash
pnpm wrangler d1 create will-they-pay
```

Copie o `database_id` impresso **só na sua máquina** (ou num secret de CI) e substitua o placeholder em `wrangler.jsonc`. Não commite o id de produção se o repositório for um template compartilhado — rode o create em cada produto novo.

Gere e aplique migrations:

```bash
pnpm db:generate          # SQL em ./drizzle a partir do schema
pnpm db:migrate           # local (alias de db:migrate:local)
pnpm db:migrate:local
pnpm db:migrate:remote    # exige wrangler login ou CLOUDFLARE_API_TOKEN no ambiente
```

## Mercado Pago

1. Crie um app em [Suas integrações](https://www.mercadopago.com.br/developers/panel/app).
2. Copie o **Access Token de teste** para `MERCADOPAGO_ACCESS_TOKEN`.
3. Em **Webhooks → Configurar notificações**:
   - URL de produção (HTTPS): `https://SEU_DOMINIO/api/webhooks/mercadopago`
   - Evento: **Payments**
   - Revele a **secret key** e grave em `MERCADOPAGO_WEBHOOK_SECRET`
4. Em sandbox, `APP_URL` pode ser `http://localhost:8787` (preview Wrangler) ou um túnel HTTPS. `auto_return` só é enviado quando `APP_URL` começa com `https://`.

O webhook valida `x-signature` no formato `ts=...,v1=...`, monta o manifesto `id:{data.id};request-id:{x-request-id};ts:{ts};` e compara HMAC-SHA256 em tempo constante. Depois busca `GET /v1/payments/{id}` e atualiza o D1.

## Scripts

| Script | Função |
| --- | --- |
| `pnpm dev` | Next.js local, com bindings via OpenNext |
| `pnpm build` | `next build` |
| `pnpm preview` | Build OpenNext + `wrangler dev` (runtime de Workers) |
| `pnpm deploy` | Build OpenNext + deploy no Cloudflare |
| `pnpm test` | Vitest |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Gera SQL (drizzle-kit) |
| `pnpm db:migrate:local` / `pnpm db:migrate:remote` | Aplica SQL com Wrangler |

Depois de `pnpm preview`, rode `pnpm db:migrate:local` se as tabelas ainda não existirem no D1 local.

## Estrutura

```
src/lib/db          schema Drizzle e client D1
src/lib/leads       validação Zod + persistência
src/lib/payments    cliente HTTP, HMAC, serviço de preferência/webhook
src/app/actions     server actions (finas)
src/app/api/webhooks/mercadopago
src/components      UI shadcn + formulários
drizzle             migrations SQL versionadas
```

Rotas de UI: `/` (leads + checkout), `/checkout/success`, `/checkout/failure`, `/checkout/pending`.

## Deploy

1. Substitua o `database_id` placeholder (passo D1).
2. Ajuste `vars.APP_URL` em `wrangler.jsonc` para o domínio HTTPS do Worker.
3. `pnpm wrangler secret put MERCADOPAGO_ACCESS_TOKEN`
4. `pnpm wrangler secret put MERCADOPAGO_WEBHOOK_SECRET`
5. `pnpm db:migrate:remote`
6. `pnpm deploy`
7. Cadastre a URL do webhook no painel do Mercado Pago.

Não rode `wrangler secret put` com valores no histórico de shell compartilhado se puder evitar; o CLI lê o valor de forma interativa.

## Notas

O Next.js está pinado em **16.3.8** (ainda Next 16) porque o `create-next-app` atual puxa 16.4, e o `@opennextjs/cloudflare@1.20.9` quebra no `preview-props.json` ([issue 1355](https://github.com/opennextjs/opennextjs-cloudflare/issues/1355)). Há um `pnpm patch` no adapter para quando você subir de versão.

Cache Components (`cacheComponents`) ficou desligado no `next.config.ts`: com ele ligado, o Worker local travava o request. Vale religar depois que o OpenNext tratar isso no workerd.

## Testes

Os testes sobem um SQLite em memória (mesmo schema) e mockam a API do Mercado Pago com MSW. Não leem `.dev.vars`.

```bash
pnpm test
```
