"""plot_benchmark.py — Gera os gráficos comparativos (clássico vs híbrido PQC) para o README.

Estilo espelhado da suíte de benchmark do TCC (matplotlib, DPI 300, limiares CNJ Prov. 213/2026).
Lê os dados reais medidos em code/docs/benchmark-data.json (gerado por
api/src/viewkey.compare-bench.ts) e salva PNGs em code/docs/img/.

Uso:
    pip install matplotlib
    python code/scripts/plots/plot_benchmark.py
"""
import json
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ── Paleta (mesma do config.py do TCC) ──
BLUE, RED, ORANGE, GRAY = "#2563EB", "#F87171", "#F59E0B", "#6B7280"
GREEN_LIGHT, GREEN_DARK = "#4ADE80", "#15803D"
CNJ_LINE = dict(linestyle="--", linewidth=2.5, color=GREEN_DARK, alpha=0.95, zorder=5)
DPI = 300

HERE = os.path.dirname(__file__)
DATA = os.path.join(HERE, "..", "..", "docs", "benchmark-data.json")
IMG = os.path.join(HERE, "..", "..", "docs", "img")


def save(fig, name):
    os.makedirs(IMG, exist_ok=True)
    p = os.path.join(IMG, name)
    fig.savefig(p, dpi=DPI, bbox_inches="tight")
    plt.close(fig)
    print("  Salvo:", p)


def main():
    with open(DATA, encoding="utf-8") as f:
        d = json.load(f)
    c, h, cnj = d["classical"], d["hybrid"], d["cnj"]
    ops = ["keygen", "encrypt", "decrypt"]

    # ── G1 — Latência cripto (híbrido) vs limiar CNJ 500 ms (escala log) ──
    fig, ax = plt.subplots(figsize=(8, 5))
    vals = [h[o]["avg"] for o in ops]
    bars = ax.bar(ops, vals, color=GREEN_LIGHT, alpha=0.9, width=0.5, zorder=3)
    ax.axhline(cnj["latMs"], **CNJ_LINE)
    ax.text(2.1, cnj["latMs"] * 1.05, f"{cnj['latMs']} ms (CNJ Prov. 213/2026)",
            fontsize=9, color=GREEN_DARK, fontweight="bold", ha="right")
    ax.set_yscale("log")
    ax.set_ylabel("Latência média (ms, escala log)", fontsize=9)
    ax.set_title("Latência da criptografia pós-quântica vs limiar de latência do CNJ")
    for b, v in zip(bars, vals):
        ax.text(b.get_x() + b.get_width() / 2, b.get_height() * 1.08, f"{v:.2f} ms",
                ha="center", fontsize=9, fontweight="bold")
    pct = max(vals) / cnj["latMs"] * 100
    ax.text(0.0, cnj["latMs"] * 0.45, f"pior caso usa ~{pct:.1f}% do orçamento de {cnj['latMs']} ms",
            fontsize=8.5, color=GRAY)
    save(fig, "01-latencia-vs-cnj.png")

    # ── G2 — Overhead: clássico vs híbrido PQC (barras agrupadas) ──
    fig, ax = plt.subplots(figsize=(8, 5))
    x = range(len(ops))
    w = 0.38
    cvals = [c[o]["avg"] for o in ops]
    hvals = [h[o]["avg"] for o in ops]
    b1 = ax.bar([i - w / 2 for i in x], cvals, w, label=c["label"], color=GRAY, alpha=0.9, zorder=3)
    b2 = ax.bar([i + w / 2 for i in x], hvals, w, label=h["label"], color=BLUE, alpha=0.9, zorder=3)
    ax.set_xticks(list(x)); ax.set_xticklabels(ops)
    ax.set_ylabel("Latência média (ms)", fontsize=9)
    ax.set_title("Overhead da proteção pós-quântica (clássico vs híbrido)")
    ax.legend(fontsize=8.5)
    for bars in (b1, b2):
        for b in bars:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.05, f"{b.get_height():.2f}",
                    ha="center", fontsize=8)
    save(fig, "02-overhead-classico-vs-pqc.png")

    # ── G3 — Tamanho de chave pública e payload (clássico vs híbrido, escala log) ──
    fig, ax = plt.subplots(figsize=(8, 5))
    cats = ["Chave pública", "Payload cifrado"]
    cvals = [c["pubBytes"], c["payloadBytes"]]
    hvals = [h["pubBytes"], h["payloadBytes"]]
    x = range(len(cats)); w = 0.38
    b1 = ax.bar([i - w / 2 for i in x], cvals, w, label=c["label"], color=GRAY, alpha=0.9, zorder=3)
    b2 = ax.bar([i + w / 2 for i in x], hvals, w, label=h["label"], color=ORANGE, alpha=0.9, zorder=3)
    ax.set_xticks(list(x)); ax.set_xticklabels(cats)
    ax.set_yscale("log")
    ax.set_ylabel("Tamanho (bytes, escala log)", fontsize=9)
    ax.set_title("Tradeoff do PQC: chaves maiores (latência segue baixa)")
    ax.legend(fontsize=8.5)
    for bars in (b1, b2):
        for b in bars:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() * 1.08, f"{int(b.get_height())} B",
                    ha="center", fontsize=8)
    save(fig, "03-tamanho-chave-payload.png")

    # ── G4 — Throughput (híbrido) vs mínimo CNJ 50 TPS ──
    fig, ax = plt.subplots(figsize=(8, 5))
    tps = [h[o]["tps"] for o in ops]
    colors = [GREEN_LIGHT if t >= cnj["tps"] else RED for t in tps]
    bars = ax.bar(ops, tps, color=colors, alpha=0.9, width=0.5, zorder=3)
    ax.axhline(cnj["tps"], **CNJ_LINE)
    ax.text(2.1, cnj["tps"] * 1.1, f"mín. {cnj['tps']} TPS (CNJ)", fontsize=9,
            color=GREEN_DARK, fontweight="bold", ha="right")
    ax.set_ylabel("Vazão (operações/s por núcleo)", fontsize=9)
    ax.set_title("Vazão da criptografia pós-quântica vs mínimo do CNJ")
    for b, v in zip(bars, tps):
        ax.text(b.get_x() + b.get_width() / 2, b.get_height() + max(tps) * 0.02, f"{v:.0f}",
                ha="center", fontsize=9, fontweight="bold")
    save(fig, "04-throughput-vs-cnj.png")

    print("OK — 4 gráficos gerados a partir de", os.path.basename(DATA))


if __name__ == "__main__":
    main()
