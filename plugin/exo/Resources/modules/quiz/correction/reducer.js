import {QUESTION_CURRENT} from './actions'

export const reduceCorrection = (state = {}, action = {}) => {
  switch (action.type) {
    case QUESTION_CURRENT:
      return action.id
  }

  return state
}
