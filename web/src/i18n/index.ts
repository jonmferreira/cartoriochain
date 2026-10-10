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
      quemUsaEyebrow: 'Quem usa',
      quemUsaTituloPre: 'Três formas de usar.',
      quemUsaTituloPost: 'Uma infraestrutura.',
      perfil: {
        cidadao: {
          badge: 'Cidadão',
          tituloPre: 'Escrituras, contratos', tituloPost: 'e procurações',
          body: 'Autentique documentos habitacionais, herança e contratos pessoais. R$5 por registro — sem conta, sem carteira digital.',
          c1: 'Registro em menos de 30 segundos',
          c2: 'Link público de verificação para qualquer pessoa',
          c3: 'Dados pessoais protegidos — só o titular acessa',
          cta: '↗ Registrar documento',
        },
        construtora: {
          badge: 'Construtora · Escritório',
          tituloPre: 'Volume de documentos', tituloPost: 'com rastreabilidade',
          body: 'API batch para registrar centenas de contratos MCMV ou jurídicos por mês. Auditoria on-chain elimina passivo por fraude.',
          c1: 'API batch — integra com ERP jurídico',
          c2: 'Painel de gestão por projeto / obra',
          c3: 'R$3/doc em volume (vs R$300 em cartório)',
          cta: 'Ver planos B2B →',
        },
        banco: {
          badge: 'Banco · Seguradora',
          tituloPre: 'Verificação de autenticidade', tituloPost: 'em lote',
          body: 'Confirme a autenticidade de escrituras e laudos antes de liberar financiamento ou pagar sinistros. Resposta em millisegundos.',
          c1: 'Consulta pública sem wallet nem conta',
          c2: 'API REST — integra com due diligence existente',
          c3: 'Evidência imutável, auditável por qualquer parte',
          cta: '◎ Verificar autenticidade',
        },
      },
      inpiEyebrow: 'Propriedade intelectual',
      inpiTituloPre: 'O registro hoje.',
      inpiTituloPost: 'O registro partindo daqui.',
      inpiBody: 'O INPI não tem API. Não tem velocidade. Mas tem validade jurídica. O CartórioChain resolve tudo que vem antes — e garante que quando você chegar lá, ninguém vai poder contestar que a ideia não era sua.',
      inpiT1Label: 'Via INPI direto',
      inpiT1Tag: 'burocracia tradicional',
      inpiColTipo: 'Tipo de registro',
      inpiColCusto: 'Custo',
      inpiColPrazo: 'Prazo',
      inpiColAnterior: 'Anterioridade garantida em',
      inpiArrow: '↓ partindo do CartórioChain',
      inpiT2Label: 'Via CartórioChain → INPI',
      inpiT2Tag: 'R$5 · imediato',
      inpiColEtapa: 'Etapa',
      inpiColVelocidade: 'Velocidade',
      inpiColGarante: 'O que garante',
      inpiRows: [
        { tipo: 'Registro de marca', custo: 'R$440–1.720/classe', prazo: '18–36 meses', anterior: 'Data do protocolo' },
        { tipo: 'Registro de software', custo: '~R$160', prazo: '< 7 dias', anterior: 'Data do protocolo' },
        { tipo: 'Patente de invenção', custo: 'R$500–2.400', prazo: '7–10 anos', anterior: 'Data do protocolo' },
      ],
      inpiCcRows: [
        { etapa: 'Prova de anterioridade', custo: 'R$5', velocidade: 'Imediato', garante: 'Hash + timestamp imutável on-chain — prior art provado antes mesmo de protocolar' },
        { etapa: 'Consulta de conflito', custo: 'incluído', velocidade: 'Segundos', garante: 'Checa se sua marca já existe no INPI antes de você gastar R$440+' },
        { etapa: 'Pacote para protocolo', custo: 'incluído', velocidade: 'Automático', garante: 'Hash no formato e-Software + Declaração de Veracidade pré-preenchida' },
        { etapa: 'Protocolo no INPI', custo: 'R$440+', velocidade: '18–36 meses', garante: 'Com anterioridade já garantida desde o primeiro dia' },
      ],
      futuro: [
        { titulo: 'Autenticação e escrituras', desc: 'SHA-256 + ZK proof para documentos habitacionais, contratos MCMV e escrituras públicas. Funcionando em produção.', status: '✓ Disponível hoje' },
        { titulo: 'Propriedade intelectual', desc: 'Prior art criptográfico para marcas, software e inventores — antes mesmo de protocolar no INPI. Prova instantânea, R$5.', status: '→ Em desenvolvimento' },
        { titulo: 'Identidade ZK on-chain', desc: 'Cidadão prova quem é sem revelar CPF. Vinculação com gov.br via ZK commitment — privacidade sem impunidade.', status: '○ Roadmap' },
        { titulo: 'Multi-party e contratos', desc: 'Todas as partes assinam com ZK proof — nenhuma enxerga os dados da outra. Divórcio, inventário, partilha extrajudicial.', status: '○ Roadmap' },
        { titulo: 'Integração governo', desc: 'Registro civil, certidões, apostila de Haia. CartórioChain como infraestrutura pública — cartório para 215 milhões de brasileiros.', status: '◌ Visão' },
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
      quemUsaEyebrow: 'Who uses it',
      quemUsaTituloPre: 'Three ways to use it.',
      quemUsaTituloPost: 'One infrastructure.',
      perfil: {
        cidadao: {
          badge: 'Citizen',
          tituloPre: 'Deeds, contracts', tituloPost: 'and powers of attorney',
          body: 'Authenticate housing documents, inheritance and personal contracts. R$5 per registration — no account, no digital wallet.',
          c1: 'Registration in under 30 seconds',
          c2: 'Public verification link for anyone',
          c3: 'Personal data protected — only the holder has access',
          cta: '↗ Register a document',
        },
        construtora: {
          badge: 'Builder · Law firm',
          tituloPre: 'Document volume', tituloPost: 'with traceability',
          body: 'Batch API to register hundreds of MCMV or legal contracts per month. On-chain auditing removes fraud liability.',
          c1: 'Batch API — integrates with legal ERP',
          c2: 'Management dashboard per project / site',
          c3: 'R$3/doc at volume (vs R$300 at a notary)',
          cta: 'See B2B plans →',
        },
        banco: {
          badge: 'Bank · Insurer',
          tituloPre: 'Authenticity verification', tituloPost: 'in bulk',
          body: 'Confirm the authenticity of deeds and reports before releasing financing or paying claims. Response in milliseconds.',
          c1: 'Public lookup with no wallet or account',
          c2: 'REST API — integrates with existing due diligence',
          c3: 'Immutable evidence, auditable by any party',
          cta: '◎ Verify authenticity',
        },
      },
      inpiEyebrow: 'Intellectual property',
      inpiTituloPre: 'Registration today.',
      inpiTituloPost: 'Registration starting from here.',
      inpiBody: 'Brazil\'s patent office (INPI) has no API and no speed, but it has legal validity. CartórioChain solves everything that comes before — and guarantees that when you get there, no one can dispute the idea was yours.',
      inpiT1Label: 'Via INPI directly',
      inpiT1Tag: 'traditional bureaucracy',
      inpiColTipo: 'Registration type',
      inpiColCusto: 'Cost',
      inpiColPrazo: 'Timeframe',
      inpiColAnterior: 'Priority guaranteed on',
      inpiArrow: '↓ starting from CartórioChain',
      inpiT2Label: 'Via CartórioChain → INPI',
      inpiT2Tag: 'R$5 · instant',
      inpiColEtapa: 'Step',
      inpiColVelocidade: 'Speed',
      inpiColGarante: 'What it guarantees',
      inpiRows: [
        { tipo: 'Trademark registration', custo: 'R$440–1,720/class', prazo: '18–36 months', anterior: 'Filing date' },
        { tipo: 'Software registration', custo: '~R$160', prazo: '< 7 days', anterior: 'Filing date' },
        { tipo: 'Patent of invention', custo: 'R$500–2,400', prazo: '7–10 years', anterior: 'Filing date' },
      ],
      inpiCcRows: [
        { etapa: 'Proof of priority', custo: 'R$5', velocidade: 'Instant', garante: 'Hash + immutable on-chain timestamp — prior art proven before you even file' },
        { etapa: 'Conflict check', custo: 'included', velocidade: 'Seconds', garante: 'Checks whether your trademark already exists at INPI before you spend R$440+' },
        { etapa: 'Filing package', custo: 'included', velocidade: 'Automatic', garante: 'Hash in e-Software format + pre-filled Declaration of Truth' },
        { etapa: 'Filing at INPI', custo: 'R$440+', velocidade: '18–36 months', garante: 'With priority already guaranteed from day one' },
      ],
      futuro: [
        { titulo: 'Authentication and deeds', desc: 'SHA-256 + ZK proof for housing documents, MCMV contracts and public deeds. Running in production.', status: '✓ Available today' },
        { titulo: 'Intellectual property', desc: 'Cryptographic prior art for trademarks, software and inventors — before even filing at INPI. Instant proof, R$5.', status: '→ In development' },
        { titulo: 'On-chain ZK identity', desc: 'A citizen proves who they are without revealing their CPF. Binding to gov.br via ZK commitment — privacy without impunity.', status: '○ Roadmap' },
        { titulo: 'Multi-party and contracts', desc: 'All parties sign with ZK proof — none sees the others\' data. Divorce, inheritance, out-of-court settlement.', status: '○ Roadmap' },
        { titulo: 'Government integration', desc: 'Civil registry, certificates, Hague apostille. CartórioChain as public infrastructure — a notary for 215 million Brazilians.', status: '◌ Vision' },
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
