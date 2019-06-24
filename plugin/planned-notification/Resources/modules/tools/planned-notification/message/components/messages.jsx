import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {ListData} from '#/main/app/content/list/containers/data.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

import {select} from '#/plugin/planned-notification/tools/planned-notification/selectors'
import {actions} from '#/plugin/planned-notification/tools/planned-notification/message/actions'

const MessagesList = props =>
  <ListData
    name="messages.list"
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      label: trans('open'),
      target: `/messages/form/${row.id}`
    })}
    fetch={{
      url: ['apiv2_plannednotificationmessage_workspace_list', {workspace: props.workspace.uuid}],
      autoload: true
    }}
    delete={{
      url: ['apiv2_plannednotificationmessage_delete_bulk'],
      displayed: () => props.canEdit
    }}
    definition={[
      {
        name: 'title',
        label: trans('title'),
        type: 'string',
        displayed: true
      }, {
        name: 'content',
        label: trans('content'),
        type: 'string',
        displayed: true,
        render: (row) => {
          let contentRow =
            <HtmlText>
              {row.content}
            </HtmlText>

          return contentRow
        }
      }
    ]}
    actions={(rows) => [
      {
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-envelope-o',
        label: trans('send'),
        callback: () => props.pickUsers(rows)
      }
    ]}
  />

MessagesList.propTypes = {
  canEdit: T.bool.isRequired,
  workspace: T.shape({
    uuid: T.string.isRequired
  }).isRequired,
  pickUsers: T.func.isRequired
}

const Messages = connect(
  state => ({
    canEdit: select.canEdit(state),
    workspace: select.workspace(state)
  }),
  dispatch => ({
    pickUsers(messages) {
      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-user',
        title: trans('add_users'),
        confirmText: trans('add'),
        name: 'messages.userspicker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list_registerable'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.sendMessages(messages, selected))
      }))
    }
  })
)(MessagesList)

export {
  Messages
}
