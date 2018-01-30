import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {UserAvatar} from '#/main/core/user/components/avatar.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/main/core/contact/tool/actions'
import {select} from '#/main/core/contact/tool/selectors'
import {OptionsType} from '#/main/core/contact/prop-types'
import {MODAL_CONTACTS_OPTIONS_FORM} from '#/main/core/contact/tool/components/modal/contacts-options-form.jsx'

const VisibleUsersActions = props =>
  <PageActions>
    <PageAction
     id="options-edit"
     icon="fa fa-fw fa-pencil"
     title={t('configure')}
     action={() => props.configure(props.options)}
     primary={false}
   />
  </PageActions>

VisibleUsersActions.propTypes = {
  options: T.object.isRequired,
  configure: T.func.isRequired
}

const VisibleUsers = props =>
  <DataListContainer
    name="users.contactable"
    open={{
      action: (row) => generateUrl('claro_user_profile', {'publicUrl': row.meta.publicUrl})
    }}
    fetch={{
      url: ['apiv2_visible_users_list'],
      autoload: true
    }}
    actions={[
      {
        icon: 'fa fa-fw fa-address-book-o',
        label: t('add_contact'),
        action: (rows) => props.createContacts(rows.map(r => r.id))
      },
      {
        icon: 'fa fa-fw fa-eye',
        label: t('show_profile'),
        action: (rows) => window.location = generateUrl('claro_user_profile', {'publicUrl': rows[0].meta.publicUrl}),
        context: 'row'
      },
      {
        icon: 'fa fa-fw fa-envelope-o',
        label: t('send_message'),
        action: (rows) => {
          window.location = `${generateUrl('claro_message_show', {'message': 0})}?${rows.map(u => `userIds[]=${u.autoId}`).join('&')}`
        }
      }
    ]}
    definition={[
      {
        name: 'username',
        type: 'username',
        label: t('username'),
        displayed: props.options.data.show_username,
        primary: props.options.data.show_username
      },
      {
        name: 'lastName',
        type: 'string',
        label: t('last_name'),
        displayed: true,
        primary: !props.options.data.show_username
      },
      {
        name: 'firstName',
        type: 'string',
        label: t('first_name'),
        displayed: true
      },
      {
        name: 'email',
        type: 'string',
        label: t('mail'),
        displayed: props.options.data.show_mail
      },
      {
        name: 'phone',
        type: 'string',
        label: t('phone'),
        displayed: props.options.data.show_phone
      }
    ]}
    card={(row) => ({
      icon: <UserAvatar picture={row.picture} alt={true}/>,
      title: row.username,
      subtitle: row.firstName + ' ' + row.lastName,
      contentText: '',
      footer:
        <span>
        </span>,
      footerLong:
        <span>
        </span>
    })}
  />

VisibleUsers.propTypes = {
  options: T.shape(OptionsType.propTypes),
  createContacts: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    options: select.options(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createContacts: users => dispatch(actions.createContacts(users)),
    configure: options => {
      dispatch(modalActions.showModal(MODAL_CONTACTS_OPTIONS_FORM, {
        data: options,
        save: options => dispatch(actions.saveOptions(options))
      }))
    }
  }
}

const ConnectedVisibleUsers = connect(mapStateToProps, mapDispatchToProps)(VisibleUsers)
const ConnectedVisibleUsersActions = connect(mapStateToProps, mapDispatchToProps)(VisibleUsersActions)

export {
  ConnectedVisibleUsers as VisibleUsers,
  ConnectedVisibleUsersActions as VisibleUsersActions
}