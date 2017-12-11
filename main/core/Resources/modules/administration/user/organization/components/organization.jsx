import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageGroupActions, PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {actions} from '#/main/core/administration/user/organization/actions'
import {generateUrl} from '#/main/core/fos-js-router'

import {MODAL_DATA_PICKER} from '#/main/core/data/modal/containers/picker.jsx'

import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'
import {WorkspaceList} from '#/main/core/administration/workspace/components/workspace-list.jsx'

const OrganizationSaveAction = makeSaveAction('organizations.current', formData => ({
  create: ['apiv2_organization_create'],
  update: ['apiv2_organization_update', {id: formData.id}]
}))(PageAction)

const OrganizationActions = props =>
  <PageActions>
    <PageGroupActions>
      <PageAction
        id="organization-delete"
        icon="fa fa-trash-o"
        title={t('delete')}
        action={() => true}
        dangerous={true}
      />
    </PageGroupActions>

    <PageGroupActions>
      <OrganizationSaveAction />

      <PageAction
        id="organization-list"
        icon="fa fa-list"
        title={t('back_to_list')}
        action="#/organizations"
      />
    </PageGroupActions>
  </PageActions>

const OrganizationForm = props =>
  <FormContainer
    level={3}
    name="organizations.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: t('name')
          }, {
            name: 'code',
            type: 'string',
            label: t('code')
          }, {
            name: 'email',
            type: 'email',
            label: t('email')
          }, {
            name: 'managers',
            type: 'users',
            label: t('managers')
          }
        ]
      }, {
        id: 'position',
        title: t('position'),
        fields: [
          {
            name: 'meta.parent',
            type: 'organization',
            label: t('parent')
          }, {
            name: 'meta.position',
            type: 'number',
            label: t('position')
          }
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="organization-workspaces"
        icon="fa fa-fw fa-book"
        title={t('workspaces')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_workspace'),
            action: () => props.pickWorkspaces(props.organization.id)
          }
        ]}
      >
        <DataListContainer
          name="organizations.current.workspaces"
          open={WorkspaceList.open}
          fetch={{
            url: ['apiv2_organization_list_workspaces', {id: props.organization.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_organization_remove_workspaces', {id: props.organization.id}],
          }}
          definition={WorkspaceList.definition}
          card={WorkspaceList.card}
        />
      </FormSection>

      <FormSection
        id="organization-users"
        icon="fa fa-fw fa-user"
        title={t('users')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_user'),
            action: () => props.pickUsers(props.organization.id)
          }
        ]}
      >
        <DataListContainer
          name="organizations.current.users"
          open={UserList.open}
          fetch={{
            url: ['apiv2_organization_list_users', {id: props.organization.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_organization_remove_users', {id: props.organization.id}],
          }}
          definition={UserList.definition}
          card={UserList.card}
        />
      </FormSection>

      <FormSection
        id="organization-groups"
        icon="fa fa-fw fa-users"
        title={t('groups')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_group'),
            action: () => props.pickGroups(props.organization.id)
          }
        ]}
      >
        <DataListContainer
          name="organizations.current.groups"
          open={GroupList.open}
          fetch={{
            url: ['apiv2_organization_list_groups', {id: props.organization.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_organization_remove_groups', {id: props.organization.id}],
          }}
          definition={GroupList.definition}
          card={GroupList.card}
        />
      </FormSection>
    </FormSections>
  </FormContainer>

OrganizationForm.propTypes = {
  organization: T.shape({
    id: T.string
  }).isRequired
}

const Organization = connect(
  state => ({
    organization: formSelect.data(formSelect.form(state, 'organizations.current'))
  }),
  dispatch => ({
    pickUsers: (organizationId) => {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-user',
        title: t('add_users'),
        confirmText: t('add'),
        name: 'users.picker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addUsers(organizationId, selected))
      }))
    },
    pickGroups: (organizationId) => {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-users',
        title: t('add_groups'),
        confirmText: t('add'),
        name: 'groups.picker',
        definition: GroupList.definition,
        card: GroupList.card,
        fetch: {
          url: ['apiv2_group_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addGroups(organizationId, selected))
      }))
    },
    pickWorkspaces: (organizationId) => {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-books',
        title: t('add_workspaces'),
        confirmText: t('add'),
        name: 'workspaces.picker',
        definition: WorkspaceList.definition,
        card: WorkspaceList.card,
        fetch: {
          url: ['apiv2_workspace_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addWorkspaces(organizationId, selected))
      }))
    },
  })
)(OrganizationForm)

export {
  OrganizationActions,
  Organization
}
