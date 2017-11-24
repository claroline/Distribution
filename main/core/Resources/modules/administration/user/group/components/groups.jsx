import React from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer} from '#/main/core/layout/list/containers/data-list.jsx'

import {GroupList} from '#/main/core/administration/user/group/components/group-list.jsx'

const GroupsActions = () =>
  <PageActions>
    <PageAction
      id="group-add"
      icon="fa fa-plus"
      title={t('add_group')}
      action="#/groups/add"
      primary={true}
    />
  </PageActions>

const Groups = () =>
  <DataListContainer
    name="groups.list"
    open={GroupList.open}
    fetch={{
      url: generateUrl('apiv2_group_list'),
      autoload: true
    }}
    delete={{
      url: generateUrl('apiv2_group_delete_bulk'),
      disabled: (rows) => false
    }}
    definition={GroupList.definition}
    card={GroupList.card}
  />

export {
  GroupsActions,
  Groups
}
