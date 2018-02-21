import React from 'react'
import {trans} from '#/main/core/translation'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'
import {constants as listConst} from '#/main/core/data/list/constants'
const LogsList = props =>
  <div>
    
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
          type: 'string',
          label: trans('action'),
          displayed: true
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
  

LogsList.propTypes = {
  workspaceId: T.number.isRequired
}

const LogsListContainer = connect(
  state => ({
    workspaceId: state.workspaceId
  }),
  null
)(LogsList)

export {
  LogsListContainer as Logs
}