import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {withRouter} from '#/main/core/router'
import {currentUser} from '#/main/core/user/current'
import {trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'

import {select} from '#/plugin/claco-form/resources/claco-form/selectors'
import {
  Field as FieldType,
  Entry as EntryType,
  EntryUser as EntryUserType
} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'
import {EntryFormData} from '#/plugin/claco-form/resources/claco-form/player/entry/components/entry-form-data.jsx'

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
    >
      {(props.canEdit || props.isManager || props.isKeywordsEnabled) &&
        <FormSections level={3}>
          {(props.canEdit || props.isManager) &&
            <FormSection
              id="entry-categories"
              className="embedded-list-section"
              icon="fa fa-fw fa-table"
              title={trans('categories')}
            >
              <EntryFormData
                data={props.entry.categories}
                choices={props.categories}
                onAdd={(category) => props.addCategory(category)}
                onRemove={(category) => props.removeCategory(category.id)}
              />
            </FormSection>
          }
          {props.isKeywordsEnabled &&
            <FormSection
              id="entry-keywords"
              className="embedded-list-section"
              icon="fa fa-fw fa-font"
              title={trans('keywords', {}, 'clacoform')}
            >
              <EntryFormData
                data={props.entry.keywords}
                choices={props.keywords}
                allowNew={props.isNewKeywordsEnabled}
                onAdd={(keyword) => props.addKeyword(keyword)}
                onRemove={(keyword) => props.removeKeyword(keyword.id)}
              />
            </FormSection>
          }
        </FormSections>
      }
    </FormContainer>
    <button
      className="btn btn-primary"
      onClick={() => props.saveForm(props.entry, props.isNew, props.history.push)}
    >
      {trans('save')}
    </button>
  </div>

EntryFormComponent.propTypes = {
  canEdit: T.bool.isRequired,
  clacoFormId: T.string.isRequired,
  fields: T.arrayOf(T.shape(FieldType.propTypes)).isRequired,
  titleLabel: T.string,
  displayMetadata: T.string.isRequired,
  isKeywordsEnabled: T.bool.isRequired,
  isNewKeywordsEnabled: T.bool.isRequired,
  isNew: T.bool.isRequired,
  isManager: T.bool.isRequired,
  entry: T.shape(EntryType.propTypes),
  entryUser: T.shape(EntryUserType.propTypes),
  categories: T.array,
  keywords: T.array,
  saveForm: T.func.isRequired,
  addCategory: T.func.isRequired,
  removeCategory: T.func.isRequired,
  addKeyword: T.func.isRequired,
  removeKeyword: T.func.isRequired,
  history: T.object.isRequired
}

const EntryForm = withRouter(connect(
  state => ({
    canEdit: resourceSelect.editable(state),
    clacoFormId: select.clacoForm(state).id,
    fields: select.visibleFields(state),
    titleLabel: select.getParam(state, 'title_field_label'),
    displayMetadata: select.getParam(state, 'display_metadata'),
    isKeywordsEnabled: select.getParam(state, 'keywords_enabled'),
    isNewKeywordsEnabled: select.getParam(state, 'new_keywords_enabled'),
    isManager: select.isCurrentEntryManager(state),
    isNew: formSelect.isNew(formSelect.form(state, 'entries.current')),
    entry: formSelect.data(formSelect.form(state, 'entries.current')),
    entryUser: select.entryUser(state),
    categories: select.categories(state),
    keywords: select.keywords(state)
  }),
  (dispatch) => ({
    saveForm(entry, isNew, navigate) {
      if (isNew) {
        dispatch(formActions.saveForm('entries.current', ['apiv2_clacoformentry_create'])).then(
          (data) => navigate(`/entries/${data.id}`),
          () => true
        )
      } else {
        dispatch(formActions.saveForm('entries.current', ['apiv2_clacoformentry_update', {id: entry.id}]))
      }
    },
    addCategory(category) {
      dispatch(actions.addCategory(category))
    },
    removeCategory(categoryId) {
      dispatch(actions.removeCategory(categoryId))
    },
    addKeyword(keyword) {
      dispatch(actions.addKeyword(keyword))
    },
    removeKeyword(keywordId) {
      dispatch(actions.removeKeyword(keywordId))
    }
  })
)(EntryFormComponent))

export {
  EntryForm
}