import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {Button} from '#/main/app/action/components/button'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'
import {actions as listActions} from '#/main/core/data/list/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/player/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {CommentForm, Comment} from '#/plugin/forum/resources/forum/player/components/comments'


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
      handleConfirm: () => this.props.deleteData(commentId)
    })
  }

  render() {
    return (
      <div className="answer-comment-container">
        {this.props.message.children.length !== 0 &&
          <h3 className="comments-title">
            <button
              type="button"
              className="btn btn-link btn-sm btn-toggle-comments"
              onClick={() => this.toggleComments()}
            >
              {this.state.opened ? trans('hide_comments', {}, 'forum'): trans('show_comments', {}, 'forum')}
            </button>
            <span className="comments-icon">
              <span className="fa fa-fw fa-comments" />
              <span className="comments-count">{this.props.message.children.length || '0'}</span>
            </span>
          </h3>
        }
        {this.state.opened &&
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
                        displayed: true,
                        action: () => this.setState({showCommentForm: comment.id})
                      }, {
                        icon: 'fa fa-fw fa-flag ',
                        label: trans('flag', {}, 'forum'),
                        displayed: true,
                        action: () => console.log(comment)
                      }, {
                        icon: 'fa fa-fw fa-trash-o',
                        label: trans('delete'),
                        displayed: true,
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
            {!this.state.showNewCommentForm &&
              <div className="comment-link-container">
                <Button
                  label={trans('comment', {}, 'actions')}
                  type="callback"
                  callback={() => this.setState({showNewCommentForm: this.props.message.id})}
                  className='comment-link'
                />
              </div>
            }
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
          </div>
        }

        {(!this.state.showNewCommentForm && this.props.message.children.length === 0) &&
          <div className="comment-link-container">
            <Button
              label={trans('comment', {}, 'actions')}
              type="callback"
              callback={() => this.setState({showNewCommentForm: this.props.message.id})}
              className='comment-link'
            />
          </div>
        }

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
      </div>
    )
  }
}

MessageCommentsComponent.propTypes = {
  subject: T.shape(SubjectType.propTypes).isRequired,
  editContent: T.func.isRequired,
  flagMessage: T.func.isRequired,
  deleteData: T.func.isRequired,
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
    deleteData(id) {
      dispatch(listActions.deleteData('subjects.messages', ['apiv2_forum_message_delete_bulk'], [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData('subjects.messages', ['claroline_forum_api_subject_getmessages', {id}]))
    },
    editContent(message, subjectId, content) {
      dispatch(actions.editContent(message, subjectId, content))
    },
    flagMessage(message, subjectId) {
      dispatch(actions.flagMessage(message, subjectId))
    }
  })
)(MessageCommentsComponent)


export {
  MessageComments
}
