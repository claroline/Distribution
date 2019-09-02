import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import tinycolor from 'tinycolor2'
import get from 'lodash/get'

import {ModalButton} from '#/main/app/buttons'

import {Event as EventTypes} from '#/plugin/agenda/event/prop-types'
import {MODAL_EVENT_ABOUT} from '#/plugin/agenda/event/modals/about'

const EventMicro = props => {
  let color
  if (get(props.event, 'display.color')) {
    color = tinycolor(get(props.event, 'display.color'))
  }

  return (
    <ModalButton
      className={classes('agenda-event-micro', props.className, {
        'text-light': color && color.isDark(),
        'text-dark': color && color.isLight()
      })}
      style={color ? {
        backgroundColor: color.toRgbString()
      } : undefined}
      modal={[MODAL_EVENT_ABOUT, {
        event: props.event
      }]}
    >
      {props.event.title}
    </ModalButton>
  )
}

EventMicro.propTypes = {
  className: T.string,
  event: T.shape(
    EventTypes.propTypes
  ).isRequired
}

export {
  EventMicro
}