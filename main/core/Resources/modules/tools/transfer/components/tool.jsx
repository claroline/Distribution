import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

import {Import as ImportTab} from '#/main/core/tools/transfer/import/components/tab'
//import {Export as ExportTab} from '#/main/core/administration/transfer/export/components/tab'
import {History as HistoryTab} from '#/main/core/tools/transfer/history/components/tab'

const TransferTool = () =>
  <TabbedPageContainer
    title={trans('data_transfer', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/import'}
    ]}

    tabs={[
      {
        icon: 'fa fa-save',
        title: trans('import'),
        path: '/import',
        content: ImportTab
      }, {
        icon: 'fa fa-download',
        title: trans('history'),
        path: '/history',
        content: HistoryTab
      }
    ]}
  />

export {
  TransferTool
}
