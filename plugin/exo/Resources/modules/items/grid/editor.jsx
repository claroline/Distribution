import React, {Component, PropTypes as T} from 'react'
import get from 'lodash/get'
import Popover from 'react-bootstrap/lib/Popover'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import {tex} from './../../utils/translate'
import {ErrorBlock} from './../../components/form/error-block.jsx'
import {Radios} from './../../components/form/radios.jsx'
import {SUM_CELL, SUM_COL, SUM_ROW, actions} from './editor'
import {SCORE_SUM, SCORE_FIXED} from './../../quiz/enums'
import {FormGroup} from './../../components/form/form-group.jsx'
import {TooltipButton} from './../../components/form/tooltip-button.jsx'
import {ColorPicker} from './../../components/form/color-picker.jsx'
import {Textarea} from './../../components/form/textarea.jsx'
import {utils} from './utils/utils'


class GridCell extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAnswerCell: false,
      showPopover: false,
      target: null
    }
  }

  render() {
    return (
      <div className="grid-cell">
        <div className="cell-header">
          <TooltipButton
            id={`cell-${this.props.cell.id}-delete-solution`}
            className="fa fa-trash"
            title={tex('delete')}
            position="top"
            enabled={this.state.isAnswerCell}
            onClick={() => {}}
          />
          <OverlayTrigger
            rootClose
            placement="top"
            overlay={
              <Popover id="popover-contained" title="Popover Top">
                <strong>Holy guacamole!</strong> Check this info.
              </Popover>
            }
            trigger={'click'}
          >
            <TooltipButton
              id={`cell-${this.props.cell.id}-edit-solution`}
              title={tex('grid_create_or_edit_solution')}
              className="fa fa-pencil"
              onClick={(e) =>
                this.setState({target: e.target, showPopover: !this.state.showPopover})
              }
            />
          </OverlayTrigger>
          <ColorPicker
            color={this.props.cell.color}
            onPick={color => this.props.onChange(
                actions.updateCellStyle('color', this.props.cell.id, color.hex)
            )}
          />
          <ColorPicker
          color={this.props.cell.background}
            onPick={color => this.props.onChange(
                actions.updateProperty('background', this.props.cell.id, color.hex)
            )}
          />
        </div>
        <div className="cell-body">
          {!this.isAnswerCell &&
            <Textarea
              onChange={() => {}}
              id={`${this.props.cell.id}-data`}
              content={this.props.cell.data}
            />
          }
          {this.isAnswerCell && this.props.cell.choices.length > 0 &&
            <div>render a dropdown</div>
          }
          {this.isAnswerCell && this.props.cell.choices.length === 0 &&
            <div>render an input text</div>
          }
        </div>
      </div>
    )
  }
}

GridCell.propTypes = {
  cell: T.object.isRequired,
  solutions: T.arrayOf(T.object).isRequired,
  onChange: T.func.isRequired
}

class Grid extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const borderStyle = {
      border: `${this.props.item.border.width}px solid ${this.props.item.border.color}`
    }

    return (
      <div className="grid-editor">
        {get(this.props.item, '_errors.item') &&
          <ErrorBlock text={this.props.item._errors.item} warnOnly={!this.props.validating}/>
        }
        {this.props.item.score.type === SCORE_SUM &&
          <div className="form-group">
            <label htmlFor="grid-penalty">{tex('editor_penalty_label')}</label>
            <input
              id="grid-penalty"
              className="form-control"
              value={this.props.item.penalty}
              type="number"
              min="0"
              onChange={e => this.props.onChange(
                 actions.updateProperty('penalty', e.target.value)
              )}
            />
          </div>
        }
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={this.props.item.random}
              onChange={e => this.props.onChange(
                actions.updateProperty('random', e.target.checked)
              )}
            />
          {tex('grid_shuffle_cells')}
          </label>
        </div>
        <hr/>
        <div className="form-group">
          <label htmlFor="grid-score-mode">{tex('grid_score_mode_label')}</label>
          <Radios
            id="grid-score-mode"
            groupName="scoreMode"
            options={[
              {value: SUM_CELL, label:tex('grid_score_sum_cell')},
              {value: SUM_COL, label:tex('grid_score_sum_col')},
              {value: SUM_ROW, label:tex('grid_score_sum_row')},
              {value: SCORE_FIXED, label:tex('fixed_score')}
            ]}
            checkedValue={this.props.item.score.type === SCORE_FIXED ? SCORE_FIXED : this.props.item.sumMode}
            onChange={value => this.props.onChange(
              actions.updateProperty('sumMode', value)
            )}
            inline={false}
          />
          {this.props.item.score.type === SCORE_FIXED &&
              <div className="sub-fields">
                <FormGroup
                  controlId={`item-${this.props.item.id}-fixedSuccess`}
                  label={tex('fixed_score_on_success')}
                  error={get(this.props.item, '_errors.score.success')}
                  warnOnly={!this.props.validating}
                >
                  <input
                    id={`item-${this.props.item.id}-fixedSuccess`}
                    type="number"
                    min="0"
                    value={this.props.item.score.success}
                    className="form-control"
                    onChange={e => this.props.onChange(
                      actions.updateProperty('scoreSuccess', e.target.value)
                    )}
                  />
                </FormGroup>
                <FormGroup
                  controlId={`item-${this.props.item.id}-fixedFailure`}
                  label={tex('fixed_score_on_failure')}
                  error={get(this.props.item, '_errors.score.failure')}
                  warnOnly={!this.props.validating}
                >
                  <input
                    id={`item-${this.props.item.id}-fixedFailure`}
                    type="number"
                    value={this.props.item.score.failure}
                    className="form-control"
                    onChange={e => this.props.onChange(
                      actions.updateProperty('scoreFailure', e.target.value)
                    )}
                  />
                </FormGroup>
              </div>
            }
        </div>
        <hr/>
        <div className="form-inline text-center table-options">
          <FormGroup
            controlId={`table-${this.props.item.id}-rows`}
            label={tex('grid_table_rows')}>
            <input
              id={`table-${this.props.item.id}-rows`}
              type="number"
              min="1"
              max="12"
              value={this.props.item.rows}
              className="form-control"
              onChange={e => this.props.onChange(
                actions.updateProperty('rows', e.target.value)
              )}
            />
          </FormGroup>
          <FormGroup
            controlId={`table-${this.props.item.id}-cols`}
            label={tex('grid_table_cols')}>
            <input
              id={`table-${this.props.item.id}-cols`}
              type="number"
              min="1"
              max="12"
              value={this.props.item.cols}
              className="form-control"
              onChange={e => this.props.onChange(
                actions.updateProperty('cols', e.target.value)
              )}
            />
          </FormGroup>
          <FormGroup
            controlId={`table-${this.props.item.id}-border-width`}
            label={tex('grid_table_border')}>
            <input
              id={`table-${this.props.item.id}-border-width`}
              type="number"
              min="0"
              max="3"
              value={this.props.item.border.width}
              className="form-control"
              onChange={e => this.props.onChange(
                actions.updateProperty('borderWidth', e.target.value)
              )}
            />
          </FormGroup>
          <ColorPicker color={this.props.item.border.color}
            onPick={color => this.props.onChange(
                actions.updateProperty('borderColor', color.hex)
            )}
          />
        </div>
        <div className="grid-body">
          <table className="grid-table">
            <tbody>
              { this.props.item.score.type === SCORE_SUM && this.props.item.sumMode === SUM_COL &&
                <tr>
                  {[...Array(this.props.item.cols)].map((x, i) =>
                    <td key={`grid-col-score-col-${i}`} style={{padding: '8px'}}>
                      <input
                        type="number"
                        min="0"
                        disabled={utils.atLeastOneSolutionInCol(i, this.props.item.cells, this.props.item.solutions)}
                        value={utils.getColScore(i, this.props.item.cells, this.props.item.solutions)}
                        className="form-control small-input"
                        onChange={e => this.props.onChange(
                          actions.updateColumnScore(i, e.target.value)
                        )}
                      />
                    </td>
                  )}
                </tr>
              }
              {[...Array(this.props.item.rows)].map((x, i) =>
                <tr key={`grid-row-${i}`}>
                  { this.props.item.score.type === SCORE_SUM && this.props.item.sumMode === SUM_ROW &&
                    <td key={`grid-row-score-col-${i}`} style={{padding: '8px'}}>
                      <input
                        type="number"
                        min="0"
                        disabled={!utils.atLeastOneSolutionInRow(i, this.props.item.cells, this.props.item.solutions)}
                        value={utils.getRowScore(i, this.props.item.cells, this.props.item.solutions)}
                        className="form-control small-input"
                        onChange={e => this.props.onChange(
                          actions.updateRowScore(i, e.target.value)
                        )}
                      />
                    </td>
                  }
                  {[...Array(this.props.item.cols)].map((x, j) =>
                    <td key={`grid-row-${i}-col-${j}`} style={borderStyle}>
                      <GridCell
                        cell={utils.getCellByCoordinates(j, i, this.props.item.cells)}
                        solutions={this.props.item.solutions}
                        onChange={this.props.onChange}
                      />
                    </td>
                  )}
                  <td>
                    <TooltipButton
                      id={`grid-btn-delete-row-${i}`}
                      className="fa fa-trash"
                      title={tex('delete')}
                      position="top"
                      enabled={this.props.item.rows > 1}
                      onClick={() => this.props.onChange(
                        actions.deleteRow(i)
                      )}
                    />
                  </td>
                </tr>
              )}
              <tr>
                { this.props.item.score.type === SCORE_SUM && this.props.item.sumMode === SUM_ROW &&
                  <td></td>
                }
                {[...Array(this.props.item.cols)].map((x, i) =>
                  <td key={`grid-btn-delete-col-${i}`}>
                    <TooltipButton
                      id={`grid-btn-delete-col-${i}`}
                      className="fa fa-trash"
                      title={tex('delete')}
                      position="top"
                      enabled={this.props.item.cols > 1}
                      onClick={() => this.props.onChange(
                        actions.deleteColumn(i)
                      )}
                    />
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

Grid.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    penalty: T.number.isRequired,
    random: T.bool.isRequired,
    sumMode: T.string,
    score: T.shape({
      type: T.string.isRequired,
      success: T.number.isRequired,
      failure: T.number.isRequired
    }),
    cells: T.arrayOf(T.shape({
      id: T.string.isRequired,
      data: T.string.isRequired,
      coordinates: T.arrayOf(T.number).isRequired,
      background: T.string.isRequired,
      color: T.string.isRequired,
      choices: T.arrayOf(T.string)
    })).isRequired,
    rows: T.number.isRequired,
    cols: T.number.isRequired,
    border:  T.shape({
      width: T.number.isRequired,
      color: T.string.isRequired
    }).isRequired,
    solutions: T.arrayOf(T.object).isRequired,
    _errors: T.object
  }).isRequired,
  validating: T.bool.isRequired,
  onChange: T.func.isRequired
}

export {Grid}
