import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {LineChart} from '#/main/core/layout/chart/line/components/line-chart.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
import {select} from '#/main/core/data/list/selectors'
import {actions as logActions} from  '#/main/core/tools/workspace/logs/actions'

class LogsList extends Component {
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.chart.invalidated) {
      nextProps.getChartData(nextProps.workspaceId, nextProps.queryString)
    }
    
    this.setState(nextProps)
  }
  
  render() {
    let props =  this.props
    return (
      <div>
        { props.chart &&
          <div className="text-center">
          <LineChart
            data={props.chart.data}
            xAxisLabel={{
              show: true,
              text: trans('date')
            }}
            yAxisLabel={{
              show: true,
              text: trans('actions')
            }}
            height={250}
            width={700}
            showArea={true}
            margin={{
              top: 20,
              bottom: 50,
              left: 50,
              right: 20
            }}
          />
          </div>
        }
        <DataListContainer
          name="logs"
          fetch={{
            url: ['apiv2_workspace_tool_logs_list', {workspaceId: props.workspaceId}],
            autoload: true
          }}
          open={{
            action: (row) => `#/log/${row.id}`
          }}
          delete={false}
          definition={[
            {
              name: 'dateLog',
              type: 'date',
              label: trans('date'),
              displayed: true,
              primary: true,
              options: {
                time: true
              }
            }, {
              name: 'action',
              type: 'enum-plus',
              label: trans('action'),
              displayed: true,
              options: {
                choices: props.actions
              }
            }, {
              name: 'doer.name',
              type: 'string',
              label: trans('user'),
              displayed: true
            }, {
              name: 'description',
              type: 'html',
              label: trans('description'),
              displayed: true,
              filterable: false,
              sortable: false,
              options: {
                trust: true
              }
            }
          ]}
      
          card={()=>{}}
      
          display={{
            available : [listConst.DISPLAY_TABLE, listConst.DISPLAY_TABLE_SM],
            current: listConst.DISPLAY_TABLE
          }}
    
        />
      </div>
    )
  }
}

LogsList.propTypes = {
  workspaceId: T.number.isRequired,
  actions: T.array.isRequired,
  chart: T.object.isRequired,
  getChartData: T.func.isRequired,
  queryString: T.string
}

const LogsListContainer = connect(
  state => ({
    workspaceId: state.workspaceId,
    chart: state.chart,
    actions: state.actions,
    queryString: select.queryString(select.list(state, 'logs'))
  }),
  dispatch => ({
    getChartData(workspaceId, filters) {
      dispatch(logActions.getChartData(workspaceId, filters))
    }
  })
)(LogsList)

export {
  LogsListContainer as Logs
}