<template>
  <div style="background:#F7EACB; min-height:100vh; padding:48px 24px;">
    <div style="max-width:900px; margin:0 auto; display:flex; flex-direction:column; gap:40px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Cobertura do produto</div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:clamp(32px,5vw,56px); text-transform:uppercase; letter-spacing:-1.5px; color:#1B231D; line-height:1; margin-bottom:16px;">Serviços<br/>cartoriais</h1>
        <p style="font-size:15px; color:#4F5E50; max-width:520px; line-height:1.6;">12 serviços de cartório físico brasileiro mapeados para o protocolo CartórioChain. Cada serviço mapeia diretamente para uma combinação de ZK Proof, ZCash ViewKey, Solana e Irys.</p>
      </div>

      <!-- Cobertura summary -->
      <div class="anim-slide-up anim-delay-1 grid-4">
        <div v-for="c in cobertura" :key="c.label" style="border:2px solid #1B231D; padding:20px 16px; background:#FFFDF6;">
          <div :style="`font-size:28px; font-weight:900; color:${c.cor}; font-family:var(--font-display);`">{{ c.qtd }}</div>
          <div style="font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:#4F5E50; margin-top:6px; line-height:1.3;">{{ c.label }}</div>
        </div>
      </div>

      <!-- Tech legend -->
      <div class="anim-slide-up anim-delay-2" style="background:#EFE0BA; border:2px solid #D1C09F; padding:20px 24px;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:14px;">Stack tecnológico</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          <div v-for="t in techStack" :key="t.nome" style="border:2px solid #1B231D; padding:6px 12px; background:#FFFDF6; display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:12px; font-weight:800; color:#1B231D;">{{ t.nome }}</span>
            <span style="font-size:11px; color:#4F5E50;">{{ t.papel }}</span>
          </div>
        </div>
      </div>

      <!-- Transparência de custos (Ponto 3) ──────────── -->
      <div class="anim-slide-up anim-delay-2">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:16px;">Transparência de custos</div>
        <div style="border:2px solid #1B231D; background:#FFFDF6; overflow:hidden;">
          <!-- Cabeçalho -->
          <div style="background:#1B231D; padding:20px 24px; display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:12px;">
            <div>
              <span style="font-family:var(--font-display); font-size:40px; font-weight:900; color:#FFD23F; letter-spacing:-1px;">R$5</span>
              <span style="font-size:13px; font-weight:700; color:#D1C09F; margin-left:10px;">por documento registrado</span>
            </div>
            <div style="font-size:12px; color:#4F5E50; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Fórmula pública · auditável on-chain</div>
          </div>
          <!-- Breakdown -->
          <div style="display:flex; flex-direction:column;">
            <div v-for="(item, i) in custosBreakdown" :key="i"
              style="display:flex; align-items:center; gap:0; border-bottom:1.5px solid #EFE0BA;"
              :style="i === custosBreakdown.length-1 ? 'border-bottom:none;' : ''"
            >
              <!-- Barra de proporção -->
              <div :style="`width:${item.pct}%; min-width:4px; background:${item.cor}; height:100%; min-height:56px; flex-shrink:0;`" />
              <div style="flex:1; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
                <div>
                  <div style="font-size:13px; font-weight:800; color:#1B231D;">{{ item.destino }}</div>
                  <div style="font-size:12px; color:#4F5E50; margin-top:2px;">{{ item.descricao }}</div>
                </div>
                <div style="font-size:14px; font-weight:900; color:#1B231D; font-family:var(--font-display); white-space:nowrap;">{{ item.valor }}</div>
              </div>
            </div>
          </div>
          <!-- Rodapé -->
          <div style="background:#EFE0BA; border-top:2px solid #D1C09F; padding:12px 24px;">
            <p style="font-size:12px; color:#4F5E50; line-height:1.6; margin:0;">
              Custo on-chain verificável a qualquer momento. O custo real de registro (Solana + Irys) é <strong>~R$0,10</strong> por documento — a diferença sustenta o protocolo, desenvolvimento e suporte.
            </p>
          </div>
        </div>
      </div>

      <!-- Planos B2B ──────────────────────────────────── -->
      <div class="anim-slide-up anim-delay-3">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:16px;">Planos</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:2px;">

          <div v-for="plano in planos" :key="plano.nome"
            style="border:2px solid #D1C09F; padding:24px 20px; background:#FFFDF6; display:flex; flex-direction:column; gap:14px;"
            :style="plano.destaque ? 'border-color:#008C4C; background:#F0FAF4;' : ''"
          >
            <div>
              <div v-if="plano.destaque" style="font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; background:#008C4C; color:white; padding:2px 8px; display:inline-block; margin-bottom:8px;">Mais popular</div>
              <div style="font-size:14px; font-weight:900; text-transform:uppercase; letter-spacing:-0.2px; color:#1B231D;">{{ plano.nome }}</div>
              <div style="display:flex; align-items:baseline; gap:4px; margin-top:8px;">
                <span style="font-family:var(--font-display); font-size:32px; font-weight:900; color:#1B231D; letter-spacing:-1px;">{{ plano.preco }}</span>
                <span style="font-size:12px; color:#4F5E50; font-weight:700;">{{ plano.unidade }}</span>
              </div>
            </div>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px; flex:1;">
              <li v-for="f in plano.features" :key="f" style="font-size:12px; color:#4F5E50; display:flex; gap:8px; align-items:flex-start; line-height:1.5;">
                <span style="color:#008C4C; flex-shrink:0; font-weight:900;">✓</span> {{ f }}
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
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:16px;">Todos os serviços</div>
        <div style="display:flex; flex-direction:column; gap:2px;">
          <div v-for="s in servicos" :key="s.nome"
            style="border:2px solid #D1C09F; padding:18px 20px; background:#FFFDF6; display:grid; gap:12px; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1);"
            :style="[
              { gridTemplateColumns: '1fr auto' },
              s.status === 'mvp' ? 'border-color:#008C4C; background:#F0FAF4;' : ''
            ]"
          >
            <div>
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px; flex-wrap:wrap;">
                <span style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:#1B231D;">{{ s.nome }}</span>
                <span :class="`badge-status badge-${s.status}`">{{ statusLabel(s.status) }}</span>
              </div>
              <p style="font-size:13px; color:#4F5E50; line-height:1.5; margin-bottom:10px;">{{ s.descricao }}</p>
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
      <div class="anim-slide-up" style="background:#1B231D; border:2px solid #1B231D; padding:32px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div>
          <div style="font-size:14px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:#F7EACB; margin-bottom:6px;">Experimente o MVP agora</div>
          <p style="font-size:13px; color:#D1C09F; line-height:1.5;">Autenticação + Escritura MCMV funcionando em produção.</p>
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
        { qtd: '2', label: 'Implementados\nhoje (MVP)',  cor: '#008C4C' },
        { qtd: '3', label: 'Próximo\nsprint',            cor: '#FFD23F' },
        { qtd: '4', label: 'Roadmap\n6 meses',          cor: '#4F5E50' },
        { qtd: '3', label: 'Futuro\n(gov/multi-party)', cor: '#D1C09F' },
      ],
      techStack: [
        { nome: 'SHA-256',        papel: 'Integridade do documento' },
        { nome: 'ZK Proof (Noir)', papel: 'Autenticidade sem revelar conteúdo' },
        { nome: 'ZCash ViewKey', papel: 'Privacidade do signatário (LGPD)' },
        { nome: 'Solana',        papel: 'Registro imutável + timestamp' },
        { nome: 'Irys',          papel: 'Armazenamento permanente' },
      ],
      custosBreakdown: [
        { destino: 'Registro on-chain', descricao: 'Taxa da rede Solana — timestamp imutável e ZK proof', valor: '~R$0,001', pct: 2, cor: '#008C4C' },
        { destino: 'Armazenamento permanente', descricao: 'Irys (Arweave) — o documento fica acessível para sempre', valor: '~R$0,10', pct: 5, cor: '#4F5E50' },
        { destino: 'Infraestrutura e operação', descricao: 'API, backend, hospedagem, RPC Helius', valor: '~R$0,90', pct: 18, cor: '#D1C09F' },
        { destino: 'Protocolo + desenvolvimento', descricao: 'Sustentabilidade do CartórioChain como serviço público auditável', valor: '~R$4,00', pct: 75, cor: '#FFD23F' },
      ],
      planos: [
        {
          nome: 'Individual',
          preco: 'R$5',
          unidade: '/ documento',
          destaque: false,
          features: [
            'Pay-per-use — paga só o que usar',
            'Link público de verificação',
            'Certificado de autenticidade',
            'Dados do signatário protegidos',
          ],
          cta: '/registrar?demo=mcmv',
          ctaLabel: '↗ Começar agora',
        },
        {
          nome: 'Construtora',
          preco: 'R$3',
          unidade: '/ doc em volume',
          destaque: true,
          features: [
            'A partir de 50 documentos/mês',
            'API batch — integra com ERP',
            'Painel de gestão por obra',
            'Relatório de auditoria mensal',
            'Suporte prioritário',
          ],
          cta: '/registrar?demo=mcmv',
          ctaLabel: '↗ Falar com a equipe',
        },
        {
          nome: 'Enterprise',
          preco: 'R$0,50',
          unidade: '/ consulta via API',
          destaque: false,
          features: [
            'API REST de verificação em lote',
            'Due diligence automatizada',
            'SLA 99,9% com suporte dedicado',
            'White-label disponível',
          ],
          cta: '/verificar',
          ctaLabel: '◎ Ver API de verificação',
        },
      ],
      servicos: [
        {
          nome: 'Autenticação de documento',
          status: 'mvp',
          descricao: 'Hash SHA-256 do documento registrado on-chain com prova de autenticidade verificável por qualquer pessoa.',
          tech: ['SHA-256', 'Solana', 'Irys'],
        },
        {
          nome: 'Escritura pública (MCMV / Imóvel)',
          status: 'mvp',
          descricao: 'Escrituras de transferência de imóvel com metadados cifrados. Caso de uso Minha Casa Minha Vida já demonstrado em produção.',
          tech: ['Solana', 'ZCash ViewKey', 'Irys'],
        },
        {
          nome: 'Reconhecimento de firma',
          status: 'proximo',
          descricao: 'ZK proof vincula assinante ao documento sem revelar identidade. Equivalente digital do reconhecimento presencial.',
          tech: ['Noir ZK', 'ZCash ViewKey'],
        },
        {
          nome: 'Procuração',
          status: 'proximo',
          descricao: 'Outorgante protegido por ViewKey — terceiros verificam a validade sem acessar dados pessoais do titular.',
          tech: ['ZCash ViewKey', 'Noir ZK'],
        },
        {
          nome: 'Ata notarial',
          status: 'proximo',
          descricao: 'Registro de fato com timestamp imutável on-chain. Substitui a ata lavrada em cartório para fins de prova.',
          tech: ['Solana', 'Irys'],
        },
        {
          nome: 'Apostila de Haia',
          status: 'roadmap',
          descricao: 'Hash + ZK proof exportáveis para verificação internacional. Elimina burocracia de autenticação entre países.',
          tech: ['SHA-256', 'ZK proof público'],
        },
        {
          nome: 'Testamento',
          status: 'roadmap',
          descricao: 'Documento cifrado com ViewKey — conteúdo fica sigiloso até a abertura. Revelação condicionada a evento on-chain.',
          tech: ['ZCash ViewKey', 'time-lock'],
        },
        {
          nome: 'Registro de imóveis',
          status: 'roadmap',
          descricao: 'NFT de propriedade com histórico completo on-chain. Cadeia de custódia auditável desde o primeiro registro.',
          tech: ['Solana NFT', 'Irys'],
        },
        {
          nome: 'Contrato particular autenticado',
          status: 'roadmap',
          descricao: 'Multi-party ZK commitment — todas as partes provam assinatura sem expor dados umas às outras.',
          tech: ['Noir multi-party', 'ZCash ViewKey'],
        },
        {
          nome: 'Divórcio extrajudicial',
          status: 'futuro',
          descricao: 'Escritura consensual com privacidade das partes garantida por ViewKey. Requer fluxo multi-party.',
          tech: ['ZCash ViewKey', 'multi-party'],
        },
        {
          nome: 'Inventário extrajudicial',
          status: 'futuro',
          descricao: 'Partilha de bens documentada on-chain com privacidade dos herdeiros protegida.',
          tech: ['Solana', 'ZCash ViewKey'],
        },
        {
          nome: 'Registro civil',
          status: 'futuro',
          descricao: 'Nascimento, casamento, óbito com identidade ZK vinculada ao CPF/RNPN. Requer integração gov.',
          tech: ['Gov API', 'ZK identity'],
        },
      ],
    }
  },
  methods: {
    statusLabel(status: string): string {
      const map: Record<string, string> = {
        mvp:     '✓ MVP',
        proximo: '→ Próximo',
        roadmap: '○ Roadmap',
        futuro:  '◌ Futuro',
      }
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
.badge-mvp     { color: #008C4C; border-color: #008C4C; background: #F0FAF4; }
.badge-proximo { color: #996A00; border-color: #FFD23F; background: #FFFBEA; }
.badge-roadmap { color: #4F5E50; border-color: #B0B8B1; background: #F4F6F4; }
.badge-futuro  { color: #9AA3A1; border-color: #D1C09F; background: #FAF8F3; }
</style>
