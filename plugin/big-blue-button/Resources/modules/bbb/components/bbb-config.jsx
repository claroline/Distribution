import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {withRouter} from 'react-router-dom'
import {trans} from '#/main/core/translation'
import {Resource as ResourceContainer} from '#/main/core/layout/resource/containers/resource.jsx'
import {actions} from '../actions'

class BBBConfig extends Component {
  //componentDidMount() {
  //  if (this.props.serverUrl && this.props.securitySalt) {
  //    this.props.connectToBBB()
  //
  //    if (this.props.params.newTab) {
  //      const newTabInterval = setInterval(
  //        () => {
  //          if (this.props.bbbUrl) {
  //            clearInterval(newTabInterval)
  //            window.open(this.props.bbbUrl, '_blank')
  //          }
  //        },
  //        2000
  //      )
  //    }
  //  }
  //}

  render() {
    return (
      //<ResourceContainer
      //  edit="/configure"
      //  editMode={true}
      //  save={{
      //    disabled: false,
      //    action: () => {}
      //  }}
      //  customActions={[]}
      //>
        <div>
          Configuration
        </div>
      //</ResourceContainer>
    )
  }
}

BBBConfig.propTypes = {
  params: T.shape({
    id: T.number,
    roomName: T.string,
    newTab: T.boolean,
    moderatorRequired: T.boolean,
    record: T.boolean
  })
}

function mapStateToProps(state) {
  return {
    params: state.resource
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedBBBConfig = withRouter(connect(mapStateToProps, mapDispatchToProps)(BBBConfig))

export {ConnectedBBBConfig as BBBConfig}