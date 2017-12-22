import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {UserAvatar} from '#/main/core/layout/user/components/user-avatar.jsx'
import {select} from '#/main/core/contact/tool/selectors'
import {actions} from '#/main/core/contact/tool/actions'
import {OptionsDataType} from '#/main/core/contact/prop-types'

const VisibleUsersActions = () =>
  <PageActions>
   <PageAction
     id="contacts-configure"
     icon="fa fa-fw fa-pencil"
     title={t('configure')}
     action={() => {}}
   />
  </PageActions>

const VisibleUsers = props =>
  <DataListContainer
    name="users"
    open={{
      action: (row) => generateUrl('claro_user_profile', {'publicUrl': row.meta.publicUrl})
    }}
    fetch={{
      url: ['apiv2_user_list'],
      autoload: true
    }}
    actions={[
      {
        icon: 'fa fa-fw fa-address-book-o',
        label: t('add_contact'),
        action: (rows) => props.createContacts(rows)
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
        displayed: props.options.show_username,
        primary: props.options.show_username
      },
      {
        name: 'lastName',
        type: 'string',
        label: t('last_name'),
        displayed: true,
        primary: !props.options.show_username
      },
      {
        name: 'firstName',
        type: 'string',
        label: t('first_name'),
        displayed: true
      },
      {
        name: 'mail',
        type: 'string',
        label: t('mail'),
        displayed: props.options.show_mail
      },
      {
        name: 'phone',
        type: 'string',
        label: t('phone'),
        displayed: props.options.show_phone
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
  options: T.shape(OptionsDataType.propTypes)
}

function mapStateToProps(state) {
  return {
    options: select.optionsData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createContacts: (users) => dispatch(actions.createContacts(users))
  }
}

const ConnectedVisibleUsers = connect(mapStateToProps, mapDispatchToProps)(VisibleUsers)

export {
  ConnectedVisibleUsers as VisibleUsers,
  VisibleUsersActions
}