<template>
  <div style="background:#F7EACB; min-height:100vh;">

    <!-- Hero ───────────────────────────────────────────── -->
    <section style="padding:64px 24px 48px; max-width:900px; margin:0 auto;">
      <div class="anim-slide-up" style="display:flex; align-items:flex-start; gap:48px; flex-wrap:wrap;">

        <!-- Texto -->
        <div style="flex:1; min-width:280px;">
          <div style="margin-bottom:20px;">
            <span class="tag tag-green">Hackathon Colosseum · ZCash Track</span>
          </div>
          <h1 style="font-family:var(--font-display); font-weight:900; font-size:clamp(40px,6vw,72px); line-height:1; letter-spacing:-2px; text-transform:uppercase; color:#1B231D; margin-bottom:8px;">
            Autentique<br/>
            <span style="background:#FFD23F; padding:0 6px; display:inline-block; margin:4px 0;">documentos</span><br/>
            sem confiança<br/>cega.
          </h1>
          <p style="font-size:16px; color:#4F5E50; max-width:420px; margin-top:16px; line-height:1.6;">
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
          <div style="border:2px solid #1B231D; background:#FFFDF6; padding:20px; position:relative;">
            <div style="position:absolute; top:-10px; left:16px; background:#FFD23F; border:2px solid #1B231D; padding:2px 10px; font-size:10px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase;">CartórioChain</div>
            <div style="margin-top:8px; display:flex; flex-direction:column; gap:14px;">
              <div v-for="stat in stats" :key="stat.label">
                <div style="font-size:10px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50;">{{ stat.label }}</div>
                <div style="font-size:22px; font-weight:900; color:#1B231D; margin-top:2px;">{{ stat.valor }}</div>
              </div>
            </div>
            <div style="margin-top:16px; padding-top:14px; border-top:1.5px solid #D1C09F; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:#008C4C;">
              ✓ Sem conta · Sem carteira
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Problema ─────────────────────────────────────── -->
    <section style="background:#EFE0BA; border-top:2px solid #D1C09F; border-bottom:2px solid #D1C09F; padding:48px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div class="anim-slide-up" style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:12px;">O problema</div>
            <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D; line-height:1.1; margin-bottom:12px;">
              Documentos falsificados, perdidos ou inacessíveis.
            </h2>
            <p style="color:#4F5E50; font-size:14px; line-height:1.6;">
              Programas como o <strong>Minha Casa Minha Vida</strong> movimentam bilhões em contratos. Cartórios tradicionais são lentos, caros e centralizados. Um documento pode ser falsificado e nunca ser detectado.
            </p>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:12px;">A solução</div>
            <h2 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D; line-height:1.1; margin-bottom:12px;">
              ZK Proof + ZCash ViewKey + Armazenamento permanente.
            </h2>
            <p style="color:#4F5E50; font-size:14px; line-height:1.6;">
              Cada documento gera uma prova criptográfica verificável por qualquer pessoa. Os dados do signatário ficam cifrados on-chain — só o titular da ViewKey pode ver.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona ─────────────────────────────────── -->
    <section style="padding:56px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:32px; text-align:center;">Como funciona</div>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:2px;">
          <div v-for="(passo, i) in passos" :key="i" class="anim-slide-up" :class="`anim-delay-${i+1}`" style="background:#FFFDF6; border:2px solid #1B231D; padding:28px 20px; position:relative;">
            <div style="font-size:48px; font-weight:900; color:#D1C09F; line-height:1; margin-bottom:12px; font-family:var(--font-display);">0{{ i+1 }}</div>
            <div style="font-size:15px; font-weight:800; text-transform:uppercase; letter-spacing:-0.2px; color:#1B231D; margin-bottom:8px;">{{ passo.titulo }}</div>
            <p style="font-size:13px; color:#4F5E50; line-height:1.5;">{{ passo.descricao }}</p>
            <div style="margin-top:14px;">
              <span class="tag tag-muted">{{ passo.tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Para quem ─────────────────────────────────────── -->
    <section style="background:#1B231D; padding:48px 24px;">
      <div style="max-width:900px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:28px;">Para quem é</div>
        <div style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px;">
          <div v-for="caso in casos" :key="caso.label" style="border:2px solid #2C3A2F; padding:20px; background:#232E25; cursor:default; transition:border-color 0.2s cubic-bezier(0.32,0.72,0,1), box-shadow 0.2s cubic-bezier(0.32,0.72,0,1), transform 0.2s cubic-bezier(0.32,0.72,0,1);" @mouseover="caso._hover=true" @mouseleave="caso._hover=false" :style="caso._hover ? 'border-color:#008C4C; box-shadow:0 4px 20px rgba(0,140,76,0.15); transform:translateY(-2px);' : ''"  >
            <div style="font-size:11px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:#FFD23F; margin-bottom:6px;">{{ caso.label }}</div>
            <p style="font-size:13px; color:#D1C09F; line-height:1.5;">{{ caso.descricao }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final ─────────────────────────────────────── -->
    <section style="padding:56px 24px; text-align:center;">
      <div style="max-width:500px; margin:0 auto;">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:16px;">Experimente agora</div>
        <h3 style="font-family:var(--font-display); font-weight:900; font-size:28px; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D; margin-bottom:24px;">Registro em menos de 30 segundos.</h3>
        <button class="btn btn-primary btn-lg" style="font-size:16px; padding:20px 40px;" @click="$router.push('/registrar?demo=mcmv')">
          ↗ Ver demo: escritura MCMV
        </button>
        <p style="margin-top:14px; font-size:12px; color:#4F5E50;">Sem carteira. Sem conta. Dados reais ficam na devnet.</p>
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
        { label: 'Privacidade',        valor: 'ZCash VK' },
      ],
      passos: [
        { titulo: 'Envie o documento',   descricao: 'Upload do arquivo. Calculamos o hash SHA-256 — o conteúdo nunca sai do seu dispositivo.',         tech: 'SHA-256' },
        { titulo: 'Gera prova ZK',       descricao: 'Uma prova criptográfica é gerada e vinculada ao seu documento. Verificável por qualquer pessoa.',    tech: 'Noir / Circom' },
        { titulo: 'Registra on-chain',   descricao: 'O hash e a prova vão para Solana + Irys. Dados do signatário ficam cifrados via ZCash ViewKey.',     tech: 'Solana · Irys' },
      ],
      casos: [
        { label: 'Construtoras',    descricao: 'Contratos de financiamento habitacional autenticados, auditáveis e imutáveis.',  _hover: false },
        { label: 'Escritórios',     descricao: 'Procurações, contratos e laudos com prova de autenticidade verificável sem intermediários.', _hover: false },
        { label: 'Minha Casa Minha Vida', descricao: 'Documentação habitacional de famílias de baixa renda protegida contra fraude.',    _hover: false },
        { label: 'Seguradoras',     descricao: 'Sinistros comprovados com evidência on-chain. Fraude detectada antes do pagamento.',   _hover: false },
      ],
    }
  },
})
</script>
