import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {ListData} from '#/main/app/content/list/containers/data'
import {Section} from '#/main/app/content/components/sections'

import {selectors} from '#/main/core/tools/dashboard/path/store'
import {BarChart} from '#/main/core/layout/chart/bar/components/bar-chart'

const Path = (props) =>
  <div>
    <h2>{props.path.name}</h2>
    <BarChart
      data={props.steps.reduce((acc, stepData) => {
        acc[stepData.step.id] = {
          xData: stepData.step.title,
          yData: stepData.users.length
        }

        return acc
      }, {})}
      yAxisLabel={{
        show: true,
        text: trans('users_count')
      }}
      xAxisLabel={{
        show: true,
        text: trans('steps', {}, 'path')
      }}
    />
    {props.opened ?
      <Section
        icon="fa fa-fw fa-user"
        title={trans('users')}
        expanded={true}
        onClick={() => props.openPath()}
      >
        {props.opened &&
          <ListData
            name={`${selectors.STORE_NAME}.evaluations`}
            fetch={{
              url: ['claroline_path_evaluations_list', {resourceNode: props.path.resourceId}],
              autoload: true
            }}
            definition={[
              {
                name: 'user.firstName',
                type: 'string',
                label: trans('first_name'),
                displayed: true
              }, {
                name: 'user.lastName',
                type: 'string',
                label: trans('last_name'),
                displayed: true
              }, {
                name: 'progression',
                type: 'number',
                label: trans('progression'),
                displayed: true,
                render: (rowData) => rowData.progression + ' / ' + rowData.progressionMax
              }, {
                name: 'score',
                type: 'number',
                label: trans('score'),
                displayed: true,
                render: (rowData) => rowData.score + ' / ' + rowData.scoreMax
              }, {
                name: 'duration',
                type: 'number',
                label: trans('duration'),
                displayed: true
              }, {
                name: 'date',
                type: 'date',
                label: trans('last_activity'),
                displayed: true,
                options: {
                  time: true
                }
              }
            ]}
          />
        }
      </Section> :
      <Section
        icon="fa fa-fw fa-user"
        title={trans('users')}
        expanded={false}
        onClick={() => props.openPath()}
      />
    }
  </div>

Path.propTypes = {
  path: T.object,
  steps: T.array,
  opened: T.bool.isRequired,
  openPath: T.func.isRequired
}

export {
  Path
}
