import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Calendar} from '#/main/core/layout/calendar/components/calendar'
import {Checkboxes} from '#/main/app/input/components/checkboxes'

import {calendarUrl} from '#/plugin/agenda/tools/agenda/utils'

const AgendaMenu = props =>
  <div className="agenda-menu">
    <Calendar
      selected={props.selected}
      onChange={(selected) => props.history.push(
        calendarUrl(props.path, props.view, selected)
      )}
      time={false}
      showCurrent={false}
    />

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
  </div>

AgendaMenu.propTypes = {
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,

  path: T.string.isRequired,
  view: T.oneOf([
    'day',
    'week',
    'month',
    'year',
    'schedule'
  ]).isRequired,
  selected: T.string.isRequired
}

export {
  AgendaMenu
}
