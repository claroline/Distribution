import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import moment from 'moment'
import {trans, t} from '#/main/core/translation'
import {FormField} from '#/main/core/layout/form/components/form-field.jsx'
import {getFieldType, getCountry} from '../../../utils'
import {selectors} from '../../../selectors'
import {actions} from '../actions'
import {EntryComments} from './entry-comments.jsx'

class EntryView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isKeywordsPanelOpen: props.openKeywords,
      isCategoriesPanelOpen: props.openCategories,
      isCommentsPanelOpen: props.openComments
    }
  }

  componentDidMount() {
    this.props.loadEntry(this.props.entryId)
  }

  updateState(property, value) {
    this.setState({[property]: value})
  }

  canViewMetadata() {
    return this.props.canEdit||
      this.props.isOwner ||
      this.props.displayMetadata === 'all' ||
      (this.props.displayMetadata === 'manager' /* && this.props.isCategoryManager */)
  }

  canComment() {
    return this.props.commentsEnabled && (!this.props.isAnon || this.props.anonymousCommentsEnabled)
  }

  canManageComments() {
    return this.props.canEdit /*|| this.props.isCategoryManager*/
  }

  isFieldDisplayable(field) {
    return this.canViewMetadata() || !field.isMetadata
  }

  displayFieldContent(field) {
    const fieldValue = this.props.entry.fieldValues ?
      this.props.entry.fieldValues.find(fv => fv.field.id === field.id) :
      null

    if (fieldValue && fieldValue.fieldFacetValue && fieldValue.fieldFacetValue.value !== undefined) {
      const value = fieldValue.fieldFacetValue.value

      switch (getFieldType(field.type).name) {
        case 'checkboxes':
          return value.join(', ')
        case 'country':
          return getCountry(value).label
        case 'date' :
          return moment(value).format('DD/MM/YYYY')
        case 'rich_text':
          return (<div dangerouslySetInnerHTML={{ __html: value}}/>)
        default:
          return value
      }
    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">
            {this.props.entry.title}
          </h2>
        </div>
        <div className="panel-body">
          {this.props.fields.map(f => this.isFieldDisplayable(f) ?
            <div key={`field-${f.id}`}>
              <div className="row">
                <label className="col-md-3">
                  {f.name}
                </label>
                <div className="col-md-9">
                  {this.displayFieldContent(f)}
                </div>
              </div>
              <hr/>
            </div> :
            ''
          )}
          {this.canViewMetadata() &&
            <div>
              {this.props.entry.publicationDate &&
                <span>{trans('publication_date', {}, 'clacoform')} : {moment(this.props.entry.publicationDate).format('DD/MM/YYYY')} - </span>
              }
              {this.props.entry.editionDate &&
                <span>{trans('edition_date', {}, 'clacoform')} : {moment(this.props.entry.editionDate).format('DD/MM/YYYY')} - </span>
              }
              {t('author')} : {this.props.entry.user ? `${this.props.entry.user.firstName} ${this.props.entry.user.lastName}` : t('anonymous')}
            </div>
          }
        </div>
        {this.props.displayKeywords &&
          <div className="panel-heading">
            <div className="panel-title">
              <span
                className="pointer-hand"
                onClick={() => this.updateState('isKeywordsPanelOpen', !this.state.isKeywordsPanelOpen)}
              >
                {trans('keywords', {}, 'clacoform')}
                &nbsp;
                <span className={`fa fa-w ${this.state.isKeywordsPanelOpen ? 'fa-chevron-circle-down' : 'fa-chevron-circle-right'}`}>
                </span>
              </span>
            </div>
          </div>
        }
        {this.props.displayKeywords &&
          <div className={`panel-body collapse ${this.state.isKeywordsPanelOpen ? 'in' : ''}`}>
            {this.props.entry.keywords && this.props.entry.keywords.map(k =>
              <button
                key={`keyword-${k.id}`}
                className="btn btn-default margin-right-sm margin-bottom-sm"
              >
                {k.name}
              </button>
            )}
          </div>
        }
        {this.props.displayCategories &&
          <div className="panel-heading">
            <div className="panel-title">
              <span
                className="pointer-hand"
                onClick={() => this.updateState('isCategoriesPanelOpen', !this.state.isCategoriesPanelOpen)}
              >
                {t('categories')}
                &nbsp;
                <span className={`fa fa-w ${this.state.isCategoriesPanelOpen ? 'fa-chevron-circle-down' : 'fa-chevron-circle-right'}`}>
                </span>
              </span>
            </div>
          </div>
        }
        {this.props.displayCategories &&
          <div className={`panel-body collapse ${this.state.isCategoriesPanelOpen ? 'in' : ''}`}>
            {this.props.entry.categories && this.props.entry.categories.map(c =>
              <button
                key={`category-${c.id}`}
                className="btn btn-default margin-right-sm margin-bottom-sm"
              >
                {c.name}
              </button>
            )}
          </div>
        }
        {(this.props.displayComments || this.canComment()) &&
          <div className="panel-heading">
            <div className="panel-title">
              <span
                className="pointer-hand"
                onClick={() => this.updateState('isCommentsPanelOpen', !this.state.isCommentsPanelOpen)}
              >
                {trans('comments', {}, 'clacoform')}
                &nbsp;
                <span className={`fa fa-w ${this.state.isCommentsPanelOpen ? 'fa-chevron-circle-down' : 'fa-chevron-circle-right'}`}>
                </span>
              </span>
            </div>
          </div>
        }
        {(this.props.displayComments || this.canComment()) &&
          <div className={`panel-body collapse ${this.state.isCommentsPanelOpen ? 'in' : ''}`}>
            <EntryComments
              entry={this.props.entry}
              displayComments={this.props.displayComments}
              canComment={this.canComment()}
              canManage={this.canManageComments()}
            />
          </div>
        }
      </div>
    )
  }
}

EntryView.propTypes = {
  canEdit: T.bool.isRequired,
  displayMetadata: T.string.isRequired,
  displayCategories: T.bool.isRequired,
  openCategories: T.bool.isRequired,
  displayKeywords: T.bool.isRequired,
  openKeywords: T.bool.isRequired,
  commentsEnabled: T.bool.isRequired,
  anonymousCommentsEnabled: T.bool.isRequired,
  displayComments: T.bool.isRequired,
  openComments: T.bool.isRequired,
  loadEntry: T.func.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    entryId: parseInt(ownProps.match.params.id),
    canEdit: state.canEdit,
    isAnon: state.isAnon,
    entry: state.currentEntry,
    fields: selectors.visibleFields(state),
    displayMetadata: selectors.getParam(state, 'display_metadata'),
    displayCategories: selectors.getParam(state, 'display_categories'),
    openCategories: selectors.getParam(state, 'open_categories'),
    displayKeywords: selectors.getParam(state, 'display_keywords'),
    openKeywords: selectors.getParam(state, 'open_keywords'),
    commentsEnabled: selectors.getParam(state, 'comments_enabled'),
    anonymousCommentsEnabled: selectors.getParam(state, 'anonymous_comments_enabled'),
    displayComments: selectors.getParam(state, 'display_comments'),
    openComments: selectors.getParam(state, 'open_comments'),
    isOwner: selectors.isCurrentEntryOwner(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadEntry: (entryId) => dispatch(actions.loadEntry(entryId))
  }
}

const ConnectedEntryView = connect(mapStateToProps, mapDispatchToProps)(EntryView)

export {ConnectedEntryView as EntryView}