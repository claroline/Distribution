import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Await} from '#/main/app/components/await'

import {getTool} from '#/main/core/tools'

const ToolMenu = props => {
  if (props.name) {
    return (
      <nav className="current-tool">
        <h2 className="h4">
          {trans(props.name, {}, 'tools')}
        </h2>

        {props.loaded &&
          <Await
            for={getTool(props.name)}
            then={(module) => {
              if (module.default.menu) {
                return createElement(module.default.menu, {
                  basePath: props.basePath + '/' + props.name
                })
              }

              return 'no menu'
            }}
          />
        }
      </nav>
    )
  }

  return null
}

ToolMenu.propTypes = {
  basePath: T.string.isRequired,
  name: T.string,
  loaded: T.bool.isRequired
}

export {
  ToolMenu
}
