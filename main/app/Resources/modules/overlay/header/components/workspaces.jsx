import React from 'react'
import {PropTypes as T} from 'prop-types'

const HeaderWorkspaces = props =>
  <div className="app-header-item app-header-workspaces">

  </div>

HeaderWorkspaces.propTypes = {
  personal: T.shape({

  }),
  current: T.shape({

  }),
  history: T.arrayOf(T.shape({

  }))
}

HeaderWorkspaces.defaultProps = {

}

export {
  HeaderWorkspaces
}
