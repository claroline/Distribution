import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/fos-js-router'
import {t} from '#/main/core/translation'

import {PageGroupActions, PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {select as formSelect} from '#/main/core/layout/form/selectors'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

const GroupSaveAction = makeSaveAction('groups.current')(PageAction)

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
  <Form
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
        title={[
          t('users'),
          <small style={{marginLeft: 5}}>50 utilisateurs</small>
        ]}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_user'),
            action: () => true
          }
        ]}
      >
        <DataList
          name="groups.current.users"
          fetchUrl={generateUrl('apiv2_group_list_users', {uuid: props.group.id})}
          actions={[]}
          definition={UserList.definition}
          card={UserList.card}
        />
      </FormSection>

      <FormSection
        id="group-roles"
        icon="fa fa-fw fa-id-badge"
        title={[
          t('roles'),
          <small style={{marginLeft: 5}}>4 rôles</small>
        ]}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_role'),
            action: () => true
          }
        ]}
      >
        <DataList
          name="groups.current.roles"
          fetchUrl={generateUrl('apiv2_group_list_roles', {uuid: props.group.id})}
          actions={[]}
          definition={RoleList.definition}
          card={RoleList.card}
        />
      </FormSection>

      <FormSection
        id="group-organizations"
        icon="fa fa-fw fa-building"
        title={[
          t('organizations'),
          <small style={{marginLeft: 5}}>3 organisations</small>
        ]}
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
  </Form>

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
