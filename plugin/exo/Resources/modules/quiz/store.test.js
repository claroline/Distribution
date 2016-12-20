import {assertEqual} from './../utils/test'
import {createStore} from './store'

describe('createStore', () => {
  it('initializes the store with initial data and calls reducer', () => {
    const state = {
      quiz: {id: '1'},
      steps: {},
      items: {}
    }
    const store = createStore(state)
    assertEqual(store.getState(), {
      quiz: {id: '1'},
      steps: {},
      items: {},
      editor: {
        currentObject: {},
        openPanels: {
          quiz: false,
          step: {}
        }
      },
      currentStep: null,
      paper: {},
      answers: {},
      modal: {
        type: null,
        props: {},
        fading: false
      },
      viewMode: 'overview'
    })
  })
})
