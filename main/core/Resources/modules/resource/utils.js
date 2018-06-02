import intersectionWith from 'lodash/intersectionWith'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {param, asset} from '#/main/app/config'
import {getApps} from '#/main/app/plugins'
import {trans} from '#/main/core/translation'

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
  const asyncActions = getApps('actions')

  let nodeActions = getType(resourceNode).actions
    .filter(action =>
        // filter by scope
      (!scope || isEmpty(action.scope) || -1 !== action.scope.indexOf(scope))
      // filter by permissions
      && !!resourceNode.permissions[action.permission]
      // filter implemented actions only
      && undefined !== asyncActions[action.name]
    )

  return Promise.all(
    nodeActions.map(action => asyncActions[action.name]())
  ).then((loadedActions) => {
    // generates action from loaded modules
    const realActions = {}
    loadedActions.map(actionModule => {
      const generated = actionModule.action([resourceNode], scope)
      realActions[generated.name] = generated
    })

    // merge server action with ui implementation
    let finalActions = nodeActions.map(action => merge({}, omit(action, 'permission'), realActions[action.name], {
      group: trans(action.group, {}, 'resource')
    }))

    if (!withDefault) {
      finalActions = finalActions.filter(action => undefined === action.default || !action.default)
    }

    return finalActions
  })
}

function getCollectionActions(resourceNodes, scope = null, withDefault = false) {
  // todo fix me

  return []

  /*return intersectionWith(
    // grab all actions for all available types
    ...resourceNodes.map(resourceNode => getActions(resourceNode, scope, withDefault)),
    // filter actions only available for all selected resource types
    isEqual
  )*/
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
