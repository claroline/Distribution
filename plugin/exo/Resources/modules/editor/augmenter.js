import mapValues from 'lodash/mapValues'
import {TYPE_QUIZ} from './enums'

// augment normalized quiz data with editor state attributes
// (can be passed an array of sub-augmenters for each item mime type)
export function augment(state, itemAugmenters = {}) {
  return Object.assign({}, state, {
    quiz: addFormFlags(state.quiz, true),
    steps: mapValues(state.steps, step => addFormFlags(step, true)),
    items: mapValues(state.items, item => {
      const subAugmenter = itemAugmenters[item.type] || (item => item)
      return subAugmenter(addFormFlags(item))
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
