import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {Routes} from '#/main/core/router'
import {
  PageActions,
  PageAction,
  PageContent,
  PageHeader,
  Page,
  PageContainer
} from '#/main/core/layout/page'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'
import {RoutedPageContent} from '#/main/core/layout/router'
import {t, trans, transChoice} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {Posts} from '#/plugin/blog/resources/blog/components/posts.jsx'
import {Post} from '#/plugin/blog/resources/blog/components/post.jsx'
import {PostForm} from '#/plugin/blog/resources/blog/components/post-form.jsx'
import {Tools} from '#/plugin/blog/resources/blog/components/toolbar/toolbar.jsx'
import {BlogOptions} from '#/plugin/blog/resources/blog/components/blog-options.jsx'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {saveEnabled} from '#/plugin/blog/resources/blog/utils.js'

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Panel from 'react-bootstrap/lib/Panel'

const Blog = props =>
  <ResourcePageContainer
      editor={{
        opened: props.mode === constants.EDIT_POST || props.mode === constants.CREATE_POST || props.mode === constants.EDIT_OPTIONS,
        open: '#edit',
        save: {
          disabled: !props.saveEnabled,
          action: () => props.save(props.blogId, props.mode, props.postId)
        }
      }}
      customActions={[
        {
          icon: 'fa fa-home',
          label: trans('show_overview'),
          action: '#/'
        },{
          icon: 'fa fa-plus',
          label: trans('new_post', {}, 'icap_blog'),
          action: '#/new'
        }
      ]}
    >
    <PageContent>
      <Grid key='blog-grid'>
        <Row className="show-grid">
          <Col xs={13} md={9}>
            <RoutedPageContent routes={[
            {
              path: '/',
              component: Posts,
              exact: true,
              onEnter: () => props.switchMode(constants.LIST_POSTS)
            }, {
              path: '/author/:authorId',
              component: Posts,
              exact: true,
              onEnter: (params) => props.getPostByAuthor(props.blogId, params.authorId)
            }, {
              path: '/new',
              component: PostForm,
              exact: true,
              onEnter: () => props.createPost()
            }, {
              path: '/post/:id',
              component: Post,
              exact: true,
              onEnter: (params) => props.getPost(props.blogId, params.id)
            }, {
              path: '/post/:id/edit',
              component: PostForm,
              exact: true,
              onEnter: (params) => props.editPost(props.blogId, params.id)
            }, {
              path: '/edit',
              component: BlogOptions,
              onEnter: (params) => props.editBlogOptions(props.blogId)
            }
            ]}/>
          </Col>
          <Col xs={5} md={3}>
            <Tools />
          </Col>
        </Row>
      </Grid>
    </PageContent>
  </ResourcePageContainer>

Blog.propTypes = {
  blogId: T.string.isRequired,
  postId: T.string,
  saveEnabled: T.bool.isRequired,
  save: T.func.isRequired
}
          
const BlogContainer = connect(
    state => ({
      blogId: state.blog.data.id,
      postId: !isEmpty(state.post_edit) ? state.post_edit.data.id : null,
      mode: state.mode,
      saveEnabled: saveEnabled(formSelect, state, state.mode),
      editorOpened: !isEmpty(formSelect.data(formSelect.form(state, 'blog.data.options'))),
    }),
    dispatch => ({
      getPost: (blogId, postId) => {
        dispatch(actions.getPost(blogId, postId))
      },
      createPost: () => {
        dispatch(actions.createPost(constants.POST_EDIT_FORM_NAME))
      },
      getPostByAuthor: (blogId, authorName) => {
        dispatch(actions.getPostByAuthor(blogId, authorName))
      },
      editPost: (blogId, postId) => {
        dispatch(actions.editPost(constants.POST_EDIT_FORM_NAME, blogId, postId))
      },
      editBlogOptions: (blogId) => {
        dispatch(actions.editBlogOptions('blog.data.options', blogId))
      },
      switchMode: (mode) => {
        dispatch(actions.switchMode(mode))
      },
      initDataList: () => {
        dispatch(actions.initDataList())
      },
      save: (blogId, mode, postId) => {
        if(mode === constants.CREATE_POST){
          dispatch(
            formActions.saveForm(constants.POST_EDIT_FORM_NAME, ['apiv2_blog_post_new', {blogId: blogId}])
          )
        }else if(mode === constants.EDIT_POST && postId !== null){
          dispatch(
            formActions.saveForm(constants.POST_EDIT_FORM_NAME, ['apiv2_blog_post_update', {blogId: blogId, postId: postId}])
          )
        }else if(mode === constants.EDIT_OPTIONS){
          dispatch(
            formActions.saveForm('blog.data.options', ['apiv2_blog_options', {blogId: blogId}])
          )
        }
      }
    })
)(Blog)
      
export {BlogContainer}
