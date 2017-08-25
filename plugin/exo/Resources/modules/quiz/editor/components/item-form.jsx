import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {t, tex} from '#/main/core/translation'
import {HINT_ADD, HINT_CHANGE, HINT_REMOVE} from './../actions'
import {FormGroup} from '#/main/core/layout/form/components/form-group.jsx'
import {Textarea} from '#/main/core/layout/form/components/textarea.jsx'
import {SubSection} from '#/main/core/layout/form/components/sub-section.jsx'
import {TooltipButton} from './../../../components/form/tooltip-button.jsx'
import ObjectsEditor from './item-objects-editor.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/check-group.jsx'

// TODO: add categories, define-as-model

const Metadata = props =>
  <div>
    <FormGroup
      controlId={`item-${props.item.id}-title`}
      label={t('title')}
    >
      <input
        id={`item-${props.item.id}-title`}
        type="text"
        value={props.item.title || ''}
        className="form-control"
        onChange={e => props.onChange('title', e.target.value)}
      />
    </FormGroup>
    <FormGroup
      controlId={`item-${props.item.id}-description`}
      label={t('description')}
    >
      <Textarea
        id={`item-${props.item.id}-description`}
        content={props.item.description || ''}
        onChange={text => props.onChange('description', text)}
      />
    </FormGroup>
    {props.item.rights.edit &&
      <CheckGroup
        checkId={`item-${props.item.id}-editable`}
        label={tex('protect_update')}
        checked={props.item.meta.protectQuestion}
        onChange={checked => props.onChange('meta.protectQuestion', checked)}
      />
    }
    <CheckGroup
      checkId={`item-${props.item.id}-mandatory`}
      label={props.mandatoryQuestions ? tex('make_optional'): tex('mandatory_answer')}
      checked={props.item.meta.mandatory}
      onChange={checked => props.onChange('meta.mandatory', checked)}
    />
    <FormGroup
      controlId={`item-${props.item.id}-objects`}
      label={tex('question_objects')}
    >
      <ObjectsEditor
        showModal={props.showModal}
        closeModal={props.closeModal}
        validating={props.validating}
        item={props.item}
      />
    </FormGroup>
  </div>

Metadata.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    rights: T.object.isRequired,
    meta: T.shape({
      mandatory: T.bool.isRequired,
      protectQuestion: T.bool.isRequired
    }).isRequired
  }).isRequired,
  mandatoryQuestions: T.bool.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  onChange: T.func.isRequired,
  validating: T.bool.isRequired
}

const Hint = props =>
  <div className="hint-item">
    <div className="hint-value">
      <Textarea
        id={`hint-${props.id}`}
        title={tex('hint')}
        content={props.value}
        onChange={value => props.onChange(HINT_CHANGE, {id: props.id, value})}
      />
    </div>
    <input
      id={`hint-${props.id}-penalty`}
      title={tex('penalty')}
      type="number"
      min="0"
      value={props.penalty}
      className="form-control hint-penalty"
      aria-label={tex('penalty')}
      onChange={e => props.onChange(
        HINT_CHANGE,
        {id: props.id, penalty: e.target.value}
      )}
    />
    <TooltipButton
      id={`hint-${props.id}-delete`}
      title={t('delete')}
      label={<span className="fa fa-fw fa-trash-o"/>}
      className="btn-link-default"
      onClick={props.onRemove}
    />
  </div>

Hint.propTypes = {
  id: T.string.isRequired,
  value: T.string.isRequired,
  penalty: T.number.isRequired,
  onChange: T.func.isRequired,
  onRemove: T.func.isRequired
}

const Hints = props =>
  <div className="hint-items">
    <label className="control-label" htmlFor="hint-list">
      {tex('hints')}
    </label>

    {props.hints.length === 0 &&
      <div className="no-hint-info">{tex('no_hint_info')}</div>
    }

    {props.hints.length !== 0 &&
      <ul id="hint-list">
        {props.hints.map(hint =>
          <li key={hint.id}>
            <Hint
              {...hint}
              onChange={props.onChange}
              onRemove={() => props.onChange(HINT_REMOVE, {id: hint.id})}
            />
          </li>
        )}
      </ul>
    }

    <button
      type="button"
      className="btn btn-block btn-default"
      onClick={() => props.onChange(HINT_ADD, {})}
    >
      <span className="fa fa-fw fa-plus"/>
      {tex('add_hint')}
    </button>
  </div>

Hints.propTypes = {
  hints: T.arrayOf(T.shape({
    id: T.string.isRequired
  })).isRequired,
  onChange: T.func.isRequired
}

const ItemForm = props =>
  <form>
    <FormGroup
      controlId={`item-${props.item.id}-content`}
      label={tex('question')}
      warnOnly={!props.validating}
      error={get(props.item, '_errors.content')}
    >
      <Textarea
        id={`item-${props.item.id}-content`}
        content={props.item.content}
        onChange={content => props.onChange('content', content)}
      />
    </FormGroup>

    <SubSection
      showText={tex('show_metadata_fields')}
      hideText={tex('hide_metadata_fields')}
    >
      <Metadata
        mandatoryQuestions={props.mandatoryQuestions}
        item={props.item}
        showModal={props.showModal}
        closeModal={props.closeModal}
        onChange={props.onChange}
        validating={props.validating}
      />
    </SubSection>

    <hr className="item-content-separator" />

    {props.children}

    <hr className="item-content-separator" />

    <SubSection
      showText={tex('show_interact_fields')}
      hideText={tex('hide_interact_fields')}
    >
      <Hints
        hints={props.item.hints}
        onChange={props.onHintsChange}
      />

      <hr className="item-content-separator" />

      <FormGroup
        controlId={`item-${props.item.id}-feedback`}
        label={tex('feedback')}
      >
        <Textarea
          id={`item-${props.item.id}-feedback`}
          content={props.item.feedback}
          onChange={text => props.onChange('feedback', text)}
        />
      </FormGroup>
    </SubSection>
  </form>

ItemForm.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    content: T.string.isRequired,
    hints: T.arrayOf(T.object).isRequired,
    feedback: T.string.isRequired,
    _errors: T.object
  }).isRequired,
  mandatoryQuestions: T.bool.isRequired,
  children: T.element.isRequired,
  validating: T.bool.isRequired,
  showModal: T.func.isRequired,
  closeModal: T.func.isRequired,
  onChange: T.func.isRequired,
  onHintsChange: T.func.isRequired
}

export {
  ItemForm
}
