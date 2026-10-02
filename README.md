# CartórioChain

Cartório digital descentralizado para o mercado brasileiro.  
Hackathon: Colosseum Crypto World's Fair — deadline 12/out/2026  
Trilhas: **ZCash** ($10k) · **Brasil** ($5k) · **Consumer**

---

## Stack

| Camada | Tecnologia |
|---|---|
| Smart Contract | Solana Anchor (Rust) |
| Armazenamento | Irys (Arweave) — permanente |
| Privacidade | ZCash ViewKey — dados do signatário |
| ZK Proofs | Noir (Aztec) |
| Backend | TypeScript |
| Frontend | Next.js |

---

## Estrutura

```
code/
├── programs/cartoriochain/   — Anchor program (Rust)
│   └── src/
│       ├── lib.rs            — entry point, declare_id!, #[program]
│       ├── state.rs          — DocumentRecord account
│       ├── error.rs          — CartorioError
│       └── instructions/     — register / verify / revoke
├── circuits/                 — ZK circuits Noir (v0.3)
├── app/                      — Next.js frontend (v0.4)
├── api/                      — Backend TypeScript (v0.4)
├── tests/                    — Anchor TS tests
└── scripts/                  — deploy-devnet.sh
```

---

## Setup rápido

```bash
# Pré-requisitos: Rust, Solana CLI, Anchor CLI, Node 18+
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Instalar dependências JS
yarn install

# Build do programa
anchor build

# Testes locais (localnet)
anchor test

# Deploy devnet
bash scripts/deploy-devnet.sh
```

---

## Instruções on-chain

| Instrução | Descrição |
|---|---|
| `register_document(doc_id, doc_hash, irys_tx_id, doc_type, cartorio_id)` | Registra documento — PDA `["document", doc_id]` |
| `verify_document(doc_id, doc_hash)` | Verifica integridade — falha se revogado ou hash incorreto |
| `revoke_document(doc_id, reason)` | Revoga — apenas authority original, registro permanece |

---

## Roadmap versões

| Versão | Data | Entrega |
|---|---|---|
| v0.1 | 03/out | Anchor program + testes (este commit) |
| v0.2 | 05/out | Irys integration + anchor test completo |
| v0.3 | 07/out | ZK circuit Noir (SHA-256 doc hash) + ZCash ViewKey |
| v0.4 | 09/out | Backend TS + Next.js (assinar → verificar link público) |
| v0.5 | 11/out | Demo polish + caso MCMV |
| v1.0 | 12/out | Submissão Colosseum |
