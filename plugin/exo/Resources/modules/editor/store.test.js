import {assertEqual} from './test-utils'
import {createStore} from './store'
import {TYPE_QUIZ, TYPE_STEP, mimeTypes as itemTypes} from './types'

describe('#createStore', () => {
  it('normalizes and augments quiz data', () => {
    const quiz = {
      id: '1',
      title: 'Quiz title',
      description: 'Quiz desc',
      parameters: {},
      steps: [
        {
          'id': 'a',
          'items': [
            {
              'id': 'x',
              'type': 'application/x.choice+json'
            }
          ]
        }
      ]
    }
    const store = createStore(quiz)
    assertEqual(store.getState(), {
      quiz: {
        id: '1',
        title: 'Quiz title',
        description: 'Quiz desc',
        parameters: {},
        steps: ['a'],
        _errors: {parameters: {}}
      },
      steps: {
        'a': {
          'id': 'a',
          'items': ['x'],
          _errors: {parameters: {}}
        }
      },
      items: {
        'x': {
          id: 'x',
          type: 'application/x.choice+json',
          _errors: {}
        }
      },
      currentObject: {
        id: '1',
        type: TYPE_QUIZ
      },
      openPanels: {
        [TYPE_QUIZ]: false,
        [TYPE_STEP]: {}
      },
      modal: {
        type: null,
        props: {},
        fading: false
      },
      itemTypes,
      categories: ['C1', 'C2'],
      form: {}
    })
  })
})
