import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {select as workspaceSelect} from '#/main/core/workspace/selectors'

import {selectors} from '#/plugin/team/tools/team/store'

const TeamsComponent = props =>
  <ListData
    name="teams.list"
    primaryAction={(row) => ({
      type: 'link',
      label: trans('open'),
      target: `/teams/${row.id}`
    })}
    fetch={{
      url: ['apiv2_team_list', {workspace: props.workspaceId}],
      autoload: true
    }}
    definition={[
      {
        name: 'name',
        label: trans('name'),
        displayed: true,
        filterable: true,
        type: 'string',
        primary: true
      }, {
        name: 'selfRegistration',
        label: trans('public_registration'),
        displayed: true,
        filterable: true,
        type: 'boolean'
      }, {
        name: 'selfUnregistration',
        label: trans('public_unregistration'),
        displayed: true,
        filterable: true,
        type: 'boolean'
      }, {
        name: 'publicDirectory',
        alias: 'isPublic',
        label: trans('public_directory', {}, 'team'),
        displayed: true,
        filterable: true,
        type: 'boolean'
      }, {
        name: 'maxUsers',
        label: trans('max_users', {}, 'team'),
        displayed: true,
        filterable: true,
        type: 'number'
      }
    ]}
    delete={{
      url: ['apiv2_team_delete_bulk'],
      displayed: () => props.canEdit
    }}
    actions={(rows) => [
      {
        type: 'link',
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit'),
        displayed: props.canEdit,
        scope: ['object'],
        target: `/team/form/${rows[0].id}`
      }
    ]}
  />

TeamsComponent.propTypes = {
  workspaceId: T.string.isRequired,
  canEdit: T.bool.isRequired
}

const Teams = connect(
  (state) => ({
    workspaceId: workspaceSelect.workspace(state).uuid,
    canEdit: selectors.canEdit(state)
  })
)(TeamsComponent)

export {
  Teams
}