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
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

const UserSaveAction = makeSaveAction('users.current', formData => ({
  create: ['apiv2_user_create'],
  update: ['apiv2_user_update', {id: formData.id}]
}))(PageAction)

const UserActions = () =>
  <PageActions>
    <UserSaveAction />

    <PageAction
      id="users-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/users"
    />
  </PageActions>

const UserForm = props =>
  <Form
    level={3}
    name="users.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {name: 'username', type: 'string', label: t('username'), required: true},
          {name: 'firstName', type: 'string', label: t('first_name'), required: true},
          {name: 'lastName', type: 'string', label: t('last_name'), required: true},
          {name: 'email', type: 'string', label: t('email'), required: true},
          {name: 'plainPassword', type: 'string', label: t('password (needs to be double + hidden)'), required: true},
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="user-roles"
        icon="fa fa-fw fa-user"
        title={t('roles')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_role'),
            action: () => true
          }
        ]}
      >
      <DataList
        name="users.current.roles"
        fetch={{
          url: generateUrl('apiv2_user_list_roles', {id: props.user.id}),
          autoload: true
        }}
        delete={{
          url: generateUrl('apiv2_user_remove_roles', {id: props.user.id}),
        }}
        actions={[]}
        definition={RoleList.definition}
        card={RoleList.card}
      />
      </FormSection>
      <FormSection
        id="user-groups"
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
          name="users.current.groups"
          fetch={{
            url: generateUrl('apiv2_user_list_groups', {id: props.user.id}),
            autoload: true
          }}
          delete={{
            url: generateUrl('apiv2_user_remove_groups', {id: props.user.id}),
          }}
          actions={[]}
          definition={GroupList.definition}
          card={GroupList.card}
        />
      </FormSection>
    </FormSections>
  </Form>

const User = connect(
    state => ({
      user: formSelect.data(formSelect.form(state, 'users.current'))
    }),
    dispatch =>({
      addGroup: () => dispatch(),
      removeGroup: () => dispatch(),
      addRole: () => dispatch(),
      removeRole: () => dispatch()
    })
  )(UserForm)

export {
  UserActions,
  User
}
