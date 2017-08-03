import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions} from '../actions'

class BBBContent extends Component {
  componentDidMount() {
    if (this.props.serverUrl && this.props.securitySalt) {
      this.props.connectToBBB()

      if (this.props.params.newTab) {
        const newTabInterval = setInterval(
          () => {
            if (this.props.bbbUrl) {
              clearInterval(newTabInterval)
              window.open(this.props.bbbUrl, '_blank')
            }
          },
          2000
        )
      }
    }
  }

  render() {
    return (
      <div>
        {(!this.props.serverUrl || !this.props.securitySalt) &&
          <div className="alert alert-danger">
            {trans('bbb_not_configured_msg', {}, 'bbb')}
          </div>
        }
        {this.props.bbbUrl && !this.props.params.newTab &&
          <iframe className="bbb-iframe" src={this.props.bbbUrl}></iframe>
        }
        {this.props.params.newTab &&
          <div className="alert alert-info">
            {trans('bbb_running_in_new_tab', {}, 'bbb')}
          </div>
        }
      </div>
    )
  }
}

BBBContent.propTypes = {
  params: T.shape({
    id: T.number,
    roomName: T.string,
    newTab: T.boolean,
    moderatorRequired: T.boolean,
    record: T.boolean
  }),
  resource: T.shape({
    id: T.string,
    name: T.string
  }),
  serverUrl: T.string,
  securitySalt: T.string,
  bbbUrl: T.string,
  connectToBBB: T.func
}

function mapStateToProps(state) {
  return {
    params: state.resource,
    resource: state.resourceNode,
    serverUrl: state.config.serverUrl,
    securitySalt: state.config.securitySalt,
    bbbUrl: state.bbbUrl
  }
}

function mapDispatchToProps(dispatch) {
  return {
    connectToBBB: () => dispatch(actions.connectToBBB())
  }
}

const ConnectedBBBContent = connect(mapStateToProps, mapDispatchToProps)(BBBContent)

export {ConnectedBBBContent as BBBContent}