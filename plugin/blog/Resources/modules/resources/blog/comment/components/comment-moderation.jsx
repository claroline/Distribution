import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {actions as commentActions} from '#/plugin/blog/resources/blog/comment/store'
import {trans} from '#/main/core/translation'
import {Comment} from '#/plugin/blog/resources/blog/comment/components/comment.jsx'

const CommentModerationCardComponent = props =>
  <Comment
    {...props}
    comment={props.data}
  />

CommentModerationCardComponent.propTypes = {
  data: T.object
}

const CommentModerationCard = connect(
  () => ({}),
  dispatch => ({
    publishComment: (blogId, commentId) => {
      dispatch(commentActions.publishComment(blogId, commentId))
    },
    unpublishComment: (blogId, commentId) => {
      dispatch(commentActions.unpublishComment(blogId, commentId))
    },
    reportComment: (blogId, commentId) => {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        title: trans('comment_report_confirm_title', {}, 'icap_blog'),
        question: trans('comment_report_confirm_message', {}, 'icap_blog'),
        handleConfirm: () => dispatch(commentActions.reportComment(blogId, commentId))
      }))
    },
    deleteComment: (blogId, commentId) => {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        title: trans('comment_deletion_confirm_title', {}, 'icap_blog'),
        question: trans('comment_deletion_confirm_message', {}, 'icap_blog'),
        handleConfirm: () => dispatch(commentActions.deleteComment(blogId, commentId))
      }))
    }
  })
)(CommentModerationCardComponent)

export {CommentModerationCard}