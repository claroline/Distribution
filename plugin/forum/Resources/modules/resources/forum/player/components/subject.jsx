import React, {Component} from 'react'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {Button} from '#/main/app/action/components/button'
import {currentUser} from '#/main/core/user/current'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'

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

  showCommentForm(messageId) {
    this.setState({showNewCommentForm: messageId})
  }

  createNewComment(messageId, comment) {
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
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
            <h2>{this.props.subject.title}<small> 5 messages</small></h2>
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
                  // actions={[
                  //   {
                  //     icon: 'fa fa-fw fa-pencil',
                  //     label: trans('edit'),
                  //     displayed: this.canEditMessage(message),
                  //     action: () => this.showMessageForm(message)
                  //   }, {
                  //     icon: 'fa fa-fw fa-trash-o',
                  //     label: trans('delete'),
                  //     displayed: this.props.canManage,
                  //     action: () => this.deleteMessage(message.id),
                  //     dangerous: true
                  //   }, {
                  //     icon: 'fa fa-fw fa-comment',
                  //     label: trans('delete'),
                  //     displayed: this.props.canManage,
                  //     action: () => this.showNewCommentForm()
                  //   }
                  // ]}
                />
                <div className="answer-comment-container">
                  {message.comments.map(comment =>
                    <Comment
                      key={comment.id}
                      user={comment.meta.creator}
                      date={comment.meta.created}
                      content={comment.content}
                      allowHtml={true}
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
    }
  })
)(SubjectComponent)

export {
  Subject
}
