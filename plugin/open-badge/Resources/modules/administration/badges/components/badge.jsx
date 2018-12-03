import React from 'react'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'

import {FormSections, FormSection} from '#/main/app/content/form/components/sections'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {ListData} from '#/main/app/content/list/containers/data'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

import {BadgeForm} from '#/main/core/workspace/components/form'
import {OrganizationList} from '#/main/core/administration/user/organization/components/organization-list'
import {UserList} from '#/main/core/administration/user/user/components/user-list'

const BadgeComponent = (props) =>
  <div>

    <BadgeForm
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
    </BadgeForm>
  </div>

const Badge = connect(
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
  () => null
)(BadgeComponent)

export {
  Badge
}
