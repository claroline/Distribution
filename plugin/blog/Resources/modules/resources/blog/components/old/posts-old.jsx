import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
import {Post} from '#/plugin/blog/resources/blog/components/post-old.jsx'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {Section as ClaroSection} from '#/main/core/layout/components/sections.jsx'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import {t, trans} from '#/main/core/translation'

const PostsList = props =>
  <section>
    <ButtonToolbar>
    <a href="#new">
      <Button className="btn btn btn-primary">
        <span className="fa fa-plus"></span> {trans('new_post', {}, 'icap_blog')}
      </Button>
    </a>
    </ButtonToolbar>
    {props.posts && props.posts.map((post, index) =>(
        <Post key={index} post={post} />
    ))}
  </section>

PostsList.propTypes ={
  posts: T.array,
  blogId: T.string,
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