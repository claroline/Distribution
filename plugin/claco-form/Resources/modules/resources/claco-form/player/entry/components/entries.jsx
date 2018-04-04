import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {displayDate} from '#/main/core/scaffolding/date'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {generateUrl} from '#/main/core/api/router'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {DataCard} from '#/main/core/data/components/data-card'
import {constants as listConstants} from '#/main/core/data/list/constants'
import {UserAvatar} from '#/main/core/user/components/avatar.jsx'

import {select as resourceSelect} from '#/main/core/resource/selectors'

import {selectors} from '#/plugin/claco-form/resources/claco-form/selectors'
import {constants} from '#/plugin/claco-form/resources/claco-form/constants'
import {getFieldType, getCountry} from '#/plugin/claco-form/resources/claco-form/utils'
import {actions} from '#/plugin/claco-form/resources/claco-form/player/entry/actions'

class Entries extends Component {
  deleteEntry(entry) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_entry', {}, 'clacoform'),
      question: trans('delete_entry_confirm_message', {title: entry.title}, 'clacoform'),
      handleConfirm: () => this.props.deleteEntry(entry.id)
    })
  }

  deleteEntries(entries) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_selected_entries', {}, 'clacoform'),
      question: trans('delete_selected_entries_confirm_message', {}, 'clacoform'),
      handleConfirm: () => this.props.deleteEntries(entries)
    })
  }

  isEntryManager(entry) {
    let isManager = false

    if (entry.categories && this.props.user) {
      entry.categories.forEach(c => {
        if (!isManager && c.managers) {
          c.managers.forEach(m => {
            if (m.id === this.props.user.id) {
              isManager = true
            }
          })
        }
      })
    }

    return isManager
  }

  isEntryOwner(entry) {
    return this.props.user && entry.user && entry.user.id === this.props.user.id
  }

  canEditEntry(entry) {
    return this.canManageEntry(entry) || (this.props.editionEnabled && this.isEntryOwner(entry))
  }

  canManageEntry(entry) {
    return this.props.canEdit || this.isEntryManager(entry)
  }

  canViewMetadata() {
    return this.props.canEdit ||
      this.props.displayMetadata === 'all' ||
      (this.props.displayMetadata === 'manager' && this.props.isCategoryManager)
  }

  canViewEntryMetadata(entry) {
    return this.props.canEdit ||
      this.props.displayMetadata === 'all' ||
      this.isEntryOwner(entry) ||
      (this.props.displayMetadata === 'manager' && this.isEntryManager(entry))
  }

  navigateTo(url) {
    this.props.history.push(url)
  }

  generateColumns() {
    const columns = []

    if (!this.props.isAnon) {
      const options = {}

      if (this.props.canEdit || this.props.searchEnabled) {
        options['all_entries'] = trans('all_entries', {}, 'clacoform')
      }
      if (this.props.isCategoryManager) {
        options['manager_entries'] = trans('manager_entries', {}, 'clacoform')
      }
      options['my_entries'] = trans('my_entries', {}, 'clacoform')

      if (this.props.canEdit || this.props.searchEnabled || this.props.isCategoryManager) {
        columns.push({
          name: 'type',
          label: trans('type'),
          displayable: false,
          displayed: false,
          type: 'enum',
          options: {
            choices: options
          }
        })
      }
    }
    columns.push({
      name: 'clacoForm',
      label: trans('resource'),
      displayed: false,
      displayable: false,
      filterable: true,
      type: 'number'
    })

    columns.push({
      name: 'status',
      label: trans('published'),
      displayed: true,
      type: 'boolean'
    })
    columns.push({
      name: 'locked',
      label: trans('locked'),
      displayed: false,
      type: 'boolean'
    })
    columns.push({
      name: 'title',
      label: trans('title'),
      displayed: this.isDisplayedField('title'),
      primary: true,
      type: 'string'
    })

    if (this.canViewMetadata()) {
      columns.push({
        name: 'creationDate',
        label: trans('date'),
        type: 'date',
        filterable: false,
        displayed: this.isDisplayedField('creationDateString'),
        renderer: (rowData) => this.canViewEntryMetadata(rowData) ? displayDate(rowData.creationDate) : '-'
      })
      columns.push({
        name: 'createdAfter',
        label: trans('created_after'),
        type: 'date',
        displayable: false
      })
      columns.push({
        name: 'createdBefore',
        label: trans('created_before'),
        type: 'date',
        displayable: false
      })
      columns.push({
        name: 'user',
        label: trans('user'),
        displayed: this.isDisplayedField('userString'),
        renderer: (rowData) => rowData.user && this.canViewEntryMetadata(rowData) ?
          `${rowData.user.firstName} ${rowData.user.lastName}` :
          '-'
      })
    }
    if (this.props.displayCategories) {
      columns.push({
        name: 'categories',
        label: trans('categories'),
        displayed: this.isDisplayedField('categoriesString'),
        renderer: (rowData) => rowData.categories ? rowData.categories.map(c => c.name).join(', ') : ''
      })
    }
    if (this.props.displayKeywords) {
      columns.push({
        name: 'keywords',
        label: trans('keywords', {}, 'clacoform'),
        displayed: this.isDisplayedField('keywordsString'),
        renderer: (rowData) => rowData.keywords ? rowData.keywords.map(k => k.name).join(', ') : ''
      })
    }
    this.props.fields
      .filter(f => !f.hidden && (!f.isMetadata || this.canViewMetadata()))
      .map(f => {
        if (this.getDataType(f) === 'file') {
          columns.push({
            name: `${f.id}`,
            label: f.name,
            type: 'file',
            displayed: this.isDisplayedField(`${f.id}`),
            filterable: false,
            renderer: (rowData) => {
              const fieldValue = rowData.fieldValues.find(fv => fv.field.id === f.id)

              if (fieldValue &&
                fieldValue.fieldFacetValue &&
                fieldValue.fieldFacetValue.value &&
                fieldValue.fieldFacetValue.value[0] &&
                fieldValue.fieldFacetValue.value[0]['url']
              ) {
                const link =
                  <a href={generateUrl('claro_claco_form_field_value_file_download', {fieldValue: fieldValue.id})}>
                    {fieldValue.fieldFacetValue.value[0]['name']}
                  </a>

                return link
              } else {
                return '-'
              }
            }
          })
        } else {
          columns.push({
            name: `${f.id}`,
            label: f.name,
            type: this.getDataType(f),
            displayed: this.isDisplayedField(`${f.id}`),
            filterable: getFieldType(f.type).name !== 'date',
            calculated: (rowData) => {
              const fieldValue = rowData.fieldValues.find(fv => fv.field.id === f.id)

              return fieldValue && fieldValue.fieldFacetValue && fieldValue.fieldFacetValue.value ?
                this.formatFieldValue(rowData, f, fieldValue.fieldFacetValue.value) :
                ''
            }
          })
        }
      })

    return columns
  }

  generateActions() {
    const dataListActions = [{
      icon: 'fa fa-fw fa-eye',
      label: trans('view_entry', {}, 'clacoform'),
      action: (rows) => this.navigateTo(`/entry/${rows[0].id}/view`),
      context: 'row'
    }]

    if (this.props.canGeneratePdf) {
      dataListActions.push({
        icon: 'fa fa-fw fa-print',
        label: trans('print_entry', {}, 'clacoform'),
        action: (rows) => this.props.downloadEntryPdf(rows[0].id),
        context: 'row'
      })
      dataListActions.push({
        icon: 'fa fa-w fa-print',
        label: trans('print_selected_entries', {}, 'clacoform'),
        action: (rows) => this.props.downloadEntriesPdf(rows),
        context: 'selection'
      })
    }
    dataListActions.push({
      icon: 'fa fa-fw fa-pencil',
      label: trans('edit'),
      action: (rows) => this.navigateTo(`/entry/${rows[0].id}/edit`),
      displayed: (rows) => !rows[0].locked && this.canEditEntry(rows[0]),
      context: 'row'
    })
    dataListActions.push({
      icon: 'fa fa-fw fa-eye',
      label: trans('publish'),
      action: (rows) => this.props.switchEntriesStatus(rows, constants.ENTRY_STATUS_PUBLISHED),
      displayed: (rows) => rows.filter(e => !e.locked && this.canManageEntry(e)).length === rows.length &&
        rows.filter(e => e.status === constants.ENTRY_STATUS_PUBLISHED).length !== rows.length
    })
    dataListActions.push({
      icon: 'fa fa-fw fa-eye-slash',
      label: trans('unpublish'),
      action: (rows) => this.props.switchEntriesStatus(rows, constants.ENTRY_STATUS_UNPUBLISHED),
      displayed: (rows) => rows.filter(e => !e.locked && this.canManageEntry(e)).length === rows.length &&
        rows.filter(e => e.status !== constants.ENTRY_STATUS_PUBLISHED).length !== rows.length
    })

    if (this.props.canAdministrate) {
      dataListActions.push({
        icon: 'fa fa-w fa-lock',
        label: trans('lock'),
        action: (rows) => this.props.switchEntriesLock(rows, true),
        displayed: (rows) => rows.filter(e => e.locked).length !== rows.length
      })
      dataListActions.push({
        icon: 'fa fa-w fa-unlock',
        label: trans('unlock'),
        action: (rows) => this.props.switchEntriesLock(rows, false),
        displayed: (rows) => rows.filter(e => !e.locked).length !== rows.length
      })
    }
    dataListActions.push({
      icon: 'fa fa-fw fa-trash',
      label: trans('delete'),
      action: (rows) => this.deleteEntry(rows[0]),
      displayed: (rows) => !rows[0].locked && this.canManageEntry(rows[0]),
      dangerous: true,
      context: 'row'
    })
    dataListActions.push({
      icon: 'fa fa-w fa-trash',
      label: trans('delete'),
      action: (rows) => this.deleteEntries(rows),
      displayed: (rows) => rows.filter(e => !e.locked && this.canManageEntry(e)).length === rows.length,
      dangerous: true,
      context: 'selection'
    })

    return dataListActions
  }

  getDataType(field) {
    let type = 'string'

    switch (getFieldType(field.type).name) {
      case 'date':
        type = 'date'
        break
      case 'file':
        type = 'file'
        break
      case 'number':
        type = 'number'
        break
      case 'rich_text':
      case 'html':
        type = 'html'
        break
    }

    return type
  }

  isDisplayedField(key) {
    return this.props.searchColumns ? this.props.searchColumns.indexOf(key) > -1 : false
  }

  formatFieldValue(entry, field, value) {
    let formattedValue = ''

    if (field.isMetadata && !this.canViewEntryMetadata(entry)) {
      formattedValue = '-'
    } else {
      formattedValue = value

      if (value !== undefined && value !== null && value !== '') {
        switch (getFieldType(field.type).name) {
          case 'date':
            formattedValue = value.date ? displayDate(value.date) : displayDate(value)
            break
          case 'country':
            formattedValue = getCountry(value)
            break
          case 'checkboxes':
            formattedValue = value.join(', ')
            break
          case 'select':
            if (Array.isArray(value)) {
              formattedValue = value.join(', ')
            }
            break
        }
      }
    }

    return formattedValue
  }

  getCardValue(row, type) {
    let value = row.title
    let key = ''

    switch (type) {
      case 'title':
        key = this.props.displayTitle
        break
      case 'subtitle':
        key = this.props.displaySubtitle
        break
      case 'content':
        key = this.props.displayContent
        break
    }

    if (key && key !== 'title') {
      let fieldValue = null

      switch (key) {
        case 'date':
          value = row.creationDate
          break
        case 'user':
          value = row.user ? `${row.user.firstName} ${row.user.lastName}` : trans('anonymous')
          break
        case 'categories':
          value = row.categories ? row.categories.map(c => c.name).join(', ') : ''
          break
        case 'keywords':
          value = row.keywords ? row.keywords.map(k => k.name).join(', ') : ''
          break
        default:
          fieldValue = row.fieldValues.find(fv => fv.field.id === parseInt(key))
          value = fieldValue && fieldValue.fieldFacetValue && fieldValue.fieldFacetValue.value ?
            this.formatFieldValue(row, fieldValue.field, fieldValue.fieldFacetValue.value) :
            ''
      }
    }

    return value
  }

  render() {
    return (
      <div>
        <h2>{trans('entries_list', {}, 'clacoform')}</h2>

        {this.props.canSearchEntry ?
          <DataListContainer
            display={{
              current: this.props.defaultDisplayMode || listConstants.DISPLAY_TABLE,
              available: Object.keys(listConstants.DISPLAY_MODES)
            }}
            name="entries"
            open={{
              action: (row) => `#/entry/${row.id}/view`
            }}
            fetch={{
              url: ['claro_claco_form_entries_search', {clacoForm: this.props.resourceId}],
              autoload: true
            }}
            definition={this.generateColumns()}
            filterColumns={this.props.searchColumnEnabled}
            actions={this.generateActions()}
            card={(props) =>
              <DataCard
                {...props}
                id={props.data.id}
                icon={<UserAvatar picture={props.data.user ? props.data.user.picture : undefined} alt={true}/>}
                title={this.getCardValue(props.data, 'title')}
                subtitle={this.getCardValue(props.data, 'subtitle')}
                contentText={this.getCardValue(props.data, 'content')}
              />
            }
          /> :
          <div className="alert alert-danger">
            {trans('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

Entries.propTypes = {
  canEdit: T.bool.isRequired,
  canAdministrate: T.bool.isRequired,
  isAnon: T.bool.isRequired,
  user: T.object,
  fields: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    type: T.number.isRequired,
    isMetadata: T.bool.isRequired,
    hidden: T.bool
  })).isRequired,
  canGeneratePdf: T.bool.isRequired,
  resourceId: T.number.isRequired,
  canSearchEntry: T.bool.isRequired,
  searchEnabled: T.bool.isRequired,
  searchColumnEnabled: T.bool.isRequired,
  editionEnabled: T.bool.isRequired,
  defaultDisplayMode: T.string,
  displayTitle: T.string,
  displaySubtitle: T.string,
  displayContent: T.string,
  searchColumns: T.arrayOf(T.string),
  displayMetadata: T.string.isRequired,
  displayCategories: T.bool.isRequired,
  displayKeywords: T.bool.isRequired,
  isCategoryManager: T.bool.isRequired,
  downloadEntryPdf: T.func.isRequired,
  downloadEntriesPdf: T.func.isRequired,
  switchEntriesStatus: T.func.isRequired,
  switchEntriesLock: T.func.isRequired,
  deleteEntry: T.func.isRequired,
  deleteEntries: T.func.isRequired,
  downloadFieldValueFile: T.func.isRequired,
  showModal: T.func.isRequired,
  entries: T.shape({
    data: T.array,
    totalResults: T.number,
    page: T.number,
    pageSize: T.number,
    filters: T.arrayOf(T.shape({
      property: T.string,
      value: T.any
    })),
    sortBy: T.object
  }).isRequired,
  history: T.object.isRequired
}

function mapStateToProps(state) {
  return {
    canEdit: resourceSelect.editable(state),
    canAdministrate: resourceSelect.administrable(state),
    isAnon: state.isAnon,
    user: state.user,
    fields: state.fields,
    canGeneratePdf: state.canGeneratePdf,
    resourceId: state.resource.id,
    canSearchEntry: selectors.canSearchEntry(state),
    searchEnabled: selectors.getParam(state, 'search_enabled'),
    searchColumnEnabled: selectors.getParam(state, 'search_column_enabled'),
    editionEnabled: selectors.getParam(state, 'edition_enabled'),
    defaultDisplayMode: selectors.getParam(state, 'default_display_mode'),
    displayTitle: selectors.getParam(state, 'display_title'),
    displaySubtitle: selectors.getParam(state, 'display_subtitle'),
    displayContent: selectors.getParam(state, 'display_content'),
    searchColumns: selectors.getParam(state, 'search_columns'),
    displayMetadata: selectors.getParam(state, 'display_metadata'),
    displayCategories: selectors.getParam(state, 'display_categories'),
    displayKeywords: selectors.getParam(state, 'display_keywords'),
    isCategoryManager: selectors.isCategoryManager(state),
    entries: state.entries
  }
}

function mapDispatchToProps(dispatch) {
  return {
    downloadEntryPdf: entryId => dispatch(actions.downloadEntryPdf(entryId)),
    downloadEntriesPdf: entries => dispatch(actions.downloadEntriesPdf(entries)),
    switchEntriesStatus: (entries, status) => dispatch(actions.switchEntriesStatus(entries, status)),
    switchEntriesLock: (entries, locked) => dispatch(actions.switchEntriesLock(entries, locked)),
    deleteEntry: entryId => dispatch(actions.deleteEntry(entryId)),
    deleteEntries: entries => dispatch(actions.deleteEntries(entries)),
    downloadFieldValueFile: fieldValueId => dispatch(actions.downloadFieldValueFile(fieldValueId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedEntries = withRouter(connect(mapStateToProps, mapDispatchToProps)(Entries))

export {ConnectedEntries as Entries}