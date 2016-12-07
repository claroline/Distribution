import {createSelector} from 'reselect'

const getQuestions = (state) => state.questions
const getPagination = (state) => state.pagination
const getSortBy = (state) => state.sortBy

const sortMethods = {
  type: () => {

  },
  category: (a, b) => {
    if (a.meta.category > b.meta.category) {
      return 1
    } else if (a.meta.category < b.meta.category) {
      return -1
    }

    return 0
  },
  content: (a, b) => {
    let aValue = a.title ? a.title : a.content
    let bValue = b.title ? b.title : b.content

    if (aValue > bValue) {
      return 1
    } else if (aValue < bValue) {
      return  -1
    }

    return 0
  },
  updated: (a, b) => {
    if (a.meta.updated > b.meta.updated) {
      return 1
    } else if (a.meta.updated < b.meta.updated) {
      return -1
    }

    return 0
  },
  author: () => {

  }
}

export const getVisibleQuestions =  createSelector(
  [getQuestions, getPagination, getSortBy],
  (questions, pagination, sortBy) => {
    // Apply pagination
    const offset = (pagination.current) * pagination.pageSize
    let visibleQuestions = questions.slice(offset, offset + pagination.pageSize)

    if (sortBy.property && sortMethods[sortBy.property]) {
      // Sort results
      return visibleQuestions.sort((a, b) => sortBy.direction * sortMethods[sortBy.property](a, b))
    } else {
      return visibleQuestions
    }
  }
)