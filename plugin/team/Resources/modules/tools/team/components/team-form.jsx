import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {FormContainer} from '#/main/core/data/form/containers/form'

import {Team as TeamType} from '#/plugin/team/tools/team/prop-types'

const TeamFormComponent = props =>
  <section className="tool-section">
    <h2>{props.isNew ? trans('team_creation', {}, 'team') : trans('team_edition', {}, 'team')}</h2>
    <FormContainer
      level={3}
      name="teams.current"
      buttons={true}
      target={(team, isNew) => isNew ?
        ['apiv2_team_create'] :
        ['apiv2_team_update', {id: team.id}]
      }
      save={{
        type: 'callback',
        target: `/teams/${props.team.id}`,
        callback: () => props.history.push(`/teams/${props.team.id}`)
      }}
      cancel={{
        type: 'link',
        target: '/',
        exact: true
      }}
      sections={[
        {
          id: 'general',
          icon: 'fa fa-fw fa-cogs',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            }, {
              name: 'description',
              type: 'html',
              label: trans('description')
            // },{
            //   name: 'defaultResource',
            //   type: 'resource',
            //   label: trans('default_resource', {}, 'team')
            }, {
              name: 'maxUsers',
              type: 'number',
              label: trans('max_users', {}, 'team')
            }, {
              name: 'publicDirectory',
              type: 'boolean',
              label: trans('team_directory_public_access', {}, 'team'),
              required: true
            }, {
              name: 'selfRegistration',
              type: 'boolean',
              label: trans('team_self_registration', {}, 'team'),
              required: true
            }, {
              name: 'selfUnregistration',
              type: 'boolean',
              label: trans('team_self_unregistration', {}, 'team'),
              required: true
            }
          ]
        }
      ]}
    />
  </section>

TeamFormComponent.propTypes = {
  team: T.shape(TeamType.propTypes).isRequired,
  isNew: T.bool.isRequired,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired
}

const TeamForm = connect(
  (state) => ({
    team: formSelect.data(formSelect.form(state, 'teams.current')),
    isNew: formSelect.isNew(formSelect.form(state, 'teams.current'))
  })
)(TeamFormComponent)

export {
  TeamForm
}