import { createI18n } from 'vue-i18n'

// Scaffold i18n PT-BR / EN. Começa pela Home (padrão provado); demais páginas expandem depois.
// Preferência persiste em localStorage.

const STORAGE_KEY = 'cc-locale'

const messages = {
  pt: {
    nav: { inicio: 'Início', servicos: 'Serviços', registrar: 'Registrar', verificar: 'Verificar' },
    lang: { pt: 'PT', en: 'EN', aria: 'Selecionar idioma' },
    home: {
      heroVerb: 'Autentique',
      heroHighlight: 'documentos',
      heroRest: 'com prova criptográfica.',
      heroSub: 'Sem intermediário.',
      heroBody:
        'Cartório digital descentralizado para o mercado brasileiro. Prova criptográfica de autenticidade. Dados do signatário protegidos por criptografia de divulgação seletiva — LGPD nativa.',
      ctaRegistrar: '↗ Registrar documento',
      ctaVerificar: '◎ Verificar autenticidade',
      stickerFoot: '✓ Sem conta · Sem carteira',
      problemaEyebrow: 'O problema',
      problemaTitle: 'Documentos falsificados, perdidos ou inacessíveis.',
      problemaBody:
        'Programas como o Minha Casa Minha Vida movimentam bilhões em contratos. Cartórios tradicionais são lentos, caros e centralizados. Um documento pode ser falsificado e nunca ser detectado.',
      solucaoEyebrow: 'A solução',
      solucaoTitle: 'ZK Proof + privacidade com divulgação seletiva + Armazenamento permanente.',
      solucaoBody:
        'Cada documento gera uma prova criptográfica verificável por qualquer pessoa. Os dados do signatário ficam cifrados — só quem tem a chave pode ver.',
      pqcBadgeTag: 'Proteção pós-quântica',
      pqcBadgeText:
        'Produzido com estratégia de proteção pós-quântica — abordagem híbrida alinhada às diretrizes de transição PQC do NIST ↗',
      comoFunciona: 'Como funciona',
      passos: [
        { titulo: 'Envie o documento', descricao: 'Geramos uma impressão digital única do arquivo — o conteúdo nunca sai do seu dispositivo.' },
        { titulo: 'Gera prova de autenticidade', descricao: 'Uma prova criptográfica é gerada e vinculada ao documento. Qualquer pessoa pode verificar, sem intermediário.' },
        { titulo: 'Registra permanentemente', descricao: 'A prova vai para Solana + Irys. Dados do signatário ficam protegidos — só o titular pode ver.' },
      ],
      stats: [
        { label: 'Custo por registro', valor: '~$0.001' },
        { label: 'Tempo de registro', valor: '< 5 seg' },
        { label: 'Armazenamento', valor: 'Permanente' },
        { label: 'Privacidade', valor: 'Total' },
      ],
      paraOndeVamos: 'Para onde vamos',
      futuroTitlePre: 'Infraestrutura de confiança',
      futuroTitlePost: 'para o Brasil inteiro.',
      experimente: 'Experimente agora',
      ctaTitle: 'Registro em menos de 30 segundos.',
      ctaBtn: '↗ Ver demo: escritura MCMV',
      ctaHint: 'É um demo — nenhum dado real é armazenado.',
    },
  },
  en: {
    nav: { inicio: 'Home', servicos: 'Services', registrar: 'Register', verificar: 'Verify' },
    lang: { pt: 'PT', en: 'EN', aria: 'Select language' },
    home: {
      heroVerb: 'Authenticate',
      heroHighlight: 'documents',
      heroRest: 'with cryptographic proof.',
      heroSub: 'No middleman.',
      heroBody:
        'A decentralized digital notary for the Brazilian market. Cryptographic proof of authenticity. Signer data protected by selective-disclosure encryption — privacy-law native.',
      ctaRegistrar: '↗ Register a document',
      ctaVerificar: '◎ Verify authenticity',
      stickerFoot: '✓ No account · No wallet',
      problemaEyebrow: 'The problem',
      problemaTitle: 'Documents forged, lost or locked away.',
      problemaBody:
        'Programs like Minha Casa Minha Vida move billions in contracts. Traditional notaries are slow, expensive and centralized. A document can be forged and never detected.',
      solucaoEyebrow: 'The solution',
      solucaoTitle: 'ZK proof + selective-disclosure privacy + permanent storage.',
      solucaoBody:
        'Every document produces a cryptographic proof anyone can verify. The signer data stays encrypted — only the key-holder can read it.',
      pqcBadgeTag: 'Post-quantum protection',
      pqcBadgeText:
        'Built with a post-quantum protection strategy — a hybrid approach aligned with NIST post-quantum transition guidance ↗',
      comoFunciona: 'How it works',
      passos: [
        { titulo: 'Upload the document', descricao: 'We generate a unique fingerprint of the file — the content never leaves your device.' },
        { titulo: 'Generates proof of authenticity', descricao: 'A cryptographic proof is created and bound to the document. Anyone can verify it, with no middleman.' },
        { titulo: 'Registers permanently', descricao: 'The proof goes to Solana + Irys. Signer data stays protected — only the holder can see it.' },
      ],
      stats: [
        { label: 'Cost per registration', valor: '~$0.001' },
        { label: 'Registration time', valor: '< 5 sec' },
        { label: 'Storage', valor: 'Permanent' },
        { label: 'Privacy', valor: 'Full' },
      ],
      paraOndeVamos: 'Where we are going',
      futuroTitlePre: 'Trust infrastructure',
      futuroTitlePost: 'for all of Brazil.',
      experimente: 'Try it now',
      ctaTitle: 'Registration in under 30 seconds.',
      ctaBtn: '↗ See demo: MCMV deed',
      ctaHint: 'It is a demo — no real data is stored.',
    },
  },
}

function initialLocale(): 'pt' | 'en' {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  return saved === 'en' ? 'en' : 'pt'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale(),
  fallbackLocale: 'pt',
  messages,
})

// Reflete o idioma inicial no <html lang> (a11y/SEO), não só ao trocar.
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale() === 'en' ? 'en' : 'pt-BR'
}

export function setLocale(locale: 'pt' | 'en') {
  i18n.global.locale.value = locale
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale)
  if (typeof document !== 'undefined') document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR'
}
