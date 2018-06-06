import {bootstrap} from '#/main/app/bootstrap'

import {BlogContainer} from '#/plugin/blog/resources/blog/components/resource.jsx'
import {reducer} from '#/plugin/blog/resources/blog/reducer'

/**
 * Blog resource application.
 *
 * @constructor
 */
export const App = () => ({
  component: BlogContainer,
  store: reducer,
  styles: 'claroline-distribution-plugin-blog-blog-resource',
  initialData: initialData => Object.assign({}, initialData, {
    user: initialData.user,
    canEdit: initialData.edit,
    blog: {
      data: {
        id: initialData.blog.id,
        title: initialData.blog.title,
        originalOptions: initialData.blog.options,
        authors: initialData.authors,
        archives: initialData.archives
      }
    },
    posts: {
      pageSize: initialData.blog.options.postPerPage
    },
    resource: {
      node: initialData.resourceNode
    }
  })
})