#!/bin/bash
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"

echo "=== Verificando Rust ==="
rustc --version
cargo --version

echo "=== Instalando AVM (Anchor Version Manager) ==="
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force 2>&1

echo "=== Instalando Anchor 0.31.x via AVM ==="
avm install 0.31.0
avm use 0.31.0

echo "=== Versão Anchor ==="
anchor --version
