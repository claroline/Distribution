import React from 'react'
import {PropTypes as T} from 'prop-types'
import {t, trans} from '#/main/core/translation'
import {NumberGroup}  from '#/main/core/layout/form/components/group/number-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'

export const CorrectionForm = props =>
  <form>
    <div className="panel panel-default correction-form-panel">
      <NumberGroup
        controlId="score"
        label={trans('score', {}, 'dropzone')}
        value={props.correction.totalGrade !== null ? props.correction.totalGrade : undefined}
        onChange={value => props.handleUpdate('totalGrade', parseInt(value))}
      />
      <HtmlGroup
        controlId="comment"
        label={trans('comment', {}, 'dropzone')}
        content={props.correction.comment || ''}
        onChange={value => props.handleUpdate('comment', value)}
        minRows={3}
      />
      <div className="btn-group">
        <button
          className="btn btn-default"
          onClick={() => props.handleCancel()}
        >
          {t('cancel')}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => props.handleSave()}
        >
          {t('save')}
        </button>
      </div>
    </div>
  </form>

CorrectionForm.propTypes = {
  correction: T.shape({
    id: T.string,
    drop: T.string,
    totalGrade: T.number,
    comment: T.string
  }),
  handleUpdate: T.func.isRequired,
  handleSave: T.func.isRequired,
  handleCancel: T.func.isRequired
}