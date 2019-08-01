import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

import {BarChart} from '#/main/core/layout/chart/bar/components/bar-chart'

const Path = (props) =>
  <div>
    <h2>{props.path.name}</h2>
    <BarChart
      data={props.steps.reduce((acc, step) => {
        acc[step.id] = {
          xData: step.step.title,
          yData: step.users.length
        }

        return acc
      }, {})}
      yAxisLabel={{
        show: true,
        text: trans('nb_users')
      }}
      xAxisLabel={{
        show: true,
        text: trans('steps', {}, 'path')
      }}
    />
  </div>

Path.propTypes = {
  path: T.object,
  steps: T.array
}

export {
  Path
}
