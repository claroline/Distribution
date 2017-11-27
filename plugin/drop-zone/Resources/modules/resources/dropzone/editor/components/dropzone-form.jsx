import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import get from 'lodash/get'
import moment from 'moment'

import {t, trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/layout/resource/selectors'
import {ActivableSet} from '#/main/core/layout/form/components/fieldset/activable-set.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {NumberGroup}  from '#/main/core/layout/form/components/group/number-group.jsx'
import {RadioGroup} from '#/main/core/layout/form/components/group/radio-group.jsx'
import {DatetimeGroup} from '#/main/core/layout/form/components/group/datetime-group.jsx'

import {DropzoneType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {constants} from '#/plugin/drop-zone/resources/dropzone/constants'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/editor/actions'
import {Criteria} from '#/plugin/drop-zone/resources/dropzone/editor/components/criteria.jsx'

const InstructionsSection = props =>
  <FormSection
    id="instructions-section"
    title={trans('instructions', {}, 'dropzone')}
    {...props}
  >
    <HtmlGroup
      controlId="instruction"
      label={trans('instruction', {}, 'dropzone')}
      content={props.formData.display.instruction || ''}
      onChange={value => props.updateForm('display.instruction', value)}
      minRows={3}
      hideLabel={true}
      warnOnly={!props.validating}
      error={get(props.errors, 'instruction')}
    />
  </FormSection>

InstructionsSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  updateForm: T.func.isRequired
}

const DocumentsSection = props =>
  <FormSection
    id="documents-section"
    title={trans('allowed_document_types', {}, 'dropzone')}
    {...props}
  >
    <p>{trans('allowed_document_types_info', {}, 'dropzone')}</p>
    <CheckGroup
      checkId="upload-enabled-chk"
      checked={props.formData.parameters.uploadEnabled}
      label={trans('uploaded_files', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.uploadEnabled', checked)}
    />
    <CheckGroup
      checkId="rich-text-enabled-chk"
      checked={props.formData.parameters.richTextEnabled}
      label={trans('rich_text_online_edition', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.richTextEnabled', checked)}
    />
    <CheckGroup
      checkId="workspace-resource-enabled-chk"
      checked={props.formData.parameters.workspaceResourceEnabled}
      label={trans('workspace_resources', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.workspaceResourceEnabled', checked)}
    />
    <CheckGroup
      checkId="url-enabled-chk"
      checked={props.formData.parameters.urlEnabled}
      label={trans('url_info', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.urlEnabled', checked)}
    />
  </FormSection>

DocumentsSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  updateForm: T.func.isRequired
}

const DropCorrectionSection = props =>
  <FormSection
    id="drop-correction-section"
    title={trans('drop_and_correction_type', {}, 'dropzone')}
    {...props}
  >
    <RadioGroup
      controlId="drop-type"
      label={trans('drop_type', {}, 'dropzone')}
      options={[
        {value: 0, label: trans('drop_type_user', {}, 'dropzone')},
        {value: 1, label: trans('drop_type_team', {}, 'dropzone')}
      ]}
      checkedValue={props.formData.parameters.dropType}
      onChange={value => props.updateForm('parameters.dropType', parseInt(value))}
    />
    <RadioGroup
      controlId="peer-review"
      label={trans('correction_type_info', {}, 'dropzone')}
      options={[
        {value: 'teacher', label: trans('teacher_correction_info', {}, 'dropzone')},
        {value: 'peer', label: trans('peer_correction_info', {}, 'dropzone')}
      ]}
      checkedValue={props.formData.parameters.peerReview ? 'peer' : 'teacher'}
      onChange={value => {
        const peerReview = value === 'peer'
        props.updateForm('parameters.peerReview', peerReview)

        if (peerReview) {
          props.updateForm('parameters.criteriaEnabled', true)
        }
      }}
    />
    {props.formData.parameters.peerReview &&
      <div>
        <NumberGroup
          controlId="expected-correction-total"
          label={trans('expected_correction_total_label', {}, 'dropzone')}
          value={props.formData.parameters.expectedCorrectionTotal}
          min={1}
          onChange={value => props.updateForm('parameters.expectedCorrectionTotal', parseInt(value))}
        />
        <CheckGroup
          checkId="display-notation-chk"
          checked={props.formData.display.displayCorrectionsToLearners}
          label={trans('display_corrections_to_learners', {}, 'dropzone')}
          onChange={checked => props.updateForm('display.displayCorrectionsToLearners', checked)}
        />
        {props.formData.display.displayCorrectionsToLearners &&
          <CheckGroup
            checkId="correction-denial-chk"
            checked={props.formData.parameters.correctionDenialEnabled}
            label={trans('correction_denial_label', {}, 'dropzone')}
            onChange={checked => props.updateForm('parameters.correctionDenialEnabled', checked)}
          />
        }
      </div>
    }
  </FormSection>

DropCorrectionSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  updateForm: T.func.isRequired
}

const CriteriaSection = props =>
  <FormSection
    id="criteria-section"
    title={trans('evaluation_criteria', {}, 'dropzone')}
    {...props}
  >
    <p>{trans('criteria_info_1', {}, 'dropzone')}</p>
    <p>{trans('criteria_info_2', {}, 'dropzone')}</p>
    <p>{trans('criteria_info_3', {}, 'dropzone')}</p>
    <CheckGroup
      checkId="comment-in-correction-enabled-chk"
      checked={props.formData.parameters.commentInCorrectionEnabled}
      label={trans('enable_comment', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.commentInCorrectionEnabled', checked)}
    />
    <CheckGroup
      checkId="comment-in-correction-forced-chk"
      checked={props.formData.parameters.commentInCorrectionForced}
      label={trans('force_comment', {}, 'dropzone')}
      onChange={checked => props.updateForm('parameters.commentInCorrectionForced', checked)}
    />
    <CheckGroup
      className="criteria-enabled-chk"
      checkId="criteria-enabled-chk"
      checked={props.formData.parameters.criteriaEnabled}
      label={trans('enable_evaluation_criteria', {}, 'dropzone')}
      disabled={props.formData.parameters.peerReview}
      onChange={checked => props.updateForm('parameters.criteriaEnabled', checked)}
      help={get(props.errors, 'criteriaEnabled')}
    />
    {props.formData.parameters.criteriaEnabled &&
      <div>
        <HtmlGroup
          controlId="correction-instruction"
          label={trans('correction_instruction', {}, 'dropzone')}
          content={props.formData.display.correctionInstruction || ''}
          onChange={value => props.updateForm('display.correctionInstruction', value)}
          minRows={3}
        />
        <NumberGroup
          controlId="criteria-total"
          label={trans('criteria_scale', {}, 'dropzone')}
          value={props.formData.parameters.criteriaTotal}
          min={2}
          onChange={value => props.updateForm('parameters.criteriaTotal', parseInt(value))}
          warnOnly={!props.validating}
          error={get(props.errors, 'criteriaTotal')}
        />
        <Criteria/>
      </div>
    }
  </FormSection>

CriteriaSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  updateForm: T.func.isRequired
}

const NotationSection = props =>
  <FormSection
    id="notation-section"
    title={trans('rating', {}, 'dropzone')}
    {...props}
  >
    <NumberGroup
      controlId="score-max"
      label={trans('score_max', {}, 'dropzone')}
      value={props.formData.parameters.scoreMax}
      min={0}
      onChange={value => props.updateForm('parameters.scoreMax', parseInt(value))}
      warnOnly={!props.validating}
      error={get(props.errors, 'scoreMax')}
    />
    <NumberGroup
      controlId="score-to-pass"
      label={trans('score_to_pass', {}, 'dropzone')}
      value={props.formData.parameters.scoreToPass}
      min={0}
      onChange={value => props.updateForm('parameters.scoreToPass', parseInt(value))}
      warnOnly={!props.validating}
      error={get(props.errors, 'scoreToPass')}
    />
    <CheckGroup
      checkId="display-notation-to-learners-chk"
      checked={props.formData.display.displayNotationToLearners}
      label={trans('display_notation_to_learners', {}, 'dropzone')}
      onChange={checked => props.updateForm('display.displayNotationToLearners', checked)}
    />
    <ActivableSet
      id="display-notation-message-to-learners"
      label={trans('display_notation_message_to_learners', {}, 'dropzone')}
      activated={props.formData.display.displayNotationMessageToLearners}
      onChange={activated => props.updateForm('display.displayNotationMessageToLearners', activated)}
    >
      <HtmlGroup
        controlId="success-message"
        label={trans('success_message', {}, 'dropzone')}
        content={props.formData.display.successMessage || ''}
        onChange={value => props.updateForm('display.successMessage', value)}
        minRows={3}
      />
      <HtmlGroup
        controlId="fail-message"
        label={trans('fail_message', {}, 'dropzone')}
        content={props.formData.display.failMessage || ''}
        onChange={value => props.updateForm('display.failMessage', value)}
        minRows={3}
      />
    </ActivableSet>
  </FormSection>

NotationSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  updateForm: T.func.isRequired
}

const PlanningSection = props =>
  <FormSection
    id="planning-section"
    title={trans('planning', {}, 'dropzone')}
    {...props}
  >
    <p>{trans('planning_info_1', {}, 'dropzone')}</p>
    <p>{trans('planning_info_2', {}, 'dropzone')}</p>
    <RadioGroup
      controlId="planning"
      label={trans('planning_type_label', {}, 'dropzone')}
      options={[
        {value: 'manual', label: trans('manually', {}, 'dropzone')},
        {value: 'date', label: trans('by_dates', {}, 'dropzone')}
      ]}
      inline={true}
      checkedValue={props.formData.parameters.manualPlanning ? 'manual' : 'date'}
      onChange={value => props.updateForm('parameters.manualPlanning', value === 'manual')}
    />
    {props.formData.parameters.manualPlanning &&
      <RadioGroup
        controlId="manual-state"
        label={trans('choose_current_state', {}, 'dropzone')}
        options={props.formData.parameters.peerReview ? constants.PEER_PLANNING_STATES : constants.TEACHER_PLANNING_STATES}
        inline={false}
        checkedValue={props.formData.parameters.manualState}
        onChange={value => props.updateForm('parameters.manualState', value)}
      />
    }
    {!props.formData.parameters.manualPlanning &&
      <div>
        <DatetimeGroup
          controlId="drop-start-date"
          label={trans('drop_start_date', {}, 'dropzone')}
          defaultValue={props.formData.parameters.dropStartDate ? moment(props.formData.parameters.dropStartDate, 'YYYY-MM-DD\THH:mm') : ''}
          onChange={date => {
            const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
            props.updateForm('parameters.dropStartDate', stringDate)
          }}
          warnOnly={!props.validating}
          error={get(props.errors, 'dropStartDate')}
        />
        <DatetimeGroup
          controlId="drop-end-date"
          label={trans('drop_end_date', {}, 'dropzone')}
          defaultValue={props.formData.parameters.dropEndDate ? moment(props.formData.parameters.dropEndDate, 'YYYY-MM-DD\THH:mm') : ''}
          onChange={date => {
            const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
            props.updateForm('parameters.dropEndDate', stringDate)
          }}
          warnOnly={!props.validating}
          error={get(props.errors, 'dropEndDate')}
        />
        <CheckGroup
          checkId="auto-close-drops-at-drop-end-date"
          checked={props.formData.parameters.autoCloseDropsAtDropEndDate}
          label={trans('auto_close_drops_at_drop_end_date', {}, 'dropzone')}
          onChange={checked => props.updateForm('parameters.autoCloseDropsAtDropEndDate', checked)}
        />
        <DatetimeGroup
          controlId="review-start-date"
          label={trans('review_start_date', {}, 'dropzone')}
          defaultValue={props.formData.parameters.reviewStartDate ? moment(props.formData.parameters.reviewStartDate, 'YYYY-MM-DD\THH:mm') : ''}
          onChange={date => {
            const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
            props.updateForm('parameters.reviewStartDate', stringDate)
          }}
          warnOnly={!props.validating}
          error={get(props.errors, 'reviewStartDate')}
        />
        <DatetimeGroup
          controlId="review-end-date"
          label={trans('review_end_date', {}, 'dropzone')}
          defaultValue={props.formData.parameters.reviewEndDate ? moment(props.formData.parameters.reviewEndDate, 'YYYY-MM-DD\THH:mm') : ''}
          onChange={date => {
            const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
            props.updateForm('parameters.reviewEndDate', stringDate)
          }}
          warnOnly={!props.validating}
          error={get(props.errors, 'reviewEndDate')}
        />
      </div>
    }
  </FormSection>

PlanningSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  updateForm: T.func.isRequired
}

const NotificationsSection = props =>
  <FormSection
    id="notification-section"
    title={t('notifications')}
    {...props}
  >
    <CheckGroup
      checkId="drop-notification-chk"
      checked={props.formData.notifications.enabled}
      label={trans('notify_managers_on_drop', {}, 'dropzone')}
      onChange={checked => props.updateNotifications('drop', checked)}
    />
  </FormSection>

NotificationsSection.propTypes = {
  formData: T.shape(DropzoneType.propTypes),
  updateNotifications: T.func.isRequired
}

const DropzoneForm = props => props.canEdit ?
  <form>
    <div className="panel panel-default">
      <fieldset className="panel-body">
        <p>{trans('common_info_1', {}, 'dropzone')}</p>
        <p>{trans('common_info_2', {}, 'dropzone')}</p>
        <p>{trans('common_info_3', {}, 'dropzone')}</p>
      </fieldset>
    </div>
    <FormSections defaultOpened="instructions-section">
      <InstructionsSection {...props}/>
      <DocumentsSection {...props}/>
      <DropCorrectionSection {...props}/>
      <CriteriaSection {...props}/>
      <NotationSection {...props}/>
      <PlanningSection {...props}/>
      <NotificationsSection {...props}/>
    </FormSections>
  </form> :
  <div className="alert alert-danger">
    {t('unauthorized')}
  </div>

DropzoneForm.propTypes = {
  canEdit: T.bool.isRequired,
  formData: T.shape(DropzoneType.propTypes),
  errors: T.object,
  validating: T.bool,
  updateForm: T.func.isRequired,
  updateNotifications: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    canEdit: resourceSelect.editable(state),
    formData: select.formData(state),
    errors: select.formErrors(state),
    validating: select.formValidating(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateForm: (property, value) => dispatch(actions.updateForm(property, value)),
    updateNotifications: (property, value) => dispatch(actions.updateNotifications(property, value))
  }
}

const ConnectedDropzoneForm = connect(mapStateToProps, mapDispatchToProps)(DropzoneForm)

export {
  ConnectedDropzoneForm as DropzoneForm
}
