import {bootstrap} from '#/main/app/bootstrap'

import {WikiResource} from '#/plugin/wiki/resources/wiki/components/resource'
import {reducer} from '#/plugin/wiki/resources/wiki/reducer'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.wiki-container',

  // app main component
  WikiResource,

  // app store configuration
  reducer,

  // transform data attributes for redux store
  (initialData) => {
    return {
      resource: {
        node: initialData.resourceNode
      },
      wiki: initialData.wiki,
      sectionTree: initialData.sectionTree
    }
  }
)