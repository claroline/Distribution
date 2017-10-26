import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import moment from 'moment'

import {trans} from '#/main/core/translation'

import {ActivableSet} from '#/main/core/layout/form/components/fieldset/activable-set.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {NumberGroup}  from '#/main/core/layout/form/components/group/number-group.jsx'
import {RadioGroup} from '#/main/core/layout/form/components/group/radio-group.jsx'

import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'
import {Radios} from '#/main/core/layout/form/components/field/radios.jsx'

import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'

import {Criteria} from './criteria.jsx'
import {select} from '../../selectors'
import {actions} from '../actions'

const InstructionsSection = props =>
  <FormSections>
    <FormSection
      id="instructions-section"
      title={trans('instructions', {}, 'dropzone')}
    >
      <Textarea
        id="instruction"
        content={props.display.instruction || ''}
        onChange={value => props.updateDisplay('instruction', value)}
        minRows={3}
      />
    </FormSection>
  </FormSections>

InstructionsSection.propTypes = {
  display: T.shape({
    instruction: T.string
  }),
  updateDisplay: T.func.isRequired
}

const DocumentsSection = props =>
  <FormSections>
    <FormSection
      id="documents-section"
      title={trans('allowed_document_types', {}, 'dropzone')}
    >
      <p>{trans('allowed_document_types_info', {}, 'dropzone')}</p>
      <CheckGroup
        checkId="upload-enabled-chk"
        checked={props.parameters.uploadEnabled}
        label={trans('uploaded_files', {}, 'dropzone')}
        onChange={checked => props.updateParameters('uploadEnabled', checked)}
      />
      <CheckGroup
        checkId="rich-text-enabled-chk"
        checked={props.parameters.richTextEnabled}
        label={trans('rich_text_online_edition', {}, 'dropzone')}
        onChange={checked => props.updateParameters('richTextEnabled', checked)}
      />
      <CheckGroup
        checkId="workspace-resource-enabled-chk"
        checked={props.parameters.workspaceResourceEnabled}
        label={trans('workspace_resources', {}, 'dropzone')}
        onChange={checked => props.updateParameters('workspaceResourceEnabled', checked)}
      />
      <CheckGroup
        checkId="url-enabled-chk"
        checked={props.parameters.urlEnabled}
        label={trans('url_info', {}, 'dropzone')}
        onChange={checked => props.updateParameters('urlEnabled', checked)}
      />
    </FormSection>
  </FormSections>

DocumentsSection.propTypes = {
  parameters: T.shape({
    uploadEnabled: T.bool.isRequired,
    richTextEnabled: T.bool.isRequired,
    workspaceResourceEnabled: T.bool.isRequired,
    urlEnabled: T.bool.isRequired
  }),
  updateParameters: T.func.isRequired
}

const CorrectionSection = props =>
  <FormSections>
    <FormSection
      id="correction-section"
      title={trans('correction_type', {}, 'dropzone')}
    >
      <p>{trans('correction_type_info', {}, 'dropzone')}</p>
      <Radios
        groupName="peer-review"
        options={[
          {value: 'teacher', label: trans('teacher_correction_info', {}, 'dropzone')},
          {value: 'peer', label: trans('peer_correction_info', {}, 'dropzone')}
        ]}
        checkedValue={props.parameters.peerReview ? 'peer' : 'teacher'}
        onChange={value => {
          const peerReview = value === 'peer'
          props.updateParameters('peerReview', peerReview)

          if (peerReview) {
            props.updateParameters('criteriaEnabled', true)
          }
        }}
      />
      {props.parameters.peerReview &&
        <div>
          <NumberGroup
            controlId="expected-correction-total"
            label={trans('expected_correction_total_label', {}, 'dropzone')}
            value={props.parameters.expectedCorrectionTotal}
            min={1}
            onChange={value => props.updateParameters('expectedCorrectionTotal', parseInt(value))}
          />
          <CheckGroup
            checkId="display-notation-chk"
            checked={props.display.displayNotationToLearners}
            label={trans('display_corrections_to_learners', {}, 'dropzone')}
            onChange={checked => props.updateDisplay('displayNotationToLearners', checked)}
          />
          {props.display.displayNotationToLearners &&
            <CheckGroup
              checkId="correction-denial-chk"
              checked={props.parameters.correctionDenialEnabled}
              label={trans('correction_denial_label', {}, 'dropzone')}
              onChange={checked => props.updateParameters('correctionDenialEnabled', checked)}
            />
          }
        </div>
      }
    </FormSection>
  </FormSections>

CorrectionSection.propTypes = {
  parameters: T.shape({
    peerReview: T.bool.isRequired,
    expectedCorrectionTotal: T.number.isRequired,
    correctionDenialEnabled: T.bool.isRequired
  }),
  display: T.shape({
    displayNotationToLearners: T.bool.isRequired
  }),
  updateParameters: T.func.isRequired,
  updateDisplay: T.func.isRequired
}

const CriteriaSection = props =>
  <FormSections>
    <FormSection
      id="criteria-section"
      title={trans('evaluation_criteria', {}, 'dropzone')}
    >
      <p>{trans('criteria_info_1', {}, 'dropzone')}</p>
      <p>{trans('criteria_info_2', {}, 'dropzone')}</p>
      <p>{trans('criteria_info_3', {}, 'dropzone')}</p>
      <CheckGroup
        checkId="criteria-enabled-chk"
        checked={props.parameters.criteriaEnabled}
        label={trans('enable_evaluation_criteria', {}, 'dropzone')}
        disabled={props.parameters.peerReview}
        onChange={checked => props.updateParameters('criteriaEnabled', checked)}
      />
      {props.parameters.criteriaEnabled &&
        <div>
          <HtmlGroup
            controlId="correction-instruction"
            label={trans('correction_instruction', {}, 'dropzone')}
            content={props.display.correctionInstruction || ''}
            onChange={value => props.updateDisplay('correctionInstruction', value)}
            minRows={3}
          />
          <CheckGroup
            checkId="comment-in-correction-enabled-chk"
            checked={props.parameters.commentInCorrectionEnabled}
            label={trans('enable_comment', {}, 'dropzone')}
            onChange={checked => props.updateParameters('commentInCorrectionEnabled', checked)}
          />
          <CheckGroup
            checkId="comment-in-correction-forced-chk"
            checked={props.parameters.commentInCorrectionForced}
            label={trans('force_comment', {}, 'dropzone')}
            onChange={checked => props.updateParameters('commentInCorrectionForced', checked)}
          />
          <Criteria/>
        </div>
      }
    </FormSection>
  </FormSections>

CriteriaSection.propTypes = {
  parameters: T.shape({
    criteriaEnabled: T.bool.isRequired,
    commentInCorrectionEnabled: T.bool.isRequired,
    commentInCorrectionForced: T.bool.isRequired
  }),
  display: T.shape({
    correctionInstruction: T.string
  }),
  updateParameters: T.func.isRequired,
  updateDisplay: T.func.isRequired
}

const NotationSection = props =>
  <FormSections>
    <FormSection
      id="notation-section"
      title={trans('rating', {}, 'dropzone')}
    >
      <NumberGroup
        controlId="score-to-pass"
        label={trans('score_to_pass', {}, 'dropzone')}
        value={props.parameters.scoreToPass}
        min={0}
        onChange={value => props.updateParameters('scoreToPass', parseInt(value))}
      />
      <CheckGroup
        checkId="display-notation-to-learners-chk"
        checked={props.display.displayNotationToLearners}
        label={trans('display_notation_to_learners', {}, 'dropzone')}
        onChange={checked => props.updateDisplay('displayNotationToLearners', checked)}
      />
      <ActivableSet
        id="display-notation-message-to-learners"
        label={trans('display_notation_message_to_learners', {}, 'dropzone')}
        activated={props.display.displayNotationMessageToLearners}
        onChange={activated => props.updateDisplay('displayNotationMessageToLearners', activated)}
      >
        <HtmlGroup
          controlId="success-message"
          label={trans('success_message', {}, 'dropzone')}
          content={props.display.successMessage || ''}
          onChange={value => props.updateDisplay('successMessage', value)}
          minRows={3}
        />
        <HtmlGroup
          controlId="fail-message"
          label={trans('fail_message', {}, 'dropzone')}
          content={props.display.failMessage || ''}
          onChange={value => props.updateDisplay('failMessage', value)}
          minRows={3}
        />
      </ActivableSet>
    </FormSection>
  </FormSections>

NotationSection.propTypes = {
  parameters: T.shape({
    scoreToPass: T.number.isRequired
  }),
  display: T.shape({
    displayNotationToLearners: T.bool.isRequired,
    displayNotationMessageToLearners: T.bool.isRequired,
    successMessage: T.string,
    failMessage: T.string
  }),
  updateParameters: T.func.isRequired,
  updateDisplay: T.func.isRequired
}

const PlanningSection = props =>
  <FormSections>
    <FormSection
      id="planning-section"
      title={trans('planning', {}, 'dropzone')}
    >
      <p>{trans('planning_info_1', {}, 'dropzone')}</p>
      <p>{trans('planning_info_2', {}, 'dropzone')}</p>
      <Radios
        groupName="planning"
        options={[
          {value: 'manual', label: trans('manually', {}, 'dropzone')},
          {value: 'date', label: trans('by_dates', {}, 'dropzone')}
        ]}
        inline={true}
        checkedValue={props.parameters.manualPlanning ? 'manual' : 'date'}
        onChange={value => props.updateParameters('manualPlanning', value === 'manual')}
      />
      {props.parameters.manualPlanning &&
        <RadioGroup
          controlId="manual-state"
          label={trans('choose_current_manual_state', {}, 'dropzone')}
          options={[
            {value: 'notStarted', label: trans('manual_state_not_started', {}, 'dropzone')},
            {value: 'peerReview', label: trans('manual_state_peer_review', {}, 'dropzone')},
            {value: 'allowDrop', label: trans('manual_state_allow_drop', {}, 'dropzone')},
            {value: 'allowDropAndPeerReview', label: trans('manual_state_allow_drop_and_peer_review', {}, 'dropzone')},
            {value: 'finished', label: trans('manual_state_finished', {}, 'dropzone')}
          ]}
          inline={false}
          checkedValue={props.parameters.manualState}
          onChange={value => props.updateParameters('manualState', value)}
        />
      }
      {!props.parameters.manualPlanning &&
        <div>
          <div className="row dropzone-datetime-row">
            <div className="control-label col-md-3">
              <label>{trans('drop_start_date', {}, 'dropzone')}</label>
            </div>
            <div className="col-md-9">
              <Datetime
                closeOnSelect={true}
                dateFormat={true}
                timeFormat={true}
                locale="fr"
                utc={false}
                defaultValue={props.parameters.dropStartDate ?
                  moment(props.parameters.dropStartDate, 'YYYY-MM-DD\THH:mm') :
                  ''
                }
                onChange={date => {
                  const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
                  props.updateParameters('dropStartDate', stringDate)
                }}
              />
            </div>
          </div>
          <div className="row dropzone-datetime-row">
            <div className="control-label col-md-3">
              <label>{trans('drop_end_date', {}, 'dropzone')}</label>
            </div>
            <div className="col-md-9">
              <Datetime
                closeOnSelect={true}
                dateFormat={true}
                timeFormat={true}
                locale="fr"
                utc={false}
                defaultValue={props.parameters.dropEndDate ?
                  moment(props.parameters.dropEndDate, 'YYYY-MM-DD\THH:mm') :
                  ''
                }
                onChange={date => {
                  const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
                  props.updateParameters('dropEndDate', stringDate)
                }}
              />
            </div>
          </div>
          <CheckGroup
            checkId="auto-close-drops-at-drop-end-date"
            checked={props.parameters.autoCloseDropsAtDropEndDate}
            label={trans('auto_close_drops_at_drop_end_date', {}, 'dropzone')}
            onChange={checked => props.updateParameters('autoCloseDropsAtDropEndDate', checked)}
          />
          <div className="row dropzone-datetime-row">
            <div className="control-label col-md-3">
              <label>{trans('review_start_date', {}, 'dropzone')}</label>
            </div>
            <div className="col-md-9">
              <Datetime
                closeOnSelect={true}
                dateFormat={true}
                timeFormat={true}
                locale="fr"
                utc={false}
                defaultValue={props.parameters.reviewStartDate ?
                  moment(props.parameters.reviewStartDate, 'YYYY-MM-DD\THH:mm') :
                  ''
                }
                onChange={date => {
                  const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
                  props.updateParameters('reviewStartDate', stringDate)
                }}
              />
            </div>
          </div>
          <div className="row dropzone-datetime-row">
            <div className="control-label col-md-3">
              <label>{trans('review_end_date', {}, 'dropzone')}</label>
            </div>
            <div className="col-md-9">
              <Datetime
                closeOnSelect={true}
                dateFormat={true}
                timeFormat={true}
                locale="fr"
                utc={false}
                defaultValue={props.parameters.reviewEndDate ?
                  moment(props.parameters.reviewEndDate, 'YYYY-MM-DD\THH:mm') :
                  ''
                }
                onChange={date => {
                  const stringDate = typeof date === 'string' ? date : date.format('YYYY-MM-DD\THH:mm')
                  props.updateParameters('reviewEndDate', stringDate)
                }}
              />
            </div>
          </div>
        </div>
      }
    </FormSection>
  </FormSections>

PlanningSection.propTypes = {
  parameters: T.shape({
    manualPlanning: T.bool.isRequired,
    manualState: T.string.isRequired,
    autoCloseDropsAtDropEndDate: T.bool.isRequired,
    dropStartDate: T.string,
    dropEndDate: T.string,
    reviewStartDate: T.string,
    reviewEndDate: T.string
  }),
  updateParameters: T.func.isRequired
}

const DropzoneForm = props =>
  <form>
    <div className="panel panel-default">
      <fieldset className="panel-body">
        <p>{trans('common_info_1', {}, 'dropzone')}</p>
        <p>{trans('common_info_2', {}, 'dropzone')}</p>
        <p>{trans('common_info_3', {}, 'dropzone')}</p>
      </fieldset>
    </div>
    <InstructionsSection {...props}/>
    <DocumentsSection {...props}/>
    <CorrectionSection {...props}/>
    <CriteriaSection {...props}/>
    <NotationSection {...props}/>
    <PlanningSection {...props}/>
  </form>

DropzoneForm.propTypes = {
  parameters: T.object,
  display: T.object,
  notifications: T.object,
  updateParameters: T.func.isRequired,
  updateDisplay: T.func.isRequired,
  updateNotifications: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    parameters: select.formParametersData(state),
    display: select.formDisplayData(state),
    notifications: select.formNotificationsData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateParameters: (property, value) => dispatch(actions.updateParameters(property, value)),
    updateDisplay: (property, value) => dispatch(actions.updateDisplay(property, value)),
    updateNotifications: (property, value) => dispatch(actions.updateNotifications(property, value))
  }
}

const ConnectedDropzoneForm = connect(mapStateToProps, mapDispatchToProps)(DropzoneForm)

export {
  ConnectedDropzoneForm as DropzoneForm
}
