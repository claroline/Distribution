import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {select} from '../../selectors'
import {actions} from '../actions'
import {generateCorrectionGrades} from '../../utils'

import {CorrectionForm} from './correction-form.jsx'

class CorrectionRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: generateCorrectionGrades(props.correction, props.dropzone),
      showForm: false
    }
    this.updateCorrection = this.updateCorrection.bind(this)
    this.updateCorrectionCriterion = this.updateCorrectionCriterion.bind(this)
    this.saveCorrection = this.saveCorrection.bind(this)
    this.cancelCorrection = this.cancelCorrection.bind(this)
  }

  updateCorrection(property, value) {
    const correction = Object.assign({}, this.state.correction, {[property]: value})
    this.setState({correction: correction})
  }

  updateCorrectionCriterion(criterionId, value) {
    const grades = cloneDeep(this.state.correction.grades)
    const index = grades.findIndex(g => g.criterion === criterionId)

    if (index > -1) {
      const grade = Object.assign({}, grades[index], {value: value})
      grades[index] = grade
    }
    const correction = Object.assign({}, this.state.correction, {grades: grades})

    this.setState({correction: correction})
  }

  saveCorrection() {
    this.props.saveCorrection(this.state.correction)
    this.setState({showForm: false})
  }

  cancelCorrection() {
    this.setState({correction: this.props.correction, showForm: false})
  }

  deleteCorrection(correctionId) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_correction', {}, 'dropzone'),
      question: trans('delete_correction_confirm_message', {}, 'dropzone'),
      handleConfirm: () => this.props.deleteCorrection(correctionId)
    })
  }

  render() {
    return (this.state.showForm ?
      <tr className="correction-row correction-form-row">
        <td colSpan="7">
          <CorrectionForm
            correction={this.state.correction}
            dropzone={this.props.dropzone}
            handleUpdate={this.updateCorrection}
            handleCriterionUpdate={this.updateCorrectionCriterion}
            handleSave={this.saveCorrection}
            handleCancel={this.cancelCorrection}
          />
        </td>
      </tr> :
      <tr className="correction-row">
        <td>
          {this.props.correction.correctionDenied &&
            <span className="fa fa-w fa-exclamation-triangle"/>
          }
        </td>
        <td>
          {`${this.props.correction.user.firstName} ${this.props.correction.user.lastName}`}
        </td>
        <td>{this.props.correction.startDate}</td>
        <td>{this.props.correction.endDate}</td>
        <td>{this.props.dropzone.parameters.criteriaEnabled ? 'criteria sum' : this.props.correction.totalGrade}</td>
        <td>
          <div className="btn-group">
            {this.props.correction.finished &&
              <button
                className="btn btn-default btn-sm"
                onClick={() => this.props.switchCorrectionValidation(this.props.correction.id)}
              >
                {this.props.correction.valid ? trans('invalidate_correction', {}, 'dropzone') : trans('revalidate_correction', {}, 'dropzone')}
              </button>
            }
            <button
              className="btn btn-default btn-sm"
              onClick={() => this.setState({showForm: true})}
            >
              {t('edit')}
            </button>
            {!this.props.correction.finished &&
              <button
                className="btn btn-default btn-sm"
                onClick={() => this.props.submitCorrection(this.props.correction.id)}
              >
                {trans('submit_correction', {}, 'dropzone')}
              </button>
            }
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.deleteCorrection(this.props.correction.id)}
            >
              {t('delete')}
            </button>
          </div>
        </td>
      </tr>
    )
  }
}

CorrectionRow.propTypes = {
  correction: T.shape({
    id: T.string.isRequired,
    drop: T.string.isRequired,
    user: T.shape({
      firstName: T.string.isRequired,
      lastName: T.string.isRequired
    }).isRequired,
    startDate: T.string.isRequired,
    endDate: T.string,
    totalGrade: T.string,
    finished: T.bool.isRequired,
    valid: T.bool.isRequired
  }).isRequired,
  dropzone: T.object,
  saveCorrection: T.func.isRequired,
  submitCorrection: T.func.isRequired,
  switchCorrectionValidation: T.func.isRequired,
  deleteCorrection: T.func.isRequired,
  showModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveCorrection: (correction) => dispatch(actions.saveCorrection(correction)),
    submitCorrection: (correctionId) => dispatch(actions.submitCorrection(correctionId)),
    switchCorrectionValidation: (correctionId) => dispatch(actions.switchCorrectionValidation(correctionId)),
    deleteCorrection: (correctionId) => dispatch(actions.deleteCorrection(correctionId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedCorrectionRow = connect(mapStateToProps, mapDispatchToProps)(CorrectionRow)

export {ConnectedCorrectionRow as CorrectionRow}