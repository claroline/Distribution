import invariant from 'invariant'

let registeredTypes = {}

export function registerItemType(definition) {
  assertValidItemType(definition)

  if (registeredTypes[definition.type]) {
    throw new Error(`${definition.type} is already registered`)
  }

  definition.question = typeof definition.question !== 'undefined' ?
    definition.question :
    true
  definition.augmenter = typeof definition.augmenter !== 'undefined' ?
    definition.augmenter :
    (item => item)

  registeredTypes[definition.type] = definition
}

export function listItemMimeTypes() {
  return Object.keys(registeredTypes)
}

export function getDefinition(type) {
  if (!registeredTypes[type]) {
    throw new Error(`Unknown item type ${type}`)
  }

  return registeredTypes[type]
}

// testing purposes only
export function resetTypes() {
  registeredTypes = {}
}

function assertValidItemType(definition) {
  invariant(definition.name, 'name is mandatory')
  invariant(typeof definition.name === 'string', 'name must be a string')
  invariant(definition.type, 'mime type is mandatory')
  invariant(typeof definition.type === 'string', 'mime type must be a string')
  invariant(definition.component, 'component is mandatory')
  invariant(definition.reducer, 'reducer is mandatory')
  invariant(typeof definition.reducer === 'function', 'reducer must be a function')
}
