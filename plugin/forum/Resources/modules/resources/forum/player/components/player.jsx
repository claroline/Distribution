import React from 'react'
import {connect} from 'react-redux'


import {select} from '#/plugin/forum/resources/forum/selectors'
import {UserMessage} from '#/main/core/user/message/components/user-message.jsx'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form.jsx'

const PlayerComponent = (props) =>
  <div>
    <section>
      <h2>Titre du Sujet <small>5 messages</small></h2>
      <div className="tag">
        <ul>
          {props.subject.tags.map(tag =><li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </section>
    <section className="posts">
      {props.messages.map(message =>
        <UserMessage
          key={message.id}
          user={message.meta.creator}
          date={message.meta.created}
          content={message.content}
          allowHtml={true}
        />
      )}
    </section>
  </div>

const Player = connect(
  (state) => ({
    subject: select.subject(state),
    messages: select.messages(state)
  })
)(PlayerComponent)

export {
  Player
}
