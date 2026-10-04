# CartórioChain

Cartório digital descentralizado para o mercado brasileiro.  
Armazena prova de autenticidade de documentos on-chain sem expor dados do signatário.

---

## O que o usuário vê vs. o que acontece

| O usuário vê | O que acontece por baixo |
|---|---|
| "Impressão digital única do arquivo" | Hash SHA-256 calculado localmente — o arquivo nunca sai do dispositivo |
| "Prova de autenticidade" | Circuito ZK em Noir — prova que X assinou este documento sem revelar quem é X |
| "Dados protegidos" | PII cifrado com X25519 + AES-256-GCM (semântica ZCash ViewKey) — só o titular decifra |
| "Registro permanente" | Solana (timestamp imutável no ledger) + Irys/Arweave (armazenamento permanente) |
| "Código de verificação" | docId derivado do hash + seed — verificável por qualquer pessoa |
| "Verificação de autenticidade" | ZK verifier confirma assinatura válida + commitment correto sem revelar chave pública |

---

## Stack

| Camada | Tecnologia | Status |
|---|---|---|
| Blockchain | Solana (Anchor 1.2.0) | ✅ Devnet — `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW` |
| Privacidade | X25519 + AES-256-GCM com semântica ZCash ViewKey | ✅ Completo |
| ZK Proofs | Noir (nargo 1.0) + Barretenberg UltraHonk | ✅ Circuito compilado |
| Armazenamento permanente | Irys (Arweave) | ✅ Completo |
| Backend | Node.js + Hono + TypeScript — porta 3001 | ✅ Deploy Railway |
| Frontend | Vue 3 + Vite + Cloudflare Pages — porta 5176 | ✅ Deploy Cloudflare |

---

## Estrutura

```
code/
├── programs/cartoriochain/   — Anchor smart contract (Rust)
│   └── src/
│       ├── lib.rs            — Entry point: register_document, verify_document, revoke_document
│       ├── state.rs          — DocumentRecord struct + SPACE calculation
│       └── instructions/     — Uma instrução por arquivo
├── circuits/document_proof/  — Circuito ZK (Noir)
│   └── src/main.nr           — Prova assinatura ECDSA secp256k1 + retorna Pedersen commitment
├── api/                      — Backend Node.js (Hono)
│   └── src/
│       ├── index.ts          — Servidor + rotas
│       ├── zk.ts             — Geração e verificação de ZK proofs (Noir JS + Barretenberg)
│       ├── viewkey.ts        — Cifra/decifra PII com X25519 (ViewKey semântico)
│       ├── irys.ts           — Upload de documentos para Irys/Arweave
│       ├── anchor-client.ts  — Interação com o programa Solana
│       └── routes/
│           ├── documents.ts  — CRUD de documentos + ZK integrado
│           ├── proofs.ts     — Endpoints ZK standalone
│           └── viewkey.ts    — Geração de keypair + encrypt/decrypt
└── web/                      — Frontend Vue 3
    └── src/
        └── views/            — Home, Registrar, Verificar, Serviços
```

---

## Fluxo de registro

1. Usuário seleciona arquivo — hash SHA-256 calculado no browser
2. Usuário seleciona tipo de documento (combobox com 10 tipos) — campo "cartório" removido (desnecessário no MVP)
3. API faz upload do arquivo para Irys — recebe txId
4. API registra no Solana: doc_hash, irys_tx_id, doc_type, cartorio_id, signer_commitment
5. Se paymentAddress fornecido: PII do signatário é cifrado com ViewKey antes do registro
6. Se pubKeyX, pubKeyY, signature fornecidos: ZK proof gerado, signer_commitment = Pedersen(pubKey)
7. Frontend exibe código de verificação para o usuário guardar

## Fluxo de verificação

1. Usuário informa código de verificação
2. API busca registro na Solana pelo docId
3. Compara hash do arquivo fornecido com o hash on-chain
4. Se ZK proof disponível: verifica com UltraHonk Barretenberg
5. Exibe: cartório, tipo, data, status (válido / revogado)

---

## Variáveis de ambiente (API)

```env
WALLET_KEY=<base58 privkey>
SOLANA_RPC=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
IRYS_URL=https://devnet.irys.xyz
PORT=3001
DEMO_MODE=true
CORS_ORIGINS=http://localhost:5176
```

## Deploy do smart contract

```bash
# Requisitos: WSL + Rust 1.95+ + Solana CLI 4.3.0 + Anchor CLI 1.2.0
# Wallet: ~/.config/solana/cartoriochain-deploy.json (precisa ter SOL no devnet)
anchor build && anchor deploy --provider.cluster devnet
```

Smart contract devnet: `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW`  
Authority: `ABvPhg87fRB6vsb17f14N8RD9KnXn4HK94dCDmTwQNXV`  
Slot: 507386911

Faucet devnet: https://faucet.solana.com

---

## Versões fixadas

Todas as dependências do frontend têm versões exatas (sem `^`) em `web/package.json`.  
Para o smart contract: `anchor-lang = "=1.2.0"` em `programs/cartoriochain/Cargo.toml`.

---

## Testes e2e (Playwright)

Suite de 20 testes cobrindo fluxo de registro, home e página de serviços.

```bash
cd web
npx playwright test
```

### Cobertura de features

| Teste | Feature coberta |
|---|---|
| demo MCMV — carrega step 1 | Pré-carregamento via `?demo=mcmv`, arquivo mockado visível |
| step 1 — upload desabilitado sem arquivo | Botão Avançar bloqueado sem arquivo selecionado |
| step 1 → step 2 com demo | Navegação entre steps + campos pré-preenchidos |
| step 2 — avançar habilitado com demo | Validação de formulário de informações do documento |
| step 2 → step 3 (PIX) | Exibição de dados do pagamento (taxa R$5,00, chave PIX) |
| step 3 — botão copiar chave PIX | Clipboard API — copia chave e exibe feedback "✓ Copiado" |
| step 3 — botão Voltar | Navegação regressiva entre steps |
| step 3 — "Já paguei" — spinner | Transição para confirmação de pagamento |
| step 4 loading — progress bar | Loading screen com etapas de autenticação visíveis |
| UX — sem texto blockchain | Regra crítica: Solana/USDC/wallet/ZCash 100% ocultos do usuário |
| Privacidade avançada — toggle | Seção "Payload cifrado" abre/fecha corretamente |
| step 2 — combobox com datalist | Tipo de documento é `<input list="doc-types">` com 10 opções |
| step 2 — campo cartório removido | Campo "Cartório ou instituição emissora" não visível |
| step 3 — chave PIX dinâmica | Formato `pix+[hash]@cartoriochain.com.br` por docIdSeed |
| home — comparativo de custo | "99,8%" e "R$2.400" visíveis na barra amarela |
| home — loop econômico | "Cada centavo é rastreável" + nós "Você paga" e "Verificável" |
| home — 3 perfis de usuário | Cidadão, Construtora/Escritório, Banco/Seguradora + CTAs |
| home — sem blockchain exposto | Hero não contém wallet/USDC |
| /servicos — breakdown de custos | Seção Transparência com Registro on-chain e Armazenamento |
| /servicos — 3 planos | Individual, Construtora (mais popular), Enterprise visíveis |

### Bugs UX encontrados e corrigidos pelos testes

| Bug | Arquivo | Fix |
|---|---|---|
| "ZCash · Solana" visível na navbar | `src/App.vue:6` | Trocado por "Autenticidade Digital" |
| Emoji ⬆ como ícone funcional de upload | `RegistrarStepDocumento.vue` | Substituído por SVG |
| Emoji 🔒 no botão de privacidade | `RegistrarStepInformacoes.vue` | Substituído por SVG |
| `.progress-fill` com `ease` em vez de curva correta | `style.css` | `cubic-bezier(0.32,0.72,0,1)` |
| `.spinner` e `.shimmer` sem `prefers-reduced-motion` | `style.css` | Adicionados ao bloco reduce |
| `.vk-toggle` sem focus ring visível | `style.css` | `outline: 2px solid #FFD23F` |

### Decisões técnicas dos testes

- `permissions: ['clipboard-read', 'clipboard-write']` no `playwright.config.ts` — necessário para `navigator.clipboard` em headless Chromium
- `page.route('**/documents', ...)` com delay de 6s para manter o estado `carregando` visível no test de step 4 (sem backend rodando, a request falha instantaneamente e o loading desaparece antes da asserção)
- Seletor `getByRole('button', { name: /Avançar/ })` em vez de `text=Avançar` — evita strict mode violation quando há múltiplos elementos com o texto

---

## Home page — seções implementadas

| Seção | Descrição |
|---|---|
| Hero | Headline + sticker card de stats (custo, tempo, privacidade) |
| Problema / Solução | Dois cards lado a lado — MCMV + ZK |
| Como funciona | 3 passos (SHA-256 → ZK proof → Solana+Irys) |
| Comparativo de custo | Barra amarela: R$5 vs ~~R$2.400~~ cartório — 99,8% mais barato |
| Onde vai o R$5 | Loop econômico: 5 nós com setas — você paga → ZK proof → Solana → Irys → verificável |
| 12 serviços mapeados | Grid de serviços com badge MVP/Próximo/Roadmap |
| Quem usa | 3 perfis com CTAs: Cidadão, Construtora/Escritório, Banco/Seguradora |
| CTA final | Demo escritura MCMV |

## Página /servicos — seções implementadas

| Seção | Descrição |
|---|---|
| Cobertura | 4 stats: implementados, próximo sprint, roadmap, futuro |
| Stack tecnológico | SHA-256, ZK Noir, ZCash ViewKey, Solana, Irys |
| Transparência de custos | Breakdown do R$5: Solana ~R$0,001 + Irys ~R$0,10 + operação + protocolo |
| Planos | Individual (R$5/doc), Construtora (R$3/doc em volume), Enterprise (R$0,50/consulta API) |
| Todos os serviços | 12 serviços com status, descrição, tech e botão demo para MVPs |

---

## Hackathon Colosseum — deadline 12/out/2026

| Trilha | Prêmio | Status |
|---|---|---|
| ZCash | $10k | ✅ ViewKey encryption de PII + ZK proof |
| Solana | $10k | ✅ Smart contract devnet |
| Brasil | $5k | ✅ Caso de uso Minha Casa Minha Vida |
| Tempo | $10k | Integração pagamento a implementar |
| Public Good | $5k | Página `/verificar/:id` pública sem login |
