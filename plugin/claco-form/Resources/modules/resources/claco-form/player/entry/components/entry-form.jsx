import React, {Component} from 'react'
import ReactDOM from 'react-dom'
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
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {select} from '#/plugin/claco-form/resources/claco-form/selectors'
import {
  Field as FieldType,
  Entry as EntryType,
  EntryUser as EntryUserType
} from '#/plugin/claco-form/resources/claco-form/prop-types'
import {actions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'
import {EntryFormData} from '#/plugin/claco-form/resources/claco-form/player/entry/components/entry-form-data.jsx'
import {FormField} from '#/plugin/claco-form/resources/claco-form/player/entry/components/form-field.jsx'

const authenticatedUser = currentUser()

class EntryFormComponent extends Component {
  componentDidMount() {
    this.renderTemplateFields()
  }

  componentDidUpdate() {
    this.renderTemplateFields()
  }

  getSections() {
    const isShared = this.props.entryUser && this.props.entryUser.id ? this.props.entryUser.shared : false

    const sectionFields = [
      {
        name: 'title',
        type: 'string',
        label: this.props.titleLabel ? this.props.titleLabel : trans('title'),
        required: true
      }
    ]
    this.props.fields.forEach(f => {
      const params = {
        name: `values.${f.id}`,
        type: f.type,
        label: f.label,
        required: f.required,
        help: f.help,
        displayed: this.props.isNew ||
          isShared ||
          this.props.displayMetadata === 'all' ||
          (this.props.displayMetadata === 'manager' && this.props.isManager) ||
          !f.restrictions.isMetadata ||
          (this.props.entry.user && this.props.entry.user.id === authenticatedUser.id),
        disabled: !this.props.isManager && ((this.props.isNew && f.restrictions.locked && !f.restrictions.lockedEditionOnly) || (!this.props.isNew && f.restrictions.locked)),
        options: f.options ? f.options : {}
      }

      switch (f.type) {
        case 'file':
          params['options'] = Object.assign({}, params['options'], {'uploadUrl': ['apiv2_clacoformentry_file_upload', {clacoForm: this.props.clacoFormId}]})
          break
        case 'choice':
          params['options'] = f.options.choices ?
            Object.assign({}, params['options'], {
              'choices': f.options.choices.reduce((acc, choice) => {
                acc[choice.value] = choice.value

                return acc
              }, {})
            }) :
            {}
          break
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

  renderTemplateFields() {
    if (this.props.useTemplate && this.props.template) {
      const title =
        <FormField
          controlId="field-title"
          type="string"
          label={trans('title')}
          required={true}
          noLabel={true}
          value={this.props.entry.title}
          error={this.props.errors.title}
          onChange={value => this.props.updateFormProp('title', value)}
        />
      const element = document.getElementById('clacoform-entry-title')

      if (element) {
        ReactDOM.render(title, element)
      }
      this.props.fields.filter(f => f.type !== 'file' && f.type !== 'date').forEach(f => {
        const fieldEl = document.getElementById(`clacoform-field-${f.autoId}`)

        if (fieldEl) {
          const fieldComponent =
            <FormField
              key={`field-${f.id}`}
              controlId={`field-${f.id}`}
              type={f.type}
              label={f.name}
              required={f.required}
              disabled={!this.props.isManager && ((this.props.isNew && f.restrictions.locked && !f.restrictions.lockedEditionOnly) || (!this.props.isNew && f.restrictions.locked))}
              help={f.help}
              noLabel={true}
              value={this.props.entry.values ? this.props.entry.values[f.id] : undefined}
              error={this.props.errors[f.id]}
              onChange={value => this.props.updateFormProp(`values.${f.id}`, value)}
            />
          ReactDOM.render(fieldComponent, fieldEl)
        }
      })
    }
  }

  generateTemplate() {
    let template = this.props.template
    template = template.replace('%clacoform_entry_title%', '<span id="clacoform-entry-title"></span>')
    this.props.fields.filter(f => f.type !== 'file').forEach(f => {
      template = template.replace(`%field_${f.autoId}%`, `<span id="clacoform-field-${f.autoId}"></span>`)
    })

    return template
  }

  render() {
    return (
      <div>
        {this.props.useTemplate && this.props.template ?
          <HtmlText>
            {this.generateTemplate()}
          </HtmlText> :
          <FormContainer
            level={3}
            name="entries.current"
            sections={this.getSections()}
          />
        }
        {(this.props.canEdit || this.props.isManager || this.props.isKeywordsEnabled) &&
          <FormSections level={3}>
            {(this.props.canEdit || this.props.isManager) &&
              <FormSection
                id="entry-categories"
                className="embedded-list-section"
                icon="fa fa-fw fa-table"
                title={trans('categories')}
              >
                <EntryFormData
                  data={this.props.entry.categories}
                  choices={this.props.categories}
                  onAdd={(category) => this.props.addCategory(category)}
                  onRemove={(category) => this.props.removeCategory(category.id)}
                />
              </FormSection>
            }
            {this.props.isKeywordsEnabled &&
              <FormSection
                id="entry-keywords"
                className="embedded-list-section"
                icon="fa fa-fw fa-font"
                title={trans('keywords', {}, 'clacoform')}
              >
                <EntryFormData
                  data={this.props.entry.keywords}
                  choices={this.props.keywords}
                  allowNew={this.props.isNewKeywordsEnabled}
                  onAdd={(keyword) => this.props.addKeyword(keyword)}
                  onRemove={(keyword) => this.props.removeKeyword(keyword.id)}
                />
              </FormSection>
            }
          </FormSections>
        }
        <button
          className="btn btn-primary"
          onClick={() => this.props.saveForm(this.props.entry, this.props.isNew, this.props.history.push)}
        >
          {trans('save')}
        </button>
      </div>
    )
  }
}


EntryFormComponent.propTypes = {
  canEdit: T.bool.isRequired,
  clacoFormId: T.string.isRequired,
  fields: T.arrayOf(T.shape(FieldType.propTypes)).isRequired,
  template: T.string,
  useTemplate: T.bool.isRequired,
  titleLabel: T.string,
  displayMetadata: T.string.isRequired,
  isKeywordsEnabled: T.bool.isRequired,
  isNewKeywordsEnabled: T.bool.isRequired,
  isManager: T.bool.isRequired,
  isNew: T.bool.isRequired,
  errors: T.object,
  entry: T.shape(EntryType.propTypes),
  entryUser: T.shape(EntryUserType.propTypes),
  categories: T.array,
  keywords: T.array,
  saveForm: T.func.isRequired,
  updateFormProp: T.func.isRequired,
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
    useTemplate: select.getParam(state, 'use_template'),
    template: select.template(state),
    titleLabel: select.getParam(state, 'title_field_label'),
    displayMetadata: select.getParam(state, 'display_metadata'),
    isKeywordsEnabled: select.getParam(state, 'keywords_enabled'),
    isNewKeywordsEnabled: select.getParam(state, 'new_keywords_enabled'),
    isManager: select.isCurrentEntryManager(state),
    isNew: formSelect.isNew(formSelect.form(state, 'entries.current')),
    errors: formSelect.errors(formSelect.form(state, 'entries.current')),
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
    updateFormProp(propName, propValue) {
      dispatch(formActions.updateProp('entries.current', propName, propValue))
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