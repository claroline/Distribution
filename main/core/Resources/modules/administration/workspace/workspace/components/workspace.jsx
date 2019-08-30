import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'

import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {ListData} from '#/main/app/content/list/containers/data'
import {actions} from '#/main/core/administration/workspace/workspace/actions'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

import {WorkspaceForm} from '#/main/core/workspace/components/form'
import {WorkspaceMetrics} from '#/main/core/workspace/components/metrics'
import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {OrganizationList} from '#/main/core/administration/community/organization/components/organization-list'
import {UserList} from '#/main/core/administration/community/user/components/user-list'

const WorkspaceComponent = (props) =>
  <div>
    {!props.new && props.workspace.meta &&
      <WorkspaceMetrics
        className="component-container"
        workspace={props.workspace}
      />
    }

    <WorkspaceForm
      name="workspaces.current"
      buttons={true}
      target={(workspace, isNew) => isNew ?
        ['apiv2_workspace_create'] :
        ['apiv2_workspace_update', {id: workspace.id}]
      }
      cancel={{
        type: LINK_BUTTON,
        target: '/workspaces',
        exact: true
      }}
    >
      <FormSections level={3}>
        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-building"
          title={trans('organizations')}
          disabled={props.new}
          actions={[
            {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-plus',
              label: trans('add_organizations'),
              callback: () => props.pickOrganizations(props.workspace.uuid)
            }
          ]}
        >
          <ListData
            name="workspaces.current.organizations"
            fetch={{
              url: ['apiv2_workspace_list_organizations', {id: props.workspace.uuid}],
              autoload: props.workspace.uuid && !props.new
            }}
            primaryAction={OrganizationList.open}
            delete={{
              url: ['apiv2_workspace_remove_organizations', {id: props.workspace.uuid}]
            }}
            definition={OrganizationList.definition}
            card={OrganizationList.card}
          />
        </FormSection>

        <FormSection
          className="embedded-list-section"
          icon="fa fa-fw fa-user"
          title={trans('managers')}
          disabled={props.new || isEmpty(props.managerRole)}
          actions={[
            {
              type: CALLBACK_BUTTON,
              icon: 'fa fa-fw fa-plus',
              label: trans('add_managers'),
              callback: () => props.pickManagers(props.workspace)
            }
          ]}
        >
          <ListData
            name="workspaces.current.managers"
            fetch={{
              url: ['apiv2_workspace_list_managers', {id: props.workspace.uuid}],
              autoload: props.workspace.uuid && !props.new
            }}
            primaryAction={UserList.open}
            delete={{
              url: ['apiv2_role_remove_users', {id: !isEmpty(props.managerRole) && props.managerRole.id}]
            }}
            definition={UserList.definition}
            card={UserList.card}
          />
        </FormSection>
      </FormSections>
    </WorkspaceForm>
  </div>

WorkspaceComponent.propTypes = {
  new: T.bool.isRequired,
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  managerRole: T.shape({
    id: T.string
  }),
  pickOrganizations: T.func.isRequired,
  pickManagers: T.func.isRequired
}

WorkspaceComponent.defaultProps = {
  managerRole: {},
  workspace: WorkspaceTypes.defaultProps
}

const Workspace = connect(
  state => {
    const workspace = formSelect.data(formSelect.form(state, 'workspaces.current'))

    return {
      new: formSelect.isNew(formSelect.form(state, 'workspaces.current')),
      workspace: workspace,
      managerRole: !isEmpty(workspace.roles) ?
        workspace.roles.find(role => role.name.indexOf('ROLE_WS_MANAGER') > -1) :
        null
    }
  },
  dispatch =>({
    pickOrganizations(workspaceId) {
      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-buildings',
        title: trans('add_organizations'),
        confirmText: trans('add'),
        name: 'organizations.picker',
        definition: OrganizationList.definition,
        card: OrganizationList.card,
        fetch: {
          url: ['apiv2_organization_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addOrganizations(workspaceId, selected))
      }))
    },
    pickManagers(workspace) {
      // this is not a pretty way to find it but it's ok for now
      const managerRole = workspace.roles.find(role => role.name.indexOf('ROLE_WS_MANAGER') > -1)

      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-user',
        title: trans('add_managers'),
        confirmText: trans('add'),
        name: 'managers.picker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list_managed_workspace'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addManagers(workspace.uuid, selected, managerRole.id))
      }))
    }
  })
)(WorkspaceComponent)

export {
  Workspace
}
