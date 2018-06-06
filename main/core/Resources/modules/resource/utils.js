import merge from 'lodash/merge'
import omit from 'lodash/omit'
import uniq from 'lodash/uniq'

import {param, asset} from '#/main/app/config'
import {getApps} from '#/main/app/plugins'
import {trans} from '#/main/core/translation'

import {hasPermission} from '#/main/core/resource/permissions'

/**
 * Get the type implemented by a resource node.
 *
 * @param {object} resourceNode
 */
function getType(resourceNode) {
  return param('resourceTypes')
    .find(type => type.name === resourceNode.meta.type)
}

function loadActions(resourceNodes, actions) {
  const asyncActions = getApps('actions')

  // only get implemented actions
  const implementedActions = actions.filter(action => undefined !== asyncActions[action.name])

  return Promise.all(
    Object.keys(asyncActions).map(action => asyncActions[action]())
  ).then((loadedActions) => {
    // generates action from loaded modules
    const realActions = {}
    loadedActions.map(actionModule => {
      const generated = actionModule.action(resourceNodes)
      realActions[generated.name] = generated
    })

    // merge server action with ui implementation
    return implementedActions.map(action => merge({}, omit(action, 'permission'), realActions[action.name], {
      group: trans(action.group)
    }))
  })
}

/**
 * Gets the list of available actions for a resource.
 *
 * @param {Array}   resourceNodes - the current resource node
 * @param {boolean} withDefault   - include the default action (most of the time, it's not useful to get it)
 */
function getActions(resourceNodes, withDefault = false) {
  const resourceTypes = uniq(resourceNodes.map(resourceNode => resourceNode.meta.type))

  const collectionActions = resourceTypes
    .reduce((accumulator, resourceType) => {
      let typeActions = getType({meta: {type: resourceType}}).actions
        .filter(action =>
          // filter default if needed
          (withDefault || undefined === action.default || !action.default)
          // filter by permissions (the user must have perms on AT LEAST ONE node in the collection)
          && !!resourceNodes.find(resourceNode => hasPermission(action.permission, resourceNode))
        )

      return accumulator.concat(typeActions)
    }, [])

  return loadActions(resourceNodes, collectionActions, withDefault)
}

function getDefaultAction(resourceNode) {
  const defaultAction = getType(resourceNode).actions
    .find(action => action.default)

  if (hasPermission(defaultAction.permission, resourceNode)) {
    return loadActions([resourceNode], [defaultAction], 'object')
      .then(loadActions => loadActions[0] || null)
  }

  return null
}

export {
  getType,
  getActions,
  getDefaultAction
}
