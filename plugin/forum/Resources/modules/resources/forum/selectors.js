import {createSelector} from 'reselect'

const forum = state => state.forum
const messages = state => state.subjects.messages
const sortOrder = state => state.subjects.messages.sortOrder

const subjects = state => state.subjects
const subject = createSelector(
  [subjects],
  (subjects) => subjects.current
)

const forumId = createSelector(
  [forum],
  (forum) => forum.id
)

const sortedMessages = createSelector(
  [sortOrder, messages],
  (sortOrder, messages) => messages.slice().sort((a, b) => {
    if (null === a.meta.updated || a.meta.updated < b.meta.updated) {
      return -1*sortOrder
    } else if (null === b.meta.updated || a.meta.updated > b.meta.updated) {
      return 1*sortOrder
    }

    return 0
  })
)

export const select = {
  forum,
  subject,
  messages,
  forumId,
  sortedMessages
}
