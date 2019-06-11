import React, {createElement} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {Await} from '#/main/app/components/await'
import {CallbackButton} from '#/main/app/buttons/callback'

import {getTool} from '#/main/core/tools'

const ToolMenu = props => {
  if (props.name) {
    return (
      <nav className={classes('current-tool', {
        opened: props.opened
      })}>
        <h2 className="h4">
          <CallbackButton callback={props.open}>
            {trans(props.name, {}, 'tools')}
          </CallbackButton>
        </h2>

        {(props.loaded && props.opened) &&
          <Await
            for={getTool(props.name)}
            then={(module) => {
              if (module.default.menu) {
                return createElement(module.default.menu, {
                  path: props.path
                })
              }

              return null
            }}
          />
        }
      </nav>
    )
  }

  return null
}

ToolMenu.propTypes = {
  path: T.string,
  name: T.string,
  loaded: T.bool.isRequired,
  opened: T.bool.isRequired,
  open: T.func.isRequired
}

export {
  ToolMenu
}
