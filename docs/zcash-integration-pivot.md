# Privacy integration — Zcash attempt → Cloak pivot (decision record)

A short, honest build log of how we approached on-chain privacy for CartórioChain, the two
integration paths we evaluated, and why we pivoted. We keep it because the decision is part of the work.

**Full technical deep-dive** (shielded tx, viewing keys, encrypted memos, selective-disclosure flow):
[`zcash-privacy-concepts.md`](./zcash-privacy-concepts.md).

---

## 1. How far we got

Target: real on-chain selective disclosure — write a document's signer-data commitment into the
**encrypted memo** of a shielded transaction, readable by an authorized auditor via a **viewing key**,
opaque to everyone else.

Reached:
- Built a real Zcash light wallet (`zingo-cli`) from source, **reproducibly, inside Docker** (no local
  Rust/WSL needed).
- Created a real testnet **shielded unified address** and pointed the wallet at the public `lightwalletd`
  (`testnet.zec.rocks`).
- Wrote the full end-to-end test harness (sync → export viewing key → send shielded tx with memo → read
  memo back → capture txid as proof). See `scripts/zcash/`.

Not reached: broadcasting the actual shielded transaction — blocked externally (below).

## 2. The two paths we evaluated

**Path A — full node (`zcashd` via Docker).**
Ran a testnet `zcashd`. Blocked by: a multi-hour full-chain sync (testnet is ~4.48M blocks, no official
fast-sync) **and** an interactive wallet-backup step (`zcashd-wallet-tool`) that is awkward to automate.
The node also can't send until fully synced. Too slow for the deadline.

**Path B — light client (`zingo-cli`).**
Built it and got a funded-ready wallet + address in minutes (no full sync). Blocked by: **testnet funding
is dry** — the Valar faucet hit its daily payout cap and the Jino Labs faucet is **paused for the NU7
network upgrade** ("Zallet has no NU7 release yet"). Without TAZ we cannot broadcast the transaction that
would make the integration count, and NU7 adds a wallet-compatibility risk.

Both paths are **blocked by external testnet infrastructure**, not by our code. Path B is kept ready to
resume the moment a faucet resets (steps in `scripts/zcash/README.md`).

## 3. Decision — pivot the privacy feature to Cloak (Solana)

We deliver the same property through **Cloak** (`@cloak.dev/sdk`), a Solana-native privacy stack:
shielded UTXO + zk-SNARK + **viewing keys with a compliance pathway** (an entity opens its own history to
an auditor without exposing anyone else in the pool) — exactly "a judge can audit, an attacker cannot."

Why Cloak is the right call:
- **Same guarantee, shippable now** — real privacy, not encryption "inspired by" a concept.
- **On Solana** — our strongest, already-working integration; this reinforces the Solana track instead of
  depending on a second chain.
- **TypeScript SDK** — drops into our Node backend; no circuits/Merkle trees/prover infra to run.
- **No faucet dependency** — Solana devnet funding is instant, so progress isn't hostage to a dry testnet.

The direct Zcash path remains documented and resumable as a bonus toward the Zcash track once testnet
funding is available again.

> Note: "Cloak" is not a separate track — it is a Solana protocol, so a Cloak integration counts toward
> the **Solana** track. The privacy narrative stays intact either way.
