import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {trans} from '#/main/core/translation'
import {select as workspaceSelect} from '#/main/core/workspace/selectors'

const TeamsComponent = props =>
  <DataListContainer
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
        name: 'description',
        label: trans('description'),
        displayed: true,
        filterable: true,
        type: 'string'
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
        name: 'public',
        label: trans('public'),
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
    actions={() => []}
  />

TeamsComponent.propTypes = {
  workspaceId: T.string.isRequired
}

const Teams = connect(
  (state) => ({
    workspaceId: workspaceSelect.workspace(state).uuid
  })
)(TeamsComponent)

export {
  Teams
}