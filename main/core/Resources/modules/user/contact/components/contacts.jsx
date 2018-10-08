import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {URL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'

import {trans} from '#/main/core/translation'
import {UserCard} from '#/main/core/user/data/components/user-card'
import {OptionsType} from '#/main/core/user/contact/prop-types'

const ContactCard = props =>
  <UserCard
    {...omit(props, 'data')}
    {...props.data}
  />

ContactCard.propTypes = {
  data: T.object.isRequired
}

const ContactsComponent = props =>
  <ListData
    name="contacts"
    display={{
      current: listConst.DISPLAY_TILES_SM,
      available: Object.keys(listConst.DISPLAY_MODES)
    }}
    fetch={{
      url: ['apiv2_contact_list'],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: URL_BUTTON,
      target: ['claro_user_profile', {user: row.data.meta.publicUrl}]
    })}
    delete={{
      url: ['apiv2_contact_delete_bulk']
    }}
    definition={[
      {
        name: 'data.username',
        type: 'username',
        alias: 'username',
        label: trans('username'),
        displayed: props.options.data.show_username,
        primary: props.options.data.show_username
      }, {
        name: 'data.lastName',
        type: 'string',
        alias: 'lastName',
        label: trans('last_name'),
        displayed: true,
        primary: !props.options.data.show_username
      }, {
        name: 'data.firstName',
        type: 'string',
        alias: 'firstName',
        label: trans('first_name'),
        displayed: true
      }, {
        name: 'data.email',
        type: 'string',
        alias: 'email',
        label: trans('email'),
        displayed: props.options.data.show_mail
      }, {
        name: 'data.phone',
        type: 'string',
        alias: 'phone',
        label: trans('phone'),
        displayed: props.options.data.show_phone
      }, {
        name: 'group',
        type: 'string',
        label: trans('group'),
        displayed: false,
        displayable: false,
        filterable: true
      }
    ]}
    card={ContactCard}
  />

ContactsComponent.propTypes = {
  options: T.shape(OptionsType.propTypes)
}

const Contacts = connect(
  (state) => ({
    options: formSelect.data(formSelect.form(state, 'options'))
  })
)(ContactsComponent)

export {
  Contacts
}
