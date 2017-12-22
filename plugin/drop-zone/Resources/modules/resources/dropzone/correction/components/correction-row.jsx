import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {t, trans} from '#/main/core/translation'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {DropzoneType, CorrectionType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {generateCorrectionGrades} from '#/plugin/drop-zone/resources/dropzone/utils'
import {actions} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {CorrectionForm} from '#/plugin/drop-zone/resources/dropzone/correction/components/correction-form.jsx'

class CorrectionRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: generateCorrectionGrades(props.correction, props.dropzone),
      showForm: false
    }
    this.saveCorrection = this.saveCorrection.bind(this)
    this.cancelCorrection = this.cancelCorrection.bind(this)
  }

  saveCorrection(correction) {
    this.props.saveCorrection(correction)
    this.setState({correction: correction, showForm: false})
  }

  showCorrectionEditionForm() {
    this.setState(
      {correction: generateCorrectionGrades(this.props.correction, this.props.dropzone)},
      () => this.setState({showForm: true})
    )
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
            saveCorrection={this.saveCorrection}
            cancelCorrection={this.cancelCorrection}
          />
        </td>
      </tr> :
      <tr className="correction-row">
        <td>
          {this.props.correction.correctionDenied &&
            <span className="fa fa-fw fa-exclamation-triangle"/>
          }
        </td>
        <td>
          <a
            className="pointer-hand"
            onClick={() => {
              this.props.showModal(
                'MODAL_CORRECTION',
                {
                  title: trans(
                    'correction_from',
                    {name: `${this.props.correction.teamName ? `[${this.props.correction.teamName}] ` : ''}
                      ${this.props.correction.user.firstName} ${this.props.correction.user.lastName}
                    `},
                    'dropzone'
                  ),
                  correction: this.props.correction,
                  dropzone: this.props.dropzone
                }
              )
            }}
          >
            {this.props.correction.teamName ? `[${this.props.correction.teamName}] ` : ''}
            {`${this.props.correction.user.firstName} ${this.props.correction.user.lastName}`}
          </a>
        </td>
        <td>{this.props.correction.startDate}</td>
        <td>{this.props.correction.endDate}</td>
        <td>{this.props.correction.score} / {this.props.dropzone.parameters.scoreMax}</td>
        <td>
          <div className="btn-group">
            {this.props.correction.finished &&
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={() => this.props.switchCorrectionValidation(this.props.correction.id)}
              >
                {this.props.correction.valid ? trans('invalidate_correction', {}, 'dropzone') : trans('revalidate_correction', {}, 'dropzone')}
              </button>
            }
            {!this.props.correction.finished &&
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={() => this.showCorrectionEditionForm()}
              >
                {t('edit')}
              </button>
            }
            {!this.props.correction.finished && this.props.correction.startDate !== this.props.correction.lastEditionDate &&
              <button
                className="btn btn-default btn-sm"
                type="button"
                onClick={() => this.props.submitCorrection(this.props.correction.id)}
              >
                {trans('submit_correction', {}, 'dropzone')}
              </button>
            }
            <button
              className="btn btn-danger btn-sm"
              type="button"
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
  correction: T.shape(CorrectionType.propTypes).isRequired,
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
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