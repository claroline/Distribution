import React from 'react'

import {trans} from '#/main/core/translation'

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
      <EventPropLi label='limit_date' value={props.end.string}/>
      <EventPropLi label='form.author' value={props.owner.username}/>
    </ul>
    {props.description &&
      <Description description={props.description}/>
    }
    {props.workspace &&
      <WorkspaceInfo workspace={props.workspace}/>
    }
    {props.isTaskDone ?
      <span>done</span>:
      <span>notdone</span>
    }
  </div>

const Event = props =>
  <div>
    <ul className="list-group list-group-values">
      <EventPropLi label='form.start' value={props.start.string}/>
      <EventPropLi label='form.end' value={props.end.string}/>
      <EventPropLi label='form.author' value={props.owner.username}/>
    </ul>
    {props.description &&
      <Description description={props.description}/>
    }
    {props.workspace &&
      <WorkspaceInfo workspace={props.workspace}/>
    }

    {props.is_guest &&
       <button className="btn btn-primary" onClick={props.onForm()}>edit guest</button>
    }

    {!props.is_guest && props.editable &&
       <button className="btn btn-primary" onClick={props.onForm}>edit</button>
    }
  </div>

export {
  Task,
  Event
}
