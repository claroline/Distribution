import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {SCORE_SUM, SCORE_FIXED} from './../../quiz/enums'
import {makeActionCreator, makeId} from './../../utils/utils'
import {tex} from './../../utils/translate'
import {notBlank} from './../../utils/validate'
import {Grid as component} from './editor.jsx'
import {utils} from './utils/utils'

const UPDATE_PROP = 'UPDATE_PROP'
const DELETE_COLUMN = 'DELETE_COLUMN'
const DELETE_ROW = 'DELETE_ROW'
const UPDATE_COLUMN_SCORE = 'UPDATE_COLUMN_SCORE'
const UPDATE_ROW_SCORE = 'UPDATE_ROW_SCORE'

export const SUM_CELL = 'cell'
export const SUM_COL = 'col'
export const SUM_ROW = 'row'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  deleteColumn: makeActionCreator(DELETE_COLUMN, 'index'),
  deleteRow: makeActionCreator(DELETE_ROW, 'index'),
  updateColumnScore: makeActionCreator(UPDATE_COLUMN_SCORE, 'index', 'score'),
  updateRowScore: makeActionCreator(UPDATE_ROW_SCORE, 'index', 'score')
}

function decorate(item) {

  return item
}

function reduce(grid = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, grid, {
        random: false,
        penalty: 0,
        sumMode: SUM_CELL,
        cells: [
          makeDefaultCell(0,0)
        ],
        rows: 1,
        cols: 1,
        border: {
          color: '#000',
          width: 1
        },
        solutions: []
      }))
    }
    case UPDATE_PROP: {
      const newItem = cloneDeep(grid)
      switch (action.property) {
        case 'penalty': {
          newItem[action.property] = parseFloat(action.value)
          break
        }
        case 'rows': {
          const newRowIndex = action.value - 1
          if (action.value < grid.rows) {
            return deleteRow(newRowIndex, newItem)
          } else {
            newItem[action.property] = parseFloat(action.value)
            // add default cell content to each created cell
            for (let i = 0; i < grid.cols; i++) {
              newItem.cells.push(makeDefaultCell(i, newRowIndex))
            }
          }
          break
        }
        case 'cols': {
          const newColIndex = action.value - 1
          if (action.value < grid.cols) {
            // delete every col cells and corresponding solutions
            return deleteCol(newColIndex, newItem)
          } else {
            newItem[action.property] = parseFloat(action.value)
            // add default cell content to each created cell
            for (let i = 0; i < grid.rows; i++) {
              newItem.cells.push(makeDefaultCell(newColIndex, i))
            }
          }
          break
        }
        case 'sumMode': {
          if (action.value === SCORE_FIXED) {
            // @TODO set score from every solutions to 0 ? to score.success ?
            newItem.score.type = SCORE_FIXED
            // can not apply penalty in this case
            newItem.penalty = 0
          } else {
            newItem.score.type = SCORE_SUM
            newItem[action.property] = action.value
            // set default values for success and failure
            newItem.score.success = 1
            newItem.score.failure = 0
          }
          break
        }
        case 'scoreSuccess': {
          newItem.score.success = parseFloat(action.value)
          break
        }
        case 'scoreFailure': {
          newItem.score.failure = parseFloat(action.value)
          break
        }
        case 'shuffle': {
          newItem[action.property] = Boolean(action.value)
          break
        }
        case 'borderWidth': {
          newItem.border.width = parseFloat(action.value)
          break
        }
        case 'borderColor': {
          newItem.border.color = action.value
          break
        }
      }

      return newItem
    }
    case DELETE_COLUMN: {
      const newItem = cloneDeep(grid)
      return deleteCol(action.index, newItem)
    }
    case DELETE_ROW: {
      const newItem = cloneDeep(grid)
      return deleteRow(action.index, newItem)
    }
    case UPDATE_COLUMN_SCORE: {
      const newItem = cloneDeep(grid)
      const cellsToUpdate = utils.getCellsByCol(action.index, grid.cells)
      cellsToUpdate.forEach(cell => {
        cell.score = parseFloat(action.score)
      })
      return newItem
    }
    case UPDATE_ROW_SCORE: {
      const newItem = cloneDeep(grid)
      const cellsToUpdate = utils.getCellsByRow(action.index, grid.cells)
      cellsToUpdate.forEach(cell => {
        cell.score = parseFloat(action.score)
      })
      return newItem
    }
  }
  return grid
}

function deleteRow(rowIndex, grid){
  const cellsToDelete = utils.getCellsByRow(rowIndex.index, grid.cells)
  cellsToDelete.forEach(cell => {
    const cellIndex = grid.cells.findIndex(toRemove => toRemove.id === cell.id)
    grid.cells.splice(cellIndex, 1)
    // also remove associated solution if any
    const solutionIndex = grid.solutions.findIndex(solution => solution.cellId = cell.id)
    if (-1 !== solutionIndex) {
      grid.solutions.splice(solutionIndex, 1)
    }
  })
  // update y coordinates for all remaining cells
  grid.cells.forEach(cell => --cell.coordinates[1])
  --grid.rows
  return grid
}

function deleteCol(colIndex, grid){
  const cellsToDelete = utils.getCellsByCol(colIndex.index, grid.cells)
  cellsToDelete.forEach(cell => {
    const cellIndex = grid.cells.findIndex(toRemove => toRemove.id === cell.id)
    grid.cells.splice(cellIndex, 1)
    // also remove associated solution if any
    const solutionIndex = grid.solutions.findIndex(solution => solution.cellId = cell.id)
    if (-1 !== solutionIndex) {
      grid.solutions.splice(solutionIndex, 1)
    }
  })
  // update x coordinates for all remaining cells
  grid.cells.forEach(cell => --cell.coordinates[0])
  --grid.cols
  return grid
}

function validate(item) {
  const errors = {}


  return errors
}

function makeDefaultCell(x, y) {
  return {
    id: makeId(),
    data: '',
    coordinates: [x, y],
    background: '#fff',
    color: '#000',
    choices: []
  }
}




export default {
  component,
  reduce,
  decorate,
  validate
}
