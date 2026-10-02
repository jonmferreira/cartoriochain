#!/bin/bash
S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"

echo "=== Keypair em target/deploy ==="
"$S/solana-keygen" pubkey /mnt/c/Projetos/cartoriochain/code/target/deploy/cartoriochain-keypair.json

echo "=== Keypair em /tmp ==="
"$S/solana-keygen" pubkey /tmp/cartoriochain-program-keypair.json 2>/dev/null || echo "nao encontrado em /tmp"
