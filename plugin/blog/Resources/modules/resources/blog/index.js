import {bootstrap} from '#/main/app/bootstrap'

import {BlogResource} from '#/plugin/blog/resources/blog/components/resource'
import {reducer} from '#/plugin/blog/resources/blog/reducer'

export const App = () => ({
  component: BlogResource,
  store: reducer,
  styles: 'claroline-distribution-plugin-path-path-resource',
  initialState: initialState => Object.assign({}, initialState, {
    user: initialState.user,
    canEdit: initialState.edit,
    blog: {
      data: {
        id: initialState.blog.id,
        title: initialState.blog.title,
        originalOptions: initialState.blog.options,
        authors: initialState.authors,
        archives: initialState.archives
      }
    },
    posts: {
      pageSize: initialState.blog.options.postPerPage
    },
    resource: {
      node: initialState.resourceNode
    }
  })
})