import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {Path} from '#/main/core/tools/dashboard/path/components/path'

class Paths extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchPathsData(this.props.workspaceId)
  }

  render() {
    return (
      <div>
        {this.props.trackings.map((tracking, index) =>
          <Path
            key={`path-tracking-${index}`}
            path={tracking.path}
            steps={tracking.steps}
          />
        )}
      </div>
    )
  }
}

Paths.propTypes = {
  workspaceId: T.string.isRequired,
  trackings: T.array,
  fetchPathsData: T.func.isRequired
}

export {
  Paths
}
