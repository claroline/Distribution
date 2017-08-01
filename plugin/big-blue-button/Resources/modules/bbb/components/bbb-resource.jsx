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
        editMode={true}
        save={{
          disabled: true,
          action: () => {}
        }}
        customActions={[]}
      >
        {this.props.serverUrl && this.props.securityKey ?
          <div>
            {this.props.serverUrl}
            <hr/>
            {this.props.securityKey}
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
  securityKey: T.string
}

function mapStateToProps(state) {
  return {
    serverUrl: state.serverUrl,
    securityKey: state.securityKey
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedBBBResource = connect(mapStateToProps, mapDispatchToProps)(BBBResource)

export {ConnectedBBBResource as BBBResource}