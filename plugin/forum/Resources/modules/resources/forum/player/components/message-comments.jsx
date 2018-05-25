import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/player/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {CommentForm, Comment} from '#/plugin/forum/resources/forum/player/components/comments'

const authenticatedUser = currentUser()

class MessageCommentsComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCommentForm: null,
      showNewCommentForm: null,
      opened: props.opened
    }
  }

  toggleComments() {
    this.setState({opened: !this.state.opened})
    if(this.state.showNewCommentForm && this.state.opened === true) {
      this.setState({showNewCommentForm: null})
    }
  }

  showCommentForm(messageId) {
    this.setState({opened: true})
    this.setState({showNewCommentForm: messageId})
  }

  createNewComment(messageId, comment) {
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
  }

  updateComment(comment, content) {
    this.props.editContent(comment, this.props.subject.id, content)
    this.setState({showCommentForm: null})
  }

  deleteComment(commentId) {
    this.props.showModal(MODAL_CONFIRM, {
      dangerous: true,
      icon: 'fa fa-fw fa-trash-o',
      title: trans('delete_comment', {}, 'forum'),
      question: trans('remove_comment_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteComment(commentId)
    })
  }

  render() {
    return (
      <div className="answer-comment-container">
        {(this.state.opened &&
          <div>
            {this.props.message.children.map(comment =>
              <div key={comment.id}>
                {this.state.showCommentForm !== comment.id &&
                  <Comment
                    user={comment.meta.creator}
                    date={comment.meta.created}
                    content={comment.content}
                    allowHtml={true}
                    actions={[
                      {
                        icon: 'fa fa-fw fa-pencil',
                        label: trans('edit'),
                        displayed: comment.meta.creator.id === authenticatedUser.id,
                        action: () => this.setState({showCommentForm: comment.id})
                      }, {
                        icon: 'fa fa-fw fa-flag ',
                        label: trans('flag', {}, 'forum'),
                        displayed: comment.meta.creator.id !== authenticatedUser.id,
                        action: () => this.props.flag(comment, this.props.subject.id)
                      }, {
                        icon: 'fa fa-fw fa-trash-o',
                        label: trans('delete'),
                        displayed: comment.meta.creator.id === authenticatedUser.id,
                        action: () => this.deleteComment(comment.id),
                        dangerous: true
                      }
                    ]}
                  />
                }
                {this.state.showCommentForm === comment.id &&
                  <CommentForm
                    user={currentUser()}
                    allowHtml={true}
                    submitLabel={trans('add_comment')}
                    content={comment.content}
                    submit={(content) => this.updateComment(comment, content)}
                    cancel={() => this.setState({showCommentForm: null})}
                  />
                }
              </div>
            )}
          </div>
        )}
        {this.state.showNewCommentForm === this.props.message.id &&
          <CommentForm
            user={currentUser()}
            allowHtml={true}
            submitLabel={trans('add_comment')}
            // content={comment.content}
            submit={(comment) => this.createNewComment(this.props.message.id, comment)}
            cancel={() => this.setState({showNewCommentForm: null})}
          />
        }
        <div className="comment-link-container">
          {this.props.message.children.length !== 0 &&
            <button
              type="button"
              className="btn btn-link btn-sm comment-link"
              onClick={() => this.toggleComments()}
            >
              {this.state.opened ? transChoice('hide_comments',this.props.message.children.length, {count: this.props.message.children.length}, 'forum'): transChoice('show_comments', this.props.message.children.length, {count: this.props.message.children.length}, 'forum')}
            </button>
          }
          {!this.state.showNewCommentForm || !get(this.props.subject, 'meta.closed') &&
            <button
              type="button"
              onClick={() => this.showCommentForm(this.props.message.id)}
              className='btn btn-link btn-sm comment-link'
            >
              {trans('comment', {}, 'actions')}
            </button>
          }
        </div>
      </div>
    )
  }
}

MessageCommentsComponent.propTypes = {
  subject: T.shape(SubjectType.propTypes).isRequired,
  message: T.shape({
    id: T.string.Required,
    children: T.array.isRequired
  }).isRequired,
  editContent: T.func.isRequired,
  opened: T.bool,
  // flagMessage: T.func.isRequired,
  deleteComment: T.func.isRequired,
  createComment: T.func.isRequired,
  showModal: T.func
}

const MessageComments =  connect(
  state => ({
    subject: select.subject(state)
  }),
  dispatch => ({
    createComment(messageId, comment) {
      dispatch(actions.createComment(messageId, comment))
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    },
    deleteComment(id) {
      dispatch(listActions.deleteComment('subjects.messages', ['apiv2_forum_message_delete_bulk'], [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData('subjects.messages', ['claroline_forum_api_subject_getmessages', {id}]))
    },
    editContent(message, subjectId, content) {
      dispatch(actions.editContent(message, subjectId, content))
    },
    flag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    }
  })
)(MessageCommentsComponent)


export {
  MessageComments
}
