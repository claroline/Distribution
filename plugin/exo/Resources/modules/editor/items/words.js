import {Words as component} from './words.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'
import {ITEM_FORM} from './../components/item-form.jsx'

function reducer(words = {}, action) {

  switch (action.type) {
    case ITEM_CREATE: {
      return update(words, {
        solutions: {$set: [
          {
            text: '',
            caseSensitive: false,
            score: 1,
            feedback: ''
          }
        ]}
      })
    }
  }
  return words
}

function initialFormValues(words) {

  return update(words, {
    showCaseSensitive: {$set: words.solutions && (words.solutions.find(el => el.caseSensitive) !== undefined) ? true:false},
    solutions: {$set: words.solutions}
  })

}

function validateFormValues(values) {
  const errors = {}
  return errors
}

export function makeNewWord() {
  return {
    text: '',
    caseSensitive: false,
    score: 0,
    feedback: ''
  }
}

export function wordsDeletablesSelector(state) {
  const formValues = state.form[ITEM_FORM].values
  const gtOne = formValues.solutions.length > 1
  return formValues.solutions.map(() => gtOne)
}

export function wordCaseSensitiveSelector(state){
  const formValues = state.form[ITEM_FORM].values
  if(formValues.showCaseSensitive){
    return formValues.solutions.map(word => word.caseSensitive)
  } else {
    return formValues.solutions.map(() => false)
  }
}

export default {
  type: 'application/x.words+json',
  name: 'words',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
