#!/usr/bin/env bash
set -e
# Usa Solana 4.3.0 + platform-tools v1.57 (Cargo 1.85+)
STABLE_DIR=$(ls ~/.local/share/solana/install/releases/ | grep '^stable-')
ln -sfn ~/.local/share/solana/install/releases/$STABLE_DIR/solana-release \
         ~/.local/share/solana/install/active_release 2>/dev/null || true
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"
. "$HOME/.cargo/env"

cd /mnt/c/Projetos/cartoriochain/code

echo "Solana: $(solana --version)"
echo "==> cargo build-sbf..."
cargo build-sbf 2>&1
echo "BUILD_OK"
