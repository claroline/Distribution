import React from 'react'

import {trans} from '#/main/core/translation'
import {generateUrl} from '#/main/core/api/router'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {LogList} from '#/main/core/tools/workspace/logs/overview/components/log-list.jsx'

const LogsActions = () =>
  <PageActions>
    <PageAction
      id="csv-export"
      icon="fa fa-download"
      title={trans('export_csv')}
      action={generateUrl('claro_workspace_logs_csv', {'workspaceId': 1551})}
      primary={true}
    />
  </PageActions>

const LogsList = () =>
  <DataListContainer
    name="logs.list"
    open={LogList.open}
    fetch={{
      url: ['apiv2_workspace_tools_log_list'],
      autoload: true
    }}
    definition={LogList.definition}
  />

export {
  LogsActions,
  LogsList as Logs
}
