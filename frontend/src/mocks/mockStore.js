import { applyListQuery } from '@/lib/listQuery'
import { mockError, mockResponse } from '@/mocks/mockUtils'

/**
 * In-memory collection that behaves like a REST resource for mock mode.
 * Changes last until the page reloads.
 */
export function createMockCollection(initialItems, { prefix, searchKeys = [], defaultSort } = {}) {
  let items = initialItems.map((item) => ({ ...item }))
  let counter = items.length

  const find = (id) => items.find((item) => item._id === id)

  return {
    all: () => items,

    list(query = {}) {
      const page = applyListQuery(items, { ...query, searchKeys, sort: query.sort ?? defaultSort })
      return mockResponse({ ...page, limit: page.pageSize })
    },

    get(id) {
      const item = find(id)
      return item ? mockResponse(item) : mockError('The requested record was not found.', 404)
    },

    create(data) {
      counter += 1
      const item = { _id: `${prefix}-${counter}-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), ...data }
      items = [item, ...items]
      return mockResponse(item)
    },

    update(id, changes) {
      const item = find(id)
      if (!item) return mockError('The requested record was not found.', 404)
      const updated = { ...item, ...changes, updatedAt: new Date().toISOString() }
      items = items.map((entry) => (entry._id === id ? updated : entry))
      return mockResponse(updated)
    },

    updateAll(changes) {
      items = items.map((entry) => ({ ...entry, ...changes(entry) }))
      return mockResponse({ updated: items.length })
    },

    remove(id) {
      if (!find(id)) return mockError('The requested record was not found.', 404)
      items = items.filter((entry) => entry._id !== id)
      return mockResponse({ _id: id })
    },
  }
}
