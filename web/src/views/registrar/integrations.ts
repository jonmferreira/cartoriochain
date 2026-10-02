import http from '../../services/http'
import type { RegistrarPayload, RegistrarResult } from './types'

export async function registrarDocumento(
  arquivo: File,
  payload: RegistrarPayload,
): Promise<RegistrarResult> {
  const form = new FormData()
  form.append('file', arquivo)
  form.append('docType', payload.docType)
  form.append('cartorioId', payload.cartorioId)
  form.append('pubKeyX', payload.pubKeyX)
  form.append('pubKeyY', payload.pubKeyY)
  form.append('sigR', payload.sigR)
  form.append('sigS', payload.sigS)
  if (payload.viewkeyPayload) form.append('viewkeyPayload', payload.viewkeyPayload)

  const { data } = await http.post<RegistrarResult>('/documents', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return {
    ...data,
    verificarUrl: `${window.location.origin}/verificar/${data.docId}`,
  }
}
