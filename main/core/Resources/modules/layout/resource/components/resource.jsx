import React, {Component, PropTypes as T} from 'react'

import {registerModalTypes} from '#/main/core/layout/modal'
import { Page, PageHeader, PageContent } from '#/main/core/layout/page/components/page.jsx'
import { ResourceActions } from './resource-actions.jsx'

import {MODAL_RESOURCE_PROPERTIES, EditPropertiesModal} from './modal/edit-properties.jsx'
import {MODAL_RESOURCE_RIGHTS, EditRightsModal} from './modal/edit-rights.jsx'

class Resource extends Component {
  constructor(props) {
    super(props)

    // register modals
    registerModalTypes([
      [MODAL_RESOURCE_PROPERTIES, EditPropertiesModal],
      [MODAL_RESOURCE_RIGHTS,     EditRightsModal]
    ])
  }

  render() {
    return (
      <Page
        className="resource-page"
        embedded={this.props.embedded}
        fullscreen={this.props.fullscreen}

        modal={this.props.modal}
        showModal={this.props.showModal}
        fadeModal={this.props.fadeModal}
        hideModal={this.props.hideModal}
      >
        <PageHeader
          className="resource-header"
          title={this.props.resourceNode.name}
        >
          <ResourceActions
            resourceNode={this.props.resourceNode}
            editMode={this.props.editMode}
            edit={this.props.edit}
            save={this.props.save}
            customActions={this.props.customActions}
            fullscreen={this.props.fullscreen}
            toggleFullscreen={this.props.toggleFullscreen}
            togglePublication={this.props.togglePublication}
            showModal={this.props.showModal}
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
  resourceNode: T.shape({
    name: T.string.isRequired
  }).isRequired,
  fullscreen: T.bool,
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
  toggleFullscreen: T.func.isRequired,
  togglePublication: T.func.isRequired,

  customActions: T.array.isRequired,
  editMode: T.bool,
  edit: T.oneOfType([T.func, T.string]).isRequired,
  save: T.object.isRequired
}

Resource.defaultProps = {
  embedded: false
}

export {Resource}
