import React from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'

import {TreeView} from '#/main/core/layout/treeview/treeview.jsx'
import {DataTreeContainer} from '#/main/core/data/list/containers/data-tree.jsx'

import {OrganizationList} from '#/main/core/administration/user/organization/components/organization-list.jsx'

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
    open={OrganizationList.open}
    fetch={{
      url: generateUrl('apiv2_organization_list_recursive'),
      autoload: true
    }}
    delete={{
      url: generateUrl('apiv2_organization_delete_bulk'),
      displayed: (organizations) => 0 !== organizations.filter(organization => !organization.meta.default).length
    }}
    definition={OrganizationList.definition}
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
    card={OrganizationList.card}
  />

export {
  OrganizationsActions,
  Organizations
}
