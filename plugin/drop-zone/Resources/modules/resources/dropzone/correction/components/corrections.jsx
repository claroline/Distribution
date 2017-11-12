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
      correction: generateCorrectionGrades(props.correction, props.dropzone)
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
    this.props.closeForm(this.props.correction.id)
  }

  cancelCorrection() {
    this.setState({correction: this.props.correction})
    this.props.closeForm(this.props.correction.id)
  }

  render() {
    return (this.props.editionMode ?
      <tr className="correction-row correction-form-row">
        <td colSpan="6">
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
          {`${this.props.correction.user.firstName} ${this.props.correction.user.lastName}`}
        </td>
        <td>{this.props.correction.startDate}</td>
        <td>{this.props.correction.endDate}</td>
        <td>{this.props.dropzone.parameters.criteriaEnabled ? 'criteria sum' : this.props.correction.totalGrade}</td>
        <td>
          <div className="btn-group">
            <button
              className="btn btn-default btn-sm"
              onClick={() => this.props.showForm(this.props.correction.id)}
            >
              {t('edit')}
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => this.props.deleteCorrection(this.props.correction.id)}
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
    totalGrade: T.string
  }).isRequired,
  dropzone: T.object,
  editionMode: T.bool.isRequired,
  showForm: T.func.isRequired,
  closeForm: T.func.isRequired
}

class Corrections extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correctionForms: {}
    }
    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.deleteCorrection = this.deleteCorrection.bind(this)
  }

  showForm(correctionId) {
    const correctionForms = Object.assign({}, this.state.correctionForms, {[correctionId]: true})
    this.setState({correctionForms: correctionForms})
  }

  closeForm(correctionId) {
    const correctionForms = Object.assign({}, this.state.correctionForms, {[correctionId]: false})
    this.setState({correctionForms: correctionForms})
  }

  deleteCorrection(correctionId) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_correction', {}, 'dropzone'),
      question: trans('delete_correction_confirm_message', {}, 'dropzone'),
      handleConfirm: () => this.props.deleteCorrection(correctionId)
    })
  }

  render() {
    return (
      <table className="table corrections-table">
        <thead>
          <tr>
            <th>{trans('corrector', {}, 'dropzone')}</th>
            <th>{trans('start_date', {}, 'dropzone')}</th>
            <th>{trans('end_date', {}, 'dropzone')}</th>
            <th>{trans('score', {}, 'dropzone')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
        {this.props.corrections.map(c =>
          <CorrectionRow
            key={`correction-row-${c.id}`}
            correction={c}
            dropzone={this.props.dropzone}
            editionMode={!!this.state.correctionForms[c.id]}
            showForm={this.showForm}
            closeForm={this.closeForm}
            saveCorrection={this.props.saveCorrection}
            deleteCorrection={this.deleteCorrection}
          />
        )}
        </tbody>
      </table>
    )
  }
}

Corrections.propTypes = {
  corrections: T.array,
  dropzone: T.object,
  saveCorrection: T.func.isRequired,
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
    deleteCorrection: (correctionId) => dispatch(actions.deleteCorrection(correctionId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedCorrections = connect(mapStateToProps, mapDispatchToProps)(Corrections)

export {ConnectedCorrections as Corrections}