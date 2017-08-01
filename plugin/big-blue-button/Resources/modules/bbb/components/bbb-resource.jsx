import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'

class BBBResource extends Component {
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
        {this.props.serverUrl && this.props.securitySalt ?
          <div>
            {this.props.serverUrl}
            <hr/>
            {this.props.securitySalt}
          </div> :
          <div className="alert alert-danger">
            {trans('bbb_not_configured_msg', {}, 'bbb')}
          </div>
        }
      </ResourceContainer>
    )
  }
}

BBBResource.propTypes = {
  serverUrl: T.string,
  securitySalt: T.string
}

function mapStateToProps(state) {
  return {
    serverUrl: state.config.serverUrl,
    securitySalt: state.config.securitySalt
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedBBBResource = connect(mapStateToProps, mapDispatchToProps)(BBBResource)

export {ConnectedBBBResource as BBBResource}