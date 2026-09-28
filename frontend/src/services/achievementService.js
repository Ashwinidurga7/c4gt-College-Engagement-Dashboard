import { achievementsMock, activitiesMock } from '@/mocks/portfolioMock'
import { toAchievement, toAchievementPayload, toActivityPayload, toPortfolioActivity } from '@/services/portfolioAdapters'
import { createResourceService } from '@/services/resourceService'
import { studentService } from '@/services/studentService'

const achievements = createResourceService({ path: '/achievements', mock: achievementsMock, toItem: toAchievement, toPayload: toAchievementPayload })
const activities = createResourceService({ path: '/activities', mock: activitiesMock, toItem: toPortfolioActivity, toPayload: toActivityPayload })

/** Lists come from the student's own records (`/api/students/<name>`); changes go to `/api/<name>`. */
export const achievementService = {
  list: studentService.achievements,
  create: achievements.create,
  update: achievements.update,
  remove: achievements.remove,
}

export const activityService = {
  list: studentService.activities,
  create: activities.create,
  update: activities.update,
  remove: activities.remove,
}
