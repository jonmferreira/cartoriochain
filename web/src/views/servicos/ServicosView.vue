<template>
  <div class="page" style="padding:48px 24px;">
    <div class="wrap" style="display:flex; flex-direction:column; gap:40px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div class="eyebrow" style="margin-bottom:8px;">Cobertura do produto</div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:clamp(32px,5vw,56px); text-transform:uppercase; letter-spacing:-1.5px; color:var(--color-text); line-height:1; margin-bottom:16px;">Serviços<br/>cartoriais</h1>
        <p class="body-muted" style="max-width:520px;">12 serviços de cartório físico brasileiro mapeados para o protocolo CartórioChain. Cada serviço mapeia diretamente para uma combinação de ZK Proof, ZCash ViewKey, Solana e Irys.</p>
      </div>

      <!-- Cobertura summary -->
      <div class="anim-slide-up anim-delay-1 grid-4">
        <div v-for="c in cobertura" :key="c.label" style="border:2px solid var(--color-ink-3); padding:20px 16px; background:var(--color-ink-1);">
          <div :style="`font-size:28px; font-weight:900; color:${c.cor}; font-family:var(--font-display);`">{{ c.qtd }}</div>
          <div class="eyebrow" style="margin-top:6px; line-height:1.3;">{{ c.label }}</div>
        </div>
      </div>

      <!-- Tech legend -->
      <div class="anim-slide-up anim-delay-2" style="background:var(--color-ink-1); border:2px solid var(--color-ink-3); padding:20px 24px;">
        <div class="eyebrow" style="margin-bottom:14px;">Stack tecnológico</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="t in techStack" :key="t.nome" style="border:2px solid var(--color-ink-3); padding:6px 12px; background:var(--color-ink); display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:12px; font-weight:800; color:var(--color-text);">{{ t.nome }}</span>
            <span class="body-xs">{{ t.papel }}</span>
          </div>
        </div>
      </div>

      <!-- Transparência de custos ──────────── -->
      <div class="anim-slide-up anim-delay-2">
        <div class="eyebrow" style="margin-bottom:16px;">Transparência de custos</div>
        <div style="border:2px solid var(--color-ink-3); background:var(--color-ink-1); overflow:hidden;">
          <div style="background:var(--color-ink); padding:20px 24px; display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:12px;">
            <div>
              <span style="font-family:var(--font-display); font-size:40px; font-weight:900; color:var(--color-yellow); letter-spacing:-1px;">R$5</span>
              <span style="font-size:13px; font-weight:700; color:var(--color-kraft); margin-left:10px;">por documento registrado</span>
            </div>
            <div class="eyebrow" style="letter-spacing:0.06em;">Fórmula pública · auditável on-chain</div>
          </div>
          <div style="display:flex; flex-direction:column;">
            <div v-for="(item, i) in custosBreakdown" :key="i"
              style="display:flex; align-items:center; gap:0; border-bottom:1.5px solid var(--color-ink-3);"
              :style="i === custosBreakdown.length-1 ? 'border-bottom:none;' : ''"
            >
              <div :style="`width:${item.pct}%; min-width:4px; background:${item.cor}; height:100%; min-height:56px; flex-shrink:0;`" />
              <div style="flex:1; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                  <div style="font-size:13px; font-weight:800; color:var(--color-text);">{{ item.destino }}</div>
                  <div class="body-xs" style="margin-top:2px;">{{ item.descricao }}</div>
                </div>
                <div style="font-size:14px; font-weight:900; color:var(--color-text); font-family:var(--font-display); white-space:nowrap;">{{ item.valor }}</div>
              </div>
            </div>
          </div>
          <div style="background:var(--color-ink-2); border-top:2px solid var(--color-ink-3); padding:12px 24px;">
            <p class="body-xs" style="line-height:1.6; margin:0;">
              Custo on-chain verificável a qualquer momento. O custo real de registro (Solana + Irys) é <strong>~R$0,10</strong> por documento — a diferença sustenta o protocolo, desenvolvimento e suporte.
            </p>
          </div>
        </div>
      </div>

      <!-- Planos B2B ──────────────────────────────────── -->
      <div class="anim-slide-up anim-delay-3">
        <div class="eyebrow" style="margin-bottom:16px;">Planos</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:2px;">

          <div v-for="plano in planos" :key="plano.nome"
            style="border:2px solid var(--color-ink-3); padding:24px 20px; background:var(--color-ink-1); display:flex; flex-direction:column; gap:14px;"
            :style="plano.destaque ? 'border-color:var(--color-emerald); background:#0D2B1A;' : ''"
          >
            <div>
              <div v-if="plano.destaque" class="badge badge-emerald" style="margin-bottom:8px;">Mais popular</div>
              <div style="font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:-0.2px; color:var(--color-text);">{{ plano.nome }}</div>
              <div style="display:flex; align-items:baseline; gap:4px; margin-top:8px;">
                <span style="font-family:var(--font-display); font-size:32px; font-weight:900; color:var(--color-text); letter-spacing:-1px;">{{ plano.preco }}</span>
                <span class="body-xs">{{ plano.unidade }}</span>
              </div>
            </div>
            <ul class="check-list" style="flex:1;">
              <li v-for="f in plano.features" :key="f" class="check-item" style="color:var(--color-text-muted);">
                <span class="check-icon">✓</span> {{ f }}
              </li>
            </ul>
            <button
              class="btn btn-sm"
              :class="plano.destaque ? 'btn-primary' : 'btn-secondary'"
              style="cursor:pointer; margin-top:auto;"
              @click="$router.push(plano.cta)"
            >{{ plano.ctaLabel }}</button>
          </div>

        </div>
      </div>

      <!-- Serviços table -->
      <div class="anim-slide-up anim-delay-3">
        <div class="eyebrow" style="margin-bottom:16px;">Todos os serviços</div>
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div v-for="s in servicos" :key="s.nome"
            style="border:2px solid var(--color-ink-3); padding:18px 20px; background:var(--color-ink-1); display:grid; gap:12px; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1);"
            :style="[
              { gridTemplateColumns: '1fr auto' },
              s.status === 'mvp' ? 'border-color:var(--color-emerald); background:#0D2B1A;' : ''
            ]"
          >
            <div>
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px; flex-wrap:wrap;">
                <span style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:var(--color-text);">{{ s.nome }}</span>
                <span :class="`badge-status badge-${s.status}`">{{ statusLabel(s.status) }}</span>
              </div>
              <p class="body-sm" style="margin-bottom:10px;">{{ s.descricao }}</p>
              <div style="display:flex; flex-wrap:wrap; gap:6px;">
                <span v-for="t in s.tech" :key="t" class="tag tag-muted">{{ t }}</span>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; padding-top:2px;">
              <button v-if="s.status === 'mvp'" class="btn btn-primary btn-sm" style="cursor:pointer; white-space:nowrap;" @click="$router.push('/registrar?demo=mcmv')">
                ↗ Ver demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="anim-slide-up" style="background:var(--color-ink); border:2px solid var(--color-ink-3); padding:32px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:var(--color-text); margin-bottom:6px;">Experimente o MVP agora</div>
          <p class="body-sm" style="color:var(--color-kraft);">Autenticação + Escritura MCMV funcionando em produção.</p>
        </div>
        <button class="btn btn-primary btn-sm" style="cursor:pointer;" @click="$router.push('/registrar?demo=mcmv')">
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
        { nome: 'ZCash ViewKey',   papel: 'Privacidade do signatário (LGPD)' },
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
        { nome: 'Autenticação de documento', status: 'mvp', descricao: 'Hash SHA-256 do documento registrado on-chain com prova de autenticidade verificável por qualquer pessoa.', tech: ['SHA-256', 'Solana', 'Irys'] },
        { nome: 'Escritura pública (MCMV / Imóvel)', status: 'mvp', descricao: 'Escrituras de transferência de imóvel com metadados cifrados. Caso de uso Minha Casa Minha Vida já demonstrado em produção.', tech: ['Solana', 'ZCash ViewKey', 'Irys'] },
        { nome: 'Reconhecimento de firma', status: 'proximo', descricao: 'ZK proof vincula assinante ao documento sem revelar identidade. Equivalente digital do reconhecimento presencial.', tech: ['Noir ZK', 'ZCash ViewKey'] },
        { nome: 'Procuração', status: 'proximo', descricao: 'Outorgante protegido por ViewKey — terceiros verificam a validade sem acessar dados pessoais do titular.', tech: ['ZCash ViewKey', 'Noir ZK'] },
        { nome: 'Ata notarial', status: 'proximo', descricao: 'Registro de fato com timestamp imutável on-chain. Substitui a ata lavrada em cartório para fins de prova.', tech: ['Solana', 'Irys'] },
        { nome: 'Apostila de Haia', status: 'roadmap', descricao: 'Hash + ZK proof exportáveis para verificação internacional. Elimina burocracia de autenticação entre países.', tech: ['SHA-256', 'ZK proof público'] },
        { nome: 'Testamento', status: 'roadmap', descricao: 'Documento cifrado com ViewKey — conteúdo fica sigiloso até a abertura. Revelação condicionada a evento on-chain.', tech: ['ZCash ViewKey', 'time-lock'] },
        { nome: 'Registro de imóveis', status: 'roadmap', descricao: 'NFT de propriedade com histórico completo on-chain. Cadeia de custódia auditável desde o primeiro registro.', tech: ['Solana NFT', 'Irys'] },
        { nome: 'Contrato particular autenticado', status: 'roadmap', descricao: 'Multi-party ZK commitment — todas as partes provam assinatura sem expor dados umas às outras.', tech: ['Noir multi-party', 'ZCash ViewKey'] },
        { nome: 'Divórcio extrajudicial', status: 'futuro', descricao: 'Escritura consensual com privacidade das partes garantida por ViewKey. Requer fluxo multi-party.', tech: ['ZCash ViewKey', 'multi-party'] },
        { nome: 'Inventário extrajudicial', status: 'futuro', descricao: 'Partilha de bens documentada on-chain com privacidade dos herdeiros protegida.', tech: ['Solana', 'ZCash ViewKey'] },
        { nome: 'Registro civil', status: 'futuro', descricao: 'Nascimento, casamento, óbito com identidade ZK vinculada ao CPF/RNPN. Requer integração gov.', tech: ['Gov API', 'ZK identity'] },
        { nome: 'Registro de patente / propriedade intelectual', status: 'futuro', descricao: 'Prova de anterioridade criptográfica para inventores e pesquisadores. Hash do documento registrado on-chain antes do protocolo INPI — evidência imutável de prior art em disputas de propriedade intelectual.', tech: ['SHA-256', 'Solana', 'Irys', 'ZCash ViewKey'] },
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
