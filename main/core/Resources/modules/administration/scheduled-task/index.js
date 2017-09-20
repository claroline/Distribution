import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {routedApp} from '#/main/core/utilities/app/router'
import {generateUrl} from '#/main/core/fos-js-router'

import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {makeListReducer} from '#/main/core/layout/list/reducer'
import {reducer} from '#/main/core/administration/scheduled-task/reducer'

import {ScheduledTasks} from '#/main/core/administration/scheduled-task/components/scheduled-tasks.jsx'
import {ScheduledTask} from '#/main/core/administration/scheduled-task/components/scheduled-task.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.scheduled-tasks-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  routedApp([
    {path: '/',    component: ScheduledTasks, exact: true},
    {path: '/:id', component: ScheduledTask}
  ]),

  // app store configuration
  {
    // app reducers
    isCronConfigured: (state = false) => state,
    tasks: reducer,

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer,
  },

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      isCronConfigured: initialData.isCronConfigured,
      tasks: merge({}, initialData.tasks, {
        fetchUrl: generateUrl('claro_scheduled_task_list')
      })
    }
  }
)
