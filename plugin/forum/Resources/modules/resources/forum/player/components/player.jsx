import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Button} from '#/main/app/action/components/button'
import {currentUser} from '#/main/core/user/current'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {trans} from '#/main/core/translation'
import {UserMessage} from '#/main/core/user/message/components/user-message.jsx'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form.jsx'


class PlayerComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showNewMessageForm: false,
      showNewCommentForm: false
    }
  }

  canEditComment(comment) {
    return this.props.canManage || (this.props.user && comment.user && this.props.user.id === comment.user.id)
  }

  render() {
    return(
      <section>
        <div className="subject-info">
          <div>
            <Button
              label={trans('forum_back_to_subjects', {}, 'forum')}
              type="link"
              target="/play"
              className="btn-link"
              primary={true}
            />
          </div>
          <div>
            <h2>{this.props.subject.title}<small> 5 messages</small></h2>
            <div className="tag">
              {this.props.subject.tags.map(tag =>
                <span key={tag} className="label label-primary"><span className="fa fa-fw fa-tag" />{tag}</span>
              )}
            </div>
          </div>
        </div>

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
            </li>
          )}
        </ul>
        <section className="answer">
          {!this.state.showNewMessageForm &&
            <div className="answer-button-container">
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
      </section>
    )
  }
}






const Player = connect(
  (state) => ({
    subject: select.subject(state),
    messages: select.messages(state)
  })
)(PlayerComponent)

export {
  Player
}
