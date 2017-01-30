import {makeActionCreator} from './../../utils/actions'

import {REQUEST_SEND} from './../../api/actions'

export const QUESTIONS_SHARE = 'QUESTIONS_SHARE'
export const QUESTIONS_SET = 'QUESTIONS_SET'
export const QUESTIONS_REMOVE = 'QUESTIONS_DELETE'

export const actions = {}

actions.setQuestions = makeActionCreator(QUESTIONS_SET, 'questions')
actions.removeQuestions = makeActionCreator(QUESTIONS_REMOVE, 'questions')
//actions.shareQuestions = makeActionCreator()

actions.shareQuestions = (questions, users, ) => ({
  [REQUEST_SEND]: {
    route: ['questions_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify(questions)
    },
    success: () => actions.removeQuestions(questions)
  }
})

actions.deleteQuestions = questions => ({
  [REQUEST_SEND]: {
    route: ['questions_delete'],
    request: {
      method: 'DELETE',
      body: JSON.stringify(questions)
    },
    success: () => actions.removeQuestions(questions)
  }
})
