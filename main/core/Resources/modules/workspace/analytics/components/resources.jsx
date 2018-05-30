import React from 'react'
import {PropTypes as T} from 'prop-types'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/core/translation'

import {Heading} from '#/main/core/layout/components/heading'
import {PieChart} from '#/main/core/layout/chart/pie/components/pie-chart'
import {DashboardTable, DashboardCard} from '#/main/core/layout/dashboard'

const Resources = props =>
  <section>
    <Heading level={2}>
      {trans('resources_usage_ratio')}
    </Heading>

    <div className="row">
      <div className="col-md-6">
        <PieChart
          data={props.resourceTypes || {}}
          width={600}
          responsive={true}
          colors={schemeCategory20c}
          showPercentage={true}
        />
      </div>

      <div className="col-md-6">
        <DashboardTable
          definition={[
            {
              name: 'xData',
              label: trans('name'),
              transDomain: 'resource',
              colorLegend: true
            }, {
              name: 'yData',
              label: '#'
            }
          ]}
          data={
              Object.keys(props.resourceTypes).map(v => props.resourceTypes[v]) || []
          }
          colors={schemeCategory20c}
        />
      </div>
    </div>
  </section>

Resources.propsTypes = {
  resourceTypes: T.object.isRequired // todo check
}

export {
  Resources
}