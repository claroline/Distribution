import cloneDeep from 'lodash/cloneDeep'
import times from 'lodash/times'

// TODO : remove duplicated methods

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

utils.hasPinnedItems = (items) => {
  return -1 < items.findIndex(item => item.hasOwnProperty('coordinates'))
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

utils.pairItemsWithDisplayOption = (items) => {
  return items.filter(i => !i.coordinates).map(i => Object.assign({}, i, {display: true, removable: true}))
}

utils.switchItemDisplay = (items, id, display) => {
  return items.map(item => item.id === id ? Object.assign({}, item, {display: display}) : item)
}

utils.generateAnswerPairItems = (items, rows, answer = []) => {
  let data = []
  times(rows, i => data[i] = [-1, -1])
  Array.apply(null, {length: rows}).map((x, i) => {
    const item = items.find(item => item.coordinates && item.coordinates[1] === i)
    if(undefined !== item) {
      data[i][item.coordinates[0]] = Object.assign({}, item, {removable: false})
    }
  })
  answer.forEach((a) => {
    const itemX = items.find(i => i.id === a[0])
    const itemY = items.find(i => i.id === a[1])
    // search first if one of the answer pair is in the pinned items
    const row = data.find(d => (-1 !== d[0] && d[0].id === a[0]) || (-1 !== d[1] && d[1].id === a[1]))

    if (row) {
      // if existing pair answer is associated to a pinned item, set the second pair value with the given answer
      if (-1 === row[0] && itemX) {
        row[0] = Object.assign({}, itemX, {removable: true})
      } else if (-1 === row[1] && itemY) {
        row[1] = Object.assign({}, itemY, {removable: true})
      }
    } else {
      // initialize existing pair answer into the first empty pair answer found
      const emptyRow = data.find(d => -1 === d[0] && -1 === d[1])

      if (emptyRow) {
        if (itemX) {
          emptyRow[0] = Object.assign({}, itemX, {removable: true})
        }
        if (itemY) {
          emptyRow[1] = Object.assign({}, itemY, {removable: true})
        }
      }
    }
  })

  return data
}

utils.addAnswerItem = (answerItems, item, x, y) => {
  let data = []
  for (let i = 0; i < answerItems.length; ++i) {
    if (i === x) {
      let pair = answerItems[i]
      pair[y] = item
      data.push(pair)
    } else {
      data.push(answerItems[i])
    }
  }
  return data
}

utils.removeAnswerItem = (answerItems, itemId) => {
  return answerItems.map(row => row.map(item => ((item === -1) || (item.id !== itemId)) ? item : -1))
}

utils.generateAnswer = (answerItems) => {
  let answer = []
  answerItems.forEach(row => {
    let answerRow = []
    row.forEach(item => {
      if (item !== -1) {
        answerRow.push(item.id)
      }
    })
    if (answerRow.length > 0) {
      answer.push(answerRow)
    }
  })
  return answer
}



utils.addAnswerItem = (answerItems, item, x, y) => {
  let data = []
  for (let i = 0; i < answerItems.length; ++i) {
    if (i === x) {
      let pair = answerItems[i]
      pair[y] = item
      data.push(pair)
    } else {
      data.push(answerItems[i])
    }
  }
  return data
}

utils.removeAnswerItem = (answerItems, itemId) => {
  return answerItems.map(row => row.map(item => ((item === -1) || (item.id !== itemId)) ? item : -1))
}

utils.generateAnswer = (answerItems) => {
  let answer = []
  answerItems.forEach(row => {
    if (row[0] !== -1 && row[1] !== -1) {
      answer.push([row[0].id, row[1].id])
    }
  })
  return answer
}


utils.getYourAnswers = (answers, item) => {
  let yourAnswers = {
    answers: [],
    orpheans: []
  }

  if (answers) {
    answers.forEach(answer => {
      // search for corresponding solution
      let solution = item.solutions.find(solution => solution.itemIds.length === 2 && solution.itemIds.indexOf(answer[0]) !== -1 && solution.itemIds.indexOf(answer[1]) !== -1)
      let valid = undefined !== solution && solution.score > 0
      if (valid && solution.ordered) {
        valid = answer[0] === solution.itemIds[0] && answer[1] === solution.itemIds[1]
      }
      const leftItemData = item.items.find(item => item.id === answer[0]).data
      const rightItemData = item.items.find(item => item.id === answer[1]).data

      // not a real solution could be an odd !
      if (solution === undefined) {
        solution = item.solutions.find(solution => solution.itemIds.length === 1 && ( solution.itemIds[0] === answer[0] || solution.itemIds[0] === answer[1]))
      }

      yourAnswers.answers.push({
        leftItem: {id: answer[0], data:leftItemData},
        rightItem: {id: answer[1], data:rightItemData},
        valid: valid,
        feedback: undefined !== solution ? solution.feedback : '',
        score: undefined !== solution ? solution.score : ''
      })
    })
  }

  item.items.forEach(el => {
    const answerFound = answers ? answers.find(answer => answer.indexOf(el.id) !== -1) : undefined
    if (undefined === answerFound) {
      const solution = item.solutions.filter(solution => solution.itemIds.length === 1).find(solution => solution.itemIds[0] === el.id)

      yourAnswers.orpheans.push({
        data: el.data,
        id: el.id,
        feedback: undefined !== solution ? solution.feedback : '',
        score: undefined !== solution ? solution.score : ''
      })
    }
  })

  return yourAnswers
}

utils.getExpectedAnswers = (item) => {
  let expectedAnswers = {
    answers: [],
    odd: []
  }

  utils.getRealSolutionList(item.solutions).forEach(solution => {
    expectedAnswers.answers.push({
      leftItem: {id: solution.itemIds[0], data: item.items.find(item => item.id === solution.itemIds[0]).data},
      rightItem: {id: solution.itemIds[1], data: item.items.find(item => item.id === solution.itemIds[1]).data},
      valid: solution.score > 0,
      feedback: solution.feedback,
      score: solution.score
    })
  })

  item.solutions.filter(solution => solution.itemIds.length === 1).forEach(solution => {
    expectedAnswers.odd.push({
      item: {id: solution.itemIds[0], data: item.items.find(el => el.id === solution.itemIds[0]).data},
      feedback: solution.feedback ,
      score: solution.score
    })
  })

  return expectedAnswers
}

utils.isPresentInOdds = (itemId, odds) => {
  let isPresent = false

  odds.forEach(o => {
    if (o.item.id === itemId) {
      isPresent = true
    }
  })

  return isPresent
}

utils.isPresentInSolutions = (firstId, secondId, solutions) => {
  let isPresent = false

  solutions.forEach(s => {
    if (s.itemIds.length > 1 &&
      ((s.ordered && s.itemIds[0] === firstId && s.itemIds[1] === secondId) ||
        (!s.ordered && ((s.itemIds[0] === firstId && s.itemIds[1] === secondId) || (s.itemIds[1] === firstId && s.itemIds[0] === secondId))))
    ) {
      isPresent = true
    }
  })

  return isPresent
}

utils.findUserAnswer = (solution, answer) => {
  return answer.data.find(answer =>  JSON.stringify(cloneDeep(solution.itemIds).sort()) === JSON.stringify(cloneDeep(answer).sort()))
}
