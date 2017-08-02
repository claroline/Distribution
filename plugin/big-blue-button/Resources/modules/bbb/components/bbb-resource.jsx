import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import shajs from 'sha.js'
import {trans} from '#/main/core/translation'
import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {actions} from '../actions'

class BBBResource extends Component {
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
      <ResourceContainer
        edit="#"
        editMode={false}
        save={{
          disabled: false,
          action: () => {}
        }}
        customActions={[]}
      >
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
      </ResourceContainer>
    )
  }
}

BBBResource.propTypes = {
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

const ConnectedBBBResource = connect(mapStateToProps, mapDispatchToProps)(BBBResource)

export {ConnectedBBBResource as BBBResource}