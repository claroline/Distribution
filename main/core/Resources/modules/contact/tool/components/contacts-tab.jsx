import React from 'react'

import {Routes} from '#/main/core/router'
import {Contacts, ContactsActions} from '#/main/core/contact/tool/components/contacts.jsx'

const ContactsTabActions = () =>
  <Routes
    routes={[
      {
        path: '/contacts',
        exact: true,
        component: ContactsActions
      }
    ]}
  />

const ContactsTabComponent = () =>
  <Routes
    routes={[
      {
        path: '/contacts',
        exact: true,
        component: Contacts
      }
    ]}
  />

export {
  ContactsTabActions,
  ContactsTabComponent as ContactsTab
}
