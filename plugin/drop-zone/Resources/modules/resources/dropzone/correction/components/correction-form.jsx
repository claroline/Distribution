import React from 'react'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'
import {NumberGroup}  from '#/main/core/layout/form/components/group/number-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {RadioGroup}  from '#/main/core/layout/form/components/group/radio-group.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

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
  criteria: T.arrayOf(T.shape({
    id: T.string.isRequired,
    instruction: T.string.isRequired
  })).isRequired,
  total: T.number.isRequired,
  grades: T.arrayOf(T.shape({
    id: T.string.isRequired,
    criterion: T.string.isRequired,
    value: T.number
  })),
  handleUpdate: T.func.isRequired
}

export const CorrectionForm = props =>
  <form>
    <div className="panel panel-default correction-form-panel">
      {props.dropzone.parameters.criteriaEnabled ?
        <CriteriaForm
          criteria={props.dropzone.criteria}
          total={props.dropzone.parameters.criteriaTotal}
          grades={props.correction.grades}
          handleUpdate={props.handleCriterionUpdate}
        /> :
        <NumberGroup
          controlId="score"
          label={trans('score', {}, 'dropzone')}
          value={props.correction.totalGrade !== null ? props.correction.totalGrade : undefined}
          onChange={value => props.handleUpdate('totalGrade', parseInt(value))}
        />
      }
      {props.dropzone.parameters.commentInCorrectionEnabled &&
        <HtmlGroup
          controlId="comment"
          label={trans('comment', {}, 'dropzone')}
          content={props.correction.comment || ''}
          onChange={value => props.handleUpdate('comment', value)}
          minRows={3}
        />
      }
      <div className="btn-group btn-group-right">
        <button
          className="btn btn-default"
          type="button"
          onClick={() => props.handleCancel()}
        >
          {t('cancel')}
        </button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => props.handleSave()}
        >
          {t('save')}
        </button>
      </div>
    </div>
  </form>

CorrectionForm.propTypes = {
  dropzone: T.object,
  correction: T.shape({
    id: T.string,
    drop: T.string,
    totalGrade: T.number,
    comment: T.string,
    grades: T.array
  }),
  handleUpdate: T.func.isRequired,
  handleCriterionUpdate: T.func.isRequired,
  handleSave: T.func.isRequired,
  handleCancel: T.func.isRequired
}