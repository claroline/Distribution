/**
 * Plugins registry.
 *
 * It contains the configurations for all applications provided by enabled plugins.
 */

import isEmpty from 'lodash/isEmpty'

import {declareRegistry} from '#/main/app/registry'

const registeredActions = {}

function registerActions(actions) {
  const entryActions = Object.keys(actions)

  return Promise.all(
    entryActions.map(actionName => actions[actionName]())
  ).then((loadedActions) => {
    entryActions.reduce((accumulator, actionName, index) => Object.assign(accumulator, {[actionName]: loadedActions[index].action}), registeredActions)
  })
}

// declares a new registry to grab plugins
const registry = declareRegistry('plugins')

/*(entries) => {
  const actions = Object.keys(entries)
  // only get entries with declared actions
    .filter(entryName => !isEmpty(entries[entryName].actions))
    // merge all entries actions into a single object
    .reduce((accumulator, entryName) => Object.assign(accumulator, entries[entryName].actions), {})

  if (!isEmpty(actions)) {
    return registerActions(actions)
  }


}*/


  /*.on('add', (entry) => {
    // preload actions
    if (entry.actions) {
      registry.isDirty()

      const entryActions = Object.keys(entry.actions)

      return Promise.all(
        entryActions.map(actionName => entry.actions[actionName]())
      ).then((loadedActions) => {
        entryActions.reduce((accumulator, actionName, index) => Object.assign(accumulator, {[actionName]: loadedActions[index].action}), registeredActions)

        registry.isReady()
      })
    }
  })*/

export {
  registry
}
