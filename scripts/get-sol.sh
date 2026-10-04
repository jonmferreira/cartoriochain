#!/bin/bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
PUBKEY="ABvPhg87fRB6vsb17f14N8RD9KnXn4HK94dCDmTwQNXV"
RPC="https://api.devnet.solana.com"

get_balance() {
  curl -s "$RPC" -X POST -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"getBalance\",\"params\":[\"$PUBKEY\"]}" \
    | grep -o '"value":[0-9]*' | grep -o '[0-9]*'
}

request_airdrop() {
  # 1 SOL = 1000000000 lamports
  curl -s "$RPC" -X POST -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"requestAirdrop\",\"params\":[\"$PUBKEY\",1000000000]}"
}

echo "Balance atual: $(get_balance) lamports"
echo ""

for i in 1 2 3; do
  echo "=== Tentativa $i ==="
  RESULT=$(request_airdrop)
  echo "$RESULT"
  sleep 8
done

echo ""
echo "Balance final: $(get_balance) lamports"
