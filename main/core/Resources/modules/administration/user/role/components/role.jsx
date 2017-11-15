import React from 'react'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/layout/form/selectors'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

const RoleSaveAction = makeSaveAction('roles.current', formData => ({
  create: ['apiv2_role_create'],
  update: ['apiv2_role_update', {id: formData.id}]
}))(PageAction)

const RoleActions = props =>
  <PageActions>
    <RoleSaveAction />

    <PageAction
      id="roles-list"
      icon="fa fa-list"
      title={t('back_to_list')}
      action="#/roles"
    />
  </PageActions>

const RoleForm = props =>
  <Form
    level={3}
    name="roles.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {name: 'translationKey', type: 'string', label: t('name'), required: true}
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="role-users"
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
      <DataList
        name="roles.current.users"
        fetch={{
          url: generateUrl('apiv2_role_list_users', {id: props.role.id}),
          autoload: true
        }}
        delete={{
          url: generateUrl('apiv2_role_remove_users', {id: props.role.id}),
        }}
        actions={[]}
        definition={UserList.definition}
        card={UserList.card}
      />
      </FormSection>
      <FormSection
        id="role-groups"
        icon="fa fa-fw fa-id-badge"
        title={t('groups')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_group'),
            action: () => true
          }
        ]}
      >
        <DataList
          name="roles.current.groups"
          fetch={{
            url: generateUrl('apiv2_role_list_groups', {id: props.role.id}),
            autoload: true
          }}
          delete={{
            url: generateUrl('apiv2_role_remove_groups', {id: props.role.id}),
          }}
          actions={[]}
          definition={GroupList.definition}
          card={GroupList.card}
        />
      </FormSection>
    </FormSections>
  </Form>

RoleForm.propTypes = {

}

const Role = connect(
  state => ({
    role: formSelect.data(formSelect.form(state, 'roles.current'))
  }),
  dispatch =>({
    addGroup: () => dispatch(),
    removeGroup: () => dispatch(),
    addUser: () => dispatch(),
    removeUser: () => dispatch(),
  })
)(RoleForm)

export {
  RoleActions,
  Role
}
