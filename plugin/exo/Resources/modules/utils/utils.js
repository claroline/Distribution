import update from 'immutability-helper'
import uuid from 'uuid'

// re-export immutability-helper with a custom delete command
update.extend('$delete', (property, object) => {
  const newObject = update(object, {[property]: {$set: undefined}})
  delete newObject[property]
  return newObject
})

export {update}

// counter for id generation
let lastGeneratedIds = []

// generate a temporary id string
export function makeId() {
  lastGeneratedIds.push(uuid())

  return lastGeneratedIds[lastGeneratedIds.length - 1]
}

// return the last generated id (mainly for test purposes)
export function lastId() {
  return lastGeneratedIds[lastGeneratedIds.length - 1]
}

// test purpose only
export function lastIds(count) {
  if (count > lastGeneratedIds.length) {
    throw new Error(
      `Cannot access last ${count} ids, only ${lastGeneratedIds.length} were generated`
    )
  }

  const ids = []

  for (let i = lastGeneratedIds.length - count; i < lastGeneratedIds.length; ++i) {
    ids.push(lastGeneratedIds[i])
  }

  return ids
}

export function makeItemPanelKey(itemType, itemId) {
  return `item-${itemType}-${itemId}`
}

export function makeStepPropPanelKey(stepId) {
  return `step-${stepId}-properties`
}

export function getIndex(array, element) {
  if (!Array.isArray(array)) {
    throw new Error(`Excepted array, got ${typeof array}`)
  }

  const index = array.indexOf(element)

  if (index === -1) {
    const arrString = JSON.stringify(array, null, 2)
    const elString = JSON.stringify(element, null, 2)
    throw new Error(
      `Cannot get index of element\nArray:\n${arrString}\nElement:\n${elString}`
    )
  }

  return index
}
