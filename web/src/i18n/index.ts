import { createI18n } from 'vue-i18n'

// Scaffold i18n PT-BR / EN. Começa pela Home (padrão provado); demais páginas expandem depois.
// Preferência persiste em localStorage.

// i18n PT-BR / EN. Expansão em andamento (módulo por módulo). Padrão: strings estáticas via $t;
// arrays (passos/stats/loop/servicosDestaque) via computed lendo $tm('home.<chave>') + merge visual.
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
      custoEyebrow: 'Custo por escritura MCMV',
      custoCc: 'CartórioChain',
      custoTrad: 'Cartório tradicional',
      custoVs: 'vs',
      custoMaisBarato: 'mais barato',
      ondeVaiEyebrow: 'Onde vai o R$5',
      ondeVaiTitulo: 'Cada centavo é rastreável.',
      loop: [
        { titulo: 'Promocional', descricao: 'Taxa única via PIX por documento', tag: '' },
        { titulo: 'Autenticado', descricao: 'ZK proof gerado e vinculado ao arquivo', tag: 'ZK Proof' },
        { titulo: 'Registrado', descricao: 'Timestamp imutável na Solana', tag: '~R$0,001' },
        { titulo: 'Armazenado', descricao: 'Documento permanente via Irys', tag: '~R$0,10' },
        { titulo: 'Verificável', descricao: 'Link público para qualquer pessoa, para sempre', tag: 'Grátis' },
      ],
      coberturaEyebrow: 'Cobertura cartorial',
      coberturaTituloPre: '12 serviços mapeados.',
      coberturaTituloPost: '2 funcionando hoje.',
      verTodos: 'Ver todos →',
      servicosDestaque: [
        { nome: 'Autenticação', tech: ['SHA-256', 'Solana', 'Irys'] },
        { nome: 'Escritura MCMV', tech: ['Divulgação seletiva', 'Solana'] },
        { nome: 'Reconhecimento de firma', tech: ['ZK Proof', 'Divulgação seletiva'] },
        { nome: 'Procuração', tech: ['ZK Proof', 'Divulgação seletiva'] },
        { nome: 'Ata notarial', tech: ['Solana', 'Irys'] },
        { nome: 'Apostila de Haia', tech: ['ZK público'] },
      ],
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
      custoEyebrow: 'Cost per MCMV deed',
      custoCc: 'CartórioChain',
      custoTrad: 'Traditional notary',
      custoVs: 'vs',
      custoMaisBarato: 'cheaper',
      ondeVaiEyebrow: 'Where the R$5 goes',
      ondeVaiTitulo: 'Every cent is traceable.',
      loop: [
        { titulo: 'Promotional', descricao: 'One-time PIX fee per document', tag: '' },
        { titulo: 'Authenticated', descricao: 'ZK proof generated and bound to the file', tag: 'ZK Proof' },
        { titulo: 'Registered', descricao: 'Immutable timestamp on Solana', tag: '~R$0.001' },
        { titulo: 'Stored', descricao: 'Permanent document via Irys', tag: '~R$0.10' },
        { titulo: 'Verifiable', descricao: 'Public link for anyone, forever', tag: 'Free' },
      ],
      coberturaEyebrow: 'Notarial coverage',
      coberturaTituloPre: '12 services mapped.',
      coberturaTituloPost: '2 working today.',
      verTodos: 'See all →',
      servicosDestaque: [
        { nome: 'Authentication', tech: ['SHA-256', 'Solana', 'Irys'] },
        { nome: 'MCMV deed', tech: ['Selective disclosure', 'Solana'] },
        { nome: 'Signature recognition', tech: ['ZK Proof', 'Selective disclosure'] },
        { nome: 'Power of attorney', tech: ['ZK Proof', 'Selective disclosure'] },
        { nome: 'Notarial record', tech: ['Solana', 'Irys'] },
        { nome: 'Apostille', tech: ['Public ZK'] },
      ],
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
