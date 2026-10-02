#!/bin/bash
S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"

"$S/solana" config set --url devnet

if [ ! -f /home/jonathandev/.config/solana/id.json ]; then
  "$S/solana-keygen" new --no-bip39-passphrase --outfile /home/jonathandev/.config/solana/id.json
fi

WALLET=$("$S/solana" address)
echo "WALLET=$WALLET"

BALANCE=$("$S/solana" balance)
echo "BALANCE=$BALANCE"

# Airdrop se balance < 1 SOL
if echo "$BALANCE" | grep -q "^0"; then
  echo "Fazendo airdrop..."
  "$S/solana" airdrop 2
fi

echo "BALANCE_FINAL=$("$S/solana" balance)"
