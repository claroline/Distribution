
import {FileCreation} from '#/main/core/resources/file/components/creation'
import {FileResource} from '#/main/core/resources/file/components/resource'
import {reducer} from '#/main/core/resources/text/reducer'

/**
 * File resource configuration.
 */
const Resource = {
  /**
   * The resource name.
   *
   * NB. It MUST match the API one.
   */
  name: 'file',

  creation: {
    component: FileCreation
  },

  /**
   * The main application of the resource.
   */
  main: {
    component: FileResource,
    store: reducer,
    initialData: (initialData) => Object.assign({}, initialData, {
      resource: {
        node: initialData.resourceNode,
        evaluation: initialData.evaluation
      }
    })
  }
}

export {
  Resource
}
