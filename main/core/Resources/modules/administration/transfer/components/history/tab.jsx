import React from 'react'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {HistoryList} from '#/main/core/administration/transfer/components/history/history-list.jsx'

import {trans} from '#/main/core/translation'

const Tab = () =>
  <DataListContainer
    name="history"
    open={HistoryList.open}
    fetch={{
      url: ['apiv2_transfer_list'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_transfer_delete_bulk']
    }}
    definition={HistoryList.definition}
    actions={[
      {
        icon: 'fa fa-fw fa-save',
        label: trans('execute'),
        action: () => alert('execute'),
        context: 'row'
      }
    ]}
  />
export {Tab}
