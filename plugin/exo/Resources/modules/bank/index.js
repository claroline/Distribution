import merge  from 'lodash/merge'

import {generateUrl} from '#/main/core/fos-js-router'
import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {registerDefaultItemTypes} from './../items/item-types'
import {registerModalType} from '#/main/core/layout/modal'
import {MODAL_ADD_ITEM, AddItemModal} from './../quiz/editor/components/modal/add-item-modal.jsx'
import {MODAL_SEARCH, SearchModal} from './components/modal/search.jsx'
import {MODAL_SHARE, ShareModal} from './components/modal/share.jsx'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer} from '#/plugin/exo/bank/reducer'

import {Questions} from './components/questions.jsx'

// Load question types
registerDefaultItemTypes()

// Register needed modals
registerModalType(MODAL_SEARCH, SearchModal)
registerModalType(MODAL_ADD_ITEM, AddItemModal)
registerModalType(MODAL_SHARE, ShareModal)

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.question-bank-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Questions,

  // app store configuration
  {
    currentUser: (state = null) => state,
    questions: reducer,

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer
  },

  // remap data-attributes set on the app DOM container
  (initialData) => ({
    currentUser: initialData.currentUser,
    questions: merge({}, initialData.questions, {
      fetchUrl: generateUrl('question_list')
    })
  })
)
