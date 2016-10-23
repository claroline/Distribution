import merge from 'lodash/merge'
import zipObject from 'lodash/zipObject'
import {ITEM_CREATE} from './../actions'
import {makeActionCreator, makeId} from './../util'
import {tex} from './../lib/translate'
import {Choice as component} from './choice.jsx'

const UPDATE_PROP = 'UPDATE_PROP'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property')
}


// reduce

// decorate

// sanitize

// validate



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
            data: ''
          },
          {
            id: secondChoiceId,
            data: ''
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
    case UPDATE_PROP: {
      // mark as touched

      return merge({}, item, action.property)
    }
  }
  return item
}

function decorate(item) {
  const solutionsById = zipObject(
    item.solutions.map(solution => solution.id),
    item.solutions
  )
  const choicesWithSolutions = item.choices.map(
    choice => Object.assign({}, choice, {
      _score: solutionsById[choice.id].score,
      _feedback: solutionsById[choice.id].feedback,
      _checked: false,
      _deletable: item.solutions.length > 2,
      _errors: {},
      _touched: {}
    })
  )

  let decorated = Object.assign({}, item, {
    choices: choicesWithSolutions
  })

  return setChoiceTicks(decorated)
}

function setChoiceTicks(item) {
  if (item.multiple) {
    item.choices.forEach(
      choice => choice._checked = choice._score > 0
    )
  } else {
    let max = 0
    let maxId = null

    item.choices.forEach(choice => {
      if (choice._score > max) {
        max = choice._score
        maxId = choice.id
      }
    })

    item.choices.forEach(choice =>
      choice._checked = max > 0 && choice.id === maxId
    )
  }

  return item
}

function sanitize() {

}

function validate(values) {
  const errors = {choices: []}

  if (values.fixedScore) {
    if (values.fixedFailure >= values.fixedSuccess) {
      errors.fixedFailure = tex('fixed_failure_above_success_error')
      errors.fixedSuccess = tex('fixed_success_under_failure_error')
    }

    if (!values.choices.find(choice => choice.score > 0)) {
      errors.choices._error = tex(
        values.multiple ?
          'fixed_score_choice_at_least_one_correct_answer_error' :
          'fixed_score_choice_no_correct_answer_error'
      )
    }
  } else {
    if (!values.choices.find(choice => choice.score > 0)) {
      errors.choices._error = tex(
        values.multiple ?
          'sum_score_choice_at_least_one_correct_answer_error' :
          'sum_score_choice_no_correct_answer_error'
      )
    }
  }

  return errors
}

// export function makeNewChoice() {
//   return {
//     id: makeId(),
//     data: null,
//     score: 0
//   }
// }
//
// export function choiceDeletablesSelector(state) {
//   const formValues = state.form[ITEM_FORM].values
//   const gtTwo = formValues.choices.length > 2
//
//   return formValues.choices.map(() => gtTwo)
// }
//
// export function choiceTicksSelector(state) {
//   const formValues = state.form[ITEM_FORM].values
//
//   if (formValues.multiple) {
//     return formValues.choices.map(choice => choice.score > 0)
//   }
//
//   let max = 0
//   let maxId = null
//
//   formValues.choices.forEach(choice => {
//     if (choice.score > max) {
//       max = choice.score
//       maxId = choice.id
//     }
//   })
//
//   return formValues.choices.map(choice => max > 0 && choice.id === maxId)
// }

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  component,
  reduce,
  decorate,
  sanitize,
  validate
}
