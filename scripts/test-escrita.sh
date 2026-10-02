#!/bin/bash
set -e

S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"
export PATH="$HOME/.cargo/bin:$S:$PATH"
PROJ="/mnt/c/Projetos/cartoriochain/code"

echo "=== 1. Build SBF ==="
cd "$PROJ"
cargo build-sbf 2>&1 | grep -E "(Finished|error\[|BUILD)"

echo "=== 2. Subindo validator ==="
"$S/solana-test-validator" --reset --quiet &
VPID=$!
sleep 6

echo "=== 3. Config + airdrop ==="
"$S/solana" config set --url localhost
"$S/solana" airdrop 10

echo "=== 4. Deploy ==="
"$S/solana" program deploy \
  "$PROJ/target/deploy/cartoriochain.so" \
  --program-id "$PROJ/target/deploy/cartoriochain-keypair.json"

echo "=== 5. Gerar IDL ==="
mkdir -p "$PROJ/target/idl"
# Ancora gera o IDL em target/idl durante o build — verificar
ls "$PROJ/target/idl/" 2>/dev/null || echo "IDL ainda nao gerado pelo build"

echo "=== 6. Instalar deps API ==="
cd "$PROJ/api"
npm install --silent 2>/dev/null || true

echo "=== 7. Subindo API ==="
SOLANA_RPC=http://localhost:8899 \
WALLET_PATH=/home/jonathandev/.config/solana/id.json \
PROGRAM_ID=BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW \
IRYS_URL=https://devnet.irys.xyz \
  node -r ts-node/register src/index.ts &
APIPID=$!
sleep 4

echo "=== 8. Teste POST /documents ==="
RESULT=$(curl -s -X POST http://localhost:3001/documents \
  -F "file=@$PROJ/web/src/views/home/HomeView.vue" \
  -F "docType=escritura-mcmv" \
  -F "cartorioId=CRIO-RJ-001" \
  -F "pubKeyX=aa00000000000000000000000000000000000000000000000000000000000000" \
  -F "pubKeyY=aa00000000000000000000000000000000000000000000000000000000000000" \
  -F "sigR=aa00000000000000000000000000000000000000000000000000000000000000" \
  -F "sigS=aa00000000000000000000000000000000000000000000000000000000000000")

echo "RESULTADO:"
echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"

kill $APIPID 2>/dev/null || true
kill $VPID 2>/dev/null || true
echo "=== FIM ==="
