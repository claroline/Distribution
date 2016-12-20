import mapValues from 'lodash/mapValues'
import cloneDeep from 'lodash/cloneDeep'
import defaultsDeep from 'lodash/defaultsDeep'
import defaults from './defaults'
import {TYPE_QUIZ} from './enums'

// augment normalized quiz data with editor state attributes and default values
// (can be passed an array of sub-decorators for each item mime type)
export function decorate(state, itemDecorators = {}) {
  const newState = cloneDeep(state)

  return Object.assign(newState, {
    quiz: defaultsDeep(newState.quiz, defaults.quiz),
    steps: mapValues(newState.steps, step => defaultsDeep(step, defaults.step)),
    items: mapValues(newState.items, item => {
      const subDecorator = itemDecorators[item.type] || (item => item)
      return decorateItem(item, subDecorator)
    }),
    editor: {
      currentObject: {
        id: newState.quiz.id,
        type: TYPE_QUIZ
      }
    }
  })
}

export function decorateItem(item, subDecorator = item => item) {
  let decorated = defaultsDeep(item, defaults.item)

  decorated.hints = decorated.hints.map(hint =>
    defaultsDeep(hint, defaults.hint)
  )

  return subDecorator(decorated)
}
