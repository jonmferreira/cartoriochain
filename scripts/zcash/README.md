# Zcash integration — attempt, effort & pivot decision

> Honest engineering record. We attempted a **real** Zcash on-chain integration for the Zcash track and
> hit **external infrastructure limits** (zingolib's fail-closed Nym mixnet). For submission we ship the
> real ViewKey-*semantics* selective-disclosure layer (`api/src/viewkey.ts`), labeled precisely, and keep
> this native path fully reproducible so we can resume it. Decision record: `../../docs/zcash-integration-pivot.md`.

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
1. **Funding fluctuates — it is NOT a dead end.** Faucet daily caps reset in windows, so a "dry" reading is
   point-in-time. Re-checking minutes later works: we obtained 0.125 TAZ from the Valar faucet
   (tx `c45b65dfde3f4d2f1cfb1b3601f1eb7568f7d56cd9bacfd5753ed3254cb3ed65`). **Lesson: always re-poll the
   faucet site before concluding it's unavailable.**
2. **The real blocker — zingolib's fail-closed Nym mixnet.** Current zingolib ships the Nym mixnet
   transport as a **default feature** (`default = ["nym"]`, ADR 0024/0026). Any *online* session demands a
   `nym-proxy` binary (not bundled) and **fails closed with no runtime bypass** — so the funded wallet
   can't sync/send as built. The documented fix is to recompile **`--no-default-features`** (nakednet).
   That rebuild is correct but did not fit the submission window (OOM on first pass, then the deadline).

## Decision — ship the honest ViewKey-semantics layer; keep this native path resumable
For submission we ship the **real, working** selective-disclosure layer (`api/src/viewkey.ts`, X25519 +
HKDF + AES-256-GCM, Zcash ViewKey *semantics*) and label it precisely — never as a native shielded
broadcast. The native attempt here stays reproducible and is a short step from done: just the nakednet
rebuild + a sync. We also evaluated **Cloak** (Solana-native privacy) — blocked on a mainnet-only endpoint
pin; see `../../docs/cloak-integration-status.md`.

## How to resume the native Zcash attempt
```powershell
# 1. Build the wallet WITHOUT the Nym mixnet feature (nakednet) — this is the fix for the blocker:
#    docker exec zingo-build sh -c "cd /zingolib && cargo build --release -p zingo-cli --no-default-features -j 2"
#    (or re-run build-zingo.ps1 after adding --no-default-features to its cargo invocation)
# 2. Fund the shielded address via a testnet faucet (re-poll if it reports a cap):
#    faucet.testnet.valargroup.dev  /  zcashfaucet.jinolabs.xyz
# 3. Run the end-to-end test
powershell -File test-flow.ps1
```

Wallet data and the built binary live outside the repo (`../../../zcash-node/`) — never commit seeds/keys.
