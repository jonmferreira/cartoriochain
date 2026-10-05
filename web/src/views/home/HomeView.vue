<template>
  <div style="background:#1B231D; min-height:100vh;">

    <!-- Hero ───────────────────────────────────────────── -->
    <section style="padding:64px 24px 48px; max-width:900px; margin:0 auto;">
      <div class="anim-slide-up" style="display:flex; align-items:flex-start; gap:48px; flex-wrap:wrap;">

        <!-- Texto -->
        <div style="flex:1; min-width:280px;">
          <div style="margin-bottom:20px;">
            <span class="tag tag-green">Hackathon Colosseum · ZCash Track</span>
          </div>
          <h1 style="font-family:var(--font-display); font-weight:900; font-size:clamp(36px,4.5vw,58px); line-height:1; letter-spacing:-2px; text-transform:uppercase; color:#F7EACB; margin-bottom:8px; word-break:break-word;">
            Autentique<br/>
            <span style="background:#FFD23F; padding:0 6px; display:inline-block; margin:4px 0;">documentos</span><br/>
            com prova<br/>criptográfica.<br/>
            <span style="font-size:0.55em; letter-spacing:-0.5px; color:#4F5E50;">Sem intermediário.</span>
          </h1>
          <p style="font-size:16px; color:#8A9E8C; max-width:420px; margin-top:16px; line-height:1.6;">
            Cartório digital descentralizado para o mercado brasileiro.
            Prova criptográfica de autenticidade. Dados do signatário protegidos por ZCash ViewKey — LGPD nativa.
          </p>
          <div style="display:flex; gap:12px; margin-top:32px; flex-wrap:wrap;">
            <button class="btn btn-primary btn-lg" style="cursor:pointer;" @click="$router.push('/registrar?demo=mcmv')">
              ↗ Registrar documento
            </button>
            <button class="btn btn-secondary btn-lg" style="cursor:pointer;" @click="$router.push('/verificar')">
              ◎ Verificar autenticidade
            </button>
          </div>
        </div>

        <!-- Sticker card -->
        <div class="anim-slide-up anim-delay-2" style="width:240px; flex-shrink:0;">
          <div style="border:2px solid #3A4F3E; background:#2C3A2E; padding:20px; position:relative; box-shadow:0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);">
            <div style="position:absolute; top:-10px; left:16px; background:#FFD23F; border:2px solid #1B231D; padding:2px 10px; font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">CartórioChain</div>
            <div style="margin-top:8px; display:flex; flex-direction:column; gap:14px;">
              <div v-for="stat in stats" :key="stat.label">
                <div style="font-size:10px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50;">{{ stat.label }}</div>
                <div style="font-size:22px; font-weight:900; color:#F7EACB; margin-top:2px;">{{ stat.valor }}</div>
              </div>
            </div>
            <div style="margin-top:16px; padding-top:14px; border-top:1.5px solid #3A4F3E; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#008C4C;">
              ✓ Sem conta · Sem carteira
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Problema ─────────────────────────────────────── -->
    <section style="background:#243029; border-top:3px solid #008C4C; border-bottom:3px solid #008C4C; padding:48px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div class="anim-slide-up grid-2">
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#6B8A6E; margin-bottom:12px;">O problema</div>
            <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; line-height:1.1; margin-bottom:12px;">
              Documentos falsificados, perdidos ou inacessíveis.
            </h2>
            <p style="color:#8A9E8C; font-size:14px; line-height:1.6;">
              Programas como o <strong>Minha Casa Minha Vida</strong> movimentam bilhões em contratos. Cartórios tradicionais são lentos, caros e centralizados. Um documento pode ser falsificado e nunca ser detectado.
            </p>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#6B8A6E; margin-bottom:12px;">A solução</div>
            <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; line-height:1.1; margin-bottom:12px;">
              ZK Proof + ZCash ViewKey + Armazenamento permanente.
            </h2>
            <p style="color:#8A9E8C; font-size:14px; line-height:1.6;">
              Cada documento gera uma prova criptográfica verificável por qualquer pessoa. Os dados do signatário ficam cifrados on-chain — só o titular da ViewKey pode ver.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona ─────────────────────────────────── -->
    <section style="padding:56px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#6B8A6E; margin-bottom:32px; text-align:center;">Como funciona</div>
        <div class="grid-3">
          <div v-for="(passo, i) in passos" :key="i" class="anim-slide-up" :class="`anim-delay-${i+1}`" style="background:#2C3A2E; border:2px solid #3A4F3E; border-top:3px solid #008C4C; padding:28px 20px; position:relative; box-shadow:0 8px 32px rgba(0,0,0,0.45)">
            <div style="font-size:48px; font-weight:900; color:#D1C09F; line-height:1; margin-bottom:12px; font-family:var(--font-display);">0{{ i+1 }}</div>
            <div style="font-size:15px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:#F7EACB; margin-bottom:8px;">{{ passo.titulo }}</div>
            <p style="font-size:13px; color:#8A9E8C; line-height:1.5;">{{ passo.descricao }}</p>
            <div style="margin-top:14px;">
              <span class="tag tag-muted">{{ passo.tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparativo de custo ──────────────────────────── -->
    <section style="background:#FFD23F; border-top:3px solid #1B231D; border-bottom:3px solid #1B231D; padding:32px 24px;">
      <div style="max-width:900px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px;">
        <div>
          <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#1B231D; opacity:0.6; margin-bottom:6px;">Custo por escritura MCMV</div>
          <div style="display:flex; align-items:baseline; gap:20px; flex-wrap:wrap;">
            <div style="display:flex; align-items:baseline; gap:8px;">
              <span style="font-family:var(--font-display); font-size:48px; font-weight:900; color:#1B231D; letter-spacing:-2px; line-height:1;">R$5</span>
              <span style="font-size:13px; font-weight:800; color:#1B231D; text-transform:uppercase; letter-spacing:0.05em;">CartórioChain</span>
            </div>
            <div style="font-size:22px; font-weight:900; color:#1B231D; opacity:0.4;">vs</div>
            <div style="display:flex; align-items:baseline; gap:8px; text-decoration:line-through; opacity:0.5;">
              <span style="font-family:var(--font-display); font-size:48px; font-weight:900; color:#1B231D; letter-spacing:-2px; line-height:1;">R$2.400</span>
              <span style="font-size:13px; font-weight:800; color:#1B231D; text-transform:uppercase; letter-spacing:0.05em;">Cartório tradicional</span>
            </div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:var(--font-display); font-size:36px; font-weight:900; color:#1B231D; letter-spacing:-1px; line-height:1;">99,8%</div>
          <div style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:#1B231D; opacity:0.7; margin-top:4px;">mais barato</div>
        </div>
      </div>
    </section>

    <!-- Loop econômico ─────────────────────────────────── -->
    <section style="background:#1B231D; border-bottom:3px solid #008C4C; padding:48px 0;">
      <div style="max-width:900px; margin:0 auto; padding:0 24px; margin-bottom:28px;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Onde vai o R$5</div>
        <h2 style="font-family:var(--font-display); font-weight:900; font-size:24px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; line-height:1.1;">Cada centavo é rastreável.</h2>
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
    <section style="background:#1B231D; padding:48px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Cobertura cartorial</div>
            <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; line-height:1.1;">12 serviços mapeados.<br/>2 funcionando hoje.</h2>
          </div>
          <button class="btn btn-secondary btn-sm" style="cursor:pointer;" @click="$router.push('/servicos')">Ver todos →</button>
        </div>
        <div class="grid-3">
          <div v-for="s in servicosDestaque" :key="s.nome"
            style="border:2px solid #2C3A2F; padding:18px 16px; background:#232E25; position:relative;"
            :style="s.mvp ? 'border-color:#008C4C;' : ''"
          >
            <div v-if="s.mvp" style="position:absolute; top:-1px; right:-1px; background:#008C4C; padding:2px 8px; font-size:9px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:white;">MVP</div>
            <div style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:#F7EACB; margin-bottom:6px;">{{ s.nome }}</div>
            <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px;">
              <span v-for="t in s.tech" :key="t" style="font-size:10px; font-weight:700; color:#4F5E50; border:1.5px solid #2C3A2F; padding:2px 6px;">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Para quem ─────────────────────────────────────── -->
    <section style="background:#1B231D; padding:56px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Quem usa</div>
        <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; line-height:1.1; margin-bottom:36px;">Três formas de usar.<br/>Uma infraestrutura.</h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:2px;">

          <!-- Perfil 1 — Pessoa física -->
          <div style="background:#232E25; border:2px solid #2C3A2F; padding:28px 24px; display:flex; flex-direction:column; gap:16px; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1),transform 0.2s cubic-bezier(0.32,0.72,0,1);" @mouseover="$el.style.borderColor='#008C4C'" @mouseleave="$el.style.borderColor='#2C3A2F'">
            <div>
              <span style="font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; background:#FFD23F; color:#1B231D; padding:3px 8px;">Cidadão</span>
            </div>
            <div>
              <div style="font-size:17px; font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#F7EACB; margin-bottom:8px;">Escrituras, contratos<br/>e procurações</div>
              <p style="font-size:13px; color:#8A9E8C; line-height:1.6;">Autentique documentos habitacionais, herança e contratos pessoais. R$5 por registro — sem conta, sem carteira digital.</p>
            </div>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Registro em menos de 30 segundos</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Link público de verificação para qualquer pessoa</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Dados pessoais protegidos — só o titular acessa</li>
            </ul>
            <button class="btn btn-primary btn-sm" style="margin-top:auto; cursor:pointer;" @click="$router.push('/registrar?demo=mcmv')">↗ Registrar documento</button>
          </div>

          <!-- Perfil 2 — Construtoras e escritórios -->
          <div style="background:#232E25; border:2px solid #2C3A2F; padding:28px 24px; display:flex; flex-direction:column; gap:16px; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1),transform 0.2s cubic-bezier(0.32,0.72,0,1);" @mouseover="$el.style.borderColor='#008C4C'" @mouseleave="$el.style.borderColor='#2C3A2F'">
            <div>
              <span style="font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; background:#008C4C; color:white; padding:3px 8px;">Construtora · Escritório</span>
            </div>
            <div>
              <div style="font-size:17px; font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#F7EACB; margin-bottom:8px;">Volume de documentos<br/>com rastreabilidade</div>
              <p style="font-size:13px; color:#8A9E8C; line-height:1.6;">API batch para registrar centenas de contratos MCMV ou jurídicos por mês. Auditoria on-chain elimina passivo por fraude.</p>
            </div>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> API batch — integra com ERP jurídico</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Painel de gestão por projeto / obra</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> R$3/doc em volume (vs R$300 em cartório)</li>
            </ul>
            <button class="btn btn-secondary btn-sm" style="margin-top:auto; border-color:#4F5E50; color:#D1C09F; cursor:pointer;" @click="$router.push('/servicos')">Ver planos B2B →</button>
          </div>

          <!-- Perfil 3 — Bancos e Seguradoras -->
          <div style="background:#232E25; border:2px solid #2C3A2F; padding:28px 24px; display:flex; flex-direction:column; gap:16px; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1),transform 0.2s cubic-bezier(0.32,0.72,0,1);" @mouseover="$el.style.borderColor='#008C4C'" @mouseleave="$el.style.borderColor='#2C3A2F'">
            <div>
              <span style="font-size:9px; font-weight:800; letter-spacing:0.12em; text-transform:uppercase; background:#4F5E50; color:#F7EACB; padding:3px 8px;">Banco · Seguradora</span>
            </div>
            <div>
              <div style="font-size:17px; font-weight:900; text-transform:uppercase; letter-spacing:-0.3px; color:#F7EACB; margin-bottom:8px;">Verificação de autenticidade<br/>em lote</div>
              <p style="font-size:13px; color:#8A9E8C; line-height:1.6;">Confirme a autenticidade de escrituras e laudos antes de liberar financiamento ou pagar sinistros. Resposta em millisegundos.</p>
            </div>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Consulta pública sem wallet nem conta</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> API REST — integra com due diligence existente</li>
              <li style="font-size:12px; color:#D1C09F; display:flex; gap:8px; align-items:flex-start;"><span style="color:#008C4C; flex-shrink:0;">✓</span> Evidência imutável, auditável por qualquer parte</li>
            </ul>
            <button class="btn btn-secondary btn-sm" style="margin-top:auto; border-color:#4F5E50; color:#D1C09F; cursor:pointer;" @click="$router.push('/verificar')">◎ Verificar autenticidade</button>
          </div>

        </div>
      </div>
    </section>

    <!-- CTA final ─────────────────────────────────────── -->
    <section style="padding:56px 24px; text-align:center;">
      <div style="max-width:500px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:16px;">Experimente agora</div>
        <h3 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB; margin-bottom:24px;">Registro em menos de 30 segundos.</h3>
        <button class="btn btn-primary btn-lg" style="font-size:16px; padding:20px 40px;" @click="$router.push('/registrar?demo=mcmv')">
          ↗ Ver demo: escritura MCMV
        </button>
        <p style="margin-top:14px; font-size:12px; color:#4F5E50;">É um demo — nenhum dado real é armazenado.</p>
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      stats: [
        { label: 'Custo por registro', valor: '~$0.001' },
        { label: 'Tempo de registro',  valor: '< 5 seg' },
        { label: 'Armazenamento',      valor: 'Permanente' },
        { label: 'Privacidade',        valor: 'Total' },
      ],
      loopEconomico: [
        { icone: 'R$5', bg: '#FFD23F', titulo: 'Promocional', descricao: 'Taxa única via PIX por documento', tag: null },
        { icone: '✓',  bg: '#C6ECD8', titulo: 'Autenticado', descricao: 'ZK proof gerado e vinculado ao arquivo', tag: 'ZK Proof' },
        { icone: '◎',  bg: '#C5DCF0', titulo: 'Registrado', descricao: 'Timestamp imutável na Solana', tag: '~R$0,001' },
        { icone: '∞',  bg: '#E8D5F5', titulo: 'Armazenado', descricao: 'Documento permanente via Irys', tag: '~R$0,10' },
        { icone: '↗',  bg: '#D4E8D0', titulo: 'Verificável', descricao: 'Link público para qualquer pessoa, para sempre', tag: 'Grátis' },
      ],
      passos: [
        { titulo: 'Envie o documento',        descricao: 'Geramos uma impressão digital única do arquivo — o conteúdo nunca sai do seu dispositivo.',         tech: 'SHA-256' },
        { titulo: 'Gera prova de autenticidade', descricao: 'Uma prova criptográfica é gerada e vinculada ao documento. Qualquer pessoa pode verificar, sem intermediário.', tech: 'Noir / Circom' },
        { titulo: 'Registra permanentemente',   descricao: 'A prova vai para Solana + Irys. Dados do signatário ficam protegidos — só o titular pode ver.',              tech: 'Solana · Irys' },
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
  border: 2px solid #1B231D;
  box-sizing: border-box;
}

.loop-icon {
  width: 60px;
  height: 60px;
  border: 3px solid #1B231D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 900;
  font-family: var(--font-display);
  color: #1B231D;
  flex-shrink: 0;
}

.loop-titulo {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.2px;
  color: #1B231D;
  line-height: 1.2;
}

.loop-desc {
  font-size: 11px;
  color: #4F5E50;
  line-height: 1.4;
}

.loop-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: #1B231D;
  color: #FFD23F;
  padding: 2px 8px;
}

.loop-arrow {
  font-size: 20px;
  color: #D1C09F;
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
