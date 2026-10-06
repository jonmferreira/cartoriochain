<template>
  <div class="page">

    <!-- Hero ───────────────────────────────────────────── -->
    <section class="home-s-hero">
      <div class="wrap">
        <div class="anim-slide-up home-hero-layout">

          <!-- Texto -->
          <div class="home-hero-text">
            <h1 class="home-hero-title">
              Autentique<br/>
              <span class="home-hero-highlight">documentos</span><br/>
              com prova<br/>criptográfica.<br/>
              <span class="home-hero-sub">Sem intermediário.</span>
            </h1>
            <p class="body-muted home-hero-body">
              Cartório digital descentralizado para o mercado brasileiro.
              Prova criptográfica de autenticidade. Dados do signatário protegidos por ZCash ViewKey — LGPD nativa.
            </p>
            <div class="home-hero-ctas">
              <button class="btn btn-primary btn-lg" @click="$router.push('/registrar?demo=mcmv')">
                ↗ Registrar documento
              </button>
              <button class="btn btn-secondary btn-lg" @click="$router.push('/verificar')">
                ◎ Verificar autenticidade
              </button>
            </div>
          </div>

          <!-- Sticker card -->
          <div class="anim-slide-up anim-delay-2 home-sticker-wrap">
            <div class="home-sticker">
              <div class="home-sticker-label">CartórioChain</div>
              <div class="home-sticker-stats">
                <div v-for="stat in stats" :key="stat.label">
                  <div class="eyebrow">{{ stat.label }}</div>
                  <div class="home-stat-valor">{{ stat.valor }}</div>
                </div>
              </div>
              <div class="home-sticker-foot">
                ✓ Sem conta · Sem carteira
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Problema ─────────────────────────────────────── -->
    <section class="home-s-problema">
      <div class="wrap">
        <div class="anim-slide-up grid-2">
          <div>
            <div class="eyebrow-label" style="margin-bottom:12px;">O problema</div>
            <h2 class="section-title" style="margin-bottom:12px;">
              Documentos falsificados, perdidos ou inacessíveis.
            </h2>
            <p class="body-muted">
              Programas como o <strong>Minha Casa Minha Vida</strong> movimentam bilhões em contratos. Cartórios tradicionais são lentos, caros e centralizados. Um documento pode ser falsificado e nunca ser detectado.
            </p>
          </div>
          <div>
            <div class="eyebrow-label" style="margin-bottom:12px;">A solução</div>
            <h2 class="section-title" style="margin-bottom:12px;">
              ZK Proof + ZCash ViewKey + Armazenamento permanente.
            </h2>
            <p class="body-muted">
              Cada documento gera uma prova criptográfica verificável por qualquer pessoa. Os dados do signatário ficam cifrados on-chain — só o titular da ViewKey pode ver.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona ─────────────────────────────────── -->
    <section class="home-s-como">
      <div class="wrap">
        <div class="eyebrow-label" style="margin-bottom:32px; text-align:center;">Como funciona</div>
        <div class="grid-3">
          <div v-for="(passo, i) in passos" :key="i" class="anim-slide-up home-passo-card" :class="`anim-delay-${i+1}`">
            <div class="home-passo-num">0{{ i+1 }}</div>
            <div class="home-passo-titulo">{{ passo.titulo }}</div>
            <p class="body-sm">{{ passo.descricao }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparativo de custo ──────────────────────────── -->
    <section class="home-s-custo">
      <div class="wrap home-custo-inner">
        <div>
          <div class="eyebrow home-custo-eyebrow">Custo por escritura MCMV</div>
          <div class="home-custo-values">
            <div class="home-custo-entry">
              <span class="home-custo-amount">R$5</span>
              <span class="eyebrow home-custo-label">CartórioChain</span>
            </div>
            <div class="home-custo-vs">vs</div>
            <div class="home-custo-entry home-custo-old">
              <span class="home-custo-amount">R$2.400</span>
              <span class="eyebrow home-custo-label">Cartório tradicional</span>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="home-pct">99,8%</div>
          <div class="eyebrow home-pct-label">mais barato</div>
        </div>
      </div>
    </section>

    <!-- Loop econômico ─────────────────────────────────── -->
    <section class="home-s-loop">
      <div class="wrap home-loop-header">
        <div class="eyebrow" style="margin-bottom:8px;">Onde vai o R$5</div>
        <h2 class="section-title">Cada centavo é rastreável.</h2>
      </div>
      <div class="loop-marquee-outer">
        <div class="loop-marquee-track">
          <template v-for="n in 2" :key="n">
            <div v-for="(no, i) in loopEconomico" :key="`${n}-${i}`" class="loop-item">
              <div class="loop-node" :style="`background:${no.bg}`">
                <div class="loop-icon">{{ no.icone }}</div>
                <div class="loop-titulo">{{ no.titulo }}</div>
                <div class="loop-desc">{{ no.descricao }}</div>
                <span v-if="no.tag" class="loop-tag">{{ no.tag }}</span>
              </div>
              <div v-if="i < loopEconomico.length - 1" class="loop-arrow">→</div>
            </div>
            <div class="loop-spacer"></div>
          </template>
        </div>
      </div>
    </section>

    <!-- Serviços cobertos ────────────────────────────── -->
    <section class="home-s-servicos">
      <div class="wrap">
        <div class="home-srv-header">
          <div>
            <div class="eyebrow" style="margin-bottom:8px;">Cobertura cartorial</div>
            <h2 class="section-title">12 serviços mapeados.<br/>2 funcionando hoje.</h2>
          </div>
          <button class="btn btn-secondary btn-sm" @click="$router.push('/servicos')">Ver todos →</button>
        </div>
        <div class="grid-3">
          <div v-for="s in servicosDestaque" :key="s.nome"
            class="home-srv-card"
            :class="{ 'home-srv-card--mvp': s.mvp }"
          >
            <div v-if="s.mvp" class="home-srv-mvp-badge">MVP</div>
            <div class="home-srv-nome">{{ s.nome }}</div>
            <div class="home-srv-techs">
              <span v-for="t in s.tech" :key="t" class="home-srv-tech-tag">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Para quem ─────────────────────────────────────── -->
    <section class="home-s-perfis">
      <div class="wrap">
        <div class="eyebrow" style="margin-bottom:8px;">Quem usa</div>
        <h2 class="section-title" style="margin-bottom:36px;">Três formas de usar.<br/>Uma infraestrutura.</h2>
        <div class="home-perfis-grid">

          <!-- Cidadão -->
          <div class="home-perfil-card">
            <span class="badge badge-yellow">Cidadão</span>
            <div>
              <div class="home-perfil-title">Escrituras, contratos<br/>e procurações</div>
              <p class="body-sm">Autentique documentos habitacionais, herança e contratos pessoais. R$5 por registro — sem conta, sem carteira digital.</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> Registro em menos de 30 segundos</li>
              <li class="check-item"><span class="check-icon">✓</span> Link público de verificação para qualquer pessoa</li>
              <li class="check-item"><span class="check-icon">✓</span> Dados pessoais protegidos — só o titular acessa</li>
            </ul>
            <button class="btn btn-primary btn-sm home-perfil-cta" @click="$router.push('/registrar?demo=mcmv')">↗ Registrar documento</button>
          </div>

          <!-- Construtora -->
          <div class="home-perfil-card">
            <span class="badge badge-emerald">Construtora · Escritório</span>
            <div>
              <div class="home-perfil-title">Volume de documentos<br/>com rastreabilidade</div>
              <p class="body-sm">API batch para registrar centenas de contratos MCMV ou jurídicos por mês. Auditoria on-chain elimina passivo por fraude.</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> API batch — integra com ERP jurídico</li>
              <li class="check-item"><span class="check-icon">✓</span> Painel de gestão por projeto / obra</li>
              <li class="check-item"><span class="check-icon">✓</span> R$3/doc em volume (vs R$300 em cartório)</li>
            </ul>
            <button class="btn btn-secondary btn-sm home-perfil-cta" style="border-color:var(--color-text-muted); color:var(--color-kraft);" @click="$router.push('/servicos')">Ver planos B2B →</button>
          </div>

          <!-- Banco / Seguradora -->
          <div class="home-perfil-card">
            <span class="badge badge-ink">Banco · Seguradora</span>
            <div>
              <div class="home-perfil-title">Verificação de autenticidade<br/>em lote</div>
              <p class="body-sm">Confirme a autenticidade de escrituras e laudos antes de liberar financiamento ou pagar sinistros. Resposta em millisegundos.</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> Consulta pública sem wallet nem conta</li>
              <li class="check-item"><span class="check-icon">✓</span> API REST — integra com due diligence existente</li>
              <li class="check-item"><span class="check-icon">✓</span> Evidência imutável, auditável por qualquer parte</li>
            </ul>
            <button class="btn btn-secondary btn-sm home-perfil-cta" style="border-color:var(--color-text-muted); color:var(--color-kraft);" @click="$router.push('/verificar')">◎ Verificar autenticidade</button>
          </div>

        </div>
      </div>
    </section>

    <!-- INPI comparativo ───────────────────────────────── -->
    <section class="home-s-inpi">
      <div class="wrap">
        <div class="eyebrow" style="margin-bottom:8px;">Propriedade intelectual</div>
        <h2 class="section-title" style="margin-bottom:8px;">O registro hoje.<br/>O registro partindo daqui.</h2>
        <p class="body-muted" style="max-width:480px; margin-bottom:32px;">O INPI não tem API. Não tem velocidade. Mas tem validade jurídica. O CartórioChain resolve tudo que vem antes — e garante que quando você chegar lá, ninguém vai poder contestar que a ideia não era sua.</p>

        <div class="home-inpi-tables">

          <!-- Tabela INPI — entra da direita -->
          <div class="home-inpi-slide" ref="inpiTable">
            <div class="home-inpi-block">
              <div class="home-inpi-head">
                <span class="home-inpi-headlabel">Via INPI direto</span>
                <span class="home-inpi-headtag">burocracia tradicional</span>
              </div>
              <table class="home-inpi-table">
                <thead>
                  <tr>
                    <th>Tipo de registro</th>
                    <th>Custo</th>
                    <th>Prazo</th>
                    <th>Anterioridade garantida em</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in inpiRows" :key="r.tipo">
                    <td>{{ r.tipo }}</td>
                    <td class="home-inpi-td-cost home-inpi-td-cost--slow">{{ r.custo }}</td>
                    <td>{{ r.prazo }}</td>
                    <td>{{ r.anterior }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="home-inpi-arrow">
            <div class="home-inpi-arrow-line"></div>
            <span class="home-inpi-arrow-txt">↓ partindo do CartórioChain</span>
            <div class="home-inpi-arrow-line"></div>
          </div>

          <!-- Tabela CartórioChain — entra da esquerda -->
          <div class="home-cc-slide" ref="ccTable">
            <div class="home-inpi-block home-inpi-block--cc">
              <div class="home-inpi-head home-inpi-head--cc">
                <span class="home-inpi-headlabel home-inpi-headlabel--cc">Via CartórioChain → INPI</span>
                <span class="home-inpi-headtag home-inpi-headtag--cc">R$5 · imediato</span>
              </div>
              <table class="home-inpi-table">
                <thead>
                  <tr>
                    <th>Etapa</th>
                    <th>Custo</th>
                    <th>Velocidade</th>
                    <th>O que garante</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="home-cc-row--highlight">
                    <td>Prova de anterioridade</td>
                    <td>R$5</td>
                    <td>Imediato</td>
                    <td>Hash + timestamp imutável on-chain — prior art provado antes mesmo de protocolar</td>
                  </tr>
                  <tr>
                    <td>Consulta de conflito</td>
                    <td>incluído</td>
                    <td>Segundos</td>
                    <td>Checa se sua marca já existe no INPI antes de você gastar R$440+</td>
                  </tr>
                  <tr>
                    <td>Pacote para protocolo</td>
                    <td>incluído</td>
                    <td>Automático</td>
                    <td>Hash no formato e-Software + Declaração de Veracidade pré-preenchida</td>
                  </tr>
                  <tr>
                    <td>Protocolo no INPI</td>
                    <td>R$440+</td>
                    <td>18–36 meses</td>
                    <td>Com anterioridade já garantida desde o primeiro dia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Visão de futuro ─────────────────────────────────── -->
    <section class="home-s-futuro">
      <div class="wrap">
        <div class="eyebrow" style="margin-bottom:8px;">Para onde vamos</div>
        <h2 class="section-title">Infraestrutura de confiança<br/>para o Brasil inteiro.</h2>
        <div class="home-futuro-grid">
          <div v-for="f in futuroCards" :key="f.titulo"
            class="anim-slide-up home-futuro-card"
            :class="{ 'home-futuro-card--active': f.ativo }"
          >
            <div class="home-futuro-num" :class="{ 'home-futuro-num--active': f.ativo }">{{ f.num }}</div>
            <div class="home-futuro-title">{{ f.titulo }}</div>
            <p class="home-futuro-desc">{{ f.desc }}</p>
            <span class="home-futuro-status" :class="`home-futuro-status--${f.statusKey}`">{{ f.status }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final ─────────────────────────────────────── -->
    <section class="home-s-cta">
      <div class="home-cta-inner">
        <div class="eyebrow" style="margin-bottom:16px;">Experimente agora</div>
        <h3 class="section-title home-cta-title">Registro em menos de 30 segundos.</h3>
        <button class="btn btn-primary btn-lg home-cta-btn" @click="$router.push('/registrar?demo=mcmv')">
          ↗ Ver demo: escritura MCMV
        </button>
        <p class="body-xs home-cta-hint">É um demo — nenhum dado real é armazenado.</p>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',

  mounted() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    const inpi = this.$refs.inpiTable as Element
    const cc   = this.$refs.ccTable   as Element
    if (inpi) obs.observe(inpi)
    if (cc)   obs.observe(cc)
  },

  data() {
    return {
      stats: [
        { label: 'Custo por registro', valor: '~$0.001' },
        { label: 'Tempo de registro',  valor: '< 5 seg' },
        { label: 'Armazenamento',      valor: 'Permanente' },
        { label: 'Privacidade',        valor: 'Total' },
      ],
      loopEconomico: [
        { icone: 'R$5', bg: 'var(--color-yellow)', titulo: 'Promocional', descricao: 'Taxa única via PIX por documento', tag: null },
        { icone: '✓',  bg: '#C6ECD8', titulo: 'Autenticado', descricao: 'ZK proof gerado e vinculado ao arquivo', tag: 'ZK Proof' },
        { icone: '◎',  bg: '#C5DCF0', titulo: 'Registrado', descricao: 'Timestamp imutável na Solana', tag: '~R$0,001' },
        { icone: '∞',  bg: '#E8D5F5', titulo: 'Armazenado', descricao: 'Documento permanente via Irys', tag: '~R$0,10' },
        { icone: '↗',  bg: '#D4E8D0', titulo: 'Verificável', descricao: 'Link público para qualquer pessoa, para sempre', tag: 'Grátis' },
      ],
      passos: [
        { titulo: 'Envie o documento',           descricao: 'Geramos uma impressão digital única do arquivo — o conteúdo nunca sai do seu dispositivo.' },
        { titulo: 'Gera prova de autenticidade', descricao: 'Uma prova criptográfica é gerada e vinculada ao documento. Qualquer pessoa pode verificar, sem intermediário.' },
        { titulo: 'Registra permanentemente',    descricao: 'A prova vai para Solana + Irys. Dados do signatário ficam protegidos — só o titular pode ver.' },
      ],
      inpiRows: [
        { tipo: 'Registro de marca',     custo: 'R$440–1.720/classe', prazo: '18–36 meses', anterior: 'Data do protocolo' },
        { tipo: 'Registro de software',  custo: '~R$160',             prazo: '< 7 dias',    anterior: 'Data do protocolo' },
        { tipo: 'Patente de invenção',   custo: 'R$500–2.400',        prazo: '7–10 anos',   anterior: 'Data do protocolo' },
      ],
      futuroCards: [
        { num: '01', ativo: true,  titulo: 'Autenticação e escrituras', desc: 'SHA-256 + ZK proof para documentos habitacionais, contratos MCMV e escrituras públicas. Funcionando em produção.', status: '✓ Disponível hoje', statusKey: 'now' },
        { num: '02', ativo: false, titulo: 'Propriedade intelectual', desc: 'Prior art criptográfico para marcas, software e inventores — antes mesmo de protocolar no INPI. Prova instantânea, R$5.', status: '→ Em desenvolvimento', statusKey: 'soon' },
        { num: '03', ativo: false, titulo: 'Identidade ZK on-chain', desc: 'Cidadão prova quem é sem revelar CPF. Vinculação com gov.br via ZK commitment — privacidade sem impunidade.', status: '○ Roadmap', statusKey: 'future' },
        { num: '04', ativo: false, titulo: 'Multi-party e contratos', desc: 'Todas as partes assinam com ZK proof — nenhuma enxerga os dados da outra. Divórcio, inventário, partilha extrajudicial.', status: '○ Roadmap', statusKey: 'future' },
        { num: '05', ativo: false, titulo: 'Integração governo', desc: 'Registro civil, certidões, apostila de Haia. CartórioChain como infraestrutura pública — cartório para 215 milhões de brasileiros.', status: '◌ Visão', statusKey: 'future' },
      ],
      servicosDestaque: [
        { nome: 'Autenticação', mvp: true,  tech: ['SHA-256', 'Solana', 'Irys'] },
        { nome: 'Escritura MCMV', mvp: true, tech: ['ZCash ViewKey', 'Solana'] },
        { nome: 'Reconhecimento de firma', mvp: false, tech: ['ZK Proof', 'ViewKey'] },
        { nome: 'Procuração', mvp: false, tech: ['ZK Proof', 'ViewKey'] },
        { nome: 'Ata notarial', mvp: false, tech: ['Solana', 'Irys'] },
        { nome: 'Apostila de Haia', mvp: false, tech: ['ZK público'] },
      ],
    }
  },
})
</script>

<style src="./home.css"></style>

<style scoped>
.loop-marquee-outer {
  overflow: hidden;
  width: 100%;
  padding: 4px 0;
}

.loop-marquee-track {
  display: flex;
  align-items: stretch;
  width: max-content;
  animation: loop-scroll 38s linear infinite;
}

.loop-marquee-track:hover {
  animation-play-state: paused;
}

.loop-item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.loop-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 172px;
  text-align: center;
  padding: 32px 16px;
  border: 2px solid var(--color-ink);
  box-sizing: border-box;
}

.loop-icon {
  width: 60px;
  height: 60px;
  border: 3px solid var(--color-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  font-family: var(--font-display);
  color: var(--color-ink);
  flex-shrink: 0;
}

.loop-titulo {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.2px;
  color: var(--color-ink);
  line-height: 1.2;
}

.loop-desc {
  font-size: 11px;
  color: var(--color-ink);
  opacity: 0.6;
  line-height: 1.4;
}

.loop-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--color-ink);
  color: var(--color-yellow);
  padding: 2px 8px;
}

.loop-arrow {
  font-size: 20px;
  color: var(--color-kraft);
  font-weight: 900;
  padding: 0 14px;
  flex-shrink: 0;
}

.loop-spacer {
  width: 90vw;
  flex-shrink: 0;
}

@keyframes loop-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .loop-marquee-track {
    animation: none;
    overflow-x: auto;
  }
}
</style>
