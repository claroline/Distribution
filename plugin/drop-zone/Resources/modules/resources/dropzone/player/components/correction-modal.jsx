import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {PropTypes as T} from 'prop-types'
import Modal from 'react-bootstrap/lib/Modal'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {t, trans} from '#/main/core/translation'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {RadioGroup}  from '#/main/core/layout/form/components/group/radio-group.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

export const MODAL_CORRECTION = 'MODAL_CORRECTION'

class DenialBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: props.correction,
      showForm: false
    }
  }

  updateCorrectionDeniedComment(value) {
    const correction = Object.assign({}, this.state.correction, {correctionDeniedComment: value})
    this.setState({correction: correction})
  }

  cancelDeniedComment() {
    this.setState({correction: this.props.correction, showForm: false})
  }

  saveDeniedComment() {
    const correction = Object.assign({}, this.state.correction, {correctionDenied: true})
    this.setState(
      {correction: correction, showForm: false},
      () => this.props.saveCorrection(this.state.correction)
    )
  }

  render() {
    return (
      <div id="denial-box">
        {this.state.correction.correctionDenied &&
          <HtmlText>
            {this.state.correction.correctionDeniedComment}
          </HtmlText>
        }
        {!this.state.correction.correctionDenied && !this.state.showForm &&
          <button
            className="btn btn-danger"
            onClick={() => this.setState({showForm: true})}
          >
            {trans('deny_correction', {}, 'dropzone')}
          </button>
        }
        {!this.state.correction.correctionDenied && this.state.showForm &&
          <div>
            <HtmlGroup
              controlId="correction-denied-comment"
              label={trans('correction_denied_comment_label', {}, 'dropzone')}
              content={this.state.correction.correctionDeniedComment || ''}
              onChange={value => this.updateCorrectionDeniedComment(value)}
              minRows={3}
            />
            <div className="btn-group btn-group-right">
              <button
                className="btn btn-default"
                onClick={() => this.cancelDeniedComment()}
              >
                {t('cancel')}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => this.saveDeniedComment()}
              >
                {t('save')}
              </button>
            </div>
          </div>
        }
      </div>
    )
  }
}

DenialBox.propTypes = {
  saveCorrection: T.func.isRequired,
  fadeModal: T.func.isRequired
}

export class CorrectionModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: props.correction
    }
  }

  render() {
    return (
      <BaseModal {...this.props}>
        <Modal.Body>
          {this.props.dropzone.parameters.criteriaEnabled && this.props.dropzone.criteria.length > 0 &&
            <table className="table">
              <tbody>
                {this.props.dropzone.criteria.map(c =>
                  <tr key={`correction-criterion-${c.id}`}>
                    <td>
                      <HtmlText>
                        {c.instruction}
                      </HtmlText>
                    </td>
                    <td className="criterion-scale-form-row">
                      <RadioGroup
                        controlId={`correction-criterion-${c.id}-radio`}
                        label="correction_criterion_radio"
                        options={[...Array(this.props.dropzone.parameters.criteriaTotal).keys()].map((idx) => {
                          return {
                            label: '',
                            value: idx
                          }
                        })}
                        disabled={true}
                        inline={true}
                        hideLabel={true}
                        checkedValue={this.props.correction.grades.find(g => g.criterion === c.id).value}
                        onChange={() => {}}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          }
          {this.props.correction.comment &&
            <div>
              <h3>{t('comment')}</h3>
              <HtmlText className="correction-comment">
                {this.props.correction.comment}
              </HtmlText>
            </div>
          }
          {this.props.dropzone.parameters.correctionDenialEnabled &&
            <DenialBox {...this.props}/>
          }
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-default"
            onClick={this.props.fadeModal}
          >
            {t('close')}
          </button>
        </Modal.Footer>
      </BaseModal>
    )
  }
}

CorrectionModal.propTypes = {
  fadeModal: T.func.isRequired
}
