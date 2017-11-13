import React from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

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
  <DataList
    name="groups.list"
    fetchUrl={generateUrl('apiv2_group_list')}
    actions={[]}
    definition={GroupList.definition}
    card={GroupList.card}
  />

export {
  GroupsActions,
  Groups
}
