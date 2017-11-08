import React from 'react'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {enumRole} from '#/main/core//administration/user/role/constants'
import {RoleCard} from '#/main/core//administration/user/role/components/role-card.jsx'

const GroupSaveAction = makeSaveAction('groups.current')(PageAction)

const GroupActions = props =>
  <PageActions>
    <GroupSaveAction />

    <PageAction
      id="group-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/groups"
    />
  </PageActions>

const Group = props =>
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
      }, {
        id: 'access_restrictions',
        icon: 'fa fa-fw fa-key',
        title: t('access_restrictions'),
        fields: [
          // accountExpiration
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
        USERS
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
          definition={[
            {name: 'name', type: 'string', label: t('name'), displayed: true},
            {name: 'type', type: 'enum', label: t('type'), options: {choices: enumRole}, displayed: false},
            {name: 'translationKey', type: 'string', label: t('translation'), renderer: (rowData) => t(rowData.translationKey), displayed: true}
          ]}
          actions={[]}
          card={RoleCard}
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

Group.propTypes = {

}

export {
  GroupActions,
  Group
}
