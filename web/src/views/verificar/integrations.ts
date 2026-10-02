import http from '../../services/http'
import type { VerificarResult } from './types'

export async function verificarDocumento(docId: string, docHashHex?: string): Promise<VerificarResult> {
  try {
    const { data: documento } = await http.get(`/documents/${docId}`)

    if (docHashHex) {
      const { data: verify } = await http.post(`/documents/${docId}/verify`, { docHash: docHashHex })
      return { valido: verify.valid, documento }
    }

    return { valido: !documento.revoked, documento }
  } catch (e: unknown) {
    const err = e as { response?: { status: number } }
    if (err.response?.status === 404) {
      return { valido: false, documento: null, erro: 'Documento não encontrado.' }
    }
    throw e
  }
}
