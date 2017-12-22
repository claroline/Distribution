import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

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

ContactsTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const ContactsTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      // dispatch(actions.open('users.current', id))
    }
  })
)(ContactsTabComponent)

export {
  ContactsTabActions,
  ContactsTab
}
