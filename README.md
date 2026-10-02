# CartórioChain

Cartório digital descentralizado para o mercado brasileiro.

Registre e verifique documentos com prova criptográfica de autenticidade. Dados do signatário protegidos por ZCash ViewKey — LGPD nativa. Armazenamento permanente via Irys.

**Hackathon:** Colosseum Crypto World's Fair · deadline 12/out/2026  
**Trilhas:** ZCash ($10k) · Brasil ($5k) · Consumer

---

## O problema

No Brasil, registrar um imóvel custa até R$15.000 e leva semanas. Documentos se perdem. Laudos são falsificados. O beneficiário do **Minha Casa Minha Vida** não tem como verificar nada sem contratar um advogado.

Custo CartórioChain: **$0,001 por ato** vs R$300 por registro notarial.

---

## Arquitetura

```
Usuário
  │  assina documento
  ▼
API (Express · porta 3001)
  ├─► Irys (Arweave)        ← armazena arquivo permanentemente
  │     └─ retorna irys_tx_id
  ├─► ZK Circuit (Noir)     ← prova: hash confere + assinatura válida
  │     └─ retorna signer_commitment (Pedersen commitment)
  └─► Solana (Anchor)       ← registra DocumentRecord PDA on-chain
        └─ retorna tx + PDA

Verificador (qualquer pessoa, sem wallet)
  └─► GET /documents/:id   ← lê PDA on-chain, retorna status + metadados
```

**DocumentRecord PDA** — `seeds = [b"document", doc_id]`:

| Campo | Tipo | Descrição |
|---|---|---|
| `doc_hash` | `[u8; 32]` | SHA-256 do arquivo |
| `irys_tx_id` | `String` | ID permanente no Arweave |
| `doc_type` | `String` | escritura, contrato, laudo... |
| `cartorio_id` | `String` | identificação do cartório emissor |
| `authority` | `Pubkey` | signatário Solana |
| `registered_at` | `i64` | timestamp Unix |
| `revoked` | `bool` | imutabilidade preservada mesmo após revogação |
| `revoke_reason` | `String` | motivo da revogação |
| `viewkey_payload` | `String` | dados do signatário cifrados com ZCash ViewKey (LGPD) |
| `signer_commitment` | `String` | Pedersen commitment do pubkey — anchor point do ZK proof |

---

## Stack

| Camada | Tecnologia |
|---|---|
| Smart contract | Solana · Anchor 0.31 · Rust |
| ZK Proofs | Noir (Aztec) — SHA-256 + ECDSA secp256k1 + Pedersen |
| Privacidade | ZCash ViewKey — dados do signatário cifrados on-chain |
| Armazenamento permanente | Irys (Arweave) |
| API | Express · TypeScript · Helmet · rate limiting |
| Frontend | Vue 3 · Vite · PrimeVue · Tailwind CSS 4 |
| Build Solana | cargo build-sbf · platform-tools v1.57 |

---

## ZCash ViewKey — trilha $10k

O campo `viewkey_payload` armazena os dados pessoais do signatário (nome, CPF, endereço) **cifrados** com uma ZCash ViewKey:

- **On-chain:** somente texto cifrado — nenhum dado pessoal exposto (LGPD)
- **Cartório autorizado:** descriptografa com a chave de visualização para auditoria
- **ZK proof:** o `signer_commitment` (Pedersen commitment do pubkey) prova matematicamente que o signatário possui a chave privada correspondente, **sem revelar identidade**

ZK proof + ViewKey = privacidade nativa + conformidade LGPD em contrato único.

---

## Estrutura do repositório

```
code/
├── programs/cartoriochain/     Anchor smart contract (Rust)
│   └── src/
│       ├── lib.rs              3 instruções: register / verify / revoke
│       ├── state.rs            DocumentRecord + SPACE (constantes nomeadas)
│       ├── error.rs            CartorioError enum
│       └── instructions/       register · verify · revoke
├── circuits/document_proof/    Circuito ZK em Noir
│   └── src/main.nr             SHA-256 + ECDSA secp256k1 + Pedersen commitment
├── api/src/                    API Express (TypeScript)
│   ├── index.ts                Helmet · CORS whitelist · rate limiting
│   ├── anchor-client.ts        SDK Anchor 0.31
│   ├── irys.ts                 upload permanente + SHA-256
│   ├── zk.ts                   nargo prove / verify
│   └── routes/
│       ├── documents.ts        POST / GET / verify / DELETE
│       └── proofs.ts           generate · verify
├── web/src/                    Frontend Vue 3
│   ├── views/home/             Landing page — MCMV + casos de uso
│   ├── views/registrar/        Registrar documento (View + integrations + types)
│   └── views/verificar/        Verificar autenticidade — público, sem wallet
├── target/idl/                 IDL Anchor 0.31
└── scripts/                    build-sbf · start-validator · test-escrita
```

---

## Rodando localmente

**Pré-requisitos:** Rust 1.85+, Solana CLI 4.3.0, Node.js 18+, Nargo (Noir)

```bash
# Instalar Nargo
curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash

# 1. Build do smart contract (WSL/Linux)
bash scripts/build-sbf.sh

# 2. Localnet — validator + deploy (Terminal 1)
bash scripts/start-validator.sh

# 3. API (Terminal 2)
cd api && npm install
SOLANA_RPC=http://localhost:8899 \
WALLET_PATH=~/.config/solana/id.json \
PROGRAM_ID=BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW \
PORT=3001 \
npm run dev

# 4. Frontend (Terminal 3)
cd web && npm install
npm run dev   # → http://localhost:5176
```

**Demo MCMV:** `http://localhost:5176/registrar?demo=mcmv`  
Dados de escritura habitacional pré-preenchidos — clique Registrar para ver o fluxo completo.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Status + rede |
| `POST` | `/documents` | Registrar (upload + Irys + Solana) |
| `GET` | `/documents/:id` | Buscar registro on-chain |
| `POST` | `/documents/:id/verify` | Verificar hash |
| `DELETE` | `/documents/:id` | Revogar (somente authority) |
| `POST` | `/proofs/generate` | Gerar ZK proof |
| `POST` | `/proofs/verify` | Verificar ZK proof |

Rate limiting: 10 req/min em escritas · 60 req/min em leituras.

---

## Program ID

| Rede | Program ID |
|---|---|
| Localnet | `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW` |
| Devnet | a deployar |

---

## Casos de uso B2B

| Setor | Uso |
|---|---|
| Minha Casa Minha Vida | Escrituras e contratos de financiamento verificáveis pelo beneficiário |
| Escritórios jurídicos | Contratos com prova criptográfica de autoria |
| Construtoras | Laudos técnicos e habite-se contra falsificação |
| Seguradoras e bancos | Apólices e garantias com rastreabilidade imutável |

**Gap competitivo:** nenhum produto combina ZK privacy (LGPD) + Solana + Irys permanente + caso de uso cartório brasileiro.

---

## Segurança (OWASP)

- Dados pessoais nunca expostos on-chain (ZCash ViewKey)
- ZK proof prova autenticidade sem revelar identidade
- Imutabilidade: documentos revogados permanecem no ledger
- CORS restrito por origem · Helmet · rate limiting · validação hex64 em inputs ZK
- Path traversal em `/proofs/verify` mitigado — path interno sempre usado

---

## Licença

MIT
