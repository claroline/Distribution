import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans, t} from '#/main/core/translation'
import {selectors} from '../../selectors'

class EntriesList extends Component {
  render() {
    return (
      <div>
        <h2>{trans('entries_list', {}, 'clacoform')}</h2>
        <br/>
        {this.props.canSearchEntry ?
          <div>
            Entries List
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
  canGeneratePdf: T.bool.isRequired,
  resourceId: T.number.isRequired,
  canSearchEntry: T.bool.isRequired
}

function mapStateToProps(state) {
  return {
    canEdit: state.canEdit,
    canGeneratePdf: state.canGeneratePdf,
    resourceId: state.resource.id,
    canSearchEntry: selectors.canSearchEntry(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedEntriesList = connect(mapStateToProps, mapDispatchToProps)(EntriesList)

export {ConnectedEntriesList as EntriesList}