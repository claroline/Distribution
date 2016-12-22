import collection from 'lodash/collection'
import {
  SHUFFLE_NEVER,
  SHUFFLE_ONCE,
  SHUFFLE_ALWAYS
} from './../enums'

/**
 * Generate a new paper for a quiz.
 *
 * @param {object} quiz - the quiz definition
 * @param {object} steps - the list of quiz steps
 * @param {object} items - the list of quiz items
 * @param {object} previousPaper - the previous attempt of the user if any
 *
 * @returns {{number: number, anonymized: boolean, structure}}
 */
export function generatePaper(quiz, steps, items, previousPaper = null) {
  return {
    number: previousPaper ? previousPaper.number + 1 : 1,
    anonymized: quiz.parameters.anonymizeAttempts,
    structure: generateStructure(quiz, steps, items, previousPaper)
  }
}

function generateStructure(quiz, steps, items, previousPaper = null) {
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
    pickedSteps = collection.shuffle(pickedSteps);
  }

  // Pick questions for each steps and generate structure
  return pickedSteps.map((stepId) => {
    let step = steps[stepId]

    let pickedItems = []
    if (previousPaper && SHUFFLE_ONCE === step.parameters.randomPick) {
      // Get picked items from the last user paper
      // Retrieves the list of items of the current step
      pickedItems = repickQuestions($pickedStep, $previousStructure);
    } else {
      // Pick a new set of questions
      pickedItems = pick(step.items, step.parameters.pick)
    }

    // Shuffles items if needed
    if ( (!previousPaper && SHUFFLE_ONCE === step.parameters.randomOrder)
      || SHUFFLE_ALWAYS === step.parameters.randomOrder) {
      pickedItems = collection.shuffle(pickedItems);
    }

    return {
      id: stepId,
      items: pickedItems
    };
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
    picked = collection.sampleSize(originalSet, count).sort((a, b) => {
      // We need to put the picked items in their original order
      if (originalSet.indexOf(a) < originalSet.indexOf(b)) {
        return -1
      } else if (originalSet.indexOf(a) > originalSet.indexOf(b)) {
        return 1
      }
      return 0
    })
  } else {
    picked = originalSet.splice(0);
  }

  return picked;
}
