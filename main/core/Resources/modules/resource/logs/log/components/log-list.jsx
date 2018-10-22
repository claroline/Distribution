import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {select as listSelect} from '#/main/app/content/list/store'

import {actions as logActions} from  '#/main/core/layout/logs/actions'
import {LogList} from '#/main/core/layout/logs'

const List = (props) =>
  <LogList
    id={props.resourceId}
    listUrl={['apiv2_resource_logs_list', {resourceId: props.resourceId}]}
    actions={props.actions}
    chart={props.chart}
    getChartData={props.getChartData}
    queryString={props.queryString}
  />

List.propTypes = {
  resourceId: T.number.isRequired,
  actions: T.array.isRequired,
  chart: T.object.isRequired,
  getChartData: T.func.isRequired,
  queryString: T.string
}

const ListContainer = connect(
  state => ({
    resourceId: state.resourceId,
    chart: state.chart,
    actions: state.actions,
    queryString: listSelect.queryString(listSelect.list(state, 'logs'))
  }),
  dispatch => ({
    getChartData(resourceId, filters) {
      dispatch(logActions.getChartData('apiv2_resource_logs_list_chart', {resourceId}, filters))
    }
  })
)(List)

export {
  ListContainer as Logs
}