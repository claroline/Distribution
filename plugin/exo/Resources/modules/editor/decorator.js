import mapValues from 'lodash/mapValues'
import merge from 'lodash/merge'
import {TYPE_QUIZ, SCORE_SUM} from './enums'

// augment normalized quiz data with editor state attributes
// (can be passed an array of sub-decorators for each item mime type)
export function decorate(state, itemDecorators = {}) {
  return Object.assign({}, state, {
    quiz: addFormFlags(state.quiz, true),
    steps: mapValues(state.steps, step => addFormFlags(step, true)),
    items: mapValues(state.items, item => {
      const subDecorator = itemDecorators[item.type] || (item => item)
      const decorated = addFormFlags(addScoreProperties(item))
      decorated._errors.score = {}
      decorated._touched.score = {}
      return subDecorator(decorated)
    }),
    currentObject: {
      id: state.quiz.id,
      type: TYPE_QUIZ
    }
  })
}

function addFormFlags(object, withParams = false) {
  return Object.assign({}, object, {
    _errors: withParams ? {parameters: {}}: {},
    _touched: withParams ? {parameters: {}}: {}
  })
}

function addScoreProperties(item) {
  return merge({
    score: {
      type: SCORE_SUM,
      success: 1,
      failure: 0
    }
  }, item)
}
