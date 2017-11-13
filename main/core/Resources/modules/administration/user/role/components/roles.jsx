import React from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

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
    fetch={{
      url: generateUrl('apiv2_role_list')
    }}
    delete={{
      url: generateUrl('apiv2_role_delete_bulk')
    }}
    definition={RoleList.definition}
    actions={[]}
    card={RoleList.card}
  />

export {
  RolesActions,
  Roles
}
