import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {MENU_BUTTON} from '#/main/app/buttons'

const GROUP_SEPARATOR  = '|'
const ACTION_SEPARATOR = ' '

// TODO : use reselect to memoize toolbars config

/**
 *
 * @param {string} toolbarConfig
 */
function parseToolbar(toolbarConfig) {
  if (toolbarConfig) {
    const groups = toolbarConfig.split(GROUP_SEPARATOR)

    return groups
      .map(group => group
        .split(ACTION_SEPARATOR)
        .map(action => action.trim())
      )
  }

  return []
}

/**
 *
 * @param {string} toolbarConfig
 * @param {Array}  actions
 * @param {string} scope
 *
 * @todo improve implementation (the part for more menu)
 */
function buildToolbar(toolbarConfig, actions = [], scope) {
  let toolbar = []

  // filters toolbar actions
  actions = actions.filter(action =>
    // only get displayed actions
    (undefined === action.displayed || !!action.displayed)
    // only get actions for the requested scope
    && (!scope || isEmpty(action.scope) || -1 !== action.scope.indexOf(scope))
  )

  // retrieves defined actions groups
  const config = parseToolbar(toolbarConfig)

  // we want to know if there is action that are not configured in the toolbar
  let rest = actions.slice()

  // checks if there is a `more` action to grab remaining actions
  let hasMore = false
  // we only allow one primary action in the btn bar
  // we don't limit it in the more menu
  let hasPrimaryAction = false

  if (0 !== config.length) {
    toolbar = config.map(
      // loop over each group
      (group) => group.map(
        // loop over each defined action to retrieve them
        (actionName) => {
          if ('more' === actionName) {
            hasMore = true

            // create the more action
            // we will fill menu later or remove the button of there is no remaining action
            return {
              name: 'more',
              type: MENU_BUTTON,
              icon: 'fa fa-fw fa-ellipsis-v',
              label: trans('show-more-actions', {}, 'actions'),
              menu: {
                align: 'right' // I hope it wil not cause problems to not be able to configure it
              }
            }
          } else {
            const pos = rest.findIndex(action => actionName === action.name)
            if (-1 !== pos) {
              const action = rest.splice(pos, 1)

              if (action[0].primary) {
                if (!hasPrimaryAction) {
                  hasPrimaryAction = true
                } else {
                  // we only keep 1st primary action
                  action[0].primary = false
                }
              }

              // return the definition of the action (nb. splice always return an array)
              return action[0]
            }
          }
        }
      ).filter(action => !!action)
    ).filter(group => 0 !== group.length)
  }

  if (0 < rest.length) {
    // append remaining actions to the configured toolbar (in a new group)
    if (hasMore) {
      // merge all remaining actions in a menu
      const groupIndex = toolbar.findIndex(group => -1 !== group.findIndex(action => 'more' === action.name))
      const actionIndex = toolbar[groupIndex].findIndex(action => 'more' === action.name)

      toolbar[groupIndex][actionIndex].menu.items = rest
    } else {
      // append all remaining actions in a new group
      toolbar.push(rest)
    }
  } else if (hasMore) {
    // all actions were configured in the toolbar, remove the more menu
    const groupIndex = toolbar.findIndex(group => -1 !== group.findIndex(action => 'more' === action.name))
    const actionIndex = toolbar[groupIndex].findIndex(action => 'more' === action.name)

    // remove action
    delete toolbar[groupIndex][actionIndex]
  }

  return toolbar
}

export {
  buildToolbar
}
