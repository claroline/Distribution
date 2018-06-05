import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {toKey} from '#/main/core/scaffolding/text/utils'
import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {Button as ButtonTypes} from '#/main/app/button/prop-types'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

import {
  MenuOverlay,
  Menu,
  MenuAction,
  MenuItem
} from '#/main/app/overlay/menu'

import {CallbackButton} from '#/main/app/button/components/callback'

/**
 * Menu button.
 * Renders a component that will open a menu with additional actions.
 *
 * @param props
 * @constructor
 */
const MenuButton = props => {
  const displayedActions = props.menu.items.filter(
    action => undefined === action.displayed || action.displayed
  )

  // filters and groups actions
  const primaryActions      = displayedActions.filter(action => action.primary && !action.dangerous)
  const unclassifiedActions = displayedActions.filter(action => !action.primary && !action.dangerous && !action.group)
  const dangerousActions    = displayedActions.filter(action => action.dangerous)

  // generate actions groups
  const groupActions = {}
  for (let i=0; i < displayedActions.length; i++) {
    const action = displayedActions[i]
    if (!action.primary && !action.dangerous && !!action.group) {
      if (!groupActions[action.group]) {
        groupActions[action.group] = []
      }

      groupActions[action.group].push(action)
    }
  }

  //console.log(unclassifiedActions)

  // only display button if there are actions
  return (
    <MenuOverlay
      id={`${props.id}-menu`}
      position={props.menu.position}
      align={props.menu.align}
    >
      <CallbackButton
        {...omit(props, 'menu')}
        className={classes('dropdown-toggle', props.className)}
        bsRole="toggle"
        disabled={0 === displayedActions.length}
        callback={() => true}
      >
        {props.children}
      </CallbackButton>

      <Menu>
        {(props.menu.label && 0 !== unclassifiedActions.length) &&
          <MenuItem header={true}>{props.menu.label}</MenuItem>
        }

        {primaryActions.map((action) =>
          <MenuAction
            {...action}
            key={toKey(action.label)}
            id={`${props.id}${action.id || toKey(action.label)}`}
          />
        )}

        {(0 !== primaryActions.length && 0 !== unclassifiedActions.length) &&
          <MenuItem divider={true} />
        }

        {unclassifiedActions.map((action) =>
          <MenuAction
            {...action}
            key={toKey(action.label)}
            id={`${props.id}${action.id || toKey(action.label)}`}
          />
        )}

        {Object.keys(groupActions).map((group) => [
          <MenuItem key={toKey(group)} header={true}>{group}</MenuItem>,
          ...groupActions[group].map((action) =>
            <MenuAction
              {...action}
              key={toKey(action.label)}
              id={`${props.id}${action.id || toKey(action.label)}`}
            />
          )
        ])}

        {((0 !== unclassifiedActions.length || 0 !== Object.keys(groupActions).length) && 0 !== dangerousActions.length) &&
          <MenuItem divider={true} />
        }

        {dangerousActions.map((action) =>
          <MenuAction
            {...action}
            key={toKey(action.label)}
            id={`${props.id}${action.id || toKey(action.label)}`}
          />
        )}
      </Menu>
    </MenuOverlay>
  )
}

implementPropTypes(MenuButton, ButtonTypes, {
  id: T.string.isRequired,
  menu: T.shape({
    label: T.string,
    position: T.oneOf(['top', 'bottom']),
    align: T.oneOf(['left', 'right']),
    items: T.arrayOf(T.shape(
      ActionTypes.propTypes
    )).isRequired
  }).isRequired
})

export {
  MenuButton
}
