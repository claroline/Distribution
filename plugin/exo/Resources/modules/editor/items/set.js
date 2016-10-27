import {Set as component} from './set.jsx'
import {ITEM_CREATE} from './../actions'
import {update, makeId} from './../util'
import {ITEM_FORM} from './../components/item-form.jsx'

function reducer(question = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      const firstMemberId = makeId()
      const secondMemberId = makeId()
      const firstSetId = makeId()
      const secondSetId = makeId()

      return update(question, {
        sets: {$set: [
          {
            id: firstSetId,
            name:'SET A'
          },
          {
            id: secondSetId,
            name:'SET B'
          }
        ]},
        members: {$set: [
          {
            id: firstMemberId,
            type:'text/plain',
            data:'Alea jacta est'
          },
          {
            id: secondMemberId,
            type:'text/plain',
            data:'Lorem Ipsum'
          }
        ]},
        solutions: {$set: [
          {
            setId: firstSetId,
            memberId: firstMemberId,
            score: 3,
            feedback: 'feedback 1'
          },
          {
            setId: secondSetId,
            memberId: secondMemberId,
            score: 1,
            feedback: 'feedback 2'
          }
        ]},
        penalty:{$set: 0},
        shuffle:{$set: false}
      })
    }
  }
  return question
}


function initialFormValues(question) {
  return update(question, {
    sets: {$set: question.sets},
    members: {$set: question.members},
    solutions: {$set: question.solutions},
    penalty: {$set: question.penalty},
    shuffle: {$set: question.shuffle}
  })
}

function validateFormValues() {
  const errors = {}
  return errors
}

export function getMemberData(searched, members){
  const member = members.find(el => el.id === searched)
  return member.data
}

export function setDeletablesSelector(state){
  const formValues = state.form[ITEM_FORM].values
  const gtTwo = formValues.sets.length > 2
  return formValues.sets.map(() => gtTwo)
}

export function memberDeletablesSelector(state){
  const formValues = state.form[ITEM_FORM].values
  const gtTwo = formValues.solutions.length > 1
  return formValues.solutions.map(() => gtTwo)
}

export default {
  type: 'application/x.set+json',
  name: 'set',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
