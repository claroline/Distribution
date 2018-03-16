import {trans} from '#/main/core/translation'

/**
 * Extracts a choice by value from choices nested object
 *
 * @param value
 * @param choices
 * @return {string | null} - the choice if one is found, null otherwise
 */
const extractChoice = (value, choices) => {
  if (!value) {
    return null
  }
  
  let found = null
  function searchChoice(choices) {
    choices.forEach(choice => {
      if (found) {
        return true
      }
      if (choice.value === value || choice.label.toUpperCase() === value.toUpperCase()) {
        found = choice
      } else if (choice.choices.length > 0) {
        searchChoice(choice.choices)
      }
    })
  }
  searchChoice(choices)
  
  return found
}

/**
 * Parses a displayed text and matches it to its proper choice
 *
 * @param display
 * @param choices
 * @param transDomain
 * @return {string | null} - return choice if one was found, null otherwise
 */
const parseChoice = (display, choices, transDomain) => {
  if (!display) {
    return null
  }
  let parsed = null
  function searchChoice(choices) {
    choices.forEach(choice => {
      if (parsed) {
        return true
      }
      if (choice.choices.length > 0) {
        searchChoice(choice.choices)
      } else if (
        choice.value === display ||
        choice.label.toUpperCase().includes(display.toUpperCase()) ||
        (transDomain && trans(choice.label, {}, transDomain).toUpperCase().includes(display.toUpperCase()))
      ) {
        parsed = choice.value
      }
    })
  }
  searchChoice(choices)
  
  return parsed
}

/**
 * Renders a choice to it's displayed value
 *
 * @param raw
 * @param choices
 * @param transDomain
 * @return {string} - raw if choice was not found, formatted found choice text otherwise
 */
const renderChoice = (raw, choices, transDomain) => {
  if (!raw) {
    return null
  }
  
  let found = null
  function searchChoice(choices) {
    choices.forEach(choice => {
      if (found) {
        return true
      }
      if (choice.value === raw || choice.label.toUpperCase() === raw.toUpperCase()) {
        found = transDomain ? trans(choice.label, {}, transDomain) : choice.label
      } else if (choice.choices.length > 0) {
        searchChoice(choice.choices)
        if (found) {
          found = `${transDomain ? trans(choice.label, {}, transDomain) : choice.label} : ${found}`
        }
      }
    })
  }
  searchChoice(choices)
  
  return found || raw
}

export {
  extractChoice,
  parseChoice,
  renderChoice
}