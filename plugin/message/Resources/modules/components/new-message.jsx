import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {User as UserTypes} from '#/main/core/user/prop-types'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {currentUser} from '#/main/core/user/current'
import {FormData} from '#/main/app/content/form/containers/data'
import {selectors as formSelectors} from '#/main/app/content/form/store/selectors'
// import {actions as formActions} from '#/main/app/content/form/store/actions'


const NewMessageFormWrapper = (props) =>
  <div>
    <div className='user-message-container user-message-form-container user-message-left'>
      <UserAvatar picture={props.user.picture} />

      <div className="user-message">
        <div className="user-message-meta">
          <div className="user-message-info">
            {props.user.name}
          </div>
        </div>
        <div className="user-message-content embedded-form-section">
          {props.children}
        </div>
        <Button
          className="btn btn-block btn-save btn-emphasis"
          label={trans('send'), {}, ('action')}
          type={CALLBACK_BUTTON}
          callback={props.callback}
          primary={true}
        />
      </div>
    </div>
  </div>

NewMessageFormWrapper.propTypes = {
  user: T.shape(UserTypes.propTypes),
  callback: T.func.isRequired,
  children: T.node.isRequired
}

const NewMessageComponent = (props) =>
  <div>
    <NewMessageFormWrapper
      user={currentUser()}
      callback={() => console.log(props.newMessage)}
      // props.saveForm(props.forumId, props.editingSubject, props.subject.id)}
    >
      <FormData
        level={3}
        displayLevel={2}
        name="messageForm"
        title={trans('new_message')}
        className="content-container"
        sections={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'recipient',
                type: 'username',
                label: trans('message_form_to'),
                required: true
              },
              {
                name: 'subject',
                type: 'string',
                label: trans('message_form_object')
              },
              {
                name: 'content',
                type: 'html',
                label: trans('message_form_content'),
                required: true
              }
            ]
          }
        ]}
      />
    </NewMessageFormWrapper>
  </div>

const NewMessage = connect(
  state => ({
    newMessage: formSelectors.data(formSelectors.form(state, 'messageForm'))

  })
)(NewMessageComponent)

export {
  NewMessage
}
