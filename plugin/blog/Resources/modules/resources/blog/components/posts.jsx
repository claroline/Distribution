import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {DataCard} from '#/main/core/data/components/data-card'
import {constants as listConst} from '#/main/core/data/list/constants'
import {PostCard} from '#/plugin/blog/resources/blog/components/post.jsx'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {Section as ClaroSection} from '#/main/core/layout/components/sections.jsx'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import {t, trans} from '#/main/core/translation'
import {navigate} from '#/main/app/router'
import {generatePostsActions} from '#/plugin/blog/resources/blog/utils.js'

const PostsList = props =>
  <div>
    <DataListContainer
      name="posts"
      icon={'fa fa-clock-o'}
      fetch={{
        url: ['apiv2_blog_post_list', {blogId: props.blogId}],
        autoload: true
      }}
      open={{
        action: (row) => `#/${row.slug}`
      }}
      delete={{
        url: ['apiv2_hero_delete_bulk']
      }}
      definition={[
        {
          name: 'title',
          label: trans('title', {}, 'platform'),
          type: 'string',
          primary: true,
          displayed: true
        },{
          name: 'publicationDate',
          label: trans('icap_blog_post_form_publicationDate', {}, 'icap_blog'),
          type: 'date',
          displayed: true
        },{
          name: 'fromDate',
          label: trans('icap_blog_post_form_publicationDateFrom', {}, 'icap_blog'),
          type: 'date',
          sortable: false
        },{
          name: 'toDate',
          label: trans('icap_blog_post_form_publicationDateTo', {}, 'icap_blog'),
          type: 'date',
          sortable: false,
        },{
          name: 'content',
          label: trans('content', {}, 'platform'),
          type: 'string',
          sortable: false,
          displayed: false
        },{
          name: 'authorName',
          label: trans('author', {}, 'platform'),
          type: 'string'
        }
      ]}

      selection={{}}
      card={PostCard}
    
      display={{
        available : [listConst.DISPLAY_LIST],
        current: listConst.DISPLAY_LIST
      }}
    />
  </div>

PostsList.propTypes ={
  posts: T.array,
  blogId: T.string,
  onClick: T.func.isRequired
}

const PostsContainer = connect(
    state => ({
      posts: state.posts.data,
      blogId: state.blog.data.id
    }),
    dispatch => ({
      onClick: blogId => {
        dispatch(actions.posts(blogId))
      }
    })
  )(PostsList)

export {PostsContainer as Posts}