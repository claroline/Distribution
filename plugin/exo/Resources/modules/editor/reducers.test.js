import freeze from 'deep-freeze'
import {assertEqual} from './test-util'
import {lastId} from './util'
import {actions} from './actions'
import {reducers} from './reducers'
import {TYPE_QUIZ, TYPE_STEP} from './types'

describe('Quiz reducer', () => {
  it('returns a new quiz by default', () => {
    const quiz = reducers.quiz(undefined, {})
    assertEqual(typeof quiz.id, 'string', 'Quiz must have an id')
    assertEqual(Array.isArray(quiz.steps), true, 'Quiz must have a step array')
    assertEqual(quiz.steps.length, 0, 'Steps must be empty')
  })

  it('keeps an id reference on step creation', () => {
    const quiz = freeze({steps: ['1', '2']})
    const newState = reducers.quiz(quiz, actions.createStep())
    assertEqual(newState.steps, ['1', '2', lastId()])
  })

  it('removes id on step deletion', () => {
    const quiz = freeze({steps: ['1', '2', '3']})
    const newState = reducers.quiz(quiz, actions.deleteStep('2'))
    assertEqual(newState.steps, ['1', '3'])
  })

  it('swaps ids on step move', () => {
    const quiz = freeze({steps: ['1', '2', '3']})
    const newState = reducers.quiz(quiz, actions.moveStep('3', '2'))
    assertEqual(newState, {steps: ['1', '3', '2']})
  })
})

describe('Step reducer', () => {
  it('returns an empty steps object by default', () => {
    assertEqual({}, reducers.steps(undefined, {}))
  })

  it('creates a default object on step creation', () => {
    const steps = freeze({'1': {id: '1', items: []}})
    const newState = reducers.steps(steps, actions.createStep())
    assertEqual(newState, {
      '1': {id: '1', items: []},
      [lastId()]: {id: lastId(), items: []}
    })
  })

  it('removes step object on step deletion', () => {
    const steps = freeze({
      '1': {id: '1', items: []},
      '2': {id: '2', items: []}
    })
    const newState = reducers.steps(steps, actions.deleteStep('1'))
    assertEqual(newState, {'2': {id: '2', items: []}})
  })

  it('keeps an id reference on item creation', () => {
    const steps = freeze({
      '1': {id: '1', items: []},
      '2': {id: '2', items: []}
    })
    const newState = reducers.steps(steps, actions.createItem('2', 'application/choice.x+json'))
    assertEqual(newState, {
      '1': {id: '1', items: []},
      '2': {id: '2', items: [lastId()]}
    })
  })

  it('removes item id on item deletion', () => {
    const steps = freeze({
      '1': {id: '1', items: []},
      '2': {id: '2', items: ['3', '4']}
    })
    const newState = reducers.steps(steps, actions.deleteItem('3', '2'))
    assertEqual(newState, {
      '1': {id: '1', items: []},
      '2': {id: '2', items: ['4']}
    })
  })

  it('swaps id on item move', () => {
    const steps = freeze({
      '1': {id: '1', items: ['a']},
      '2': {id: '2', items: ['b', 'c']}
    })
    const newState = reducers.steps(steps, actions.moveItem('b', 'c', '2'))
    assertEqual(newState, {
      '1': {id: '1', items: ['a']},
      '2': {id: '2', items: ['c', 'b']}
    })
  })
})

describe('Items reducer', () => {
  it('returns an empty object by default', () => {
    const items = reducers.items(undefined, {})
    assertEqual(items, {})
  })

  it('creates a default object on item creation', () => {
    const items = reducers.items(freeze({}), actions.createItem('1', 'text/html'))
    assertEqual(items, {
      [lastId()]: {
        id: lastId(),
        type: 'text/html'
      }
    })
  })

  it('removes item object on item deletion', () => {
    const items = freeze({
      '1': {id: '2', type: 'text/html'},
      '2': {id: '2', type: 'text/plain'}
    })
    const newState = reducers.items(items, actions.deleteItem('1', 'does not matter here'))
    assertEqual(newState, {
      '2': {id: '2', type: 'text/plain'}
    })
  })
})

describe('Current object reducer', () => {
  it('returns an empty object by default', () => {
    const current = reducers.currentObject(undefined, {})
    assertEqual(current, {})
  })

  it('updates on object selection', () => {
    const current = freeze({id: '1', type: TYPE_QUIZ})
    const newState = reducers.currentObject(current, actions.selectObject('2', TYPE_STEP))
    assertEqual(newState, {
      id: '2',
      type: TYPE_STEP
    })
  })

  it('updates on step creation', () => {
    const current = freeze({id: '2', type: 'text/html'})
    const newState = reducers.currentObject(current, actions.createStep())
    assertEqual(newState, {
      id: lastId(),
      type: TYPE_STEP
    })
  })

  it('updates on object change', () => {
    const current = freeze({id: '1', type: TYPE_STEP})
    const newState = reducers.currentObject(current, actions.nextObject({
      id: '2',
      type: 'text/html'
    }))
    assertEqual(newState, {
      id: '2',
      type: 'text/html'
    })
  })
})

describe('Open panels reducer', () => {
  it('returns an empty structure for quiz and steps by default', () => {
    const current = reducers.openPanels(undefined, {})
    assertEqual(current, {[TYPE_QUIZ]: false, [TYPE_STEP]: {}})
  })

  it('updates quiz key on quiz panel selection', () => {
    const current = freeze({[TYPE_QUIZ]: 'foo', [TYPE_STEP]: {}})
    const newState = reducers.openPanels(current, actions.selectQuizPanel('bar'))
    assertEqual(newState, {[TYPE_QUIZ]: 'bar', [TYPE_STEP]: {}})
  })

  it('unsets quiz key if already selected', () => {
    const current = freeze({[TYPE_QUIZ]: 'baz', [TYPE_STEP]: {}})
    const newState = reducers.openPanels(current, actions.selectQuizPanel('baz'))
    assertEqual(newState, {[TYPE_QUIZ]: false, [TYPE_STEP]: {}})
  })

  it('sets panel step key on step panel selection', () => {
    const current = freeze({[TYPE_QUIZ]: false, [TYPE_STEP]: {}})
    const newState = reducers.openPanels(current, actions.selectStepPanel('1', 'foo'))
    assertEqual(newState, {[TYPE_QUIZ]: false, [TYPE_STEP]: {'1': 'foo'}})
  })

  it('keeps track of all open step panels', () => {
    const current = freeze({[TYPE_QUIZ]: false, [TYPE_STEP]: {'1': 'foo'}})
    const secondState = reducers.openPanels(current, actions.selectStepPanel('1', 'bar'))
    const thirdState = reducers.openPanels(secondState, actions.selectStepPanel('2', 'baz'))
    assertEqual(thirdState, {[TYPE_QUIZ]: false, [TYPE_STEP]: {'1': 'bar', '2': 'baz'}})
  })

  it('unsets panel step key if already selected', () => {
    const current = freeze({[TYPE_QUIZ]: false, [TYPE_STEP]: {'1': 'foo'}})
    const newState = reducers.openPanels(current, actions.selectStepPanel('1', 'foo'))
    assertEqual(newState, {[TYPE_QUIZ]: false, [TYPE_STEP]: {'1': false}})
  })
})
