import {assertEqual} from './test-util'
import {createStore} from './store'
import {TYPE_QUIZ, TYPE_STEP, mimeTypes as itemTypes} from './types'

describe('#createStore', () => {
  it('normalizes and augments quiz data', () => {
    const quiz = {
      id: '1',
      meta: {},
      steps: [
        {
          'id': 'a',
          'items': [
            {
              'id': 'x',
              'type': 'text/html'
            }
          ]
        }
      ]
    }
    const store = createStore(quiz)
    assertEqual(store.getState(), {
      quiz: {
        id: '1',
        meta: {},
        steps: ['a']
      },
      steps: {
        'a': {
          'id': 'a',
          'items': ['x']
        }
      },
      items: {
        'x': {
          id: 'x',
          type: 'text/html'
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
