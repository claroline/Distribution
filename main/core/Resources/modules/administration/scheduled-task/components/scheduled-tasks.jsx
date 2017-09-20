import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {
  PageContainer as Page,
  PageHeader,
  PageContent,
  PageActions,
  PageAction
} from '#/main/core/layout/page/index'

import {select} from '../selectors'

const ScheduledTasks = props =>
  <Page id="scheduled-task-management">
    <PageHeader
      title={t('tasks_scheduling')}
    >
      <PageActions>
        <PageAction
          id="scheduled-task-add"
          title={t('add_a_task')}
          icon="fa fa-plus"
          primary={true}
          disabled={!props.isCronConfigured}
          action={() => true}
        />
      </PageActions>
    </PageHeader>

    <PageContent>
      <DataList
        name="tasks"
        definition={[
          {
            name: 'name',
            label: t('name'),
            displayed: true
          }, {
            name: 'type',
            label: t('type'),
            renderer: (rowData) => t(rowData.type),
            displayed: true
          }, {
            name: 'scheduledDate',
            type: 'date',
            label: t('scheduled_date'),
            displayed: true
          }, {
            name: 'meta.lastExecution',
            type: 'date',
            label: t('lastExecution'),
            displayed: true
          }
        ]}

        actions={[
          {
            icon: 'fa fa-fw fa-trash-o',
            label: t('delete'),
            action: (rows) => props.removeTasks(rows),
            isDangerous: true
          }
        ]}
      />
    </PageContent>
  </Page>

ScheduledTasks.propTypes = {
  isCronConfigured: T.bool.isRequired,
  removeTasks: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    isCronConfigured: select.isCronConfigured(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeTasks() {

    }
  }
}

const ConnectedScheduledTasks = connect(mapStateToProps, mapDispatchToProps)(ScheduledTasks)

export {
  ConnectedScheduledTasks as ScheduledTasks
}
