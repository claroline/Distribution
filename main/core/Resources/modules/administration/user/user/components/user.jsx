import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DATA_PICKER} from '#/main/core/data/modal/containers/picker.jsx'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/user/user/actions'

import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'
import {WorkspaceList} from '#/main/core/administration/workspace/components/workspace-list.jsx'

const UserSaveAction = makeSaveAction('users.current', formData => ({
  create: ['apiv2_user_create'],
  update: ['apiv2_user_update', {id: formData.id}]
}))(PageAction)

const UserActions = () =>
  <PageActions
    inline={['edit', 'save', 'community']}
    actions={[

    ]}
  >
    <UserSaveAction />

    <PageAction
      id="users-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/users"
    />
  </PageActions>

const UserForm = props =>
  <FormContainer
    level={3}
    name="users.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'username',
            type: 'username',
            label: t('username'),
            required: true
          }, {
            name: 'lastName',
            type: 'string',
            label: t('last_name'),
            required: true
          }, {
            name: 'firstName',
            type: 'string',
            label: t('first_name'),
            required: true
          }, {
            name: 'email',
            type: 'email',
            label: t('email'),
            required: true
          }
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="user-groups"
        icon="fa fa-fw fa-users"
        title={t('groups')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_groups'),
            action: () => props.pickGroups(props.user.id)
          }
        ]}
      >
        <DataListContainer
          name="users.current.groups"
          open={GroupList.open}
          fetch={{
            url: ['apiv2_user_list_groups', {id: props.user.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_user_remove_groups', {id: props.user.id}],
          }}
          definition={GroupList.definition}
          card={GroupList.card}
        />
      </FormSection>

      <FormSection
        id="group-organizations"
        icon="fa fa-fw fa-building"
        title={t('organizations')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_organizations'),
            action: () => props.pickOrganizations(props.user.id)
          }
        ]}
      >
        ORGANIZATIONS
      </FormSection>

      <FormSection
        id="user-roles"
        icon="fa fa-fw fa-id-badge"
        title={t('roles')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_roles'),
            action: () => props.pickRoles(props.user.id)
          }
        ]}
      >
        <DataListContainer
          name="users.current.roles"
          open={RoleList.open}
          fetch={{
            url: ['apiv2_user_list_roles', {id: props.user.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_user_remove_roles', {id: props.user.id}],
          }}
          definition={RoleList.definition}
          card={RoleList.card}
        />
      </FormSection>
    </FormSections>
  </FormContainer>

UserForm.propTypes = {
  user: T.shape({
    id: T.string
  }).isRequired,
  pickGroups: T.func.isRequired
}

const User = connect(
  state => ({
    user: formSelect.data(formSelect.form(state, 'users.current'))
  }),
  dispatch => ({
    pickGroups: (userId) => {
      dispatch(modalActions.showModal(MODAL_DATA_PICKER, {
        icon: 'fa fa-fw fa-users',
        title: t('add_groups'),
        name: 'groups.picker',
        open: GroupList.open,
        definition: GroupList.definition,
        card: GroupList.card,
        fetch: {
          url: ['apiv2_group_list'],
          autoload: true
        },
        handleSelect: (selected) => dispatch(actions.addGroups(userId, selected))
      }))
    },
    pickOrganizations: (userId) => {

    },
    pickRoles: (userId) => {

    }
  })
)(UserForm)

export {
  UserActions,
  User
}
