import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans, t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions} from '../actions'
import {selectors} from '../../../selectors'

class EntriesList extends Component {
  deleteEntry(entry) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_entry', {}, 'clacoform'),
      question: trans('delete_entry_confirm_message', {title: entry.title}, 'clacoform'),
      handleConfirm: () => this.props.deleteEntry(entry.id)
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

  render() {
    return (
      <div>
        <h2>{trans('entries_list', {}, 'clacoform')}</h2>
        <br/>
        {this.props.canSearchEntry ?
          <div>
            <table className="table">
              <thead>
                <tr>
                  <th>{t('title')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.entries.map(entry =>
                  <tr key={`entry-${entry.id}`}>
                    <td>
                      <a href={`#/entry/${entry.id}/view`}>{entry.title}</a>
                    </td>
                    <td>
                      {this.canEditEntry(entry) &&
                        <a
                          className="btn btn-default btn-sm margin-right-sm"
                          href={`#/entry/${entry.id}/edit`}
                        >
                          <span className="fa fa-w fa-pencil"></span>
                        </a>
                      }
                      {this.canManageEntry(entry) &&
                        <button
                          className="btn btn-danger btn-sm margin-right-sm"
                          onClick={() => this.deleteEntry(entry)}
                        >
                          <span className="fa fa-w fa-trash"></span>
                        </button>
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> :
          <div className="alert alert-danger">
            {t('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

EntriesList.propTypes = {
  canEdit: T.bool.isRequired,
  user: T.object,
  canGeneratePdf: T.bool.isRequired,
  resourceId: T.number.isRequired,
  entries: T.arrayOf(T.shape({
    id: T.number.isRequired,
    title: T.string.isRequired
  })),
  canSearchEntry: T.bool.isRequired,
  editionEnabled: T.bool.isRequired,
  deleteEntry: T.func.isRequired,
  showModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    canEdit: state.canEdit,
    user: state.user,
    canGeneratePdf: state.canGeneratePdf,
    resourceId: state.resource.id,
    canSearchEntry: selectors.canSearchEntry(state),
    editionEnabled: selectors.getParam(state, 'edition_enabled'),
    entries: state.entries
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteEntry: entryId => dispatch(actions.deleteEntry(entryId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedEntriesList = connect(mapStateToProps, mapDispatchToProps)(EntriesList)

export {ConnectedEntriesList as EntriesList}