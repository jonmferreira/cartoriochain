#!/usr/bin/env bash
set -e

echo "==> Gerando novo keypair do programa..."
anchor keys generate --program-name cartoriochain

echo "==> Build..."
anchor build

echo "==> Deploy devnet..."
anchor deploy --provider.cluster devnet

echo "==> Program ID atual:"
anchor keys list
