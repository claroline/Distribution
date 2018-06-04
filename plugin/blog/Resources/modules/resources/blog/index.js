import {bootstrap} from '#/main/core/scaffolding/bootstrap'

import {BlogContainer} from '#/plugin/blog/resources/blog/components/resource.jsx'
import {reducer} from '#/plugin/blog/resources/blog/reducer'

bootstrap(
  '.blog-container',
  BlogContainer,
  reducer,
  initialState => ({
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
    resourceNode: initialState.resourceNode,
  })
)