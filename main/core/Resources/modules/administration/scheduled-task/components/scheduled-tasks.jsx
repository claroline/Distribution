import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

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

    </PageContent>
  </Page>

ScheduledTasks.propTypes = {
  isCronConfigured: T.bool.isRequired
}

function mapStateToProps(state) {
  return {
    isCronConfigured: select.isCronConfigured(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const ConnectedScheduledTasks = connect(mapStateToProps, mapDispatchToProps)(ScheduledTasks)

export {
  ConnectedScheduledTasks as ScheduledTasks
}
