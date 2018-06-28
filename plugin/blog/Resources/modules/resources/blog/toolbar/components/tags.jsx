import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {TagCloud} from '#/main/app/content/meta/components/tag-cloud'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as postActions} from '#/plugin/blog/resources/blog/post/store/actions'
import {withRouter} from '#/main/app/router'

const TagsComponent = props =>
  <div key='redactors' className="panel panel-default">
    <div className="panel-heading">{trans('blog_widget_tag_list_blog_form_tag_cloud', {}, 'icap_blog')}</div>
    <div className="panel-body">
      <TagCloud
        tags={props.tags}
        minSize={12}
        maxSize={22}
        onClick={(tag) => {
          props.goHome(props.history)
          props.searchByTag(tag)
        }}
      />
    </div>
  </div>

TagsComponent.propTypes = {
  searchByTag: T.func.isRequired,
  tags: T.shape({}),
  history: T.shape({}),
  goHome: T.func.isRequired,
  maxSize: T.number
}

const Tags = withRouter(connect(
  state => ({
    tags: state.blog.data.tags,
    maxSize: state.blog.data.options.data.maxTag
  }),
  dispatch => ({
    searchByTag: (tag) => {
      dispatch(listActions.addFilter('posts', 'tags', tag))
      dispatch(postActions.initDataList())
    },
    goHome: (history) => {
      history.push('/')
    }
  })
)(TagsComponent))
    
export {Tags}