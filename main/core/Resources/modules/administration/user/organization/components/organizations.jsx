import React from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

import {TreeView} from '#/main/core/layout/treeview/treeview.jsx'
import {DataTreeContainer} from '#/main/core/layout/list/containers/data-tree.jsx'

const OrganizationsActions = props =>
  <PageActions>
    <PageAction
      id="organization-add"
      icon="fa fa-plus"
      title={t('add_organization')}
      action="#/organizations/add"
      primary={true}
    />
  </PageActions>

const Organizations = props =>
  <DataTreeContainer
    name="organizations.list"
    fetchUrl={generateUrl('apiv2_organization_list')}
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name')
      }, {
        name: 'email',
        type: 'email',
        label: t('email')
      }, {
        name: 'code',
        type: 'string',
        label: t('code')
      }, { // find better
        name: 'parent',
        type: 'string',
        label: t('parent')
      }
    ]}
    actions={[

    ]}
  />

export {
  OrganizationsActions,
  Organizations
}
