import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const UserTabActions = props =>
  <div>
    page actions
  </div>

const UserTab = props =>
  <DataList
    name="users"
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name'),
        renderer: (rowData) => <a href='#'> {rowData.lastName} {rowData.firstName}</a>,
        displayed: true
      },
      {
        name: 'username',
        type: 'string',
        label: t('username'),
        displayed: true
      },
      {
        name: 'firstName',
        type: 'string',
        label: t('first_name'),
        displayed: true
      },
      {
        name: 'lastName',
        type: 'string',
        label: t('last_name'),
        displayed: true
      }
    ]}
    actions={[]}
    card={(row) => ({
      onClick: '#',
      poster: null,
      icon: 'fa fa-user',
      title: row.username,
      subtitle: row.firstName + ' ' + row.lastName,
      contentText: '',
      flags: [],
      footer: <span>footer</span>,
      footerLong: <span>footerLong</span>
    })}
  />

UserTab.propTypes = {

}

export {
  UserTabActions,
  UserTab
}
