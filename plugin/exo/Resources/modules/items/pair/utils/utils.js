export const utils = {}


/**
 * returns odd list (ie items minus real items)
 */
utils.getOddlist = (items, solutions) => {
  return items.filter(item => undefined !== solutions.find(
    solution => solution._odd && solution.itemIds[0] === item.id
  ))
}

/**
 * returns real items (ie items minus odd)
 */
utils.getRealItemlist = (items, solutions) => {
  if(utils.getOddlist(items, solutions).length > 0) {
    return items.filter(item => undefined === solutions.find(
      solution => solution._odd && solution.itemIds[0] === item.id
    ))
  }
  return items
}

/**
 * get solutions minus odd
 */
utils.getRealSolutionList = (solutions) => {
  return solutions.filter(solution => !solution._odd)
}

utils.getOddSolution = (oddItem, solutions) => {
  return solutions.find(solution => solution._odd && solution.itemIds[0] === oddItem.id)
}

utils.getPairItemData = (itemId, items) => {
  const item = items.find(item => item.id === itemId)
  return undefined !== item ?  item.data : ''
}

utils.canAddSolution = (solutions, pairToUpdate, item) => {
  let test= []
  test[1] = 'blah'
  console.log(test)
  console.log('pairToUpdate', pairToUpdate)
  console.log('item', item)
  // pair has no items
  if(pairToUpdate.pair.itemIds.length === 0) {
    return true
  }
  // if already one item in the pair
  if(pairToUpdate.pair.itemIds.length === 1) {
    // - can not add the same item two times in the same pair
    const solutionToUpdate = utils.getRealSolutionList(solutions)[pairToUpdate.index]
    const indexToCheck = pairToUpdate.position === 0 ? 1 : 0
    const firstCheck = solutionToUpdate.itemIds[indexToCheck] !== item.id
    // - other pairs exist and in one of them items are the same and in the same place
    const fullPairs = solutions.filter(solution => !solution._odd && solution.itemIds.length === 2)
    const secondCheck = fullPairs.some(pair => {
      return pair.itemIds[pairToUpdate.position] === item.id && pair.itemIds[indexToCheck] === solutionToUpdate.itemIds[indexToCheck]
    })

    /*
    if (item.items.some(el => {
      return item.solutions.associations.find(association => association.itemId === el.id) === undefined &&
        item.solutions.odd.find(o => o.itemId === el.id) === undefined
    })){
      errors.items = tex('set_no_orphean_items')
    }
    */

    return firstCheck && secondCheck
  }
  return true
}
