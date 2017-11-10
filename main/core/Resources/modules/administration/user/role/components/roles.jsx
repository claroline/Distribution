import React from 'react'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

const RolesActions = () =>
  <PageActions>
    <PageAction
      id="role-add"
      icon="fa fa-plus"
      title={t('add_role')}
      action="#/roles/add"
      primary={true}
    />
  </PageActions>

const Roles = () =>
  <DataList
    name="roles.list"
    actions={[]}
    definition={RoleList.definition}
    card={RoleList.card}
  />

export {
  RolesActions,
  Roles
}
