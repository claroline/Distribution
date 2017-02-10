export const utils = {

  getCellsByCol(colIndex, cells) {
    return cells.filter(cell => cell.coordinates[0] === colIndex)
  },
  getCellsByRow(rowIndex, cells) {
    return cells.filter(cell => cell.coordinates[1] === rowIndex)
  },
  getCellByCoordinates(x, y, cells) {
    return cells.find(cell => cell.coordinates[0] === x && cell.coordinates[1] === y)
  },
  getColScore(colIndex, cells, solutions) {
    // in col score mode each item of the col MUST have the same score
    const oneCellOfTheCol = cells.find(cell => cell.coordinates[0] === colIndex)
    let cellSolutionScore = 0
    solutions.forEach(solution => {
      if (solution.cellId === oneCellOfTheCol.id && solutions.answers[0].score > cellSolutionScore) {
        cellSolutionScore = solutions.answers[0].score
      }
    })
    return cellSolutionScore
  },
  getRowScore(rowIndex, cells, solutions) {
    // in row score mode each item of the row MUST have the same score
    const oneCellOfTheRow = cells.find(cell => cell.coordinates[1] === rowIndex)
    let cellSolutionScore = 0
    solutions.forEach(solution => {
      if (solution.cellId === oneCellOfTheRow.id && solutions.answers[0].score > cellSolutionScore) {
        cellSolutionScore = solutions.answers[0].score
      }
    })
    return cellSolutionScore
  },
  atLeastOneSolutionInCol(colIndex, cells, solutions) {
    // in col score mode each item of the col MUST have the same score
    return undefined !== cells.find(cell => cell.coordinates[0] === colIndex && undefined !== solutions.find(solution => solution.cellId === cell.id))
  },
  atLeastOneSolutionInRow(rowIndex, cells, solutions) {
    // in col score mode each item of the col MUST have the same score
    return undefined !== cells.find(cell => cell.coordinates[1] === rowIndex && undefined !== solutions.find(solution => solution.cellId === cell.id))
  }
}
