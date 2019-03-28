import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

import {selectors as paperSelectors} from '#/plugin/exo/quiz/papers/selectors'
import {actions as paperActions} from '#/plugin/exo/quiz/papers/actions'

export const actions = {}

actions.displayStatistics = () => {
  return (dispatch, getState) => {
    if (!paperSelectors.papersFetched(getState())) {
      dispatch(paperActions.fetchAllPapers(paperSelectors.quizId(getState())))
    }
  }
}
actions.fetchStatistics = () => {
  return (dispatch, getState) => {
    dispatch({
      [API_REQUEST]: {
        url: ['exercise_statistics', {exerciseId: paperSelectors.quizId(getState())}],
        success: (data, dispatch) => {
          // dispatch(actions.setCurrentPaper(data))
        }
      }
    })
  }
}