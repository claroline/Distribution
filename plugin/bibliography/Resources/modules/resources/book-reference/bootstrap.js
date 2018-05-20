import {bootstrap} from '#/main/app/bootstrap'

import {BookReferenceResource} from './components/resource.jsx'
import {reducer} from './reducer'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.book-reference-container',

  // app main component
  BookReferenceResource,

  // app store configuration
  {
    bookReference: reducer
  },

  initialState => ({
    resourceNode: initialState.resourceNode,
    bookReference: {
      data: initialState.bookReference,
      originalData: initialState.bookReference
    }
  })
)
