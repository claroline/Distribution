import {shuffle, sampleSize} from 'lodash/collection'

import {makeId} from './../../utils/utils'

import {
  SHUFFLE_ONCE,
  SHUFFLE_ALWAYS
} from './../enums'

/**
 * Generate a new paper for a quiz.
 *
 * @param {object} quiz - the quiz definition
 * @param {object} steps - the list of quiz steps
 * @param {object} previousPaper - the previous attempt of the user if any
 *
 * @returns {{number: number, anonymized: boolean, structure}}
 */
export function generatePaper(quiz, steps, previousPaper = null) {
  return {
    id: makeId(),
    number: previousPaper ? previousPaper.number + 1 : 1,
    anonymized: quiz.parameters.anonymizeAttempts,
    structure: generateStructure(quiz, steps, previousPaper)
  }
}

function generateStructure(quiz, steps, previousPaper = null) {
  const parameters = quiz.parameters

  // The structure of the previous paper if any
  let previousStructure = []
  if (previousPaper) {
    previousStructure = previousPaper.slice(0)
  }

  // Generate the list of step ids for the paper
  let pickedSteps
  if (previousPaper && SHUFFLE_ONCE === parameters.randomPick) {
    // Get picked steps from the last user paper
    pickedSteps = previousStructure.map((step) => step.id)
  } else {
    // Pick a new set of steps
    pickedSteps = pick(quiz.steps, parameters.pick)
  }

  // Shuffles steps if needed
  if ( (!previousPaper && SHUFFLE_ONCE === parameters.randomOrder)
    || SHUFFLE_ALWAYS === parameters.randomOrder) {
    pickedSteps = shuffle(pickedSteps)
  }

  // Pick questions for each steps and generate structure
  return pickedSteps.map((stepId) => {
    let step = steps[stepId]

    let pickedItems = []
    if (previousPaper && SHUFFLE_ONCE === step.parameters.randomPick) {
      // Get picked items from the last user paper
      // Retrieves the list of items of the current step
      const stepStructure = previousStructure.find((step) => step.id === stepId)
      pickedItems = stepStructure.items.slice(0)
    } else {
      // Pick a new set of questions
      pickedItems = pick(step.items, step.parameters.pick)
    }

    // Shuffles items if needed
    if ( (!previousPaper && SHUFFLE_ONCE === step.parameters.randomOrder)
      || SHUFFLE_ALWAYS === step.parameters.randomOrder) {
      pickedItems = shuffle(pickedItems)
    }

    return {
      id: stepId,
      items: pickedItems
    }
  })
}

/**
 * Picks a random subset of elements in a collection.
 * If count is 0, the whole collection is returned.
 *
 * @param {Array} originalSet
 * @param {number} count
 *
 * @returns {array}
 */
function pick(originalSet, count = 0) {
  let picked
  if (0 !== count) {
    // Get a random subset of element
    picked = sampleSize(originalSet, count).sort((a, b) => {
      // We need to put the picked items in their original order
      if (originalSet.indexOf(a) < originalSet.indexOf(b)) {
        return -1
      } else if (originalSet.indexOf(a) > originalSet.indexOf(b)) {
        return 1
      }
      return 0
    })
  } else {
    picked = originalSet.slice(0)
  }

  return picked
}
