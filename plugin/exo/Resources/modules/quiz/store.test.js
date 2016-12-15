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
      currentObject: {},
      openPanels: {
        quiz: false,
        step: {}
      },
      modal: {
        type: null,
        props: {},
        fading: false
      },
      viewMode: 'editor'
    })
  })
})
