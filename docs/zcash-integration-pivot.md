# Privacy integration — Zcash attempt → Cloak pivot (decision record)

A short, honest build log of how we approached on-chain privacy for CartórioChain, the two
integration paths we evaluated, and why we pivoted. We keep it because the decision is part of the work.

**Full technical deep-dive** (shielded tx, viewing keys, encrypted memos, selective-disclosure flow):
[`zcash-privacy-concepts.md`](./zcash-privacy-concepts.md).

---

## 0. What ships today (the honest answer)

The privacy feature **that is live in the product** is a real selective-disclosure layer:
signer PII is encrypted with **X25519 + HKDF-SHA256 + AES-256-GCM** following **Zcash ViewKey
semantics** — the data holder (or an authorized auditor) decrypts with the key; everyone else sees
ciphertext. This is working cryptography (`api/src/viewkey.ts`), not a mock and not "inspired-by" hand-waving.

What it is **not**: a transaction on the native Zcash chain. We pursued that and document the full
attempt below, honestly, because the attempt is part of the work and the path is resumable. We do **not**
claim a native shielded broadcast we did not land.

## 1. How far we got toward native on-chain

Target: write a document's signer-data commitment into the **encrypted memo** of a shielded Zcash
transaction, readable by an authorized auditor via a **viewing key**, opaque to everyone else.

Reached:
- Built a real Zcash light wallet (`zingo-cli` / zingolib) from source, **reproducibly, inside Docker**
  (no local Rust/WSL needed).
- Created a real testnet **shielded unified address** and pointed the wallet at the public `lightwalletd`
  (`testnet.zec.rocks`).
- **Funded the wallet** — obtained 0.125 TAZ from the Valar faucet
  (tx `c45b65dfde3f4d2f1cfb1b3601f1eb7568f7d56cd9bacfd5753ed3254cb3ed65`).
- Wrote the full end-to-end harness (sync → export viewing key → send shielded tx with memo → read memo
  back → capture txid as proof). See `scripts/zcash/`.

Not reached: broadcasting the actual shielded transaction — blocked by the wallet-sync layer (below).

## 2. The paths we evaluated

**Path A — full node (`zcashd` via Docker).**
Ran a testnet `zcashd`. Blocked by: a multi-hour full-chain sync (testnet is ~4.48M blocks, no official
fast-sync) **and** an interactive wallet-backup step (`zcashd-wallet-tool`) awkward to automate. The node
also can't send until fully synced. Too slow for the deadline.

**Path B — light client (`zingo-cli`).**
Built it and got a funded wallet + address in minutes (no full sync), and — contrary to an earlier
reading — **funding turned out to be available**: faucet availability *fluctuates* (daily caps reset in
windows), so "dry" was a point-in-time snapshot, not a dead end. Re-checking the site minutes later is
worth doing. The real blocker surfaced next: current zingolib ships the **Nym mixnet transport as a
default, fail-closed feature** (`default = ["nym"]`, ADR 0024/0026). Any *online* session demands a
`nym-proxy` binary we don't have, with **no runtime bypass**. The documented fix is to recompile
`--no-default-features` (nakednet). That rebuild is correct but did not fit the submission window
(an OOM on the first pass, then the deadline). Steps to resume are in `scripts/zcash/README.md`.

**Path C — Cloak (Solana-native privacy).**
Evaluated `@cloak.dev/sdk` (shielded UTXO + zk-SNARK + viewing keys with a compliance pathway). Blocked
externally: the published SDK is **pinned to the mainnet relay/program** — there is no free devnet/testnet
target without the Cloak team provisioning a non-production endpoint (outreach pending). Mainnet works but
costs real USDC/SOL. Kept as a resumable option; details in [`cloak-integration-status.md`](./cloak-integration-status.md).

All three native paths are blocked by **external infrastructure**, not by our code.

## 3. Decision — ship the honest ViewKey-semantics layer, keep native documented & resumable

For submission we ship the **real, working** privacy layer (§0) and label it precisely as ViewKey
*semantics*, never as a native Zcash broadcast. This still speaks to the Zcash track — the guarantee is
the Zcash selective-disclosure model ("a judge audits, a hacker can't") — without overstating what runs
on-chain.

The native paths (A/B/C) stay fully documented and resumable: Path B needs only the nakednet rebuild +
a sync; Path C needs only a non-production endpoint from the Cloak team. Either lands a real on-chain
proof post-deadline and upgrades the narrative from *semantics* to *native*.
