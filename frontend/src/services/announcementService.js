import { announcementsMock } from '@/mocks/campusMock'
import { createResourceService } from '@/services/resourceService'
import { toAnnouncement } from '@/services/studentAdapters'

function toAnnouncementPayload(values) {
  return {
    title: values.title.trim(),
    body: values.body.trim(),
    category: values.category,
    date: values.date,
  }
}

const base = createResourceService({
  path: '/announcements',
  mock: announcementsMock,
  toItem: toAnnouncement,
  toPayload: toAnnouncementPayload,
  listKey: 'announcements',
  searchKeys: ['title', 'body', 'category'],
})

/** Campus announcements shown on the student dashboard. Create, edit and delete are admin-only on the backend. */
export const announcementService = {
  list: base.list,
  create: base.create,
  update: base.update,
  remove: base.remove,
}
