# CartórioChain

**The notary no court can dispute.**

🇧🇷 [Versão em português](./README-pt-br.md)

In April 2024, in the state of Amazonas, a single forged power of attorney left a notary office and **R$ 10 million** vanished from a court account. It wasn't hacking — it was a sheet of paper signed in the wrong place, which no current system detected. This is documented in a public prosecutor investigation.

In Brazil, authenticating a property deed at a notary costs **R$ 2,400** and takes weeks. A Minha Casa Minha Vida (public housing) construction company handles up to **200 deeds per project** — R$ 480,000 in fees, and fraud still happens.

**CartórioChain authenticates any document in ~28 seconds for R$ 5**, generates an unforgeable cryptographic proof, and lets anyone verify it — no account, no wallet, no knowledge that a blockchain exists.

---

## How it works — what the user sees vs. what happens

The user never sees a blockchain. They see document type, notary and date. Underneath:

| What the user sees | What happens underneath |
|---|---|
| "Unique fingerprint of the file" | SHA-256 hash computed locally — the file never leaves the device |
| "Proof of authenticity" | ZK circuit in Noir — proves X signed this document without revealing who X is |
| "Protected data" | PII encrypted with X25519 + AES-256-GCM (ZCash ViewKey semantics) — only the holder decrypts |
| "Permanent record" | Solana (immutable timestamp) + Irys/Arweave (permanent storage) |
| "Public verification" | `/verificar/:id` — anyone verifies by URL, no login, no wallet |

**Privacy without impunity:** the holder controls who has access. A judge with the ViewKey can audit. A hacker without it gets nothing.

> **On-chain privacy — how we got here (honest build log).** What ships today is a *real* selective-disclosure layer: signer data encrypted with X25519 + HKDF + AES-256-GCM following **ZCash ViewKey semantics** — the holder (or an authorized auditor) decrypts; everyone else sees ciphertext. We then pursued a *native* on-chain integration and documented it honestly: we funded a real Zcash testnet light wallet, evaluated a full node (`zcashd`) and a light client (`zingo-cli`), and evaluated **Cloak** (Solana-native privacy). All three are blocked by external infrastructure (zingolib's fail-closed Nym mixnet needing a nakednet rebuild; Cloak pinned to a mainnet-only endpoint) — not by our code — and stay resumable. We do **not** claim a native shielded broadcast we didn't land. **Full technical study & decision →** [`docs/zcash-integration-pivot.md`](./docs/zcash-integration-pivot.md)

---

## Velocity — how we iterate

Built from scratch during the hackathon (first commit: October 2, 2026). Signals of team clock-cycle time:

- **20 end-to-end tests (Playwright)** passing — validated locally **and against production** (`cartoriochain.pages.dev`).
- **Deployed from the start** — frontend on Cloudflare Pages, API on Railway, smart contract on Solana devnet. Not localhost.
- **Bugs caught and fixed by the tests themselves** — the suite is a safety net, not decoration (see tables below).
- **Market validated against primary sources** — Amazonas housing data cross-checked with gov.br (23,000 MCMV homes contracted 2023–2025, R$ 3.1bn federal investment).

Founded by a Computer Engineering student (UEA) whose undergraduate thesis is on cryptographic authentication for public records in Brazil. CartórioChain is the production version of that research.

---

## Stack

| Layer | Technology | Status |
|---|---|---|
| Blockchain | Solana (Anchor 1.2.0) | ✅ Devnet — `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW` |
| Privacy | X25519 + AES-256-GCM with ZCash ViewKey semantics | ✅ Complete |
| ZK Proofs | Noir (nargo 1.0) + Barretenberg UltraHonk | ✅ Compiled circuit + working proof |
| Permanent storage | Irys (Arweave) | ✅ Complete |
| Payment | Tempo (USDC) — on-chain verification via RPC | ✅ Backend integrated · frontend being finalized |
| Backend | Node.js + Hono + TypeScript | ✅ Deployed on Railway |
| Frontend | Vue 3 + Vite + Cloudflare Pages | ✅ Deployed on Cloudflare |

---

## Architecture

```
code/
├── programs/cartoriochain/   — Anchor smart contract (Rust)
│   └── src/
│       ├── lib.rs            — Entry point: register_document, verify_document, revoke_document
│       ├── state.rs          — DocumentRecord struct + SPACE calculation
│       └── instructions/     — One instruction per file
├── circuits/document_proof/  — ZK circuit (Noir)
│   └── src/main.nr           — Proves ECDSA secp256k1 signature + returns Pedersen commitment
├── api/                      — Backend (Hono)
│   └── src/
│       ├── zk.ts             — ZK proof generation/verification (Noir JS + Barretenberg)
│       ├── viewkey.ts        — Encrypt/decrypt PII with X25519 (ViewKey semantics)
│       ├── irys.ts           — Upload documents to Irys/Arweave
│       ├── tempo.ts          — Verify USDC payment on the Tempo chain via JSON-RPC
│       ├── anchor-client.ts  — Interaction with the Solana program
│       └── routes/           — documents, proofs, viewkey
└── web/                      — Vue 3 frontend: Home, Registrar, Verificar, Serviços
```

---

## Registration flow

1. User selects a file — SHA-256 hash computed in the browser
2. User selects document type (combobox with 10 types)
3. API uploads the file to Irys — receives a txId
4. API registers on Solana: doc_hash, irys_tx_id, doc_type, cartorio_id, signer_commitment
5. Signer PII encrypted with ViewKey before registration
6. With pubKey + signature: ZK proof generated, signer_commitment = Pedersen(pubKey)
7. Payment: a USDC tx on the Tempo chain is verified via RPC (recipient + amount + anti-replay) before registering
8. Frontend shows the public verification link

## Verification flow

1. Anyone opens `/verificar/:id` (no login) or enters the code
2. API looks up the record on Solana by docId
3. Compares the provided file hash with the on-chain hash
4. If a ZK proof exists: verifies it with UltraHonk Barretenberg
5. Displays: notary, type, date, status (valid / revoked)

---

## Run & test

```bash
# API (DEMO_MODE bypasses the blockchain for demo)
cd api && DEMO_MODE=true PORT=3001 npx ts-node src/index.ts

# Frontend
cd web && npx vite --port 5176

# E2E tests — local or prod via PLAYWRIGHT_BASE_URL
cd web && npx playwright test
PLAYWRIGHT_BASE_URL=https://cartoriochain.pages.dev npx playwright test
```

### E2E coverage (20 tests)

| Test | Feature covered |
|---|---|
| demo MCMV — loads step 1 | Preload via `?demo=mcmv`, mocked file visible |
| step 1 — upload disabled without file | "Next" button blocked without a selected file |
| step 1 → step 2 with demo | Navigation between steps + prefilled fields |
| step 2 — next disabled without fields | Validation of the document info form |
| step 2 → step 3 (PIX) | Payment data shown (R$5.00 fee, PIX key) |
| step 3 — copy PIX key button | Clipboard API — copies the key and shows "✓ Copied" feedback |
| step 3 — back button | Backward navigation between steps |
| step 3 — "I paid" — spinner | Transition to payment confirmation |
| step 4 loading — progress bar | Loading screen with authentication steps visible |
| UX — no blockchain text | Critical rule: Solana/USDC/wallet/ZCash 100% hidden from the user |
| advanced privacy — toggle | "Privacy active" section opens/closes correctly |
| step 2 — combobox with datalist | Document type is `<input list="doc-types">` with 10 options |
| step 2 — notary field removed | "Notary or issuing institution" field not visible |
| step 3 — dynamic PIX key | Format `pix+[hash]@cartoriochain.com.br` from docIdSeed |
| home — cost comparison | "99.8%" and "R$2,400" visible in the yellow bar |
| home — economic loop | "Cada centavo é rastreável" + 5 nodes visible |
| home — 3 user profiles | Citizen, Construction/Law firm, Bank/Insurer + CTAs |
| home — no blockchain exposed | Hero contains no wallet/USDC |
| /servicos — cost breakdown | Transparency section with on-chain registration and storage |
| /servicos — 3 plans | Individual, Construction (most popular), Enterprise |

### Bugs caught and fixed by the tests

| Bug | File | Fix |
|---|---|---|
| bs58 v6 ESM — `bs58.decode is not a function` in prod | `api/src/anchor-client.ts` | Resolve `decode` under `.default` (ESM/CJS interop) — found and fixed live in production |
| "ZCash · Solana" visible in the navbar | `src/App.vue` | Replaced with "Autenticidade Digital" |
| ⬆ emoji as functional upload icon | `RegistrarStepDocumento.vue` | Replaced with SVG |
| 🔒 emoji on the privacy button | `RegistrarStepInformacoes.vue` | Replaced with SVG |
| `.progress-fill` with `ease` instead of the correct curve | `style.css` | `cubic-bezier(0.32,0.72,0,1)` |
| `.spinner`/`.shimmer` without `prefers-reduced-motion` | `style.css` | Added to the reduce block |
| `.vk-toggle` without a visible focus ring | `style.css` | `outline: 2px solid #FFD23F` |

---

## Environment variables (API)

```env
WALLET_KEY=<base58 privkey>
SOLANA_RPC=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
IRYS_URL=https://devnet.irys.xyz
TEMPO_NETWORK=testnet          # testnet (Moderato) | mainnet
CARTORIO_WALLET=<evm address>  # receives USDC payments on Tempo
TEMPO_FEE_USDC=1.00
PORT=3001
DEMO_MODE=true
CORS_ORIGINS=http://localhost:5176
```

## Smart contract deploy

```bash
# Requires: WSL + Rust 1.95+ + Solana CLI 4.3.0 + Anchor CLI 1.2.0
anchor build && anchor deploy --provider.cluster devnet
```

Devnet smart contract: `BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW`
Authority: `ABvPhg87fRB6vsb17f14N8RD9KnXn4HK94dCDmTwQNXV`

All frontend dependencies are pinned to exact versions (no `^`). Smart contract: `anchor-lang = "=1.2.0"`.

---

## Colosseum hackathon — deadline Oct 12, 2026

| Track | Status |
|---|---|
| ZCash | ✅ ViewKey encryption of PII + ZK proof |
| Solana | ✅ Smart contract on devnet |
| Brazil | ✅ Minha Casa Minha Vida use case (Amazonas) |
| Tempo | ✅ USDC payment verification integrated in the backend |
| Public Good | ✅ `/verificar/:id` public, no login, no wallet |
| University | ✅ Computer Engineering thesis (UEA) — technical founder |
