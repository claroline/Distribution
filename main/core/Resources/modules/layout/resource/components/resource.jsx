import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {registerModalTypes} from '#/main/core/layout/modal'
import {Page, PageHeader, PageContent} from '#/main/core/layout/page/components/page.jsx'
import {ResourceActions} from '#/main/core/layout/resource/components/resource-actions.jsx'

import {MODAL_RESOURCE_PROPERTIES, EditPropertiesModal} from '#/main/core/layout/resource/components/modal/edit-properties.jsx'
import {MODAL_RESOURCE_RIGHTS, EditRightsModal} from '#/main/core/layout/resource/rights/components/modal/edit-rights.jsx'
import {MODAL_RESOURCE_PASSWORD, PasswordModal} from '#/main/core/layout/resource/components/modal/password.jsx'

class Resource extends Component {
  constructor(props) {
    super(props)

    // register modals
    registerModalTypes([
      [MODAL_RESOURCE_PROPERTIES, EditPropertiesModal],
      [MODAL_RESOURCE_RIGHTS, EditRightsModal],
      [MODAL_RESOURCE_PASSWORD, PasswordModal]
    ])

    // open resource in fullscreen if configured
    this.state = {
      fullscreen: this.props.resourceNode.parameters.fullscreen,
      code:'what am I'
    }

    this.toggleFullscreen = this.toggleFullscreen.bind(this)
  }

  validateCode() {
    this.props.tryUnlock(this.props.resourceNode, this.state.code)
  }

  handleCode(code) {
    this.setState({code})
  }

  toggleFullscreen() {
    this.setState({
      fullscreen: !this.state.fullscreen
    })
  }

  render() {
    return (
      this.props.isLocked ?
        <div>
          THIS CONTENT IS PROTECTED
          <input type="text" value={this.state.code} onChange={e => this.handleCode(e.target.value)}/>
          <button onClick={this.validateCode.bind(this)} type="submit" className="btn btn-primary"> validate </button>
        </div>
      :
        <Page
          className="resource-page"
          embedded={this.props.embedded}
          fullscreen={this.state.fullscreen}

          modal={this.props.modal}
          fadeModal={this.props.fadeModal}
          hideModal={this.props.hideModal}
        >
          <PageHeader
            className="resource-header"
            title={this.props.resourceNode.name}
          >
            <ResourceActions
              resourceNode={this.props.resourceNode}
              editor={this.props.editor}
              customActions={this.props.customActions}
              fullscreen={this.state.fullscreen}
              toggleFullscreen={this.toggleFullscreen}
              togglePublication={this.props.togglePublication}
              showModal={this.props.showModal}
              fadeModal={this.props.fadeModal}
              updateNode={this.props.updateNode}
            />
          </PageHeader>

          <PageContent>
            {this.props.children}
          </PageContent>
        </Page>
    )
  }
}

Resource.propTypes = {
  isLocked: T.bool.isRequired,
  resourceNode: T.shape({
    name: T.string.isRequired,
    parameters: T.shape({
      fullscreen: T.bool.isRequired
    }).isRequired
  }).isRequired,
  embedded: T.bool,
  children: T.node.isRequired,
  modal: T.shape({
    type: T.string,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired,

  customActions: T.array,
  tryUnlock: T.func.isRequired,
  /**
   * If provided, this permits to maCODEnage the resource editor in the header (aka. open, save actions).
   */
  editor: T.shape({
    opened: T.bool,
    open: T.oneOfType([T.func, T.string]).isRequired,
    save: T.shape({
      disabled: T.bool.isRequired,
      action: T.oneOfType([T.string, T.func]).isRequired
    }).isRequired
  }),

  togglePublication: T.func.isRequired,
  updateNode: T.func.isRequired
}

Resource.defaultProps = {
  embedded: false
}

export {Resource}
