import React from 'react'
import {PropTypes as T} from 'prop-types'

// TODO : remove me when toolbar bars will be mounted in the main app
import {ModalOverlay} from '#/main/app/overlay/modal/containers/overlay'
import {AlertOverlay} from '#/main/app/overlay/alert/containers/overlay'

import {trans} from '#/main/core/translation'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {Button} from '#/main/app/action/components/button'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

/*
 <Responsive
 xs={<ToolbarSmall {...props} />}
 default={<ToolbarDefault {...props} />}
 />
 */

const ToolLink = props =>
  <Button
    className="tool-link"
    type="url"
    icon={`fa fa-${props.icon}`}
    label={trans(props.name, {}, 'tools')}
    tooltip="right"
    target={props.target}
    active={props.active}
  />

ToolLink.propTypes = {
  icon: T.string.isRequired,
  name: T.string.isRequired,
  target: T.array.isRequired,
  active: T.bool
}

const Toolbar = props => {
  const displayedActions = props.actions.filter(action => undefined === action.displayed || action.displayed)

  return (
    <nav>
      {props.primary &&
        <ToolLink
          icon={props.primary.icon}
          name={props.primary.name}
          target={props.primary.open}
          active={props.active === props.primary.name}
        />
      }

      {0 !== props.tools.length &&
        <nav className="tools">
          {props.tools.map(tool =>
            <ToolLink
              key={tool.name}
              icon={tool.icon}
              name={tool.name}
              target={tool.open}
              active={props.active === tool.name}
            />
          )}
        </nav>
      }

      {0 !== displayedActions &&
        <nav className="additional-tools">
          {displayedActions.map(action =>
            <Button
              {...action}
              key={toKey(action.label)}
              className="tool-link"
              tooltip="right"
            />
          )}
        </nav>
      }

      <AlertOverlay />
      <ModalOverlay />
    </nav>
  )
}

Toolbar.propTypes = {
  active: T.string,
  primary: T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    open: T.oneOfType([T.array, T.string])
  }),
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    open: T.oneOfType([T.array, T.string])
  })),
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  ))
}

export {
  Toolbar
}
