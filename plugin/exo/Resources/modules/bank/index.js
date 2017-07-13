import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {registerDefaultItemTypes} from './../items/item-types'
import {registerModalType} from '#/main/core/layout/modal'
import {MODAL_ADD_ITEM, AddItemModal} from './../quiz/editor/components/add-item-modal.jsx'
import {MODAL_SEARCH, SearchModal} from './components/modal/search.jsx'
import {MODAL_SHARE, ShareModal} from './components/modal/share.jsx'
import {Bank} from './components/bank.jsx'

import questionsReducer from './reducers/questions'


// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'
import {makeListReducer} from '#/main/core/layout/list/reducer'

// Load question types
registerDefaultItemTypes()

// Register needed modals
registerModalType(MODAL_SEARCH, SearchModal)
registerModalType(MODAL_ADD_ITEM, AddItemModal)
registerModalType(MODAL_SHARE, ShareModal)

// mount the react application
bootstrap(
    // app DOM container (also holds initial app data as data attributes)
    '#questions-bank',

    // app main component (accepts either a `routedApp` or a `ReactComponent`)
    Bank,

    // app store configuration
  {
      // app reducers
    questions: questionsReducer,

      // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer,
    list: makeListReducer(),
    pagination: paginationReducer
  },
    (initialData) => {
      return {
        questions: {
          data: initialData.initial.questions,
          totalResults: initialData.initial.totalResults
        },
        pagination: {
          pageSize: initialData.initial.pagination.pageSize,
          current: initialData.initial.pagination.current
        },
        list: {
          filters: [],
          sortBy: 'content'
        }
      }
    }



)