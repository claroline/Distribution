import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions} from '#/main/core/administration/user/user/actions'
import {t} from '#/main/core/translation'
import Configuration from '#/main/core/library/Configuration/Configuration'
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
        displayed: false
      },
      {
        name: 'lastName',
        type: 'string',
        label: t('last_name'),
        displayed: false
      },
      {
        name: 'hasPersonalWorkspace',
        type: 'boolean',
        label: t('has_personal_workspace'),
        filterable: true,
        displayed: true
      },
      {
        name: 'isEnabled',
        type: 'boolean',
        label: t('isEnabled'),
        filterable: true,
        displayed: true
      },
    ]}
    actions={[
      {
        icon: 'fa fa-fw fa-eye',
        label: t('show_as'),
        action: (rows) => window.location = generateUrl('claro_desktop_open', {'_switch': rows[0].username}),
        context: 'row',
      },
      {
        icon: '',
        label: 'enable ws',
        context: 'row',
        displayed: (rows) => !rows[0].hasPersonalWorkspace,
        action: (rows) => props.createWorkspace(rows[0])
      },
      {
        icon: '',
        label: 'disable ws',
        context: 'row',
        displayed: (rows) => rows[0].hasPersonalWorkspace,
        action: (rows) => props.deleteWorkspace(rows[0])
      },
      {
        icon: '',
        label: 'enable user',
        context: 'row',
        displayed: (rows) => !rows[0].isEnabled,
        action: (rows) => props.enable(rows[0])
      },
      {
        icon: '',
        label: 'disable user',
        context: 'row',
        displayed: (rows) => rows[0].isEnabled,
        action: (rows) => props.disable(rows[0])
      },
      {
        icon: 'fa fa-fw fa-book',
        label: t('user_workspaces'),
        action: (rows) => {
          alert('filters are already enabled for the main page, but the user filter does not exists yet')
          window.location = generateUrl('claro_admin_workspace_list')
        },
        context: 'row'
      },
      ...Configuration.getUsersAdministrationActions().map(action => action.options.modal ? {
        icon: action.icon,
        label: action.name(Translator),
        action: (rows) => props.showModal(MODAL_URL, {
          url: action.url(rows[0].id)
        }),
        context: 'row'
      } : {
        icon: action.icon,
        label: action.name(Translator),
        action: (rows) => window.location = action.url(rows[0].id),
        context: 'row'
      })
    ]}
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

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    enable(user) {
      dispatch(actions.enable(user))
    },
    disable(user) {
      dispatch(actions.disable(user))
    },
    createWorkspace(user) {
      dispatch(actions.createWorkspace(user))
    },
    deleteWorkspace(user) {
      dispatch(actions.deleteWorkspace(user))
    }
  }
}

const ConnectedUserTab = connect(mapStateToProps, mapDispatchToProps)(UserTab)

export {
  UserTabActions,
  ConnectedUserTab as UserTab
}
