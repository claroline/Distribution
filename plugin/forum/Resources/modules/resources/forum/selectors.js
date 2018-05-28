import {createSelector} from 'reselect'


const forum = state => state.forum
const messages = state => state.subjects.messages
const sortOrder = state => state.subjects.messages.sortOrder
const subjects = state => state.subjects
const pageSize = state => state.subjects.messages.pageSize
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

const pages = createSelector(
  [messages, pageSize],
  (messages, pageSize) => Math.ceil(messages.length / pageSize)
)

const sortedMessages = createSelector(
  [sortOrder, messages],
  (sortOrder, messages) => messages.data.slice().sort((a, b) => {
    if (null === a.meta.updated || a.meta.updated < b.meta.updated) {
      return -1*sortOrder
    } else if (null === b.meta.updated || a.meta.updated > b.meta.updated) {
      return 1*sortOrder
    }

    return 0
  })
)

const visibleSortedMessages = createSelector(
  [sortedMessages, pageSize, currentPage, sortOrder],
  (sortedMessages, pageSize, currentPage) => sortedMessages.slice(currentPage*pageSize, currentPage*pageSize+pageSize)
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
  forumId,
  pages,
  currentPage,
  sortOrder,
  sortedMessages,
  visibleSortedMessages,
  showSubjectForm,
  editingSubject,
  closedSubject,
  flaggedMessages,
  tagsCount
}
