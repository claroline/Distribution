import React, {Component} from 'react'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {currentUser} from '#/main/core/user/current'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {actions} from '#/plugin/forum/resources/forum/actions'
import {CommentForm, Comment} from '#/plugin/forum/resources/forum/player/components/comments'

class SubjectComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showNewMessageForm: false,
      showNewCommentForm: null
    }
  }

  createNewMessage(message) {
    this.props.createMessage(this.props.subject.id, message)
    this.setState({showNewMessageForm: false})
  }

  showMessageForm(message) {
    // this.setState({showNewCommentForm: messageId})
    console.log(message)
  }

  showCommentForm(messageId) {
    this.setState({showNewCommentForm: messageId})
  }

  createNewComment(messageId, comment) {
    console.log(messageId)
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
  }

  deleteMessage(messageId) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_message', {}, 'forum'),
      question: trans('remove_post_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteMessage(messageId)
    })
  }


  render() {
    if (isEmpty(this.props.subject)) {
      return(
        <span>Loading</span>
      )
    }
    return (
      <section>
        <header className="subject-info">
          <div>
            <Button
              label={trans('forum_back_to_subjects', {}, 'forum')}
              type="link"
              target="/subjects"
              className="btn-link"
              primary={true}
            />
          </div>
          <div>
            <h2>{this.props.subject.title}<small> {this.props.subject.meta.messages} messages</small></h2>
            {!isEmpty(this.props.subject.tags)&&
              <div className="tag">
                {this.props.subject.tags.map(tag =>
                  <span key={tag} className="label label-primary"><span className="fa fa-fw fa-tag" />{tag}</span>
                )}
              </div>
            }
          </div>
        </header>
        {isEmpty(this.props.message)&&
          <ul className="posts">
            {this.props.messages.map(message =>
              <li key={message.id} className="post">
                <UserMessage
                  user={message.meta.creator}
                  date={message.meta.created}
                  content={message.content}
                  allowHtml={true}
                  actions={[
                    {
                      icon: 'fa fa-fw fa-pencil',
                      label: trans('edit'),
                      displayed: true,
                      action: () => this.showMessageForm(message)
                    }, {
                      icon: 'fa fa-fw fa-trash-o',
                      label: trans('delete'),
                      displayed: true,
                      action: () => this.deleteMessage(message.id),
                      dangerous: true
                    }
                  ]}
                />
                <div className="answer-comment-container">
                  {message.comments.map(comment =>
                    <Comment
                      key={comment.id}
                      user={comment.meta.creator}
                      date={comment.meta.created}
                      content={comment.content}
                      allowHtml={true}
                      actions={[
                        {
                          icon: 'fa fa-fw fa-pencil',
                          label: trans('edit'),
                          displayed: true,
                          action: () => this.showMessageForm(message)
                        }, {
                          icon: 'fa fa-fw fa-trash-o',
                          label: trans('delete'),
                          displayed: true,
                          action: () => this.deleteMessage(message.id),
                          dangerous: true
                        }
                      ]}
                    />
                  )}
                  {!this.state.showNewCommentForm &&
                    <div className="comment-link-container">
                      <Button
                        label={trans('comment', {}, 'actions')}
                        type="callback"
                        callback={() => this.showCommentForm(message.id)}
                        className='comment-link'
                      />
                    </div>
                  }
                  {this.state.showNewCommentForm === message.id &&
                    <CommentForm
                      user={currentUser()}
                      allowHtml={true}
                      submitLabel={trans('add_comment')}
                      submit={(comment) => this.createNewComment(message.id, comment)}
                      cancel={() => this.setState({showNewCommentForm: null})}
                    />
                  }
                </div>
              </li>
            )}
          </ul>
        }
        {!this.state.showNewMessageForm &&
          <div className="answer-comment-container">
            <Button
              label={trans('reply', {}, 'forum')}
              type="callback"
              callback={() => this.setState({showNewMessageForm: true})}
              className="btn btn-block btn-emphasis"
              primary={true}
            />
          </div>
        }
        {this.state.showNewMessageForm &&
          <UserMessageForm
            user={currentUser()}
            allowHtml={true}
            submitLabel={trans('send')}
            submit={(message) => this.createNewMessage(message)}
            cancel={() => this.setState({showNewMessageForm: false})}
          />
        }
      </section>
    )
  }


}


const Subject = connect(
  state => ({
    subject: select.subject(state),
    messages: select.messages(state)
  }),
  dispatch => ({
    createMessage(subjectId, content) {
      dispatch(actions.createMessage(subjectId, content))
    },
    createComment(messageId, comment) {
      dispatch(actions.createComment(messageId, comment))
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    },
    deleteMessage(messageId) {
      dispatch(actions.deleteMessage(messageId))
    }
  })
)(SubjectComponent)

export {
  Subject
}
