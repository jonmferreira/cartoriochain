# Build reproduzível do zingo-cli (light wallet Zcash) via Docker.
# Não depende de Rust/WSL local — roda o build dentro da imagem rust:bookworm.
# Saída: binário Linux em ..\..\..\zcash-node\zingo-build\zingo-cli (fora do repo).
#
# Uso:  powershell -File build-zingo.ps1

$out = "C:\Projetos\cartoriochain\zcash-node\zingo-build"
New-Item -ItemType Directory -Force $out | Out-Null

docker rm -f zingo-build 2>$null | Out-Null
docker run --name zingo-build -v "${out}:/out" rust:bookworm bash -c @"
set -e
apt-get update -qq && apt-get install -y -qq protobuf-compiler pkg-config libssl-dev git >/dev/null 2>&1
git clone --depth 1 https://github.com/zingolabs/zingolib /zingolib
cd /zingolib
cargo build --release --package zingo-cli
cp target/release/zingo-cli /out/
echo DONE
"@

Write-Host "Binario em: $out\zingo-cli"
