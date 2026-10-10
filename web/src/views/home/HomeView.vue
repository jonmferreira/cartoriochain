<template>
  <div class="page">

    <!-- Hero ───────────────────────────────────────────── -->
    <section class="home-s-hero">
      <div class="wrap">
        <div class="anim-slide-up home-hero-layout">

          <!-- Texto -->
          <div class="home-hero-text">
            <h1 class="home-hero-title">
              {{ $t('home.heroVerb') }}<br/>
              <span class="home-hero-highlight">{{ $t('home.heroHighlight') }}</span><br/>
              {{ $t('home.heroRest') }}<br/>
              <span class="home-hero-sub">{{ $t('home.heroSub') }}</span>
            </h1>
            <p class="body-muted home-hero-body">
              {{ $t('home.heroBody') }}
            </p>
            <div class="home-hero-ctas">
              <button class="btn btn-primary btn-lg" @click="$router.push('/registrar?demo=mcmv')">
                {{ $t('home.ctaRegistrar') }}
              </button>
              <button class="btn btn-secondary btn-lg" @click="$router.push('/verificar')">
                {{ $t('home.ctaVerificar') }}
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
                {{ $t('home.stickerFoot') }}
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
            <div class="eyebrow-label" style="margin-bottom:12px;">{{ $t('home.problemaEyebrow') }}</div>
            <h2 class="section-title" style="margin-bottom:12px;">
              {{ $t('home.problemaTitle') }}
            </h2>
            <p class="body-muted">
              {{ $t('home.problemaBody') }}
            </p>
          </div>
          <div>
            <div class="eyebrow-label" style="margin-bottom:12px;">{{ $t('home.solucaoEyebrow') }}</div>
            <h2 class="section-title" style="margin-bottom:12px;">
              {{ $t('home.solucaoTitle') }}
            </h2>
            <p class="body-muted">
              {{ $t('home.solucaoBody') }}
            </p>
            <a
              class="home-pqc-badge"
              href="https://csrc.nist.gov/projects/post-quantum-cryptography"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="home-pqc-badge-tag">{{ $t('home.pqcBadgeTag') }}</span>
              <span class="home-pqc-badge-text">{{ $t('home.pqcBadgeText') }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona ─────────────────────────────────── -->
    <section class="home-s-como">
      <div class="wrap">
        <div class="eyebrow-label" style="margin-bottom:32px; text-align:center;">{{ $t('home.comoFunciona') }}</div>
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
          <div class="eyebrow home-custo-eyebrow">{{ $t('home.custoEyebrow') }}</div>
          <div class="home-custo-values">
            <div class="home-custo-entry">
              <span class="home-custo-amount">R$5</span>
              <span class="eyebrow home-custo-label">{{ $t('home.custoCc') }}</span>
            </div>
            <div class="home-custo-vs">{{ $t('home.custoVs') }}</div>
            <div class="home-custo-entry home-custo-old">
              <span class="home-custo-amount">R$2.400</span>
              <span class="eyebrow home-custo-label">{{ $t('home.custoTrad') }}</span>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div class="home-pct">99,8%</div>
          <div class="eyebrow home-pct-label">{{ $t('home.custoMaisBarato') }}</div>
        </div>
      </div>
    </section>

    <!-- Loop econômico ─────────────────────────────────── -->
    <section class="home-s-loop">
      <div class="wrap home-loop-header">
        <div class="eyebrow" style="margin-bottom:8px;">{{ $t('home.ondeVaiEyebrow') }}</div>
        <h2 class="section-title">{{ $t('home.ondeVaiTitulo') }}</h2>
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
            <div class="eyebrow" style="margin-bottom:8px;">{{ $t('home.coberturaEyebrow') }}</div>
            <h2 class="section-title">{{ $t('home.coberturaTituloPre') }}<br/>{{ $t('home.coberturaTituloPost') }}</h2>
          </div>
          <button class="btn btn-secondary btn-sm" @click="$router.push('/servicos')">{{ $t('home.verTodos') }}</button>
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
        <div class="eyebrow" style="margin-bottom:8px;">{{ $t('home.quemUsaEyebrow') }}</div>
        <h2 class="section-title" style="margin-bottom:36px;">{{ $t('home.quemUsaTituloPre') }}<br/>{{ $t('home.quemUsaTituloPost') }}</h2>
        <div class="home-perfis-grid">

          <!-- Cidadão -->
          <div class="home-perfil-card">
            <span class="badge badge-yellow">{{ $t('home.perfil.cidadao.badge') }}</span>
            <div>
              <div class="home-perfil-title">{{ $t('home.perfil.cidadao.tituloPre') }}<br/>{{ $t('home.perfil.cidadao.tituloPost') }}</div>
              <p class="body-sm">{{ $t('home.perfil.cidadao.body') }}</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.cidadao.c1') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.cidadao.c2') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.cidadao.c3') }}</li>
            </ul>
            <button class="btn btn-primary btn-sm home-perfil-cta" @click="$router.push('/registrar?demo=mcmv')">{{ $t('home.perfil.cidadao.cta') }}</button>
          </div>

          <!-- Construtora -->
          <div class="home-perfil-card">
            <span class="badge badge-emerald">{{ $t('home.perfil.construtora.badge') }}</span>
            <div>
              <div class="home-perfil-title">{{ $t('home.perfil.construtora.tituloPre') }}<br/>{{ $t('home.perfil.construtora.tituloPost') }}</div>
              <p class="body-sm">{{ $t('home.perfil.construtora.body') }}</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.construtora.c1') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.construtora.c2') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.construtora.c3') }}</li>
            </ul>
            <button class="btn btn-secondary btn-sm home-perfil-cta" style="border-color:var(--color-text-muted); color:var(--color-kraft);" @click="$router.push('/servicos')">{{ $t('home.perfil.construtora.cta') }}</button>
          </div>

          <!-- Banco / Seguradora -->
          <div class="home-perfil-card">
            <span class="badge badge-ink">{{ $t('home.perfil.banco.badge') }}</span>
            <div>
              <div class="home-perfil-title">{{ $t('home.perfil.banco.tituloPre') }}<br/>{{ $t('home.perfil.banco.tituloPost') }}</div>
              <p class="body-sm">{{ $t('home.perfil.banco.body') }}</p>
            </div>
            <ul class="check-list">
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.banco.c1') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.banco.c2') }}</li>
              <li class="check-item"><span class="check-icon">✓</span> {{ $t('home.perfil.banco.c3') }}</li>
            </ul>
            <button class="btn btn-secondary btn-sm home-perfil-cta" style="border-color:var(--color-text-muted); color:var(--color-kraft);" @click="$router.push('/verificar')">{{ $t('home.perfil.banco.cta') }}</button>
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
        <div class="eyebrow" style="margin-bottom:8px;">{{ $t('home.paraOndeVamos') }}</div>
        <h2 class="section-title">{{ $t('home.futuroTitlePre') }}<br/>{{ $t('home.futuroTitlePost') }}</h2>
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
        <div class="eyebrow" style="margin-bottom:16px;">{{ $t('home.experimente') }}</div>
        <h3 class="section-title home-cta-title">{{ $t('home.ctaTitle') }}</h3>
        <button class="btn btn-primary btn-lg home-cta-btn" @click="$router.push('/registrar?demo=mcmv')">
          {{ $t('home.ctaBtn') }}
        </button>
        <p class="body-xs home-cta-hint">{{ $t('home.ctaHint') }}</p>
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

  computed: {
    stats(): { label: string; valor: string }[] { return this.$tm('home.stats') as unknown as { label: string; valor: string }[] },
    passos(): { titulo: string; descricao: string }[] { return this.$tm('home.passos') as unknown as { titulo: string; descricao: string }[] },
    loopEconomico(): { icone: string; bg: string; titulo: string; descricao: string; tag: string }[] {
      const txt = this.$tm('home.loop') as unknown as { titulo: string; descricao: string; tag: string }[]
      const vis = [
        { icone: 'R$5', bg: 'var(--color-yellow)' },
        { icone: '✓',  bg: '#C6ECD8' },
        { icone: '◎',  bg: '#C5DCF0' },
        { icone: '∞',  bg: '#E8D5F5' },
        { icone: '↗',  bg: '#D4E8D0' },
      ]
      return vis.map((v, i) => ({ ...v, ...txt[i] }))
    },
    servicosDestaque(): { nome: string; mvp: boolean; tech: string[] }[] {
      const txt = this.$tm('home.servicosDestaque') as unknown as { nome: string; tech: string[] }[]
      const mvp = [true, true, false, false, false, false]
      return txt.map((s, i) => ({ ...s, mvp: mvp[i] }))
    },
  },

  data() {
    return {
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
  font-size: 12px;
  color: var(--color-ink-4);
  line-height: 1.4;
}

.loop-tag {
  font-size: 10px;
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
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .loop-marquee-track::-webkit-scrollbar { display: none; }
}
</style>
