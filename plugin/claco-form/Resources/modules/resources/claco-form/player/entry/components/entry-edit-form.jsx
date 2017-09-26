import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans, t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'
import {FormField} from '#/main/core/layout/form/components/form-field.jsx'
import {SelectInput} from '#/main/core/layout/form/components/field/select-input.jsx'
import {getFieldType} from '../../../utils'
import {selectors} from '../../../selectors'
import {actions} from '../actions'

const InfosList = props =>
  <span className="entry-form-infos-list">
    {props.infos.map(info =>
      <div key={info} className="btn-group margin-right-sm margin-bottom-sm">
          <button className="btn btn-default">
            {info}
          </button>
          <button
            className="btn btn-danger"
            onClick={() => props.removeInfo(info)}
          >
              <span className="fa fa-times-circle"></span>
          </button>
      </div>
    )}
  </span>

InfosList.propTypes = {
  infos: T.arrayOf(T.string).isRequired,
  removeInfo: T.func.isRequired
}

class EntryEditForm extends Component {
  constructor(props) {
    super(props)
    const fieldsValues = {
      entry_title: ''
    }
    const errors = {
      entry_title: ''
    }
    props.fields.map(f => {
      fieldsValues[f.id] = getFieldType(f.type).answerType === 'array' ? [] : ''
      errors[f.id] = ''
    })
    this.state = {
      id: props.entryId,
      entry: fieldsValues,
      categories: [],
      keywords: [],
      hasError: false,
      errors: errors,
      showCategoryForm: false,
      showKeywordForm: false,
      currentCategory: '',
      currentKeyword: ''
    }
  }

  componentDidMount() {
    let entry = this.props.entries.find(e => e.id === this.props.entryId)

    if (entry) {
      this.initializeEntry(entry)
    } else {
      fetch(
        generateUrl('claro_claco_form_entry_retrieve', {entry: this.props.entryId}),
        {method: 'GET', credentials: 'include'}
      )
      .then(response => response.json())
      .then(results => this.initializeEntry(results))
    }
  }

  initializeEntry(entry) {
    const categories = entry.categories.map(c => c.name)
    const keywords = entry.keywords.map(k => k.name)
    const values = {entry_title: entry.title}
    this.props.fields.map(f => {
      const fieldValue = entry.fieldValues.find(fv => fv.field.id === f.id)

      if (fieldValue && fieldValue.fieldFacetValue) {
        values[f.id] = fieldValue.fieldFacetValue.value
      } else {
        values[f.id] = getFieldType(f.type).answerType === 'array' ? [] : ''
      }
    })

    this.setState({entry: values, keywords: keywords, categories: categories})
  }

  addCategory() {
    if (this.state.currentCategory) {
      const categories = cloneDeep(this.state.categories)
      const index = categories.findIndex(c => c === this.state.currentCategory)

      if (index < 0) {
        categories.push(this.state.currentCategory)
      }
      this.setState({categories: categories, currentCategory: '', showCategoryForm: false})
    }
  }

  removeCategory(category) {
    const categories = cloneDeep(this.state.categories)
    const index = categories.findIndex(c => c === category)

    if (index >= 0) {
      categories.splice(index, 1)
    }
    this.setState({categories: categories})
  }

  addKeyword() {
    if (this.state.currentKeyword) {
      const keywords = cloneDeep(this.state.keywords)
      const index = keywords.findIndex(k => k.toUpperCase() === this.state.currentKeyword.toUpperCase())

      if (index < 0) {
        keywords.push(this.state.currentKeyword)
      }
      this.setState({keywords: keywords, currentKeyword: '', showKeywordForm: false})
    }
  }

  removeKeyword(keyword) {
    const keywords = cloneDeep(this.state.keywords)
    const index = keywords.findIndex(k => k === keyword)

    if (index >= 0) {
      keywords.splice(index, 1)
    }
    this.setState({keywords: keywords})
  }

  isFieldLocked(field) {
    return (!this.state.id && field.locked && !field.lockedEditionOnly) || (this.state.id && field.locked) ? true : false
  }

  updateEntryValue(property, value) {
    this.setState({entry: Object.assign({}, this.state.entry, {[property]: value})})
  }

  registerEntry() {
    console.log(this.state)

    if (!this.state['hasError']) {
      this.props.editEntry(
        this.state.id,
        this.state.entry,
        this.state.keywords,
        this.state.categories.map(categoryName => this.props.categories.find(c => c.name === categoryName).id)
      )
    }
  }

  validateEntry() {
    let hasError = false
    const errors = cloneDeep(this.state.errors)
    errors['entry_title'] = this.state.entry.entry_title === '' ? trans('form_not_blank_error', {}, 'clacoform') : ''
    this.props.fields.forEach(f => {
      errors[f.id] = f.required && (this.state.entry[f.id] === '' || this.state.entry[f.id].length === 0) ?
        trans('form_not_blank_error', {}, 'clacoform') :
        ''
    })
    Object.values(errors).forEach(e => {
      if (e) {
        hasError = true
      }
    })
    this.setState({errors: errors, hasError: hasError}, this.registerEntry)
  }

  render() {
    return (
      <div>
        <h2>{trans('entry_edition', {}, 'clacoform')}</h2>
        <br/>
        {this.props.canEdit ?
          <div>
            <FormField
              controlId="field-title"
              type="text"
              label={t('title')}
              value={this.state.entry.entry_title}
              error={this.state.errors.entry_title}
              onChange={value => this.updateEntryValue('entry_title', value)}
            />
            {this.props.fields.map(f =>
              <FormField
                key={`field-${f.id}`}
                controlId={`field-${f.id}`}
                type={getFieldType(f.type).name}
                label={f.name}
                disabled={this.isFieldLocked(f)}
                noLabel={false}
                choices={f.fieldFacet ?
                  f.fieldFacet.field_facet_choices.filter(ffc => !ffc.parent).map(ffc => Object.assign({}, ffc, {value: ffc.label})) :
                  []
                }
                value={this.state.entry[f.id]}
                error={this.state.errors[f.id]}
                onChange={value => this.updateEntryValue(f.id, value)}
              />
            )}
            {this.props.isKeywordsEnabled &&
              <div>
                <hr/>
                <h3>{trans('keywords', {}, 'clacoform')}</h3>
                {this.state.keywords.length > 0 &&
                  <InfosList
                    infos={this.state.keywords}
                    removeInfo={keyword => this.removeKeyword(keyword)}
                  />
                }
                {this.state.showKeywordForm ?
                  <SelectInput
                    selectMode={!this.props.isNewKeywordsEnabled}
                    options={this.props.keywords.map(k => {
                      return {value: k.name, label: k.name}
                    })}
                    primaryLabel={t('add')}
                    disablePrimary={!this.state.currentKeyword}
                    typeAhead={this.props.isNewKeywordsEnabled}
                    value={this.state.currentKeyword}
                    onChange={value => this.setState({currentKeyword: value})}
                    onPrimary={() => this.addKeyword()}
                    onSecondary={() => {
                      this.setState({showKeywordForm: false, currentKeyword: ''})
                    }}
                  /> :
                  <button
                    className="btn btn-default margin-bottom-sm"
                    onClick={() => this.setState({showKeywordForm: true, currentKeyword: ''})}
                  >
                      <span className="fa fa-w fa-plus"></span>
                  </button>
                }
              </div>
            }
            {this.state.id && this.props.canEdit &&
              <div>
                <hr/>
                <h3>{t('categories')}</h3>
                {this.state.categories.length > 0 &&
                  <InfosList
                    infos={this.state.categories}
                    removeInfo={category => this.removeCategory(category)}
                  />
                }
                {this.state.showCategoryForm ?
                  <SelectInput
                    selectMode={true}
                    options={this.props.categories.map(c => {
                      return {value: c.name, label: c.name}
                    })}
                    primaryLabel={t('add')}
                    disablePrimary={!this.state.currentCategory}
                    value={this.state.currentKeyword}
                    onChange={value => this.setState({currentCategory: value})}
                    onPrimary={() => this.addCategory()}
                    onSecondary={() => {
                      this.setState({showCategoryForm: false, currentCategory: ''})
                    }}
                  /> :
                  <button
                    className="btn btn-default margin-bottom-sm"
                    onClick={() => this.setState({showCategoryForm: true, currentCategory: ''})}
                  >
                      <span className="fa fa-w fa-plus"></span>
                  </button>
                }
              </div>
            }
            <hr/>
            <div className="entry-form-buttons">
              <button className="btn btn-primary" onClick={() => this.validateEntry()}>
                <span>{t('ok')}</span>
              </button>
              <a href="#/" className="btn btn-default">
                {t('cancel')}
              </a>
            </div>
          </div> :
          <div className="alert alert-danger">
            {t('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

EntryEditForm.propTypes = {
  canEdit: T.bool.isRequired,
  isKeywordsEnabled: T.bool.isRequired,
  isNewKeywordsEnabled: T.bool.isRequired,
  editEntry: T.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    entryId: ownProps.match.params.id ? parseInt(ownProps.match.params.id) : null,
    canEdit: state.canEdit,
    fields: selectors.visibleFields(state),
    entries: state.entries,
    isKeywordsEnabled: selectors.getParam(state, 'keywords_enabled'),
    isNewKeywordsEnabled: selectors.getParam(state, 'new_keywords_enabled'),
    keywords: selectors.getParam(state, 'keywords_enabled') ? state.keywords : [],
    categories: state.canEdit ? state.categories : []
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editEntry: (entryId, entry, keywords, categories) => dispatch(actions.editEntry(entryId, entry, keywords, categories))
  }
}

const ConnectedEntryEditForm = connect(mapStateToProps, mapDispatchToProps)(EntryEditForm)

export {ConnectedEntryEditForm as EntryEditForm}