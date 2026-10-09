# Zcash integration — attempt, effort & pivot decision

> Honest engineering record. We attempted a **real** Zcash on-chain integration for the Zcash track,
> hit **external testnet-infrastructure limits**, and decided to pivot the privacy feature to a
> Solana-native privacy layer (Cloak). This folder keeps the Zcash work reproducible so we can resume.

## Goal
Deliver "privacy without impunity" on the **real Zcash chain**: write the signer-data commitment into
the **encrypted memo** of a shielded transaction, and let an authorized auditor read it via a **viewing
key** — while the public sees only an opaque shielded tx. This is what the Zcash track requires
("integrate with the Zcash blockchain or asset").

## What existed before (the gap we found)
The previous "ZCash ViewKey" was **encryption inspired by** the ViewKey concept — `X25519 + AES-256-GCM`
(`api/src/viewkey.ts`) — computed locally. It never touched the Zcash chain or the ZEC asset, so it does
not qualify for the Zcash track. Tests never caught this because they run in `DEMO_MODE` (which fakes all
chains). See internal audit notes.

## What we built (effort)
- **`build-zingo.ps1`** — reproducible build of the `zingo-cli` light wallet from Rust source **inside
  Docker** (`rust:bookworm`), so it needs no local Rust/WSL. Output: a Linux binary.
- **Wallet + shielded address** — created a real testnet unified address (`utest1…`) via zingo-cli,
  pointed at the public lightwalletd `testnet.zec.rocks`.
- **`test-flow.ps1`** — end-to-end test harness: sync → export viewing key (`export_ufvk`) → send shielded
  tx with memo (`quicksend`) → read memo back (`messages`) → save txid as proof.
- **Faucet automation** — drove the testnet faucet via the chrome-devtools browser tool.

## What blocked it (external, not our code)
1. **Testnet funding is dry right now.** Valar faucet hit its daily payout cap (resets in hours); the Jino
   Labs faucet is **paused for the NU7 network upgrade** ("Zallet has no NU7 release yet"). Without TAZ we
   cannot broadcast the real shielded transaction that would make the integration count.
2. **NU7 upgrade risk.** Zcash testnet is mid-upgrade (NU7); wallet/lightwalletd compatibility is uncertain
   until we can actually sync and send.

## Decision — pivot the privacy feature to Cloak (Solana)
`Cloak` (`@cloak.dev/sdk`) is a **Solana-native** privacy stack: shielded UTXO + zk-SNARK + **viewing keys
with a compliance pathway** (an entity can open its history to an auditor without exposing others) — the
exact "judge audits, hacker can't" property, delivered through a **TypeScript SDK** that drops into our
Node backend. Advantages over the direct-Zcash path:
- Runs on **Solana** (our strongest, already-working track) — reinforces it, no new chain to integrate.
- **No faucet dependency** — Solana devnet SOL is instant.
- **Real & shippable now** — no testnet drought, no NU7 blocker.

The direct-Zcash attempt stays available (resume steps below) as a **bonus** for the Zcash track when the
faucet resets.

## How to resume the Zcash attempt
```powershell
# 1. Build the wallet (once)
powershell -File build-zingo.ps1
# 2. Fund the shielded address via a testnet faucet (when not capped)
#    faucet.testnet.valargroup.dev  /  zcashfaucet.jinolabs.xyz
# 3. Run the end-to-end test
powershell -File test-flow.ps1
```

Wallet data and the built binary live outside the repo (`../../../zcash-node/`) — never commit seeds/keys.
