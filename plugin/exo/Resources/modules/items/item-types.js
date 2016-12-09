import invariant from 'invariant'
import difference from 'lodash/difference'
import mapValues from 'lodash/mapValues'

import choice from './choice/choice'
import match from './match/match'
import cloze from './cloze/cloze'
import graphic from './graphic/graphic'
import open from './open/open'
import words from './words/words'
import set from './set/set'

const typeProperties = [
  'name',
  'type',
  'question',
  'component',
  'reduce',
  'decorate',
  'validate'
]

let registeredTypes = {}
let defaultRegistered = false

export function registerItemType(definition) {
  assertValidItemType(definition)

  if (registeredTypes[definition.type]) {
    throw new Error(`${definition.type} is already registered`)
  }

  definition.question = typeof definition.question !== 'undefined' ?
    definition.question :
    true

  definition.decorate = getOptionalFunction(definition, 'decorate', item => item)
  definition.validate = getOptionalFunction(definition, 'validate', () => ({}))

  registeredTypes[definition.type] = definition
}

export function registerDefaultItemTypes() {
  if (!defaultRegistered) {
    [choice, match, cloze, graphic, open, words, set].forEach(registerItemType)
    defaultRegistered = true
  }
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

export function getDecorators() {
  return mapValues(registeredTypes, type => type.decorate)
}

// testing purposes only
export function resetTypes() {
  registeredTypes = {}
}

function assertValidItemType(definition) {
  invariant(
    definition.name,
    makeError('name is mandatory', definition)
  )
  invariant(
    typeof definition.name === 'string',
    makeError('name must be a string', definition)
  )
  invariant(
    definition.type,
    makeError('mime type is mandatory', definition)
  )
  invariant(
    typeof definition.type === 'string',
    makeError('mime type must be a string', definition)
  )
  invariant(
    definition.component,
    makeError('component is mandatory', definition)
  )
  invariant(
    definition.reduce,
    makeError('reduce is mandatory', definition)
  )
  invariant(
    typeof definition.reduce === 'function',
    makeError('reduce must be a function', definition)
  )

  const extraProperties = difference(Object.keys(definition), typeProperties)

  if (extraProperties.length > 0) {
    invariant(
      false,
      makeError(`unknown property '${extraProperties[0]}'`, definition)
    )
  }
}

function getOptionalFunction(definition, name, defaultFunc) {
  if (typeof definition[name] !== 'undefined') {
    invariant(
      typeof definition[name] === 'function',
      makeError(`${name} must be a function`, definition)
    )
    return definition[name]
  }
  return defaultFunc
}

function makeError(message, definition) {
  const name = definition.name ? definition.name.toString() : '[unnamed]'

  return `${message} in '${name}' definition`
}
