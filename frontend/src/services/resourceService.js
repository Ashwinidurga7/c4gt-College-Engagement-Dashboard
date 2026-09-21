import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { apiClient } from '@/services/apiClient'

/**
 * Builds list/get/create/update/remove calls for a REST resource, switching to the
 * mock collection in mock mode. Every response passes through `toItem`.
 */
export function createResourceService({ path, mock, toItem, toPayload = (values) => values, listKey, searchKeys = [] }) {
  const send = (method, url, body) => apiClient[method](url, body)

  return {
    async list(query = {}) {
      const raw = env.useMock ? await mock.list(query) : await apiClient.get(path, { params: toListParams(query) })
      return toPage(listKey ? (raw?.[listKey] ?? raw) : raw, query, toItem, { searchKeys })
    },

    async get(id) {
      return toItem(env.useMock ? await mock.get(id) : await apiClient.get(`${path}/${id}`))
    },

    async create(values) {
      const payload = toPayload(values)
      return toItem(env.useMock ? await mock.create(payload) : await send('post', path, payload))
    },

    async update(id, values) {
      const payload = toPayload(values)
      return toItem(env.useMock ? await mock.update(id, payload) : await send('put', `${path}/${id}`, payload))
    },

    async remove(id) {
      if (env.useMock) await mock.remove(id)
      else await apiClient.delete(`${path}/${id}`)
      return id
    },
  }
}

/** Multipart body for uploads. The file field name is an assumption (see ASSUMPTIONS.md). */
export function toFormData(fields, file, fileField = 'file') {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') form.append(key, value)
  })
  if (file) form.append(fileField, file)
  return form
}
