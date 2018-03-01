import React from 'react'
import {PropTypes as T} from 'prop-types'
import { implementPropTypes } from '#/main/core/scaffolding/prop-types'
import {Chart as ChartTypes} from '#/main/core/layout/chart/prop-types'

const Chart = props =>
  <svg className="chart" width={props.width} height={props.height}>
    <g transform={`translate(${props.margin.left}, ${props.margin.top})`}>
      {props.children}
    </g>
  </svg>

implementPropTypes(Chart, ChartTypes, {
  children: T.node.isRequired
})

export {
  Chart
}
