import {makeId} from './../../../utils/utils'

export const utils = {}


/**
 * returns odd list (ie items minus real items)
 */
utils.getOddlist = (items, solutions) => {
  return items
}

/**
 * returns real items (ie items minus odd)
 */
utils.getRealItemlist = (items, solutions) => {
  return items
}

/**
 * get solutions minus odd
 */
utils.getRealSolutionList = (items, solutions) => {
  return solutions
}


utils.makeFieldUniqueId = (name) => {
  return `${name}-${makeId()}`
}
