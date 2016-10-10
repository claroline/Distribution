import zipObject from 'lodash/zipObject'
import {ITEM_CREATE} from './../actions'
import {makeId, update} from './../util'
import {tex} from './../lib/translate'
import {Choice as component} from './choice.jsx'
import {ITEM_FORM} from './../components/item-form.jsx'

function reducer(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      const firstChoiceId = makeId()
      const secondChoiceId = makeId()

      return update(item, {
        multiple: {$set: false},
        random: {$set: false},
        choices: {$set: [
          {
            id: firstChoiceId,
            data: null
          },
          {
            id: secondChoiceId,
            data: null
          }
        ]},
        solutions: {$set: [
          {
            id: firstChoiceId,
            score: 1
          },
          {
            id: secondChoiceId,
            score: 0
          }
        ]}
      })
    }
  }
  return item
}

function initialFormValues(item) {
  const solutionsById = zipObject(
    item.solutions.map(solution => solution.id),
    item.solutions
  )
  const choicesWithSolutions = item.choices.map(
    choice => Object.assign({}, choice, solutionsById[choice.id])
  )

  return update(item, {
    choices: {$set: choicesWithSolutions},
    fixedScore: {$set: item.score.type === 'fixed'},
    fixedFailure: {$set: 0},
    fixedSuccess: {$set: 1}
  })
}

function validateFormValues(values) {
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

export function makeNewChoice() {
  return {
    id: makeId(),
    data: null,
    score: 0
  }
}

export function choiceDeletablesSelector(state) {
  const formValues = state.form[ITEM_FORM].values
  const gtTwo = formValues.choices.length > 2

  return formValues.choices.map(() => gtTwo)
}

export function choiceTicksSelector(state) {
  const formValues = state.form[ITEM_FORM].values

  if (formValues.multiple) {
    return formValues.choices.map(choice => choice.score > 0)
  }

  let max = 0
  let maxId = null

  formValues.choices.forEach(choice => {
    if (choice.score > max) {
      max = choice.score
      maxId = choice.id
    }
  })

  return formValues.choices.map(choice => max > 0 && choice.id === maxId)
}

export default {
  type: 'application/x.choice+json',
  name: 'choice',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
