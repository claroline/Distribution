import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

export const PAPER_ADD     = 'PAPER_ADD'
export const PAPER_CURRENT = 'PAPER_CURRENT'

export const actions = {}

actions.setCurrentPaper = makeActionCreator(PAPER_CURRENT, 'paper')
actions.addPaper = makeActionCreator(PAPER_ADD, 'paper')

actions.loadCurrentPaper = (quizId, paperId) => ({
  [API_REQUEST]: {
    url: ['exercise_paper_get', {
      exerciseId: quizId,
      id: paperId
    }],
    success: (data, dispatch) => dispatch(actions.setCurrentPaper(data))
  }
})
