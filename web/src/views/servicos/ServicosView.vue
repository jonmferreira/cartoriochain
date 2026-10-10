<template>
  <div class="page svc-root">
    <div class="wrap svc-stack">

      <!-- Header -->
      <div class="anim-slide-up">
        <div class="eyebrow" style="margin-bottom:8px;">Cobertura do produto</div>
        <h1 class="svc-h1">Serviços<br/>cartoriais</h1>
        <p class="body-muted" style="max-width:520px;">12 serviços de cartório físico brasileiro mapeados para o protocolo CartórioChain. Cada serviço mapeia diretamente para uma combinação de ZK Proof, criptografia de divulgação seletiva, Solana e Irys.</p>
      </div>

      <!-- Cobertura summary -->
      <div class="anim-slide-up anim-delay-1 grid-4">
        <div v-for="c in cobertura" :key="c.label" class="svc-cob-card">
          <div class="svc-cob-qty" :style="`color:${c.cor};`">{{ c.qtd }}</div>
          <div class="eyebrow svc-cob-label">{{ c.label }}</div>
        </div>
      </div>

      <!-- Tech legend -->
      <div class="anim-slide-up anim-delay-2 svc-tech-panel">
        <div class="eyebrow" style="margin-bottom:14px;">Stack tecnológico</div>
        <div class="svc-tech-list">
          <div v-for="t in techStack" :key="t.nome" class="svc-tech-item">
            <span class="svc-tech-nome">{{ t.nome }}</span>
            <span class="body-xs">{{ t.papel }}</span>
          </div>
        </div>
      </div>

      <!-- Transparência de custos -->
      <div class="anim-slide-up anim-delay-2">
        <div class="eyebrow" style="margin-bottom:16px;">Transparência de custos</div>
        <div class="svc-custos-wrap">
          <div class="svc-custos-head">
            <div>
              <span class="svc-custos-r5">R$5</span>
              <span class="svc-custos-per">por documento registrado</span>
            </div>
            <div class="eyebrow svc-custos-formula">Fórmula pública · auditável on-chain</div>
          </div>
          <div class="svc-custos-rows">
            <div v-for="(item, i) in custosBreakdown" :key="i" class="svc-custos-row">
              <div class="svc-custos-bar" :style="`width:${item.pct}%; background:${item.cor};`" />
              <div class="svc-custos-info">
                <div>
                  <div class="svc-custos-destino">{{ item.destino }}</div>
                  <div class="body-xs" style="margin-top:2px;">{{ item.descricao }}</div>
                </div>
                <div class="svc-custos-valor">{{ item.valor }}</div>
              </div>
            </div>
          </div>
          <div class="svc-custos-foot">
            <p class="body-xs" style="line-height:1.6; margin:0;">
              Custo on-chain verificável a qualquer momento. O custo real de registro (Solana + Irys) é <strong>~R$0,10</strong> por documento — a diferença sustenta o protocolo, desenvolvimento e suporte.
            </p>
          </div>
        </div>
      </div>

      <!-- Planos B2B -->
      <div class="anim-slide-up anim-delay-3">
        <div class="eyebrow" style="margin-bottom:16px;">Planos</div>
        <div class="svc-planos-grid">
          <div v-for="plano in planos" :key="plano.nome"
            class="svc-plano-card"
            :class="{ 'svc-plano-card--destaque': plano.destaque }"
          >
            <div>
              <div v-if="plano.destaque" class="badge badge-emerald" style="margin-bottom:8px;">Mais popular</div>
              <div class="svc-plano-nome">{{ plano.nome }}</div>
              <div class="svc-plano-price-row">
                <span class="svc-plano-price">{{ plano.preco }}</span>
                <span class="body-xs">{{ plano.unidade }}</span>
              </div>
            </div>
            <ul class="svc-plano-features">
              <li v-for="f in plano.features" :key="f" class="check-item" style="color:var(--color-text-muted);">
                <span class="check-icon">✓</span> {{ f }}
              </li>
            </ul>
            <button
              class="btn btn-sm svc-plano-btn"
              :class="plano.destaque ? 'btn-primary' : 'btn-secondary'"
              @click="$router.push(plano.cta)"
            >{{ plano.ctaLabel }}</button>
          </div>
        </div>
      </div>

      <!-- Serviços table -->
      <div class="anim-slide-up anim-delay-3">
        <div class="eyebrow" style="margin-bottom:16px;">Todos os serviços</div>
        <div class="svc-list">
          <div v-for="s in servicos" :key="s.nome"
            class="svc-item"
            :class="{ 'svc-item--mvp': s.status === 'mvp' }"
          >
            <div>
              <div class="svc-item-head">
                <span class="svc-item-nome">{{ s.nome }}</span>
                <span :class="`badge-status badge-${s.status}`">{{ statusLabel(s.status) }}</span>
              </div>
              <p class="body-sm">{{ s.descricao }}</p>
            </div>
            <div class="svc-item-action">
              <button v-if="s.status === 'mvp'" class="btn btn-primary btn-sm svc-item-demo" @click="$router.push('/registrar?demo=mcmv')">
                ↗ Ver demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="anim-slide-up svc-cta">
        <div>
          <div class="svc-cta-nome">Experimente o MVP agora</div>
          <p class="body-sm" style="color:var(--color-kraft);">Autenticação + Escritura MCMV funcionando em produção.</p>
        </div>
        <button class="btn btn-primary btn-sm" @click="$router.push('/registrar?demo=mcmv')">
          ↗ Abrir demo MCMV
        </button>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ServicosView',
  data() {
    return {
      cobertura: [
        { qtd: '2', label: 'Implementados\nhoje (MVP)',  cor: 'var(--color-emerald)' },
        { qtd: '3', label: 'Próximo\nsprint',            cor: 'var(--color-yellow)' },
        { qtd: '4', label: 'Roadmap\n6 meses',          cor: 'var(--color-ink-4)' },
        { qtd: '3', label: 'Futuro\n(gov/multi-party)', cor: 'var(--color-kraft)' },
      ],
      techStack: [
        { nome: 'SHA-256',         papel: 'Integridade do documento' },
        { nome: 'ZK Proof (Noir)', papel: 'Autenticidade sem revelar conteúdo' },
        { nome: 'Divulgação seletiva', papel: 'Privacidade do signatário (LGPD)' },
        { nome: 'Solana',          papel: 'Registro imutável + timestamp' },
        { nome: 'Irys',            papel: 'Armazenamento permanente' },
      ],
      custosBreakdown: [
        { destino: 'Registro on-chain',          descricao: 'Taxa da rede Solana — timestamp imutável e ZK proof', valor: '~R$0,001', pct: 2,  cor: 'var(--color-emerald)' },
        { destino: 'Armazenamento permanente',   descricao: 'Irys (Arweave) — o documento fica acessível para sempre', valor: '~R$0,10', pct: 5,  cor: 'var(--color-ink-4)' },
        { destino: 'Infraestrutura e operação',  descricao: 'API, backend, hospedagem, RPC Helius', valor: '~R$0,90', pct: 18, cor: 'var(--color-kraft)' },
        { destino: 'Protocolo + desenvolvimento', descricao: 'Sustentabilidade do CartórioChain como serviço público auditável', valor: '~R$4,00', pct: 75, cor: 'var(--color-yellow)' },
      ],
      planos: [
        {
          nome: 'Individual', preco: 'R$5', unidade: '/ documento', destaque: false,
          features: ['Pay-per-use — paga só o que usar', 'Link público de verificação', 'Certificado de autenticidade', 'Dados do signatário protegidos'],
          cta: '/registrar?demo=mcmv', ctaLabel: '↗ Começar agora',
        },
        {
          nome: 'Construtora', preco: 'R$3', unidade: '/ doc em volume', destaque: true,
          features: ['A partir de 50 documentos/mês', 'API batch — integra com ERP', 'Painel de gestão por obra', 'Relatório de auditoria mensal', 'Suporte prioritário'],
          cta: '/registrar?demo=mcmv', ctaLabel: '↗ Falar com a equipe',
        },
        {
          nome: 'Enterprise', preco: 'R$0,50', unidade: '/ consulta via API', destaque: false,
          features: ['API REST de verificação em lote', 'Due diligence automatizada', 'SLA 99,9% com suporte dedicado', 'White-label disponível'],
          cta: '/verificar', ctaLabel: '◎ Ver API de verificação',
        },
      ],
      servicos: [
        { nome: 'Autenticação de documento', status: 'mvp', descricao: 'Hash SHA-256 do documento registrado on-chain com prova de autenticidade verificável por qualquer pessoa.' },
        { nome: 'Escritura pública (MCMV / Imóvel)', status: 'mvp', descricao: 'Escrituras de transferência de imóvel com metadados cifrados. Caso de uso Minha Casa Minha Vida já demonstrado em produção.' },
        { nome: 'Reconhecimento de firma', status: 'proximo', descricao: 'ZK proof vincula assinante ao documento sem revelar identidade. Equivalente digital do reconhecimento presencial.' },
        { nome: 'Procuração', status: 'proximo', descricao: 'Outorgante protegido por criptografia de divulgação seletiva — terceiros verificam a validade sem acessar dados pessoais do titular.' },
        { nome: 'Ata notarial', status: 'proximo', descricao: 'Registro de fato com timestamp imutável on-chain. Substitui a ata lavrada em cartório para fins de prova.' },
        { nome: 'Apostila de Haia', status: 'roadmap', descricao: 'Hash + ZK proof exportáveis para verificação internacional. Elimina burocracia de autenticação entre países.' },
        { nome: 'Testamento', status: 'roadmap', descricao: 'Documento cifrado com divulgação seletiva — conteúdo fica sigiloso até a abertura. Revelação condicionada a evento on-chain.' },
        { nome: 'Registro de imóveis', status: 'roadmap', descricao: 'NFT de propriedade com histórico completo on-chain. Cadeia de custódia auditável desde o primeiro registro.' },
        { nome: 'Contrato particular autenticado', status: 'roadmap', descricao: 'Multi-party ZK commitment — todas as partes provam assinatura sem expor dados umas às outras.' },
        { nome: 'Divórcio extrajudicial', status: 'futuro', descricao: 'Escritura consensual com privacidade das partes garantida por criptografia de divulgação seletiva. Requer fluxo multi-party.' },
        { nome: 'Inventário extrajudicial', status: 'futuro', descricao: 'Partilha de bens documentada on-chain com privacidade dos herdeiros protegida.' },
        { nome: 'Registro civil', status: 'futuro', descricao: 'Nascimento, casamento, óbito com identidade ZK vinculada ao CPF/RNPN. Requer integração gov.' },
        { nome: 'Registro de patente / propriedade intelectual', status: 'futuro', descricao: 'Prova de anterioridade criptográfica para inventores e pesquisadores. Hash do documento registrado on-chain antes do protocolo INPI — evidência imutável de prior art em disputas de propriedade intelectual.' },
      ],
    }
  },
  methods: {
    statusLabel(status: string): string {
      const map: Record<string, string> = { mvp: '✓ MVP', proximo: '→ Próximo', roadmap: '○ Roadmap', futuro: '◌ Futuro' }
      return map[status] ?? status
    },
  },
})
</script>

<style src="./servicos.css"></style>

<style scoped>
.badge-status {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 2px solid;
}
.badge-mvp     { color: var(--color-emerald); border-color: var(--color-emerald); background: rgba(0,140,76,0.1); }
.badge-proximo { color: var(--color-yellow);  border-color: var(--color-yellow);  background: rgba(255,210,63,0.08); }
.badge-roadmap { color: var(--color-ink-4);   border-color: var(--color-ink-3);   background: transparent; }
.badge-futuro  { color: var(--color-ink-4);   border-color: var(--color-ink-3);   background: transparent; }
</style>
