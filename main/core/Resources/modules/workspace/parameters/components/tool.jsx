import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

import {ParametersActions, ParametersTab} from '#/main/core/workspace/parameters/parameters/parameters.jsx'

const Parameters = () =>
  <TabbedPageContainer
    title={trans('parameters', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/parameters'}
    ]}

    tabs={[
      {
        icon: 'fa fa-save',
        title: trans('parameters'),
        path: '/parameters',
        actions: ParametersActions,
        content: ParametersTab
      }/*, {
        icon: 'fa fa-download',
        title: trans('export'),
        path: '/export',
        actions: ExportAction,
        content: ExportTab
      }*/
    ]}
  />

export {
  Parameters
}
