import {createSelector} from 'reselect'


const forum = state => state.forum
const messages = state => state.subjects.messages
const totalResults = state => state.subjects.messages.totalResults
const sortOrder = state => state.subjects.messages.sortOrder
const subjects = state => state.subjects
const currentPage = state => state.subjects.messages.currentPage

const subject = createSelector(
  [subjects],
  (subjects) => subjects.current
)

const editingSubject = createSelector(
  [subjects],
  (subjects) => subjects.form.editingSubject
)
const closedSubject = createSelector(
  [subject],
  (subject) => subject.meta.closed
)
const showSubjectForm = createSelector(
  [subjects],
  (subjects) => subjects.form.showSubjectForm
)

const forumId = createSelector(
  [forum],
  (forum) => forum.id
)


const flaggedMessages = createSelector(
  [messages],
  (messages) => messages.filter(message => true === message.meta.flagged)
)

const tagsCount = createSelector(
  [forum],
  (forum) => forum.meta.tags.reduce((obj, tag) => {
    if (!obj[tag]) {
      obj[tag] = 0
    }
    obj[tag]++
    return obj
  }, [])
)

export const select = {
  forum,
  subject,
  messages,
  totalResults,
  forumId,
  currentPage,
  sortOrder,
  showSubjectForm,
  editingSubject,
  closedSubject,
  flaggedMessages,
  tagsCount
}
