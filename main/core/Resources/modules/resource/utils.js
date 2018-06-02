import intersectionWith from 'lodash/intersectionWith'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {param, asset} from '#/main/app/config'
import {trans} from '#/main/core/translation'

// todo load dynamically
import {actions} from '#/main/core/resource/actions/actions'

import '#/main/app/plugins'

/**
 * Get the type implemented by a resource node.
 *
 * @param {object} resourceNode
 */
function getType(resourceNode) {
  return param('resourceTypes')
    .find(type => type.name === resourceNode.meta.type)
}

/**
 * Get the icon of a resource icon.
 *
 * @param {object} mimeType - the mime type of the resource node
 */
function getIcon(mimeType) {
  const icons = param('theme.icons')

  // try to find an icon for the exact mime type
  let resourceIcon = icons.find(icon => -1 !== icon.mimeTypes.indexOf(mimeType))
  if (!resourceIcon) {
    // fallback to an icon for the first mimeType part
    const type = mimeType.split('/')[0]
    resourceIcon = icons.find(icon => -1 !== icon.mimeTypes.indexOf(type))
  }

  return asset(resourceIcon.url)
}

/**
 * Gets the list of available for a resource.
 *
 * @param {object}      resourceNode - the current resource node
 * @param {string|null} scope        - filter actions with a scope
 * @param {boolean}     withDefault  - include the default action (most of the time, it's not useful to get it)
 */
function getActions(resourceNode, scope = null, withDefault = false) {
  let nodeActions = getType(resourceNode).actions
    .filter(action =>
        // filter by scope
      (!scope || isEmpty(action.scope) || -1 !== action.scope.indexOf(scope))
      // filter by permissions
      && !!resourceNode.permissions[action.permission]
      // filter implemented actions only
      && undefined !== actions[action.name]
    )

    // merge server conf with ui
    .map(action => merge({}, omit(action, 'permission'), actions[action.name]([resourceNode], scope), {
      group: trans(action.group, {}, 'resource')
    }))

  if (!withDefault) {
    nodeActions = nodeActions.filter(action => undefined === action.default || !action.default)
  }

  return nodeActions
}

function getCollectionActions(resourceNodes, scope = null, withDefault = false) {
  // todo fix me

  return intersectionWith(
    // grab all actions for all available types
    ...resourceNodes.map(resourceNode => getActions(resourceNode, scope, withDefault)),
    // filter actions only available for all selected resource types
    isEqual
  )
}

function getDefaultAction(resourceNode, scope) {
  return getActions(resourceNode, scope, true).find(action => action.default)
}

export {
  getType,
  getIcon,
  getActions,
  getCollectionActions,
  getDefaultAction
}
