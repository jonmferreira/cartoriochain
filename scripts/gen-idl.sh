#!/bin/bash
S="/home/jonathandev/.local/share/solana/install/releases/stable-44b42d45ec7e555b26ca15ad924a7432d18aaa9f/solana-release/bin"
. "/home/jonathandev/.cargo/env"
export PATH="$HOME/.cargo/bin:$S:$PATH"

cd /mnt/c/Projetos/cartoriochain/code
anchor build 2>&1 | grep -E "(Finished|error|IDL|idl|writing)"
echo "IDL gerado:"
ls target/idl/ 2>/dev/null || echo "pasta idl nao existe"
cat target/idl/cartoriochain.json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print('name:', d['name']); print('instructions:', [i['name'] for i in d['instructions']])"
