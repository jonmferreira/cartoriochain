# CartórioChain

**O cartório que nenhum tribunal pode contestar.**

🇺🇸 [English version](./README.md)

Em abril de 2024, no Amazonas, uma única procuração falsa saiu de um cartório e **R$ 10 milhões** sumiram de uma conta judicial. Não foi hacking — foi uma folha de papel assinada no lugar errado, que nenhum sistema atual detectou. Isso está documentado em investigação do Ministério Público.

No Brasil, autenticar uma escritura num cartório custa **R$ 2.400** e leva semanas. Uma construtora do Minha Casa Minha Vida tem até **200 escrituras por obra** — R$ 480 mil em taxas, e mesmo assim as fraudes acontecem.

**CartórioChain autentica qualquer documento em ~28 segundos por R$ 5**, gera uma prova criptográfica inforjável e deixa qualquer pessoa verificar — sem conta, sem carteira, sem saber que existe blockchain.

---

## Como funciona — o que o usuário vê vs. o que acontece

O usuário nunca vê blockchain. Vê tipo do documento, cartório e data. Por baixo:

| O usuário vê | O que acontece por baixo |
|---|---|
| "Impressão digital única do arquivo" | Hash SHA-256 calculado localmente — o arquivo nunca sai do dispositivo |
| "Prova de autenticidade" | Circuito ZK em Noir — prova que X assinou este documento sem revelar quem é X |
| "Dados protegidos" | PII cifrado com X25519 + AES-256-GCM (semântica ZCash ViewKey) — só o titular decifra |
| "Registro permanente" | Solana (timestamp imutável) + Irys/Arweave (armazenamento permanente) |
| "Verificação pública" | `/verificar/:id` — qualquer pessoa confere por URL, sem login, sem wallet |

**Privacidade sem impunidade:** o titular controla quem acessa. Um juiz com a ViewKey pode auditar. Um hacker sem ela não consegue nada.

---

## Velocity — como iteramos

Construído do zero durante o hackathon (primeiro commit: 2 de outubro de 2026). Sinais de ritmo de time:

- **20 testes e2e (Playwright)** passando — validados localmente **e contra produção** (`cartoriochain.pages.dev`).
- **Deploy ativo desde o início** — frontend no Cloudflare Pages, API no Railway, smart contract na devnet Solana. Não é localhost.
- **Bugs achados e corrigidos pelos próprios testes** — a suíte é rede de segurança, não enfeite (ver tabelas abaixo).
- **Mercado validado em fonte primária** — dados de habitação do Amazonas conferidos com gov.br (23 mil moradias MCMV contratadas 2023–2025, R$ 3,1 bi de investimento federal).

Fundado por estudante de Engenharia da Computação (UEA), cuja monografia é sobre autenticação criptográfica para registros públicos no Brasil. CartórioChain é a versão em produção dessa pesquisa.

---

## Stack

| Camada | Tecnologia | Status |
|---|---|---|
| Blockchain | Solana (Anchor 1.2.0) | ✅ Devnet — `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW` |
| Privacidade | X25519 + AES-256-GCM com semântica ZCash ViewKey | ✅ Completo |
| ZK Proofs | Noir (nargo 1.0) + Barretenberg UltraHonk | ✅ Circuito compilado + prova funcional |
| Armazenamento permanente | Irys (Arweave) | ✅ Completo |
| Pagamento | Tempo (USDC) — verificação on-chain via RPC | ✅ Backend integrado · frontend em finalização |
| Backend | Node.js + Hono + TypeScript | ✅ Deploy Railway |
| Frontend | Vue 3 + Vite + Cloudflare Pages | ✅ Deploy Cloudflare |

---

## Arquitetura

```
code/
├── programs/cartoriochain/   — Smart contract Anchor (Rust)
│   └── src/
│       ├── lib.rs            — Entry point: register_document, verify_document, revoke_document
│       ├── state.rs          — Struct DocumentRecord + cálculo de SPACE
│       └── instructions/     — Uma instrução por arquivo
├── circuits/document_proof/  — Circuito ZK (Noir)
│   └── src/main.nr           — Prova assinatura ECDSA secp256k1 + retorna Pedersen commitment
├── api/                      — Backend (Hono)
│   └── src/
│       ├── zk.ts             — Geração/verificação de ZK proofs (Noir JS + Barretenberg)
│       ├── viewkey.ts        — Cifra/decifra PII com X25519 (semântica ViewKey)
│       ├── irys.ts           — Upload de documentos para Irys/Arweave
│       ├── tempo.ts          — Verifica pagamento USDC na chain Tempo via JSON-RPC
│       ├── anchor-client.ts  — Interação com o programa Solana
│       └── routes/           — documents, proofs, viewkey
└── web/                      — Frontend Vue 3: Home, Registrar, Verificar, Serviços
```

---

## Fluxo de registro

1. Usuário seleciona arquivo — hash SHA-256 calculado no browser
2. Seleciona tipo de documento (combobox com 10 tipos)
3. API faz upload do arquivo para Irys — recebe txId
4. API registra no Solana: doc_hash, irys_tx_id, doc_type, cartorio_id, signer_commitment
5. PII do signatário cifrado com ViewKey antes do registro
6. Com pubKey + assinatura: ZK proof gerado, signer_commitment = Pedersen(pubKey)
7. Pagamento: tx USDC na chain Tempo verificada via RPC (destinatário + valor + anti-replay) antes de registrar
8. Frontend exibe o link de verificação pública

## Fluxo de verificação

1. Qualquer pessoa abre `/verificar/:id` (sem login) ou informa o código
2. API busca o registro na Solana pelo docId
3. Compara o hash do arquivo com o hash on-chain
4. Se há ZK proof: verifica com UltraHonk Barretenberg
5. Exibe: cartório, tipo, data, status (válido / revogado)

---

## Rodar e testar

```bash
# API (DEMO_MODE bypassa a blockchain para demo)
cd api && DEMO_MODE=true PORT=3001 npx ts-node src/index.ts

# Frontend
cd web && npx vite --port 5176

# Testes e2e — local ou prod via PLAYWRIGHT_BASE_URL
cd web && npx playwright test
PLAYWRIGHT_BASE_URL=https://cartoriochain.pages.dev npx playwright test
```

### Cobertura e2e (20 testes)

| Teste | Feature coberta |
|---|---|
| demo MCMV — carrega step 1 | Pré-carregamento via `?demo=mcmv`, arquivo mockado visível |
| step 1 — upload desabilitado sem arquivo | Botão Avançar bloqueado sem arquivo selecionado |
| step 1 → step 2 com demo | Navegação entre steps + campos pré-preenchidos |
| step 2 — avançar desabilitado sem campos | Validação do formulário de informações |
| step 2 → step 3 (PIX) | Dados do pagamento (taxa R$5,00, chave PIX) |
| step 3 — copiar chave PIX | Clipboard API — copia a chave e mostra "✓ Copiado" |
| step 3 — botão voltar | Navegação regressiva entre steps |
| step 3 — "Já paguei" — spinner | Transição para confirmação de pagamento |
| step 4 loading — progress bar | Tela de loading com etapas de autenticação visíveis |
| UX — sem texto blockchain | Regra crítica: Solana/USDC/wallet/ZCash 100% ocultos do usuário |
| privacidade avançada — toggle | Seção "Privacidade ativa" abre/fecha corretamente |
| step 2 — combobox com datalist | Tipo de documento é `<input list="doc-types">` com 10 opções |
| step 2 — campo cartório removido | Campo "Cartório ou instituição emissora" não visível |
| step 3 — chave PIX dinâmica | Formato `pix+[hash]@cartoriochain.com.br` por docIdSeed |
| home — comparativo de custo | "99,8%" e "R$2.400" visíveis na barra amarela |
| home — loop econômico | "Cada centavo é rastreável" + 5 nós visíveis |
| home — 3 perfis de usuário | Cidadão, Construtora/Escritório, Banco/Seguradora + CTAs |
| home — sem blockchain exposto | Hero não contém wallet/USDC |
| /servicos — breakdown de custos | Seção Transparência com registro on-chain e armazenamento |
| /servicos — 3 planos | Individual, Construtora (mais popular), Enterprise |

### Bugs achados e corrigidos pelos testes

| Bug | Arquivo | Fix |
|---|---|---|
| bs58 v6 ESM — `bs58.decode is not a function` em prod | `api/src/anchor-client.ts` | Resolver `decode` sob `.default` (interop ESM/CJS) — achado e corrigido ao vivo em produção |
| "ZCash · Solana" visível na navbar | `src/App.vue` | Trocado por "Autenticidade Digital" |
| Emoji ⬆ como ícone funcional de upload | `RegistrarStepDocumento.vue` | Substituído por SVG |
| Emoji 🔒 no botão de privacidade | `RegistrarStepInformacoes.vue` | Substituído por SVG |
| `.progress-fill` com `ease` em vez da curva correta | `style.css` | `cubic-bezier(0.32,0.72,0,1)` |
| `.spinner`/`.shimmer` sem `prefers-reduced-motion` | `style.css` | Adicionados ao bloco reduce |
| `.vk-toggle` sem focus ring visível | `style.css` | `outline: 2px solid #FFD23F` |

---

## Variáveis de ambiente (API)

```env
WALLET_KEY=<base58 privkey>
SOLANA_RPC=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
IRYS_URL=https://devnet.irys.xyz
TEMPO_NETWORK=testnet          # testnet (Moderato) | mainnet
CARTORIO_WALLET=<endereço evm>  # recebe os pagamentos USDC na Tempo
TEMPO_FEE_USDC=1.00
PORT=3001
DEMO_MODE=true
CORS_ORIGINS=http://localhost:5176
```

## Deploy do smart contract

```bash
# Requisitos: WSL + Rust 1.95+ + Solana CLI 4.3.0 + Anchor CLI 1.2.0
anchor build && anchor deploy --provider.cluster devnet
```

Smart contract devnet: `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW`
Authority: `ABvPhg87fRB6vsb17f14N8RD9KnXn4HK94dCDmTwQNXV`

Todas as dependências do frontend têm versão exata (sem `^`). Smart contract: `anchor-lang = "=1.2.0"`.

---

## Hackathon Colosseum — deadline 12/out/2026

| Trilha | Status |
|---|---|
| ZCash | ✅ ViewKey encryption de PII + ZK proof |
| Solana | ✅ Smart contract devnet |
| Brasil | ✅ Caso de uso Minha Casa Minha Vida (Amazonas) |
| Tempo | ✅ Verificação de pagamento USDC integrada no backend |
| Public Good | ✅ `/verificar/:id` pública, sem login, sem wallet |
| Universitária | ✅ Monografia Eng. Computação (UEA) — fundador técnico |
