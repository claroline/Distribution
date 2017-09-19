import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {selectors} from '../selectors'
//import {actions} from '../actions'

class ClacoFormMainMenu extends Component {
  render() {
    return (
      <div className="claco-form-main-menu">
        <a className="btn btn-default claco-form-menu-btn">
          <span className="fa fa-w fa-pencil-square-o fa-5x"></span>
          <h4>{trans('add_entry', {}, 'clacoform')}</h4>
        </a>
        {this.props.canSearchEntry &&
          <a
            className="btn btn-default claco-form-menu-btn"
            href="#/entries"
          >
            <span className="fa fa-w fa-search fa-5x"></span>
            <h4>{trans('find_entry', {}, 'clacoform')}</h4>
          </a>
        }
        {this.props.params['random_enabled'] &&
          <button className="btn btn-default claco-form-menu-btn">
            <span className="fa fa-w fa-random fa-5x"></span>
            <h4>{trans('random_entry', {}, 'clacoform')}</h4>
          </button>
        }
      </div>
    )
  }
}

ClacoFormMainMenu.propTypes = {
  params: T.shape({
    random_enabled: T.boolean
  }).isRequired,
  canSearchEntry: T.bool.isRequired
}

function mapStateToProps(state) {
  return {
    params: selectors.params(state),
    canSearchEntry: selectors.canSearchEntry(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedClacoFormMainMenu = connect(mapStateToProps, mapDispatchToProps)(ClacoFormMainMenu)

export {ConnectedClacoFormMainMenu as ClacoFormMainMenu}