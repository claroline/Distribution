import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

import {FormContainer} from '#/main/core/data/form/containers/form'


const WorkspaceComponent = (props) => {
  return (<div>
    <FormContainer
      level={3}
      name="workspaces.creation.workspace"
      new={true}
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'name',
              type: 'string',
              label: trans('name'),
              required: true
            }, {
              name: 'code',
              type: 'string',
              label: trans('code'),
              required: true
            }, {
              name: 'model',
              type:
              label:
              required: true
            }
          ]
        }, {
          icon: 'fa fa-fw fa-info',
          title: trans('information'),
          fields: [
            {
              name: 'meta.description',
              type: 'string',
              label: trans('description'),
              options: {
                long: true
              }
            }, {
              name: 'meta.model',
              label: trans('model'),
              type: 'boolean',
              disabled: false
            }, {
              name: 'meta.forceLang',
              type: 'boolean',
              label: trans('default_language'),
              onChange: activated => {
                if (!activated) {
                  // reset lang field
                  props.updateProp('meta.lang', null)
                }
              },
              linked: [{
                name: 'meta.lang',
                label: trans('lang'),
                type: 'locale',
                displayed: (workspace) => workspace.meta.forceLang
              }]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-sign-in',
          title: trans('opening_parameters'),
          fields: [
            {
              name: 'opening.type',

              type: 'choice',
              label: trans('type'),
              required: true,
              options: {
                noEmpty: true,
                condensed: true,
                choices: {
                  tool: trans('open_workspace_tool'),
                  resource: trans('open_workspace_resource')
                }
              },
              onChange: () => {
                props.updateProp('opening.target', null)
              },
              linked: [
                {
                  name: 'opening.target',
                  type: 'string',
                  label: trans('tool'),
                  required: true,
                  displayed: (workspace) => workspace.opening && 'tool' === workspace.opening.type
                }, {
                  name: 'opening.target',
                  type: 'string',
                  label: trans('resource'),
                  required: true,
                  displayed: (workspace) => workspace.opening && 'resource' === workspace.opening.type
                }
              ]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-desktop',
          title: trans('display_parameters'),
          fields: [
            {
              name: 'thumbnail',
              type: 'image',
              label: trans('thumbnail')
            }, {
              name: 'display.color',
              type: 'color',
              label: trans('color')
            }, {
              name: 'display.showBreadcrumbs',
              type: 'boolean',
              label: trans('showBreadcrumbs')
            }, {
              name: 'display.showTools'
              ,
              type: 'boolean',
              label: trans('showTools')
            }
          ]
        }, {
          icon: 'fa fa-fw fa-user-plus',
          title: trans('registration'),
          fields: [ {
            name: 'registration.selfRegistration',
            type: 'boolean',
            label: trans('activate_self_registration'),
            help: trans('self_registration_workspace_help'),
            linked: [
              {
                name: 'registration.validation',
                type: 'boolean',
                label: trans('validate_registration'),
                help: trans('validate_registration_help'),
                displayed: (workspace) => workspace.registration && workspace.registration.selfRegistration
              }
            ]
          }, {
            name: 'registration.selfUnregistration',
            type: 'boolean',
            label: trans('activate_self_unregistration'),
            help: trans('self_unregistration_workspace_help')
          }
          ]
        }, {
          icon: 'fa fa-fw fa-key',
          title: trans('access_restrictions'),
          fields: [
            {
              name: 'restrictions.hidden',
              type: 'boolean',
              label: trans('restrict_hidden'),
              help: trans('restrict_hidden_help')
            }, {
              name: 'restrictions.enableDates',
              label: trans('restrict_by_dates'),
              type: 'boolean',
              onChange: activated => {
                if (!activated) {
                  props.updateProp('restrictions.dates', [])
                }
              },
              linked: [
                {
                  name: 'restrictions.dates',
                  type: 'date-range',
                  label: trans('access_dates'),
                  required: true,
                  options: {
                    time: true
                  }
                }
              ]
            }, {
              name: 'restrictions.enableMaxUsers',
              type: 'boolean',
              label: trans('restrict_max_users'),
              onChange: activated => {
                if (!activated) {
                  // reset max users field
                  props.updateProp('restrictions.maxUsers', null)
                }
              },
              linked: [
                {
                  name: 'restrictions.maxUsers',
                  type: 'number',
                  label: trans('maxUsers'),
                  required: true,
                  options: {
                    min: 0
                  }
                }
              ]
            }, {
              name: 'restrictions.enableMaxResources',
              type: 'boolean',
              label: trans('restrict_max_resources'),
              onChange: activated => {
                if (!activated) {
                  // reset max users field
                  props.updateProp('restrictions.maxResources', null)
                }
              },
              linked: [
                {
                  name: 'restrictions.maxResources',
                  type: 'number',
                  label: trans('max_amount_resources'),
                  required: true,
                  options: {
                    min: 0
                  }
                }
              ]
            }, {
              name: 'restrictions.enableMaxStorage',
              type: 'boolean',
              label: trans('restrict_max_storage'),
              onChange: activated => {
                if (!activated) {
                  // reset max users field
                  props.updateProp('restrictions.maxStorage', null)
                }
              },
              linked: [
                {
                  name: 'restrictions.maxStorage',
                  type: 'storage',
                  label: trans('max_storage_size'),
                  displayed: true,
                  required: true,
                  options: {
                    min: 0
                  }
                }
              ]
            }
          ]
        }, {
          icon: 'fa fa-fw fa-bell-o',
          title: trans('notifications'),
          fields: [
            {
              name: 'notifications.enabled',
              type: 'boolean',
              label: trans('enable_notifications')
            }
          ]
        }
      ]}
    >
    </FormContainer>
  </div>
  )}

WorkspaceComponent.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired
}

WorkspaceComponent.defaultProps = {
  workspace: WorkspaceTypes.defaultProps
}

const ConnectedForm = connect(
  state => {
    const workspace = formSelect.data(formSelect.form(state, 'workspaces.creation.workspace'))

    return {
      workspace: workspace
    }
  },
  dispatch =>({
  })
)(WorkspaceComponent)

export {
  ConnectedForm as WorkspaceForm
}
