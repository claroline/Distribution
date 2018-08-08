import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import invariant from 'invariant'

import {url} from '#/main/app/api'
import {theme} from '#/main/app/config'
import {mount, unmount} from '#/main/app/mount'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {getResource} from '#/main/core/resources'

class ResourceMain extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <Await
        for={getResource(this.props.newNode.meta.type)()}
        then={module => {
          if (module.App) {
            this.setState({component: module.App()})
          }
        }}
      >
        {this.state.component && React.createElement(this.state.component)}

        {this.state.styles && 0 !== this.state.styles.length &&
          <link rel="stylesheet" type="text/css" href={theme(this.state.styles)} />
        }
      </Await>
    )
  }
}

ResourceMain.propTypes = {
  resourceNode: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

ResourceMain.defaultProps = {
  lifecycle: {}
}

export {
  ResourceMain
}
