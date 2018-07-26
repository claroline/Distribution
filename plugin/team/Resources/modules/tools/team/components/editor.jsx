import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form'

import {TeamParams as TeamParamsType} from '#/plugin/team/tools/team/prop-types'

const EditorComponent = props =>
  <div>
    <h2>{trans('configuration', {}, 'platform')}</h2>
    <FormContainer
      level={3}
      name="teamParamsForm"
      buttons={true}
      save={{
        type: 'callback',
        callback: () => props.saveForm(props.teamParams.id)
      }}
      cancel={{
        type: 'link',
        target: '/',
        exact: true
      }}
      sections={[
        {
          id: 'generam',
          icon: 'fa fa-fw fa-cogs',
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'allowedTeams',
              type: 'number',
              label: trans('max_teams', {}, 'team'),
              options: {
                min: 0
              }
            },  {
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
  </div>

EditorComponent.propTypes = {
  teamParams: T.shape(TeamParamsType.propTypes).isRequired,
  saveForm: T.func.isRequired
}

const Editor = connect(
  (state) => ({
    teamParams: formSelect.data(formSelect.form(state, 'teamParamsForm')),
  }),
  (dispatch) => ({
    saveForm(id) {
      dispatch(formActions.saveForm('teamParamsForm', ['apiv2_workspaceteamparameters_update', {id: id}]))
    }
  })
)(EditorComponent)

export {
  Editor
}