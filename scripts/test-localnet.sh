#!/bin/bash
# Teste de escrita end-to-end em localnet
set -e

S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"
export PATH="$HOME/.cargo/bin:$S:$PATH"

PROJ="/mnt/c/Projetos/cartoriochain/code"

echo "=== 1. Iniciando solana-test-validator ==="
"$S/solana-test-validator" --reset --quiet &
VALIDATOR_PID=$!
sleep 5

echo "=== 2. Configurando localnet ==="
"$S/solana" config set --url localhost
"$S/solana" airdrop 10

echo "=== 3. Deployando programa ==="
"$S/solana" program deploy \
  "$PROJ/target/deploy/cartoriochain.so" \
  --program-id "$PROJ/target/deploy/cartoriochain-keypair.json" \
  2>&1

echo "=== 4. Gerando IDL via anchor ==="
# O IDL já está em target/idl/ após o build

echo "PROGRAM_ID=FCcAWkW3dM92TDAJ3SntW7ZqnrzYiJZP6UsREQy3UCUc"
echo "Deploy OK"

# Não matar o validator — API precisa dele
echo "Validator rodando PID=$VALIDATOR_PID (mata com: kill $VALIDATOR_PID)"
