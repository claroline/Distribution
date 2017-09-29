import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans, t} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'
import {constants} from '#/main/core/layout/list/constants'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {TooltipButton} from '#/main/core/layout/button/components/tooltip-button.jsx'
import {actions} from '../actions'
import {selectors} from '../../../selectors'

class Entries extends Component {
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
            <DataList
              display={{current: constants.DISPLAY_TABLE, available: Object.keys(constants.DISPLAY_MODES)}}
              name="entries"
              definition={[
                {
                  name: 'title',
                  label: t('title'),
                  displayed: true
                }
              ]}
              card={(row) => ({
                poster: null,
                icon: 'fa fa-book',
                title: row.title,
                subtitle: row.title,
                contentText: row.title,
                flags: [].filter(flag => !!flag),
                footer:
                  <span></span>,
                footerLong:
                  <span></span>
              })}
            />
          </div> :
          <div className="alert alert-danger">
            {t('unauthorized')}
          </div>
        }
      </div>
    )
  }
}

Entries.propTypes = {
  canEdit: T.bool.isRequired,
  user: T.object,
  canGeneratePdf: T.bool.isRequired,
  resourceId: T.number.isRequired,
  canSearchEntry: T.bool.isRequired,
  editionEnabled: T.bool.isRequired,
  downloadEntryPdf: T.func.isRequired,
  switchEntryStatus: T.func.isRequired,
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
    downloadEntryPdf: entryId => dispatch(actions.downloadEntryPdf(entryId)),
    switchEntryStatus: entryId => dispatch(actions.switchEntryStatus(entryId)),
    deleteEntry: entryId => dispatch(actions.deleteEntry(entryId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedEntries = connect(mapStateToProps, mapDispatchToProps)(Entries)

export {ConnectedEntries as Entries}