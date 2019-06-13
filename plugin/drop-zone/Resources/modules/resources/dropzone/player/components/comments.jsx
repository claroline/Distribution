import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {currentUser} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'

import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {Comment as CommentType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {actions} from '#/plugin/drop-zone/resources/dropzone/player/actions'

const authenticatedUser = currentUser()

const CommentsComponent = props =>
  <div>
    {props.comments.map(comment =>
      <UserMessage
        key={`comment-${comment.id}`}
        user={comment.meta && comment.meta.user ? comment.meta.user : undefined}
        date={comment.meta ? comment.meta.creationDate : ''}
        content={comment.content}
        allowHtml={true}
        position={comment.meta && comment.meta.user && authenticatedUser && comment.meta.user.id === authenticatedUser.id ? 'left' : 'right'}
      />
    )}

    <UserMessageForm
      user={authenticatedUser}
      allowHtml={true}
      submitLabel={trans('add_comment')}
      submit={(content) => {
        const comment = {
          content: content,
          meta: {
            user: authenticatedUser,
            revision: {
              id: props.revisionId
            }
          }
        }
        props.saveComment(comment)
      }}
    />
  </div>

CommentsComponent.propTypes = {
  comments: T.arrayOf(T.shape(CommentType.propTypes)).isRequired,
  revisionId: T.string.isRequired,
  saveComment: T.func.isRequired
}

CommentsComponent.defaultProps = {
  comments: []
}

const Comments = connect(
  null,
  (dispatch) => ({
    saveComment(comment) {
      dispatch(actions.saveRevisionComment(comment))
    }
  })
)(CommentsComponent)

export {
  Comments
}
