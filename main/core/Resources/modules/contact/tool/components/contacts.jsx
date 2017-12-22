import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {UserAvatar} from '#/main/core/layout/user/components/user-avatar.jsx'
import {select} from '#/main/core/contact/tool/selectors'

const ContactsActions = () =>
  <PageActions>
    <PageAction
     id="contact-add"
     icon="fa fa-fw fa-plus"
     title={t('add_contacts')}
     action={() => {}}
     primary={true}
   />
   {/*<PageAction*/}
     {/*id="contacts-configure"*/}
     {/*icon="fa fa-fw fa-pencil"*/}
     {/*title={t('configure')}*/}
     {/*action={() => {}}*/}
   {/*/>*/}
  </PageActions>

const Contacts = props =>
  <DataListContainer
    name="contacts"
    open={{
      action: (row) => generateUrl('claro_user_profile', {'publicUrl': row.data.meta.publicUrl})
    }}
    fetch={{
      url: ['apiv2_contact_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_contact_delete_bulk']
    }}
    actions={[
      {
        icon: 'fa fa-fw fa-eye',
        label: t('show_profile'),
        action: (rows) => window.location = generateUrl('claro_user_profile', {'publicUrl': rows[0].data.meta.publicUrl}),
        context: 'row'
      },
      {
        icon: 'fa fa-fw fa-envelope-o',
        label: t('send_message'),
        action: (rows) => window.location = `${generateUrl('claro_message_show', {'message': 0})}?userIds[]=${rows[0].data.autoId}`,
        context: 'row'
      }
    ]}
    definition={[
      {
        name: 'data.username',
        type: 'username',
        label: t('username'),
        displayed: props.options.show_username,
        primary: props.options.show_username
      },
      {
        name: 'data.lastName',
        type: 'string',
        label: t('last_name'),
        displayed: true,
        primary: !props.options.show_username
      },
      {
        name: 'data.firstName',
        type: 'string',
        label: t('first_name'),
        displayed: true
      },
      {
        name: 'data.email',
        type: 'string',
        label: t('mail'),
        displayed: props.options.show_mail
      },
      {
        name: 'data.phone',
        type: 'string',
        label: t('phone'),
        displayed: props.options.show_phone
      }
    ]}
    card={(row) => ({
      icon: <UserAvatar picture={row.data.picture} alt={true}/>,
      title: row.data.username,
      subtitle: row.data.firstName + ' ' + row.data.lastName,
      contentText: '',
      footer:
        <span>
        </span>,
      footerLong:
        <span>
        </span>
    })}
  />

Contacts.propTypes = {
}

function mapStateToProps(state) {
  return {
    options: select.optionsData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

const ConnectedContacts = connect(mapStateToProps, mapDispatchToProps)(Contacts)

export {
  ConnectedContacts as Contacts,
  ContactsActions
}