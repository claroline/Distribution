import React, {Component} from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import get from 'lodash/get'
import classes from 'classnames'

import {FormData} from '#/main/app/content/form/containers/data'
import {ItemEditor as ItemEditorTypes} from '#/plugin/exo/items/prop-types'
import {SUM_CELL, SUM_COL, SUM_ROW} from '#/plugin/exo/items/grid/editor'
import {SCORE_SUM, SCORE_FIXED} from '#/plugin/exo/quiz/enums'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ColorPicker} from '#/main/core/layout/form/components/field/color-picker'

import {utils} from '#/plugin/exo/items/grid/utils/utils'
import {resizeArea} from '#/plugin/exo/items/graphic/resize'
import {makeId} from '#/plugin/exo/utils/utils'
import {asset} from '#/main/app/config/asset'
import {trans} from '#/main/app/intl/translation'
import {GridItem as GridItemTypes} from '#/plugin/exo/items/grid/prop-types'

const GridCellPopover = props =>
  <KeywordsPopover
    id={props.id}
    className="cell-popover"
    style={props.style}
    title={trans('grid_edit_cell', {}, 'quiz')}
    keywords={props.solution.answers}
    _errors={props._errors}
    validating={props.validating}
    showCaseSensitive={true}
    showScore={props.hasScore}
    _multiple={props._multiple}
    close={props.closeSolution}
    remove={props.removeSolution}
    onChange={props.update}
    addKeyword={props.addSolutionAnswer}
    removeKeyword={props.removeSolutionAnswer}
    updateKeyword={props.updateSolutionAnswer}
  />

GridCellPopover.propTypes = {
  id: T.string.isRequired,
  solution: T.shape({
    answers: T.array
  }),
  hasScore: T.bool.isRequired,
  _multiple: T.bool.isRequired,
  validating: T.bool.isRequired,
  _errors: T.shape({
    keywords: T.object
  }),
  style: T.object,
  update: T.func.isRequired,
  removeSolution: T.func.isRequired,
  closeSolution: T.func.isRequired,
  addSolutionAnswer: T.func.isRequired,
  updateSolutionAnswer: T.func.isRequired,
  removeSolutionAnswer: T.func.isRequired
}

/**
 * Cell editor.
 * NB : we use a class component because we use `refs` which are not available in functional components.
 */
class GridCell extends Component {
  render() {
    return (
      <td
        className="grid-cell"
        style={{
          color: this.props.cell.color,
          border: `${this.props.border.width}px solid ${this.props.border.color}`,
          backgroundColor: this.props.cell.background
        }}
      >
        <div className="cell-header">
          <div className="cell-actions">
            <ColorPicker
              id={`cell-${this.props.cell.id}-font`}
              className="btn-link-default"
              value={this.props.cell.color}
              onChange={color => this.props.update('color', color)}
              forFontColor={true}
            />

            <ColorPicker
              id={`cell-${this.props.cell.id}-bg`}
              className="btn-link-default"
              value={this.props.cell.background}
              onChange={color => this.props.update('background', color)}
            />
          </div>

          <div className='cell-actions' ref={element => this.refCellHeader = element}>
            {this.props.solution &&
              <Overlay
                container={this.refCellHeader}
                placement="bottom"
                show={this.props.solutionOpened}
                rootClose={isEmpty(this.props._errors)}
                target={this.refPopover}
                onHide={this.props.closeSolution}
              >
                <GridCellPopover
                  id={`cell-${this.props.cell.id}-popover`}
                  solution={this.props.solution}
                  hasScore={this.props.hasScore}
                  validating={this.props.validating}
                  _multiple={this.props.cell._multiple}
                  _errors={this.props._errors}
                  update={this.props.update}
                  removeSolution={this.props.removeSolution}
                  closeSolution={this.props.closeSolution}
                  addSolutionAnswer={this.props.addSolutionAnswer}
                  updateSolutionAnswer={this.props.updateSolutionAnswer}
                  removeSolutionAnswer={this.props.removeSolutionAnswer}
                />
              </Overlay>
            }

            <Button
              ref={element => this.refPopover = element}
              id={`cell-${this.props.cell.id}-solution`}
              className="btn-link"
              type={CALLBACK_BUTTON}
              icon={classes('fa fa-fw', {
                'fa-pencil': undefined !== this.props.solution,
                'fa-plus': undefined === this.props.solution
              })}
              label={undefined !== this.props.solution ? trans('grid_edit_solution', {}, 'quiz') : trans('grid_create_solution', {}, 'quiz')}
              callback={
                undefined !== this.props.solution ? this.props.openSolution : this.props.createSolution
              }
              tooltip="top"
            />

            {undefined !== this.props.solution &&
              <Button
                id={`cell-${this.props.cell.id}-delete-solution`}
                className="btn-link"
                type={CALLBACK_BUTTON}
                icon="fa fa-fw fa-trash-o"
                label={trans('delete', {}, 'actions')}
                callback={this.props.removeSolution}
                tooltip="top"
              />
            }
          </div>
        </div>

        {this.props.solution === undefined &&
          <textarea
            id={`${this.props.cell.id}-data`}
            className="cell-input form-control"
            style={{
              color: this.props.cell.color
            }}
            value={this.props.cell.data}
            onChange={(e) => this.props.update('data', e.target.value)}
          />
        }

        {this.props.solution !== undefined && this.props.cell.choices.length > 0 &&
          <div className="cell-dropdown dropdown">
            <button
              type="button"
              id={`choice-drop-down-${this.props.cell.id}`}
              className="btn dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="true"
              style={{
                color: this.props.cell.color
              }}
            >
              {trans('grid_choice_select_empty'), {}, 'quiz'}&nbsp;
              <span className="caret" />
            </button>
            <ul className="dropdown-menu" aria-labelledby={`choice-drop-down-${this.props.cell.id}`}>
              {this.props.cell.choices.map((choice, index) =>
                <li key={`choice-${index}`}>{choice}</li>
              )}
            </ul>
          </div>
        }

        {this.props.solution !== undefined && this.props.cell.choices.length === 0 &&
          <textarea
            className="cell-input form-control"
            id={`${this.props.cell.id}-data`}
            placeholder={utils.getBestAnswer(this.props.solution.answers)}
            style={{
              color: this.props.cell.color
            }}
          />
        }
      </td>
    )
  }
}

GridCell.propTypes = {
  border: T.shape({
    width: T.number.isRequired,
    color: T.string.isRequired
  }).isRequired,
  cell: T.shape({
    id: T.string.isRequired,
    _multiple: T.bool.isRequired,
    data: T.string.isRequired,
    background: T.string.isRequired,
    color: T.string.isRequired,
    choices: T.arrayOf(T.string),
    input: T.bool.isRequired
  }).isRequired,
  solution: T.shape({
    answers: T.array.isRequired
  }),
  hasScore: T.bool.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object,
  solutionOpened: T.bool.isRequired,
  update: T.func.isRequired,
  createSolution: T.func.isRequired,
  removeSolution: T.func.isRequired,
  openSolution: T.func.isRequired,
  closeSolution: T.func.isRequired,
  addSolutionAnswer: T.func.isRequired,
  updateSolutionAnswer: T.func.isRequired,
  removeSolutionAnswer: T.func.isRequired
}

const GridRow = props =>
  <tr>
    {props.cells.map(cell =>
      <GridCell
        key={`grid-cell-${cell.id}`}
        cell={cell}
        border={props.border}
        solution={utils.getSolutionByCellId(cell.id, props.solutions)}
        hasScore={props.score.type === SCORE_SUM && props.sumMode === SUM_CELL}
        _errors={get(props, '_errors.'+cell.id)}
        validating={props.validating}
        solutionOpened={props._popover === cell.id}
        update={(property, newValue) => props.updateCell(cell.id, property, newValue)}
        createSolution={() => props.createCellSolution(cell.id)}
        removeSolution={() => props.removeCellSolution(cell.id)}
        openSolution={() => props.openPopover(cell.id)}
        closeSolution={props.closePopover}
        addSolutionAnswer={() => props.addSolutionAnswer(cell.id)}
        updateSolutionAnswer={(keywordId, parameter, value) => props.updateSolutionAnswer(cell.id, keywordId, parameter, value)}
        removeSolutionAnswer={(keywordId) => props.removeSolutionAnswer(cell.id, keywordId)}
      />
    )}

    <td className="row-controls">
      {props.score.type === SCORE_SUM && props.sumMode === SUM_ROW &&
        <input
          type="number"
          min="0"
          step="0.5"
          disabled={!utils.atLeastOneSolutionInRow(props.index, props.cells, props.solutions)}
          value={utils.getRowScore(props.cells, props.solutions)}
          className="form-control grid-score"
          onChange={e => props.updateScore(e.target.value)}
        />
      }

      <Button
        id={`grid-btn-delete-row-${props.index}`}
        className="btn-link"
        type={CALLBACK_BUTTON}
        icon="fa fa-fw fa-trash-o"
        label={trans('delete', {}, 'actions')}
        disabled={!props.deletable}
        callback={props.removeRow}
        tooltip="top"
      />
    </td>
  </tr>

GridRow.propTypes = {
  index: T.number.isRequired,
  cells: T.arrayOf(T.shape({
    id: T.string.isRequired
  })).isRequired,
  solutions: T.arrayOf(T.object).isRequired,
  sumMode: T.string,
  score: T.shape({
    type: T.string.isRequired
  }).isRequired,
  border: T.shape({
    width: T.number.isRequired,
    color: T.string.isRequired
  }).isRequired,
  deletable: T.bool.isRequired,
  validating: T.bool.isRequired,
  _errors: T.object,
  _popover: T.string,
  removeRow: T.func.isRequired,
  updateScore: T.func.isRequired,
  updateCell: T.func.isRequired,
  createCellSolution: T.func.isRequired,
  removeCellSolution: T.func.isRequired,
  openPopover: T.func.isRequired,
  closePopover: T.func.isRequired,
  addSolutionAnswer: T.func.isRequired,
  updateSolutionAnswer: T.func.isRequired,
  removeSolutionAnswer: T.func.isRequired
}

const GridTable = props =>
  <table className="grid-table">
    <tbody>
      {[...Array(props.item.rows)].map((it, rowIndex) =>
        <GridRow
          key={`grid-row-${rowIndex}`}
          index={rowIndex}
          cells={utils.getCellsByRow(rowIndex, props.item.cells)}
          solutions={props.item.solutions}
          border={props.item.border}
          score={props.item.score}
          sumMode={props.item.sumMode}
          deletable={props.item.rows > 1}
          validating={props.validating}
          _errors={props.item._errors}
          _popover={props.item._popover}
          removeRow={() => props.removeRow(rowIndex)}
          updateScore={(newScore) => props.onChange(
            actions.updateRowScore(rowIndex, newScore)
          )}
          updateCell={(cellId, property, newValue) => props.onChange(
            actions.updateCell(cellId, property, newValue)
          )}
          createCellSolution={(cellId) => props.onChange(
            actions.createCellSolution(cellId)
          )}
          removeCellSolution={(cellId) => props.onChange(
            actions.deleteCellSolution(cellId)
          )}
          addSolutionAnswer={(cellId) => props.onChange(
            actions.addSolutionAnswer(cellId)
          )}
          updateSolutionAnswer={(cellId, keyword, parameter, value) => props.onChange(
            actions.updateSolutionAnswer(cellId, keyword, parameter, value)
          )}
          removeSolutionAnswer={(cellId, keyword) => props.onChange(
            actions.removeSolutionAnswer(cellId, keyword)
          )}
          openPopover={props.openPopover}
          closePopover={props.closePopover}
        />
      )}

      <tr>
        {[...Array(props.item.cols)].map((it, colIndex) =>
          <td key={`grid-col-${colIndex}-controls`} className="col-controls">
            {props.item.score.type === SCORE_SUM && props.item.sumMode === SUM_COL &&
              <input
                type="number"
                min="0"
                step="0.5"
                disabled={!utils.atLeastOneSolutionInCol(colIndex, props.item.cells, props.item.solutions)}
                value={utils.getColScore(colIndex, props.item.cells, props.item.solutions)}
                className="form-control grid-score"
                onChange={e => props.onChange(
                  actions.updateColumnScore(colIndex, e.target.value)
                )}
              />
            }

            <Button
              id={`grid-btn-delete-col-${colIndex}`}
              className="btn-link"
              type={CALLBACK_BUTTON}
              icon="fa fa-fw fa-trash-o"
              label={trans('delete', {}, 'actions')}
              disabled={props.item.cols <= 1}
              callback={() => props.removeColumn(colIndex)}
              tooltip="top"
            />
          </td>
        )}
        <td />
      </tr>
    </tbody>
  </table>

GridTable.propTypes = {
  item: T.shape({
    sumMode: T.string,
    score: T.shape({
      type: T.string.isRequired
    }).isRequired,
    cells: T.array.isRequired,
    rows: T.number.isRequired,
    cols: T.number.isRequired,
    border:  T.object.isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    _errors: T.object,
    _popover: T.string
  }).isRequired,
  validating: T.bool.isRequired,
  removeRow: T.func.isRequired,
  removeColumn: T.func.isRequired,
  openPopover: T.func.isRequired,
  closePopover: T.func.isRequired,
  onChange: T.func.isRequired
}

export const GridEditor = (props) =>
  <FormData
    className="grid-editor"
    embedded={true}
    name={props.formName}
    dataPart={props.path}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            //y a un truc avec sumMode ici
            type: 'choice',
            label: trans('grid_score_mode_label', {}, 'quiz'),
            name: 'score.type',
            options: {
              multiple: false,
              condensed: false,
              choices: {
                [SUM_CELL]: trans('grid_score_sum_cell', {}, 'quiz'),
                [SUM_COL]: trans('grid_score_sum_col', {}, 'quiz'),
                [SUM_ROW]: trans('grid_score_sum_row', {}, 'quiz'),
                [SCORE_FIXED]: trans('fixed_score', {}, 'quiz')
              }
            }
          },
          {
            type: 'number',
            name: 'penalty',
            label: trans('grid_editor_penalty_label', {}, 'quiz')
            //,displayed: (data) => props.score.type === SCORE_SUM
          },
          {
            type: 'number',
            name: 'score.success',
            label: trans('fixed_score_on_success', {}, 'quiz')
            //,displayed: (data) => props.score.type === SCORE_FIXED
          },
          {
            type: 'number',
            name: 'score.success',
            label: trans('fixed_score_on_failure', {}, 'quiz')
            //,displayed: (data) => props.score.type === SCORE_FIXED
          },
          {
            type: 'number',
            name: 'rows',
            label: trans('grid_table_rows', {}, 'quiz')
          },
          {
            type: 'number',
            name: 'cols',
            label: trans('grid_table_cols', {}, 'quiz')
          },
          {
            name: 'border.color',
            type: 'color',
            label: trans('grid_table_border', {}, 'quiz')
          },
          {
            name: 'border.width',
            type: 'number',
            label: trans('grid_table_border', {}, 'quiz')
          },
          {
            name: 'grid',
            required: true,
            render: (item, errors) =>
              <div className="grid-body">
                <GridTable
                  item={props.item}
                  validating={props.validating}
                  onChange={props.onChange}
                  removeRow={(row) => props.onChange(
                    actions.deleteRow(row)
                  )}
                  removeColumn={(col) => props.onChange(
                    actions.deleteColumn(col)
                  )}
                  openPopover={(cellId) => props.onChange(
                    actions.openCellPopover(cellId)
                  )}
                  closePopover={() => props.onChange(
                    actions.closeCellPopover()
                  )}
                />
              </div>
          }
        ]
      }
    ]}
  />

implementPropTypes(GridEditor, ItemEditorTypes, {
  item: T.shape(GridItemTypes.propTypes).isRequired
})
