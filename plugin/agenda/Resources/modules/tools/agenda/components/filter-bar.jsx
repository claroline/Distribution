import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Calendar} from '#/main/core/layout/calendar/components/calendar'
import {Checkboxes} from '#/main/app/input/components/checkboxes'

const FilterBar = props =>
  <div className="col-md-3">
    <div className="component-container">
      <Button
        className="btn"
        type={CALLBACK_BUTTON}
        label={trans('events', {}, 'agenda')}
        callback={() => true}
        primary={true}
      />

      <Button
        className="btn-link"
        type={CALLBACK_BUTTON}
        label={trans('tasks', {}, 'agenda')}
        callback={() => true}
      />
    </div>

    <div className="panel panel-default">
      <Calendar
        selected={null}
        onChange={() => true}
        time={false}
        showCurrent={false}
      />
    </div>

    {props.workspaces &&
      <div className="panel panel-default">
        <div data-toggle="collapse" data-target="#panel-tasks" className="panel-heading">{trans('filter_ws', {}, 'agenda')}</div>
        <div id="panel-tasks" className="panel-body list-group in">
          <Checkboxes
            id="workspaces"
            choices={props.workspaces}
            value={props.filters.workspaces}
            inline={false}
            onChange={(filters) => {
              props.onChangeFiltersWorkspace(filters, props.filters)
            }}
          />
        </div>
      </div>
    }
  </div>


FilterBar.propTypes = {
  onChangeFiltersType: T.func.isRequired,
  onChangeFiltersWorkspace: T.func.isRequired,
  workspace: T.object.isRequired,
  workspaces: T.object,
  filters: T.object.isRequired
}

export {
  FilterBar
}
