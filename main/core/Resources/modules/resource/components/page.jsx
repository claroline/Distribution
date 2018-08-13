import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/core/translation'
import {Page} from '#/main/app/page/components/page'
import {Routes} from '#/main/app/router'
import {Action as ActionTypes} from '#/main/app/action/prop-types'

import {
  ResourceNode as ResourceNodeTypes,
  UserEvaluation as UserEvaluationTypes
} from '#/main/core/resource/prop-types'
import {getActions, getToolbar} from '#/main/core/resource/utils'

import {ResourceRestrictions} from '#/main/core/resource/components/restrictions'
import {UserProgression} from '#/main/core/resource/components/user-progression'

class ResourcePage extends Component {
  constructor(props) {
    super(props)

    // open resource in fullscreen if configured
    this.state = {
      fullscreen: !this.props.embedded && get(this.props.resourceNode, 'display.fullscreen')
    }
  }

  componentDidMount() {
    this.props.loadResource(this.props.resourceNode)
  }

  componentWillReceiveProps(nextProps) {
    // the resource has changed
    if (this.props.resourceNode.id !== nextProps.resourceNode.id) {
      // load the new one
      this.props.loadResource(nextProps.resourceNode)
    }
  }

  toggleFullscreen() {
    this.setState({fullscreen: !this.state.fullscreen})
  }

  render() {
    return (
      <Page
        className={classes('resource-page', `${this.props.resourceNode.meta.type}-page`)}
        embedded={this.props.embedded}
        fullscreen={this.state.fullscreen}
        title={this.props.resourceNode.name}
        poster={this.props.resourceNode.poster ? this.props.resourceNode.poster.url : undefined}
        icon={this.props.resourceNode.display.showIcon && this.props.userEvaluation &&
          <UserProgression
            userEvaluation={this.props.userEvaluation}
            width={70}
            height={70}
          />
        }
        toolbar={getToolbar(this.props.primaryAction, true)}
        actions={getActions([this.props.resourceNode], {
          update: (resourceNodes) => {
            // checks if the action have modified the current node
            const currentNode = resourceNodes.find(node => node.id === this.props.resourceNode.id)
            if (currentNode) {
              // grabs updated data
              this.props.updateNode(currentNode)
            }
          },
          delete: (resourceNodes) => {
            // checks if the action have deleted the current node
            const currentNode = resourceNodes.find(node => node.id === this.props.resourceNode.id)
            if (currentNode) {
              // grabs updated data
              //this.props.deleteNode(currentNode)
            }
          }
        }).then((actions) => {
          return [].concat(this.props.customActions || [], actions, [
            {
              name: 'fullscreen',
              type: 'callback',
              icon: classes('fa fa-fw', {
                'fa-expand': !this.state.fullscreen,
                'fa-compress': this.state.fullscreen
              }),
              label: trans(this.state.fullscreen ? 'fullscreen_off' : 'fullscreen_on'),
              callback: this.toggleFullscreen.bind(this)
            }
          ])
        })}
      >
        <ResourceRestrictions />

        {/*this.props.children*/}
      </Page>
    )
  }
}

ResourcePage.propTypes = {
  embedded: T.bool,
  /**
   * The current resource node.
   */
  resourceNode: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired,
  updateNode: T.func.isRequired,
  loadResource: T.func.isRequired,

  /**
   * The current user evaluation.
   */
  userEvaluation: T.shape(
    UserEvaluationTypes.propTypes
  ),

  // the name of the primary action of the resource (if we want to override the default one)
  primaryAction: T.string,

  customActions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  children: T.node.isRequired
}

export {
  ResourcePage
}
