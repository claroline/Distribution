export const utils = {}

/**
 * returns odd list (ie items minus real items)
 */
utils.getOddlist = (items, solutions) => {
  return items.filter(item => undefined !== solutions.find(
    solution => solution.itemIds.length === 1 && solution.itemIds[0] === item.id
  ))
}

/**
 * returns real items (ie items minus odd)
 */
utils.getRealItemlist = (items, solutions) => {
  if(utils.getOddlist(items, solutions).length > 0) {
    return items.filter(item => undefined === solutions.find(
      solution => solution.itemIds.length === 1 && solution.itemIds[0] === item.id
    ))
  }
  return items
}

/**
 * get solutions minus odd
 */
utils.getRealSolutionList = (solutions) => {
  return solutions.filter(solution => solution.itemIds.length === 2)
}

utils.getOddSolution = (oddItem, solutions) => {
  return solutions.find(solution => solution.itemIds.length === 1 && solution.itemIds[0] === oddItem.id)
}

utils.getPairItemData = (itemId, items) => {
  if (itemId === -1) {
    return ''
  }
  const found = items.find(item => item.id === itemId)
  return found.data || ''
}

utils.pairItemHasCoords = (itemId, items, index) => {
  if (itemId === -1) {
    return ''
  }
  const found = items.find(item => item.id === itemId)
  return  undefined !== found.coordinates && found.coordinates[1] === index
}

utils.canAddSolution = (solutions, pairToUpdate, item) => {
  const realSolutionList = utils.getRealSolutionList(solutions)
  // second pair item
  const brotherIndexToCheck = pairToUpdate.position === 0 ? 1 : 0
  const solutionToUpdate = realSolutionList[pairToUpdate.index]

  // only one solution (default one) no ore only one item in it
  if (realSolutionList.length === 1 && (pairToUpdate.pair.itemIds[0] === -1 || pairToUpdate.pair.itemIds[1] === -1)) {
    // can not add the same item two times in the same pair
    return solutionToUpdate.itemIds[brotherIndexToCheck] === -1 || solutionToUpdate.itemIds[brotherIndexToCheck] !== item.id
  }

  // @TODO other cases : more than one solution current pair is ordered or not find a way to avoid duplicates
  // can not add the same item two times in the current pair
  const firstCheck = solutionToUpdate.itemIds[brotherIndexToCheck] === -1 || solutionToUpdate.itemIds[brotherIndexToCheck] !== item.id
  const secondCheck = true
  return firstCheck && secondCheck
}
