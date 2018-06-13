
import {DirectoryResource} from '#/main/core/resources/directory/components/resource'
import {reducer} from '#/main/core/resources/text/reducer'

const File = {
  app: {
    component: DirectoryResource,
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
  File
}
