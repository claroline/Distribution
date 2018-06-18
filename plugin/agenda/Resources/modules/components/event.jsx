import React from 'react'

import {trans} from '#/main/core/translation'
import moment from 'moment'

const EventPropLi = props =>
  <li className="list-group-item"> {trans(props.label, {}, 'agenda')} <span className="value"> {props.value} </span></li>

const Description = props =>
  <div className="well">
    {props.description}
  </div>

const Invitations = props =>
  <div>
    {trans('invitation_guests', {}, 'agenda')}
    {props.invitations.map(invitation =>
      <span> {invitation.user_name}</span>
    )}
  </div>

const WorkspaceInfo = props =>
  <div>
    {props.workspace.code}
  </div>

const Task = props =>
  <div>
    <ul className="list-group list-group-values">
      <EventPropLi label='limit_date' value={moment(props.end).format(trans('date_range.js_format'))}/>
      <EventPropLi label='form.author' value={props.owner.username}/>
    </ul>
    {props.description &&
      <Description description={props.description}/>
    }
    {props.workspace &&
      <WorkspaceInfo workspace={props.workspace}/>
    }
    {props.isTaskDone ?
      <span>{trans('done')}</span>:
      <span>{trans('not_done')}</span>
    }
  </div>

const Event = props => {
  return(
    <div className="panel-body">
      <ul className="list-group list-group-values">
        <EventPropLi label='form.start' value={moment(props.start).format(trans('date_range.js_format'))}/>
        <EventPropLi label='form.end' value={moment(props.end).format(trans('date_range.js_format'))}/>
        <EventPropLi label='form.author' value={props.owner.username}/>
      </ul>
      {props.description &&
        <Description description={props.description}/>
      }
      {props.workspace &&
        <WorkspaceInfo workspace={props.workspace}/>
      }

      {!props.is_guest && props.editable &&
         <button className="btn btn-primary" onClick={props.onForm}>{trans('edit')}</button>
      }
    </div>
  )}
export {
  Task,
  Event
}
