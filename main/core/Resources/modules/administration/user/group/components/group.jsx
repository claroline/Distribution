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

import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

const GroupSaveAction = makeSaveAction('groups.current', formData => ({
  create: ['apiv2_group_create'],
  update: ['apiv2_group_update', {id: formData.id}]
}))(PageAction)

const GroupActions = props =>
  <PageActions>
    <PageGroupActions>
      <PageAction
        id="group-list"
        icon="fa fa-trash-o"
        title={t('delete')}
        action={() => true}
        dangerous={true}
      />
    </PageGroupActions>

    <PageGroupActions>
      <GroupSaveAction />

      <PageAction
        id="group-list"
        icon="fa fa-list"
        title={t('back_to_list')}
        action="#/groups"
      />
    </PageGroupActions>
  </PageActions>

const GroupForm = props =>
  <FormContainer
    level={3}
    name="groups.current"
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
          }
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="group-users"
        icon="fa fa-fw fa-user"
        title={t('users')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_user'),
            action: () => true
          }
        ]}
      >
        <DataListContainer
          name="groups.current.users"
          open={UserList.open}
          fetch={{
            url: ['apiv2_group_list_users', {id: props.group.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_group_remove_users', {id: props.group.id}],
          }}
          definition={UserList.definition}
          card={UserList.card}
        />
      </FormSection>

      <FormSection
        id="group-roles"
        icon="fa fa-fw fa-id-badge"
        title={t('roles')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_role'),
            action: () => true
          }
        ]}
      >
        <DataListContainer
          name="groups.current.roles"
          open={RoleList.open}
          fetch={{
            url: ['apiv2_group_list_roles', {id: props.group.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_group_remove_roles', {id: props.group.id}],
          }}
          definition={RoleList.definition}
          card={RoleList.card}
        />
      </FormSection>

      <FormSection
        id="group-organizations"
        icon="fa fa-fw fa-building"
        title={t('organizations')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_organization'),
            action: () => true
          }
        ]}
      >
        ORGANIZATIONS
      </FormSection>
    </FormSections>
  </FormContainer>

GroupForm.propTypes = {
  group: T.shape({
    id: T.string
  }).isRequired,
  addRole: T.func.isRequired,
  removeRole: T.func.isRequired
}

const Group = connect(
  state => ({
    group: formSelect.data(formSelect.form(state, 'groups.current'))
  }),
  dispatch =>({
    addRole: () => dispatch(),
    removeRole: () => dispatch()
  })
)(GroupForm)

export {
  GroupActions,
  Group
}
