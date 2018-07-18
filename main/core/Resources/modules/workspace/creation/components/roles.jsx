import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {trans} from '#/main/core/translation'
import {Logs} from '#/main/core/workspace/creation/components/log/components/logs.jsx'

class Roles extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const roleOptions = {}

    if (this.props.model.roles) {
      this.props.model.roles.forEach(role => {
        roleOptions[role.id] = role.translationKey
      })
    }

    return (
      <div>
        <FormContainer
          disabled={true}
          name="workspaces.creation.roles"
          sections={[
            {
              title: trans('roles'),
              primary: true,
              fields: [
                {
                  name: 'roles',
                  type: 'choice',
                  label: trans('roles'),
                  required: true,
                  options: {
                    condensed: false,
                    multiple: true,
                    choices: roleOptions
                  }
                }
              ]
            }
          ]}
        />
        <Logs/>
      </div>
    )
  }
}

const ConnectedRoles = connect(
  state => ({
    model: state.workspaces.creation.model
    //model: defaultModel
  }),
  dispatch => ({
  })
)(Roles)

export {
  ConnectedRoles as WorkspaceRoles
}
