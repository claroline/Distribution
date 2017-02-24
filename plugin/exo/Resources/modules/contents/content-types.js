import invariant from 'invariant'
import difference from 'lodash/difference'
import mapValues from 'lodash/mapValues'

import textContent from './text-content'
import imageContent from './image-content'
import audioContent from './audio-content'
import videoContent from './video-content'

const typeProperties = [
  'type',
  'mimeType',
  'content',
  'editor',
  'player',
  'validate',
  'icon',
  'altIcon',
  'browseFiles'
]

let registeredContentTypes = {}
let defaultRegistered = false

export function registerContentItemType(definition) {
  assertValidItemType(definition)

  if (registeredContentTypes[definition.type]) {
    throw new Error(`${definition.type} is already registered`)
  }

  definition.content = typeof definition.content !== 'undefined' ?
    definition.content :
    true

  registeredContentTypes[definition.type] = definition
}

export function registerDefaultContentItemTypes() {
  if (!defaultRegistered) {
    [textContent, imageContent, audioContent, videoContent].forEach(registerContentItemType)
    defaultRegistered = true
  }
}

export function listContentTypes() {
  return Object.keys(registeredContentTypes)
}

export function getContentDefinition(type) {
  if (type.startsWith('text')) {
    return registeredContentTypes['text']
  } else if (type.startsWith('image')) {
    return registeredContentTypes['image']
  } else if (type.startsWith('audio')) {
    return registeredContentTypes['audio']
  } else if (type.startsWith('video')) {
    return registeredContentTypes['video']
  } else {
    throw new Error(`Unknown content type ${type}`)
  }

  //if (!registeredContentTypes[type]) {
  //}

}


function assertValidItemType(definition) {
  invariant(
    definition.type,
    makeError('mime type is mandatory', definition)
  )
  invariant(
    typeof definition.type === 'string',
    makeError('mime type must be a string', definition)
  )
  invariant(
    definition.editor,
    makeError('editor is mandatory', definition)
  )
  invariant(
    definition.editor.component,
    makeError('editor component is mandatory', definition)
  )
  invariant(
    definition.editor.reduce,
    makeError('editor reduce is mandatory', definition)
  )
  invariant(
    typeof definition.editor.reduce === 'function',
    makeError('editor reduce must be a function', definition)
  )
  invariant(
    definition.player,
    makeError('player component is mandatory', definition)
  )
  invariant(
    definition.icon,
    makeError('icon component is mandatory', definition)
  )
  invariant(
    definition.altIcon,
    makeError('altIcon component is mandatory', definition)
  )

  const extraProperties = difference(Object.keys(definition), typeProperties)

  if (extraProperties.length > 0) {
    invariant(
      false,
      makeError(`unknown property '${extraProperties[0]}'`, definition)
    )
  }
}

function makeError(message, definition) {
  const name = definition.name ? definition.name.toString() : '[unnamed]'

  return `${message} in '${name}' definition`
}
