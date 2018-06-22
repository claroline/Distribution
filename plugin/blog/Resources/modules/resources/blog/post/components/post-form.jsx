import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {t} from '#/main/core/translation'
import isEmpty from 'lodash/isEmpty'
import {Redirect } from 'react-router'
import {Button} from '#/main/app/action/components/button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {PostType} from '#/plugin/blog/resources/blog/post/components/prop-types'
import {constants} from '#/plugin/blog/resources/blog/constants.js'

const PostFormComponent = props =>
  <div>
    {props.goHome &&
      <Redirect to={'/'} />
    }
    {(props.mode === constants.CREATE_POST || !isEmpty(props.post.data)) &&
      <FormContainer
        name="post_edit"
        sections={[
          {
            id: 'Post',
            title: 'Post form',
            primary: true,
            fields: [
              {
                name: 'title',
                type: 'string',
                label: 'Title',
                required: true
              },{
                name: 'publicationDate',
                type: 'date',
                label: 'Publication date',
                required: true
              },{
                name: 'content',
                type: 'html',
                label: 'Content',
                required: true,
                options: {
                  minRows: 6
                }
              }
            ]
          }
        ]}
      >
        <ButtonToolbar>
          <Button
            disabled={!props.saveEnabled}
            primary={true}
            label={t('save')}
            type="callback"
            className="btn"
            callback={() => {
              props.save(props.blogId, props.mode, props.postId)
            }}
          />
          <Button
            disabled={!props.saveEnabled}
            label={t('cancel')}
            type="callback"
            className="btn"
            callback={() => {
              props.cancel()
            }}
          />
        </ButtonToolbar>
      </FormContainer>   
    }
  </div>

PostFormComponent.propTypes = {
  mode: T.string,
  blogId: T.string,
  postId: T.string,
  goHome: T.bool,
  saveEnabled: T.bool,
  post: T.shape(PostType.propTypes).isRequired,
  tags: T.array,
  save: T.func.isRequired,
  cancel: T.func.isRequired
}

const PostForm = connect(
  state => ({
    mode: state.mode,
    blogId: state.blog.data.id,
    postId: !isEmpty(state.post_edit) ? state.post_edit.data.id : null,
    post: state.post_edit,
    tags: state.blog.data.tags,
    goHome: state.goHome,
    saveEnabled: formSelect.saveEnabled(formSelect.form(state, 'post_edit'))
  }), dispatch => ({
    save: (blogId, mode, postId) => {
      if(mode === constants.CREATE_POST){
        dispatch(
          formActions.saveForm(constants.POST_EDIT_FORM_NAME, ['apiv2_blog_post_new', {blogId: blogId}])
        )
      }else if(mode === constants.EDIT_POST && postId !== null){
        dispatch(
          formActions.saveForm(constants.POST_EDIT_FORM_NAME, ['apiv2_blog_post_update', {blogId: blogId, postId: postId}])
        )
      }
    },
    cancel: () => {
      dispatch(
        formActions.cancelChanges(constants.POST_EDIT_FORM_NAME)
      )
    }
    
  })
)(PostFormComponent)

export {PostForm}