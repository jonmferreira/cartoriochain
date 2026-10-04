#!/usr/bin/env bash
# Deploy CartorioChain smart contract to Solana devnet
# Requires (WSL): Rust + Solana CLI + Anchor CLI 0.31.0
# Setup (once, inside WSL):
#   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
#   sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
#   cargo install --git https://github.com/coral-xyz/anchor --tag v0.31.0 anchor-cli

set -euo pipefail
PROGRAM_ID="BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW"
CODE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "=== CartorioChain devnet deploy ==="
solana config set --url devnet
BALANCE=$(solana balance --url devnet | awk '{print $1}')
if (( $(echo "$BALANCE < 2" | bc -l) )); then
  echo "Airdrop (se falhar: https://faucet.solana.com)..."
  solana airdrop 2 --url devnet || true
fi
cd "$CODE_DIR"
anchor build
BUILT_ID=$(solana address -k target/deploy/cartoriochain-keypair.json)
if [ "$BUILT_ID" != "$PROGRAM_ID" ]; then
  echo "ERRO: Program ID mismatch: $BUILT_ID != $PROGRAM_ID"
  exit 1
fi
anchor deploy --provider.cluster devnet
echo "Deploy OK: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
