#!/bin/bash
# Sobe o validator e faz airdrop. Mantém rodando em foreground.
S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"
export PATH="$HOME/.cargo/bin:$S:$PATH"

PROJ="/mnt/c/Projetos/cartoriochain/code"

"$S/solana-test-validator" --reset --quiet &
VPID=$!
sleep 6

"$S/solana" config set --url localhost
"$S/solana" airdrop 10

echo "=== Deploy do programa ==="
"$S/solana" program deploy \
  "$PROJ/target/deploy/cartoriochain.so" \
  --program-id "$PROJ/target/deploy/cartoriochain-keypair.json" 2>&1

echo "VALIDATOR_PRONTO validator_pid=$VPID"

# Manter vivo
wait $VPID
