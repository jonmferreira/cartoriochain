import type { RecursoItem, CasoUso } from './types'

export function getRecursos(): RecursoItem[] {
  return [
    {
      icone: 'pi pi-lock',
      titulo: 'ZK Proof + ZCash ViewKey',
      descricao: 'Prova que o signatário assinou sem revelar dados pessoais. LGPD nativa.',
    },
    {
      icone: 'pi pi-database',
      titulo: 'Imutável em Solana + Irys',
      descricao: 'Hash SHA-256 registrado on-chain. Documento arquivado permanentemente no Arweave.',
    },
    {
      icone: 'pi pi-search',
      titulo: 'Verificação pública',
      descricao: 'Qualquer pessoa verifica autenticidade pelo link — sem carteira, sem conta.',
    },
  ]
}

export function getCasosUso(): CasoUso[] {
  return [
    {
      label: 'Minha Casa Minha Vida',
      descricao: 'Escrituras e contratos de financiamento verificáveis pelo beneficiário.',
      icone: 'pi pi-home',
    },
    {
      label: 'Escritórios Jurídicos',
      descricao: 'Contratos assinados com prova criptográfica de autoria.',
      icone: 'pi pi-briefcase',
    },
    {
      label: 'Construtoras',
      descricao: 'Laudos técnicos e habite-se registrados contra falsificação.',
      icone: 'pi pi-building',
    },
    {
      label: 'Seguradoras e Bancos',
      descricao: 'Apólices e garantias com rastreabilidade imutável.',
      icone: 'pi pi-chart-bar',
    },
  ]
}
