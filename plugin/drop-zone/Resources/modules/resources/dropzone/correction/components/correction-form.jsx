import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

import {t, trans} from '#/main/core/translation'
import {NumberGroup}  from '#/main/core/layout/form/components/group/number-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {RadioGroup}  from '#/main/core/layout/form/components/group/radio-group.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {DropzoneType, CorrectionType, GradeType, CriterionType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {validate, isValid} from '#/plugin/drop-zone/resources/dropzone/correction/validator'

const CriteriaForm = props =>
  <div id="criteria-form">
    {props.criteria.length > 0 ?
      <table className="table">
        <tbody>
        {props.criteria.map(c =>
          <tr key={`criterion-form-${c.id}`}>
            <td>
              <HtmlText>
                {c.instruction}
              </HtmlText>
            </td>
            <td className="criterion-scale-form-row">
              <RadioGroup
                controlId={`criterion-form-${c.id}-radio`}
                label="criterion_form_radio"
                options={[...Array(props.total).keys()].map((idx) => {
                  return {
                    label: '',
                    value: idx
                  }
                })}
                inline={true}
                hideLabel={true}
                checkedValue={props.grades.find(g => g.criterion === c.id).value}
                onChange={value => props.handleUpdate(c.id, parseInt(value))}
              />
            </td>
          </tr>
        )}
        </tbody>
      </table> :
      <div className="alert alert-warning">
        {trans('no_criterion', {}, 'dropzone')}
      </div>
    }
  </div>

CriteriaForm.propTypes = {
  criteria: T.arrayOf(T.shape(CriterionType.propTypes)).isRequired,
  total: T.number.isRequired,
  grades: T.arrayOf(T.shape(GradeType.propTypes)),
  handleUpdate: T.func.isRequired
}

export class CorrectionForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correction: props.correction,
      pendingChanges: false,
      errors: {}
    }
    this.updateCorrectionCriterion = this.updateCorrectionCriterion.bind(this)
  }

  updateCorrection(property, value) {
    const correction = Object.assign({}, this.state.correction, {[property]: value})
    this.setState({correction: correction, pendingChanges: true})
  }

  updateCorrectionCriterion(criterionId, value) {
    const grades = cloneDeep(this.state.correction.grades)
    const index = grades.findIndex(g => g.criterion === criterionId)

    if (index > -1) {
      const grade = Object.assign({}, grades[index], {value: value})
      grades[index] = grade
    }
    const correction = Object.assign({}, this.state.correction, {grades: grades})

    this.setState({correction: correction, pendingChanges: true})
  }

  validateCorrection() {
    const errors = validate(this.state.correction, this.props.dropzone)
    this.setState({errors: errors}, () => this.saveCorrection())
  }

  saveCorrection() {
    if (isValid(this.state.correction, this.props.dropzone)) {
      this.props.saveCorrection(this.state.correction)
      this.setState({pendingChanges: false})
    }
  }

  render() {
    return (
      <form>
        <div className="panel panel-default correction-form-panel">
          {this.props.dropzone.parameters.criteriaEnabled ?
            <CriteriaForm
              criteria={this.props.dropzone.criteria}
              total={this.props.dropzone.parameters.criteriaTotal}
              grades={this.state.correction.grades}
              handleUpdate={this.updateCorrectionCriterion}
            /> :
            <NumberGroup
              controlId="score"
              label={t('score')}
              value={this.state.correction.score !== null ? this.state.correction.score : undefined}
              onChange={value => this.updateCorrection('score', parseInt(value))}
              error={get(this.state.errors, 'score')}
            />
          }
          {this.props.dropzone.parameters.commentInCorrectionEnabled &&
            <HtmlGroup
              controlId="comment"
              label={t('comment')}
              content={this.state.correction.comment || ''}
              onChange={value => this.updateCorrection('comment', value)}
              minRows={3}
              error={get(this.state.errors, 'comment')}
            />
          }
          <div className="btn-group btn-group-right">
            <button
              className="btn btn-default"
              type="button"
              onClick={() => this.props.cancelCorrection()}
            >
              {t('cancel')}
            </button>
            {this.props.showSubmitButton && this.props.correction.startDate !== this.props.correction.lastOpenDate &&
              <button
                className="btn btn-default"
                type="button"
                disabled={this.state.pendingChanges ||
                (this.props.dropzone.parameters.commentInCorrectionEnabled &&
                  this.props.dropzone.parameters.commentInCorrectionForced &&
                  !this.state.correction.comment)
                }
                onClick={() => this.props.submitCorrection(this.props.correction.id)}
              >
                {trans('submit_correction', {}, 'dropzone')}
              </button>
            }
            <button
              className="btn btn-primary"
              type="button"
              disabled={this.props.dropzone.parameters.commentInCorrectionEnabled &&
                this.props.dropzone.parameters.commentInCorrectionForced &&
                !this.state.correction.comment
              }
              onClick={() => this.validateCorrection()}
            >
              {t('save')}
            </button>
          </div>
        </div>
      </form>
    )
  }
}

CorrectionForm.propTypes = {
  dropzone: T.shape(DropzoneType.propTypes),
  correction: T.shape(CorrectionType.propTypes),
  showSubmitButton: T.bool.isRequired,
  saveCorrection: T.func.isRequired,
  submitCorrection: T.func.isRequired,
  cancelCorrection: T.func.isRequired
}

CorrectionForm.defaultProps = {
  showSubmitButton: false,
  submitCorrection: () => {}
}