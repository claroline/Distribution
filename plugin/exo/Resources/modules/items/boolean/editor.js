import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import zipObject from 'lodash/zipObject'
import set from 'lodash/set'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator, makeId} from './../../utils/utils'
import {tex} from './../../utils/translate'
import {notBlank} from './../../utils/validate'
import {Boolean as component} from './editor.jsx'

const UPDATE_CHOICE = 'UPDATE_CHOICE'

export const actions = {
  updateChoice: makeActionCreator(UPDATE_CHOICE, 'id', 'property', 'value')
}

function decorate(item) {
  const solutionsById = zipObject(
    item.solutions.map(solution => solution.id),
    item.solutions
  )
  const choicesWithSolutions = item.choices.map(
    choice => Object.assign({}, choice, {
      _score: solutionsById[choice.id].score,
      _feedback: solutionsById[choice.id].feedback || ''
    })
  )

  let decorated = Object.assign({}, item, {
    choices: choicesWithSolutions
  })

  return decorated
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      const firstChoiceId = makeId()
      const secondChoiceId = makeId()
      return decorate(Object.assign({}, item, {
        multiple: false,
        random: false,
        choices: [
          {
            id: firstChoiceId,
            type: 'text/html',
            data: 'a'
          },
          {
            id: secondChoiceId,
            type: 'text/html',
            data: 'b'
          }
        ],
        solutions: [
          {
            id: firstChoiceId,
            score: 1,
            feedback: ''
          },
          {
            id: secondChoiceId,
            score: 0,
            feedback: ''
          }
        ]
      }))
    }
    case UPDATE_CHOICE: {
      const newItem = cloneDeep(item)
      const choiceIndex = newItem.choices.findIndex(choice => choice.id === action.id)
      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const decoratedName = action.property === 'data' ? 'data' : `_${action.property}`

      newItem.choices[choiceIndex][decoratedName] = value

      if (action.property === 'score' || action.property === 'feedback') {
        const solutionIndex = newItem.solutions.findIndex(
          solution => solution.id === action.id
        )
        newItem.solutions[solutionIndex][action.property] = value
      }

      return newItem
    }

  }
  return item
}

function validate(item) {
  const errors = {}

  if (item.choices.find(choice => notBlank(choice.data, true))) {
    errors.choices = tex('choice_empty_data_error')
  }

  if (!item.choices.find(choice => choice._score > 0)) {
    errors.choices = tex('sum_score_choice_no_correct_answer_error')
  }

  return errors
}


export default {
  component,
  reduce,
  decorate,
  validate
}
