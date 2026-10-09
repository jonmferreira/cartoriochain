# Fluxo de teste da integração REAL do Zcash (light client zingo-cli via Docker).
# Pré-requisito: wallet financiada com TAZ (faucet). Rodar APÓS o faucet pagar.
#
# Prova o fluxo de "disclosure seletivo": grava um commitment de documento no MEMO CIFRADO
# de uma transação shielded real na testnet, exporta a viewing key, e lê o memo de volta.
#
# Uso:  powershell -File test-flow.ps1 [-DocHash <sha256hex>]
param(
  [string]$DocHash = "a4b8c2d1e9f347a1bc3d82f1e6c5d9a2b7f3e8d4c1a9b5f2e7d3c6a8b4f1e9c0"
)

$BUILD  = "C:\Projetos\cartoriochain\zcash-node\zingo-build"
$WALLET = "C:\Projetos\cartoriochain\zcash-node\wallet"
$SERVER = "https://testnet.zec.rocks:443"

function Zingo {
  param([string[]]$ZArgs, [switch]$Online)
  $base = @("run","--rm","-v","${BUILD}:/z","-v","${WALLET}:/wallet","debian:bookworm",
            "/z/zingo-cli","--chain","testnet","--server",$SERVER,"--data-dir","/wallet")
  docker @base @ZArgs 2>&1
}

Write-Host "`n=== 1. Sync + saldo (confirma TAZ recebido) ===" -ForegroundColor Cyan
Zingo @("--waitsync","balance")

Write-Host "`n=== 2. Viewing key (UFVK) — para o auditor/juiz ===" -ForegroundColor Cyan
Zingo @("export_ufvk")

Write-Host "`n=== 3. Endereco destino (para carregar o memo) ===" -ForegroundColor Cyan
Zingo @("new_address")
Write-Host "  -> copie o endereco acima para `$dest e rode o passo 4" -ForegroundColor Yellow

Write-Host "`n=== 4. Enviar tx shielded com MEMO (commitment do documento) ===" -ForegroundColor Cyan
$memo = "CartorioChain|doc=$DocHash|v1"
Write-Host "  memo: $memo"
Write-Host "  Comando (ajustar <dest> e verificar sintaxe de quicksend):"
Write-Host "  zingo-cli quicksend <dest_utest...> 10000 `"$memo`"" -ForegroundColor Yellow
Write-Host "  (10000 zats = 0.0001 TAZ; quicksend funde send+confirm)"
# Descomentar quando tiver o $dest:
# Zingo @("quicksend","<dest_utest...>","10000",$memo)

Write-Host "`n=== 5. Ler os memos (o que a viewing key enxerga) ===" -ForegroundColor Cyan
Zingo @("--waitsync","messages")

Write-Host "`n=== PROVA ===" -ForegroundColor Green
Write-Host "Guardar o txid retornado e abrir em: https://testnet.zcashexplorer.app/transactions/<txid>"
