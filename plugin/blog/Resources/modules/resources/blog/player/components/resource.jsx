import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'
import {RoutedPageContent} from '#/main/core/layout/router'
import {PageContent} from '#/main/core/layout/page/index'
import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import {url} from '#/main/app/api'
import {Posts} from '#/plugin/blog/resources/blog/post/components/posts.jsx'
import {Post} from '#/plugin/blog/resources/blog/post/components/post.jsx'
import {PostForm} from '#/plugin/blog/resources/blog/post/components/post-form.jsx'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {Tools} from '#/plugin/blog/resources/blog/toolbar/components/toolbar.jsx'
import {BlogOptions} from '#/plugin/blog/resources/blog/editor/components/blog-options.jsx'
import {actions as editorActions} from '#/plugin/blog/resources/blog/editor/store'
import {actions as postActions} from '#/plugin/blog/resources/blog/post/store'
import {actions as toolbarActions} from '#/plugin/blog/resources/blog/toolbar/store'
import {actions} from '#/plugin/blog/resources/blog/store'
import {constants} from '#/plugin/blog/resources/blog/constants.js'
import {hasPermission} from '#/main/core/resource/permissions'

const Blog = props =>
  <ResourcePageContainer
    editor={{
      icon: 'fa fa-pencil',
      label: trans('configure_blog', {}, 'icap_blog'),
      path: '/edit',
      save: {
        disabled: !props.saveEnabled,
        action: () => {
          props.saveOptions(props.blogId)
        }
      }
    }}
    customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        target: '/',
        exact: true
      },{
        type: 'link',
        icon: 'fa fa-fw fa-plus',
        displayed: props.canEdit,
        label: trans('new_post', {}, 'icap_blog'),
        target: '/new',
        exact: true
      },{
        displayed : props.pdfEnabled && props.canExport,
        type: 'download',
        icon: 'fa fa-fw fa-file-pdf-o',
        label: trans('pdf_export', {}, 'platform'),
        file: {
          url: url(['icap_blog_pdf', {blogId: props.blogId}])
        }
      },{
        type: 'url',
        icon: 'fa fa-fw fa-rss',
        label: trans('rss_label', {}, 'icap_blog'),
        target: url(['icap_blog_rss', {blogId: props.blogId}])
      }
    ]}
  >
    <PageContent>
      <Grid key="blog-grid" className="blog-page">
        <Row className="show-grid">
          <Col xs={13} md={9} className="blog-content">
            <RoutedPageContent className="blog-page-content" routes={[
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
                disabled: !props.canEdit,
                exact: true,
                onEnter: () => props.createPost()
              }, {
                path: '/edit',
                disabled: !props.canEdit,
                component: BlogOptions,
                onEnter: () => props.editBlogOptions(props.blogId),
                exact: true
              }, {
                path: '/:id',
                component: Post,
                exact: true,
                onEnter: (params) => props.getPost(props.blogId, params.id)
              }, {
                path: '/:id/edit',
                component: PostForm,
                disabled: !props.canEdit,
                exact: true,
                onEnter: (params) => props.editPost(props.blogId, params.id)
              }
            ]}/>
          </Col>
          <Col xs={5} md={3} className="blog-widgets">
            <Tools />
          </Col>
        </Row>
      </Grid>
    </PageContent>
  </ResourcePageContainer>

Blog.propTypes = {
  blogId: T.string.isRequired,
  saveEnabled: T.bool.isRequired,
  pdfEnabled: T.bool.isRequired,
  switchMode: T.func.isRequired,
  getPostByAuthor: T.func.isRequired,
  createPost: T.func.isRequired,
  editBlogOptions: T.func.isRequired,
  getPost: T.func.isRequired,
  editPost: T.func.isRequired,
  saveOptions: T.func.isRequired,
  mode: T.string,
  postId: T.string,
  canEdit: T.bool,
  canExport: T.bool
}
          
const BlogContainer = connect(
  state => ({
    blogId: state.blog.data.id,
    postId: !isEmpty(state.post_edit) ? state.post_edit.data.id : null,
    mode: state.mode,
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'blog.data.options')),
    editorOpened: !isEmpty(formSelect.data(formSelect.form(state, 'blog.data.options'))),
    pdfEnabled: state.pdfenabled,
    canExport: hasPermission('export', resourceSelect.resourceNode(state)),
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state))
  }),
  dispatch => ({
    getPost: (blogId, postId) => {
      dispatch(postActions.getPost(blogId, postId))
    },
    createPost: () => {
      dispatch(postActions.createPost(constants.POST_EDIT_FORM_NAME))
    },
    getPostByAuthor: (blogId, authorName) => {
      dispatch(postActions.getPostByAuthor(blogId, authorName))
    },
    editPost: (blogId, postId) => {
      dispatch(postActions.editPost(constants.POST_EDIT_FORM_NAME, blogId, postId))
    },
    editBlogOptions: (blogId) => {
      dispatch(editorActions.editBlogOptions(constants.OPTIONS_EDIT_FORM_NAME, blogId))
    },
    switchMode: (mode) => {
      dispatch(actions.switchMode(mode))
    },
    initDataList: () => {
      dispatch(actions.initDataList())
    },
    saveOptions: (blogId) => {
      dispatch(
        formActions.saveForm(constants.OPTIONS_EDIT_FORM_NAME, ['apiv2_blog_options_update', {blogId: blogId}])
      ).then(
        () => dispatch(toolbarActions.getTags(blogId)))
    }
  })
)(Blog)
      
export {BlogContainer}
