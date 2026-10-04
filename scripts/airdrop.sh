#!/bin/bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
PUBKEY="ABvPhg87fRB6vsb17f14N8RD9KnXn4HK94dCDmTwQNXV"

echo "=== Tentativa 1: api.devnet.solana.com ==="
solana airdrop 2 "$PUBKEY" --url https://api.devnet.solana.com 2>&1

sleep 4

echo "=== Tentativa 2: rpc.ankr.com ==="
solana airdrop 2 "$PUBKEY" --url https://rpc.ankr.com/solana_devnet 2>&1

sleep 4

echo "=== Balance ==="
solana balance "$PUBKEY" --url https://api.devnet.solana.com 2>&1
