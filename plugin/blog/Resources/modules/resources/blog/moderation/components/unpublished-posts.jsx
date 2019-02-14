import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {trans} from '#/main/app/intl/translation'
import {constants as listConst} from '#/main/app/content/list/constants'
import {ListData} from '#/main/app/content/list/containers/data'
import {PostCard} from '#/plugin/blog/resources/blog/post/components/card'
import {selectors} from '#/plugin/blog/resources/blog/store'

const UnpublishedPostsComponent = (props) =>
  <ListData
    name={selectors.STORE_NAME + '.moderationPosts'}
    fetch={{
      url: ['apiv2_blog_post_list_unpublished', {blogId: props.blogId}],
      autoload: true
    }}
    open={{
      action: (row) => `#/${row.slug}`
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
        sortable: false
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
      },{
        name: 'tags',
        label: trans('tags', {}, 'platform'),
        type: 'string',
        sortable: false,
        displayed: false
      }
    ]}

    selectable={false}
    card={PostCard}

    display={{
      available : [listConst.DISPLAY_LIST],
      current: listConst.DISPLAY_LIST
    }}
  />

UnpublishedPostsComponent.propTypes = {
  blogId: T.string.isRequired,
  posts: T.array
}

const UnpublishedPosts = connect(
  state => ({
    posts: selectors.posts(state).data,
    blogId: selectors.blog(state).data.id
  })
)(UnpublishedPostsComponent)

export {UnpublishedPosts}
