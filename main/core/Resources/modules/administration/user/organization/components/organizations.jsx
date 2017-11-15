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
    fetch={{
      url: generateUrl('apiv2_organization_list')
    }}
    delete={{
      url: generateUrl('apiv2_organization_delete_bulk'),
      displayed: (organizations) => 0 !== organizations.filter(organization => {
        console.log(organization)

        return !organization.meta.default
      }).length
    }}
    definition={[
      {
        name: 'name',
        type: 'string',
        label: t('name')
      }, {
        name: 'meta.default',
        type: 'boolean',
        label: t('default')
      }, {
        name: 'meta.parent',
        type: 'organization',
        label: t('parent')
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
      {
        icon: 'fa fa-fw fa-plus',
        label: t('add_sub_organization'),
        context: 'row',
        action: (rows) => {
          // todo open orga form
        }
      }
    ]}
    card={(row) => ({
      onClick: `#/organizations/${row.id}`,
      poster: null,
      icon: 'fa fa-building',
      title: row.name,
      subtitle: row.code,
      flags: [
        row.meta.default && ['fa fa-check', t('default')]
      ].filter(flag => !!flag)
    })}
  />

export {
  OrganizationsActions,
  Organizations
}
