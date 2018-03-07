import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'

const UserDetails = (props) =>
  <dl className={'dl-horizontal'}>
    <dt>{trans('last_name', {}, 'platform')}</dt>
    <dd>{props.user.firstName}</dd>
  
    <dt>{trans('first_name', {}, 'platform')}</dt>
    <dd>{props.user.lastName}</dd>
  
    {props.sessionId && (
    <dt>{trans('session_id', {}, 'platform')}</dt>
    )}
    {props.sessionId && (
      <dd>{props.sessionId}</dd>
    )}
  </dl>

UserDetails.propTypes = {
  user: T.shape({
    firstName: T.string.isRequired,
    lastName: T.string.isRequired,
    platformRoles: T.array,
    workspaceRoles: T.array
  }).isRequired,
  sessionId: T.string
}



const DoerDetails = (props) =>
  <div className="form-group">
    <label className="control-label" htmlFor={'doer-details'}>{trans('log_doer', {}, 'log')}</label>
    
    <div id={'doer-details'}>
      {!props.doerType === 'user' &&
      <dl className={'dl-horizontal'}>
      
      </dl>
      }
      
    </div>
  </div>

const LogDetails = (props) =>
  <div className={'log-details'}>
    <div className={'panel panel-default'}>
      <div className={'panel-heading'}>
        <h3 className={'panel-title'} dangerouslySetInnerHTML={{__html: props.log.description}}/>
      </div>
      <div className="panel-body">
      
      </div>
    </div>
  </div>

LogDetails.propTypes = {
  log: T.object.isRequired
}

const LogDetailsContainer = connect(
  state => ({
    log: state.log
  })
)(LogDetails)

export {
  LogDetailsContainer as LogDetails
}
