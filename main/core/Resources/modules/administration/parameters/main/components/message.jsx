import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {selectors as formSelect} from '#/main/app/content/form/store'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

import {ConnectionMessage as ConnectionMessageType} from '#/main/core/administration/parameters/main/prop-types'
import {constants} from '#/main/core/administration/parameters/main/constants'

const MessageComponent = (props) =>
  <FormData
    level={2}
    title={props.new ? trans('connection_message_creation') : trans('connection_message_edition')}
    name="messages.current"
    target={(message, isNew) => isNew ?
      ['apiv2_connectionmessage_create'] :
      ['apiv2_connectionmessage_update', {id: message.id}]
    }
    buttons={true}
    cancel={{
      type: LINK_BUTTON,
      target: '/messages',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        fields: [
          {
            name: 'title',
            type: 'string',
            label: trans('title'),
            required: true,
            disabled: (message) => message.locked
          }, {
            name: 'type',
            type: 'choice',
            label: trans('type'),
            required: true,
            options: {
              condensed: true,
              noEmpty: true,
              choices: constants.MESSAGE_TYPES
            },
            disabled: (message) => message.locked
          }, {
            name: 'restrictions.dates',
            type: 'date-range',
            label: trans('for_period'),
            required: true,
            options: {
              time: true
            },
            disabled: (message) => message.locked
          }, {
            name: 'roles',
            label: trans('roles'),
            type: 'roles',
            required: true,
            disabled: (message) => message.locked
          }
        ]
      }
    ]}
  />

MessageComponent.propTypes = {
  new: T.bool,
  message: T.shape(ConnectionMessageType.propTypes)
}

const Message = connect(
  (state) => ({
    new: formSelect.isNew(formSelect.form(state, 'messages.current')),
    message: formSelect.data(formSelect.form(state, 'messages.current'))
  })
)(MessageComponent)

export {
  Message
}
