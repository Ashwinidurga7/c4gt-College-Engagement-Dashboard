import { applyListQuery } from '@/lib/listQuery'
import { mockError, mockResponse } from '@/mocks/mockUtils'

/** Mock "database" state kept in localStorage, so it outlives reloads and sign-outs like a real backend. */
export function loadPersisted(key, fallback) {
  try {
    const stored = window.localStorage.getItem(`mock.store:${key}`)
    return stored === null ? fallback : JSON.parse(stored)
  } catch {
    return fallback
  }
}

export function savePersisted(key, value) {
  try {
    window.localStorage.setItem(`mock.store:${key}`, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the change still lasts until the page reloads.
  }
}

/**
 * In-memory collection that behaves like a REST resource for mock mode. Changes last until the
 * page reloads, or across reloads and sign-outs when `persist` names a storage key.
 */
export function createMockCollection(initialItems, { prefix, searchKeys = [], defaultSort, persist } = {}) {
  let items = (persist && loadPersisted(persist, null)) || initialItems.map((item) => ({ ...item }))
  let counter = items.length
  const commit = (next) => {
    items = next
    if (persist) savePersisted(persist, items)
  }

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
      commit([item, ...items])
      return mockResponse(item)
    },

    update(id, changes) {
      const item = find(id)
      if (!item) return mockError('The requested record was not found.', 404)
      const updated = { ...item, ...changes, updatedAt: new Date().toISOString() }
      commit(items.map((entry) => (entry._id === id ? updated : entry)))
      return mockResponse(updated)
    },

    updateAll(changes) {
      commit(items.map((entry) => ({ ...entry, ...changes(entry) })))
      return mockResponse({ updated: items.length })
    },

    remove(id) {
      if (!find(id)) return mockError('The requested record was not found.', 404)
      commit(items.filter((entry) => entry._id !== id))
      return mockResponse({ _id: id })
    },
  }
}
