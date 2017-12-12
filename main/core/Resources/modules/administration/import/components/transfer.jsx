import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {TabbedPageContainer} from '#/main/core/layout/page/containers/tabbed-page.jsx'
import {t} from '#/main/core/translation'

import {Import as ImportTab} from '#/main/core/administration/import/components/import/tab.jsx'
import {Export as ExportTab} from '#/main/core/administration/import/components/export/tab.jsx'
import {Action as ImportAction} from '#/main/core/administration/import/components/import/action.jsx'
import {Action as ExportAction} from '#/main/core/administration/import/components/export/action.jsx'

const Transfer = () =>
 <TabbedPageContainer
  redirect={[
    {from: '/', exact: true, to: '/import'}
  ]}

  tabs={[
    {
      icon: 'fa fa-user',
      title: t('import'),
      path: '/import',
      actions: ImportAction,
      content: ImportTab
    }, {
      icon: 'fa fa-users',
      title: t('export'),
      path: '/export',
      actions: ExportAction,
      content: ExportTab
    }]}
  />

export {
  Transfer
}
