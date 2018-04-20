import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {currentUser} from '#/main/core/user/current'
import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {select} from '#/plugin/claco-form/resources/claco-form/selectors'
import {
  Field as FieldType,
  Entry as EntryType,
  EntryUser as EntryUserType
} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

const authenticatedUser = currentUser()

function getSections(fields, clacoFormId, entry, isManager, displayMetadata, isShared, isNew, titleLabel) {
  const sectionFields = [
    {
      name: 'title',
      type: 'string',
      label: titleLabel ? titleLabel : trans('title'),
      required: true
    }
  ]
  fields.forEach(f => {
    const params = {
      name: `values.${f.id}`,
      type: f.type,
      label: f.label,
      required: f.required,
      help: f.help,
      displayed: isNew ||
        isShared ||
        displayMetadata === 'all' ||
        (displayMetadata === 'manager' && isManager) ||
        !f.restrictions.isMetadata ||
        (entry.user && entry.user.id === authenticatedUser.id),
      disabled: !isManager && ((isNew && f.restrictions.locked && !f.restrictions.lockedEditionOnly) || (!isNew && f.restrictions.locked))
    }

    if (f.type === 'file') {
      params['options'] = {
        uploadUrl: ['apiv2_clacoformentry_file_upload', {clacoForm: clacoFormId}]
      }
    }
    sectionFields.push(params)
  })
  const sections = [
    {
      id: 'general',
      title: trans('general'),
      primary: true,
      fields: sectionFields
    }
  ]

  return sections
}

const EntryFormComponent = props =>
  <div>
    <FormContainer
      level={3}
      name="entries.current"
      sections={getSections(
        props.fields,
        props.clacoFormId,
        props.entry,
        props.isManager,
        props.displayMetadata,
        props.entryUser && props.entryUser.id ? props.entryUser.shared : false,
        props.isNew,
        props.titleLabel
      )}
    />
    <button
      className="btn btn-primary"
      onClick={() => props.saveForm(props.entry, props.isNew)}
    >
      {trans('save')}
    </button>
  </div>

EntryFormComponent.propTypes = {
  clacoFormId: T.string.isRequired,
  fields: T.arrayOf(T.shape(FieldType.propTypes)).isRequired,
  titleLabel: T.string,
  displayMetadata: T.string.isRequired,
  isNew: T.bool.isRequired,
  isManager: T.bool.isRequired,
  entry: T.shape(EntryType.propTypes),
  entryUser: T.shape(EntryUserType.propTypes),
  saveForm: T.func.isRequired
}

const EntryForm = connect(
  state => ({
    clacoFormId: select.clacoForm(state).id,
    fields: select.visibleFields(state),
    titleLabel: select.getParam(state, 'title_field_label'),
    displayMetadata: select.getParam(state, 'display_metadata'),
    isManager: select.isCurrentEntryManager(state),
    isNew: formSelect.isNew(formSelect.form(state, 'entries.current')),
    entry: formSelect.data(formSelect.form(state, 'entries.current')),
    entryUser: select.entryUser(state),
  }),
  (dispatch) => ({
    saveForm(entry, isNew) {
      if (isNew) {
        dispatch(formActions.saveForm('entries.current', ['apiv2_clacoformentry_create']))
      } else {
        dispatch(formActions.saveForm('entries.current', ['apiv2_clacoformentry_update', {id: entry.id}]))
      }
    }
  })
)(EntryFormComponent)

export {
  EntryForm
}