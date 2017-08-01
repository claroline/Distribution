import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions} from '../actions'

class BBBConfigForm extends Component {
  render() {
    return (
      <div>
        {this.props.message && this.props.message.content &&
          <div className={`alert alert-${this.props.message.type}`}>
            <i
              className="fa fa-times close"
              onClick={() => this.props.resetMessage()}
            >
            </i>
            {this.props.message.content}
          </div>
        }
        <div className="form-group row">
          <label className="control-label col-md-3">
            {trans('bbb_server_url', {}, 'bbb')}
          </label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              value={this.props.serverUrl}
              onChange={e => this.props.updateConfig('serverUrl', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group row">
          <label className="control-label col-md-3">
            {trans('security_salt', {}, 'bbb')}
          </label>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              value={this.props.securitySalt}
              onChange={e => this.props.updateConfig('securitySalt', e.target.value)}
            />
          </div>
        </div>

        <hr/>
        <div className="config-buttons">
          <button
            className="btn btn-primary"
            onClick={() => this.props.saveConfig()}
          >
            {trans('save_configuration', {}, 'bbb')}
          </button>
        </div>
      </div>
    )
  }
}

BBBConfigForm.propTypes = {
  serverUrl: T.string,
  securitySalt: T.string,
  message: T.object,
  updateConfig: T.func,
  saveConfig: T.func,
  resetMessage: T.func
}

function mapStateToProps(state) {
  return {
    serverUrl: state.serverUrl,
    securitySalt: state.securitySalt,
    message: state.message
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateConfig: (property, value) => dispatch(actions.updateConfiguration(property, value)),
    saveConfig: () => dispatch(actions.saveConfiguration()),
    resetMessage: () => dispatch(actions.resetConfigurationMessage())
  }
}

const ConnectedBBBConfigForm = connect(mapStateToProps, mapDispatchToProps)(BBBConfigForm)

export {ConnectedBBBConfigForm as BBBConfigForm}