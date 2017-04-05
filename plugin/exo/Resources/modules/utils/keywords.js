import {notBlank, number, chain} from './validate'
import {tex, transChoice} from '#/main/core/translation'

export const keywords = {}

/**
 * Validates a keywords collection.
 *
 * @param {Array}   collection  - the list of keywords to validate
 * @param {boolean} useScore    - if true, it validates `score` prop else it validates `expected`
 * @param {number}  minKeywords - the minimum number of items required in the collection (default: 1)
 *
 * @returns {object} an error object
 */
keywords.validate = (collection, useScore, minKeywords) => {
  let errors = {}

  // Checks all keywords have a text
  if (collection.find(keyword => notBlank(keyword.text))) {
    errors.text = tex('words_empty_text_error')
  }

  if (useScore) {
    // Checks score for all keywords is correct
    if (undefined !== collection.find(keyword => chain(keyword.score, [notBlank, number]))) {
      errors.score = tex('words_score_not_valid')
    }

    // Checks there is at least one keyword with positive score
    if (undefined === collection.find(keyword => keyword.score > 0)) {
      errors.noValidKeyword = tex('words_no_valid_solution')
    }
  } else {
    // Checks there is at least one expected keyword
    if (undefined === collection.find(keyword => keyword.expected)) {
      errors.noValidKeyword = tex('words_no_expected_solution')
    }
  }

  if (!minKeywords) {
    minKeywords = 1
  }

  // Checks the number of keywords
  if (collection.length < minKeywords) {
    errors.count = transChoice('words_count_answers_error', minKeywords, {count: minKeywords}, 'ujm_exo')
  }

  // Checks there is no duplicate keywords
  if (keywords.hasDuplicates(collection)) {
    errors.duplicate = tex('words_duplicate_answers')
  }

  return errors
}

keywords.hasDuplicates = (keywords) => {
  let hasDuplicates = false
  keywords.forEach(keyword => {
    let count = 0
    keywords.forEach(check => {
      if (keyword.text === check.text && keyword.caseSensitive === check.caseSensitive) {
        count++
      }
    })
    if (count > 1) hasDuplicates = true
  })

  return hasDuplicates
}
