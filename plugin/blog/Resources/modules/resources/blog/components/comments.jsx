import React from 'react'
import {connect} from 'react-redux'
import {UserMessage} from '#/main/core/user/message/components/user-message.jsx'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form.jsx'
import {t, trans, transChoice} from '#/main/core/translation'
import {actions} from '#/plugin/blog/resources/blog/actions.js'
import classes from 'classnames'
import isEmpty from 'lodash/isEmpty'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

const CommentsComponent = props =>
  <div>
      <section>
        <h4 className="comments-title">
          <span className="comments-icon">
            <span className="fa fa-fw fa-comments" />
            <span className="comments-count">{props.comments.length || '0'}</span>
          </span>
          {trans('comments', {}, 'icap_blog')}
          <button
            type="button"
            className="btn btn-link btn-sm btn-toggle-comments"
            onClick={() => props.switchCommentsDisplay(!props.opened)}
          >
            {t(props.opened ? 'hide':'show')}
          </button>
        </h4>

        {props.opened && props.canComment &&
          <section className="comments-section">
            {!props.showComments  && !props.showForm &&
              <button
                className="btn btn-add-comment"
                onClick={() => props.switchCommentFormDisplay(!props.showForm)}
              >
                <span className="fa fa-fw fa-edit" style={{marginRight: '7px'}} />
                {trans('add_comment', {}, 'icap_blog')}
              </button>
            }
            {props.showForm &&
              <div>
                <h4>{trans('add_comment', {}, 'icap_blog')}</h4>
                <UserMessageForm
                  user={props.user}
                  allowHtml={true}
                  submitLabel={t('add_comment')}
                  submit={(comment) => props.submitComment(props.blogId, props.postId, comment)}
                  cancel={() => props.switchCommentFormDisplay(false)}
                />
              </div>
            }
            <hr/>
          </section>
        }
        {props.opened  &&
          <section className="comments-section">
            <h4>{trans('all_comments', {}, 'icap_blog')}</h4>
  
            {props.comments.length === 0 &&
            <div className="list-empty">
              {trans('no_comment', {}, 'icap_blog')}
            </div>
            }
  
            {props.comments.map((comment, commentIndex) =>
              !isEmpty(props.showEditCommentForm) && props.showEditCommentForm === comment.id ?
                <UserMessageForm
                  key={`comment-${commentIndex}`}
                  user={comment.author}
                  content={comment.message}
                  allowHtml={true}
                  submitLabel={t('add_comment')}
                  submit={(commentContent) => props.editComment(props.blogId,  props.postId, comment.id, commentContent)}
                  cancel={() => props.switchEditCommentFormDisplay(false)}
                /> :
                <UserMessage
                  key={`comment-${commentIndex}`}
                  className={classes({
                    'unpublished': !comment.isPublished
                  })}
                  user={comment.author ? comment.author : undefined}
                  date={comment.creationDate}
                  content={comment.message}
                  allowHtml={true}
                  actions={[
                    {
                      icon: 'fa fa-fw fa-pencil',
                      label: t('edit'),
                      displayed: props.canEdit || (comment.author && comment.author.id === props.user.id && !comment.isPublished),
                      action: () => props.switchEditCommentFormDisplay(comment.id)
                    }, {
                      icon: 'fa fa-fw fa-check',
                      label: trans('icap_blog_post_publish', {}, 'icap_blog'),
                      displayed: props.canEdit && !comment.isPublished,
                      action: () => props.publishComment(props.blogId, props.postId, comment.id)
                    }, {
                      icon: 'fa fa-fw fa-ban',
                      label: trans('icap_blog_post_unpublish', {}, 'icap_blog'),
                      displayed: props.canEdit && comment.isPublished,
                      action: () => props.unpublishComment(props.blogId, props.postId, comment.id)
                    }, {
                      icon: 'fa fa-fw fa-trash-o',
                      label: t('delete'),
                      displayed: props.canEdit || (comment.author && comment.author.id === props.user.id && !comment.isPublished),
                      action: () => props.deleteComment(props.blogId, props.postId, comment.id),
                      dangerous: true
                    }
                  ]}
                />
            )}
          </section>
        }
      </section>
  </div>
   
  const Comments = connect(
    state => ({
      user: state.user,
      canEdit: state.canEdit,
      opened: state.showComments,
      showForm: state.showCommentForm,
      showEditCommentForm: state.showEditCommentForm
    }),
    dispatch => ({
      switchCommentsDisplay: (val) => {
        dispatch(actions.showComments(val))
      },
      switchCommentFormDisplay: (val) => {
        dispatch(actions.showCommentForm(val))
      },
      switchEditCommentFormDisplay: (val) => {
        dispatch(actions.showEditCommentForm(val))
      },
      submitComment: (blogId, postId, comment) => {
        dispatch(actions.submitComment(blogId, postId, comment))
      },
      editComment: (blogId, postId, commentId, comment) => {
        dispatch(actions.editComment(blogId, postId, commentId, comment))
      },
      publishComment: (blogId, postId, commentId) => {
        dispatch(actions.publishComment(blogId, postId, commentId))
      },
      unpublishComment: (blogId, postId, commentId) => {
        dispatch(actions.unpublishComment(blogId, postId, commentId))
      },
      deleteComment: (blogId, postId, commentId) => {
        dispatch(modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: trans('comment_deletion_confirm_title', {}, 'icap_blog'),
          question: trans('comment_deletion_confirm_message', {}, 'icap_blog'),
          handleConfirm: () => dispatch(actions.deleteComment(blogId, postId, commentId))
        }))
      }
    })
  )(CommentsComponent) 
    
export {Comments}