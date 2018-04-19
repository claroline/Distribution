import React from 'react'

import {trans} from '#/main/core/translation'
import {displayDate} from '#/main/core/scaffolding/date'
import {DataListContainer} from '#/main/core/data/list/containers/data-list'

import {ScheduledTaskCard} from '#/main/core/administration/scheduled-task/data/components/scheduled-task-card'
import {constants} from '#/main/core/administration/scheduled-task/constants'

const ScheduledTasks = props =>
  <DataListContainer
    name="tasks"
    fetch={{
      url: ['apiv2_scheduledtask_list'],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: 'link',
      target: `/form/${row.id}`
    })}
    deleteAction={() => ({
      type: 'url',
      target: ['apiv2_scheduledtask_delete_bulk']
    })}
    definition={[
      {
        name: 'name',
        label: trans('name'),
        type: 'string',
        primary: true,
        displayed: true
      }, {
        name: 'type',
        label: trans('task'),
        type: 'enum',
        options: {
          choices: constants.TASK_TYPES
        },
        displayed: true
      }, {
        name: 'scheduledDate',
        type: 'date',
        label: trans('scheduled_date'),
        displayed: true,
        options: {
          time: true
        }
      }, {
        name: 'meta.lastExecution',
        type: 'date',
        label: trans('lastExecution'),
        displayed: true,
        options: {
          time: true
        }
      }
    ]}

    card={ScheduledTaskCard}
  />

export {
  ScheduledTasks
}
