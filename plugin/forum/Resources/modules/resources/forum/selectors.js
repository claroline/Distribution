import {createSelector} from 'reselect'

const forum = state => state.forum
const messages = state => state.subjects.messages


const subjects = state => state.subjects
const subject = createSelector(
  [subjects],
  (subjects) => subjects.current
)

const forumId = createSelector(
  [forum],
  (forum) => forum.id
)

export const select = {
  forum,
  subject,
  messages,
  forumId
}
