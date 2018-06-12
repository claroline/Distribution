import {DirectoryResource} from '#/main/core/resources/directory/components/resource'
import {reducer} from '#/main/core/resources/text/reducer'

const File = {
  create: (resourceNode) => [
    {
      name: 'file',
      label: trans('file'),
      type: 'file',
      required: true,
      options: {
        unzippable: true
      }
    }
  ],
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
