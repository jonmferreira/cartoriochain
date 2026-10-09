# Cloak integration — status & external dependency

Privacy pivot target (see [`zcash-integration-pivot.md`](./zcash-integration-pivot.md)). This records
exactly where the Cloak integration stands and the one external dependency that gates finishing it.

## Confirmed & ready
- **SDK installed:** `@cloak.dev/sdk@0.2.5` in `api/` (TypeScript, Node-friendly, server-keypair path).
- **API surface mapped** (from the SDK type definitions) — it delivers our full "selective disclosure" story:
  - `registerViewingKey(relayUrl, pubkey, nk, signer)` — register the **viewing key**.
  - `transact(...)` — shielded deposit / private send on Solana (UTXO + zk).
  - `encryptTransactionMetadataBundle(metadata, viewingKeyPrivate, pubkey)` — encrypt tx **metadata**; this
    is where the **document commitment** rides, bound to the shielded tx.
  - `scanTransactions({ viewingKeyNk })` + `toComplianceReport()` — an authorized auditor reads the
    encrypted metadata with the viewing key = **selective disclosure** ("a judge audits, a hacker can't").

## Planned integration flow (to build behind a flag)
1. Generate a UTXO keypair → derive `nk` (viewing key).
2. `registerViewingKey(...)` once per cartório/account.
3. On document registration: `transact(...)` a shielded tx that carries the **document commitment** as
   encrypted metadata (`encryptTransactionMetadataBundle`).
4. Verification/audit path: `scanTransactions({ viewingKeyNk })` → the auditor decrypts and reads it.
5. Save the resulting **txid** (Solana explorer) as proof of a real on-chain private integration.

## ⛔ External dependency (the gate)
The **published SDK is pinned to the mainnet relay** (`https://api.cloak.ag`, program
`zh1eLd6rSphLejbFfJEneUwzHRfMKxgzrgkfwA6qRkW`). Cloak's docs state that a non-production target requires
coordination: *"If you need a non-production target for an integration rehearsal, talk to us rather than
working around the pin."*

**So a free devnet/testnet integration needs the Cloak team to provide the non-production relay/config**
(and confirm the program deployment on that cluster). Reaching out via the hackathon organizers (Lucas)
and the Cloak team (Victor, Matheus — `matheus@cloak.ag`). **Devnet or testnet both work for us.**

## Options while the endpoint is pending
1. **Cloak devnet/testnet** — free; **pending the Cloak team's endpoint** (preferred).
2. **Cloak mainnet** — works now with no dependency; costs ~cents of USDC/SOL; strongest proof (real
   mainnet tx).
3. **Zcash testnet** — free but faucet-dependent (dry now) + NU7 upgrade risk. Documented & resumable.

## Resume checklist
- [ ] Obtain the Cloak **devnet/testnet relay URL + program ID** (from the Cloak team) — or decide mainnet.
- [ ] Build `api/src/cloak.ts` with the flow above, behind a `CLOAK_ENABLED` flag.
- [ ] Fund the server keypair (devnet airdrop, or a few cents on mainnet).
- [ ] Run one real shielded registration + an auditor scan; capture the **txid** as proof.
