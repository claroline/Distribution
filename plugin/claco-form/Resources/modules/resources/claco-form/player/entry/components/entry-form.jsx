import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

import {select} from '#/plugin/claco-form/resources/claco-form/selectors'
import {Field as FieldType} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

function getSections(fields, clacoFormId) {
  const sectionFields = [
    {
      name: 'title',
      type: 'string',
      label: trans('title'),
      required: true
    }
  ]
  fields.forEach(f => {
    const params = {
      name: `values.${f.id}`,
      type: f.type,
      label: f.label,
      required: f.required,
      help: f.help
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
      sections={getSections(props.fields, props.clacoFormId)}
    />
    <button
      className="btn btn-primary"
      onClick={() => props.saveForm(props.entry, props.new)}
    >
      {trans('save')}
    </button>
  </div>

EntryFormComponent.propTypes = {
  clacoFormId: T.string.isRequired,
  fields: T.arrayOf(T.shape(FieldType.propTypes)).isRequired,
  new: T.bool.isRequired,
  entry: T.object,
  saveForm: T.func.isRequired
}

const EntryForm = connect(
  state => ({
    clacoFormId: select.clacoForm(state).id,
    fields: select.visibleFields(state),
    new: formSelect.isNew(formSelect.form(state, 'entries.current')),
    entry: formSelect.data(formSelect.form(state, 'entries.current'))
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