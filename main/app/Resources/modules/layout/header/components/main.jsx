import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Await} from '#/main/app/components/await'

import {getMenu} from '#/main/app/layout/header/utils'

/**
 * The main menu of the Header.
 * It is provided by the platform configuration and a plugin.
 */
const HeaderMain = (props) =>
  <div className="app-header-main">
    {props.menu &&
      <Await
        for={getMenu(props.menu)}
        then={(menu) => React.createElement(menu.default, {
          authenticated: props.authenticated,
          user: props.user
        })}
      />
    }
  </div>

HeaderMain.propTypes = {
  menu: T.string,
  authenticated: T.bool.isRequired,
  user: T.object // if no user authenticated, it contains a placeholder object
}

export {
  HeaderMain
}
