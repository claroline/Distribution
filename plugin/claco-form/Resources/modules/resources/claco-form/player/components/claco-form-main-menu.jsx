import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {PropTypes as T} from 'prop-types'

import {generateUrl} from '#/main/core/api/router'
import {trans} from '#/main/core/translation'

import {selectors} from '#/plugin/claco-form/resources/claco-form/selectors'

class ClacoFormMainMenuComponent extends Component {
  goToRandomEntry() {
    fetch(generateUrl('claro_claco_form_entry_random', {clacoForm: this.props.resourceId}), {
      method: 'GET' ,
      credentials: 'include'
    })
      .then(response => response.json())
      .then(entryId => {
        if (entryId > 0) {
          this.props.history.push(`/entry/${entryId}/view`)
        }
      })
  }

  render() {
    return (
      <div className="claco-form-main-menu">
        {this.props.canAddEntry &&
          <a
            className="btn btn-default claco-form-menu-btn"
            href="#/entry/create"
          >
            <span className="fa fa-fw fa-pencil-square-o fa-5x"></span>
            <h4>{trans('add_entry', {}, 'clacoform')}</h4>
          </a>
        }
        {this.props.canSearchEntry &&
          <a
            className="btn btn-default claco-form-menu-btn"
            href="#/entries"
          >
            <span className="fa fa-fw fa-search fa-5x"></span>
            <h4>{trans('find_entry', {}, 'clacoform')}</h4>
          </a>
        }
        {this.props.randomEnabled &&
          <button
            className="btn btn-default claco-form-menu-btn"
            onClick={() => this.goToRandomEntry()}
          >
            <span className="fa fa-fw fa-random fa-5x"></span>
            <h4>{trans('random_entry', {}, 'clacoform')}</h4>
          </button>
        }
      </div>
    )
  }
}

ClacoFormMainMenuComponent.propTypes = {
  resourceId: T.number.isRequired,
  canSearchEntry: T.bool.isRequired,
  canAddEntry: T.bool.isRequired,
  randomEnabled: T.bool.isRequired,
  history: T.object.isRequired
}

const ClacoFormMainMenu = withRouter(connect(
  (state) => ({
    resourceId: selectors.clacoForm(state).id,
    canSearchEntry: selectors.canSearchEntry(state),
    randomEnabled: selectors.getParam(state, 'random_enabled'),
    canAddEntry: selectors.canAddEntry(state)
  })
)(ClacoFormMainMenuComponent))

export {
  ClacoFormMainMenu
}