#!/bin/bash
S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"
export PATH="$HOME/.cargo/bin:$S:$PATH"

cd /mnt/c/Projetos/cartoriochain/code
mkdir -p target/idl

echo "Tentando anchor idl build..."
anchor idl build -o target/idl/cartoriochain.json 2>&1 | head -20
echo "---"
ls target/idl/ 2>/dev/null
