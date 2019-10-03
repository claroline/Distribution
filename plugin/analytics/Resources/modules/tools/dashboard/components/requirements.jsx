import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'
import {FormSections, FormSection} from '#/main/app/content/form/components/sections'

import {selectors as toolSelectors} from  '#/main/core/tool/store'

import {selectors} from '#/plugin/analytics/tools/dashboard/store'

const RequirementsComponent = (props) =>
  <FormSections
    level={3}
  >
    <FormSection
      id="roles-section"
      key="roles-section"
      icon="fa fa-fw fa-id-badge"
      title={trans('roles')}
    >
      <ListData
        name={selectors.STORE_NAME + '.requirements.roles'}
        fetch={{
          url: ['apiv2_workspace_requirements_roles_list', {workspace: props.workspaceSlug}],
          autoload: true
        }}
        definition={[
          {
            name: 'id',
            type: 'string',
            label: trans('date'),
            displayed: true,
            primary: true
          }
        ]}
      />
    </FormSection>
    <FormSection
      id="users-section"
      key="users-section"
      icon="fa fa-fw fa-user"
      title={trans('users')}
    >
      <ListData
        name={selectors.STORE_NAME + '.requirements.users'}
        fetch={{
          url: ['apiv2_workspace_requirements_users_list', {workspace: props.workspaceSlug}],
          autoload: true
        }}
        definition={[
          {
            name: 'id',
            type: 'string',
            label: trans('date'),
            displayed: true,
            primary: true
          }
        ]}
      />
    </FormSection>
  </FormSections>

RequirementsComponent.propTypes = {
  workspaceId: T.string
}

const Requirements = connect(
  state => ({
    workspaceSlug: toolSelectors.contextData(state).slug
  })
)(RequirementsComponent)

export {
  Requirements
}
