import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {registerModalTypes} from '#/main/core/layout/modal'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

import {registerDefaultItemTypes, getDecorators} from '#/plugin/exo/items/item-types'
import {registerDefaultContentItemTypes} from '#/plugin/exo/contents/content-types'

import {normalize} from './normalizer'
import {decorate} from './decorators'

import {reducers as quizReducers} from './reducers'
import {reducers as editorReducers} from './editor/reducers'
import {reducers as playerReducers} from './player/reducers'
import {reducePapers} from './papers/reducer'
import {reduceCorrection} from './correction/reducer'

// app component
import {QuizResource} from '#/plugin/exo/quiz/components/resource.jsx'
// app modals
import {MODAL_CONTENT, ContentModal} from '#/plugin/exo/contents/components/content-modal.jsx'
import {MODAL_DUPLICATE_ITEM, DuplicateItemModal} from '#/plugin/exo/items/components/modal/duplicate-modal.jsx'
import {MODAL_ADD_ITEM, AddItemModal} from './editor/components/modal/add-item-modal.jsx'
import {MODAL_IMPORT_ITEMS, ImportItemsModal} from './editor/components/modal/import-items-modal.jsx'
import {MODAL_ADD_CONTENT, AddContentModal} from './editor/components/modal/add-content-modal.jsx'
import {MODAL_MOVE_ITEM, MoveItemModal} from './editor/components/modal/move-item-modal.jsx'

// register custom modals
registerModalTypes([
  [MODAL_ADD_ITEM, AddItemModal],
  [MODAL_IMPORT_ITEMS, ImportItemsModal],
  [MODAL_ADD_CONTENT, AddContentModal],
  [MODAL_CONTENT, ContentModal],
  [MODAL_MOVE_ITEM, MoveItemModal],
  [MODAL_DUPLICATE_ITEM, DuplicateItemModal]
])

registerDefaultItemTypes()
registerDefaultContentItemTypes()

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.quiz-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  QuizResource,

  // app store configuration
  {
    modal: modalReducer,
    currentRequests: apiReducer,
    resourceNode: resourceReducer,
    noServer: (state = null) => state,

    viewMode: quizReducers.viewMode,
    quiz: editorReducers.quiz,
    steps: editorReducers.steps,
    items: editorReducers.items,
    editor: editorReducers.editor,

    // TODO : combine in a sub object for cleaner store
    testMode: playerReducers.testMode,
    currentStep: playerReducers.currentStep,
    paper: playerReducers.paper,
    answers: playerReducers.answers,

    papers: reducePapers,

    correction: reduceCorrection
  },

  // remap data-attributes set on the app DOM container
  (initialData) => merge({
    noServer: initialData.noServer,
    resourceNode: initialData.resourceNode
  },
    decorate(normalize(initialData.quiz), getDecorators(), initialData.resourceNode.rights.current.edit)
  )
)
