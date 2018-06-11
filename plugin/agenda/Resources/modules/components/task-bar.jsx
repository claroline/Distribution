import React from 'react'
import {PropTypes as T} from 'prop-types'
import {url} from '#/main/app/api'
import {trans} from '#/main/core/translation'

function atrans(key) {
  return trans(key, {}, 'agenda')
}

//fullcalendar wrapper
const TaskBar = props =>
  <div className="col-md-3">
    <div className="panel text-center">
      <button className="btn btn-default btn-xs" role="button" onClick={props.openImportForm}>
        {trans('import', {}, 'platform')}
      </button>
      <a href={url(['apiv2_download_agenda', {workspace: props.workspace.id}])} className="btn btn-default btn-xs" role="button">
        {trans('export', {}, 'platform')}
      </a>
      <div data-toggle="collapse" data-target="#panel-tasks" className="panel-heading">{atrans('filter_tasks')}</div>
      <div className="panel panel-default">
        <div id="panel-tasks" className="panel-body list-group in">
          <div id="selectTask">
            <div className="list-group-item">
              <input id="no-filter-tasks" type="radio" name="tasks" className="filter-tasks" value="no-filter-tasks" checked/>
              <label htmlFor="no-filter-tasks">{atrans('no_filter_tasks') }</label>
            </div>
            <div className="list-group-item">
              <input id="hide-tasks" type="radio" name="tasks" className="filter-tasks" value="hide-tasks"/>
              <label htmlFor="hide-tasks">{ atrans('hide_tasks') }</label>
            </div>
            <div className="list-group-item">
              <input id="hide-events" type="radio" name="tasks" className="filter-tasks" value="hide-events"/>
              <label htmlFor="hide-events">{ atrans('show_task_only') }</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="panel panel-default">
      <div className="panel-heading">Priorité</div>
      <div className="panel-body list-group">
        <div className="list-group-item">color:#FF0000: Haute</div>
        <div className="list-group-item">color:#01A9DB: Normale</div>
        <div className="list-group-item">color:#848484: Basse</div>
      </div>
    </div>
  </div>


TaskBar.propTypes = {
  openImportForm: T.func.isRequired,
  onExport: T.func.isRequired,
  workspace: T.object.isRequired
}

export {
  TaskBar
}
