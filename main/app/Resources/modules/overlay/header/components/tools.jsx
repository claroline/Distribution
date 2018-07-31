import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, URL_BUTTON} from '#/main/app/buttons'

const HeaderTools = props =>
  <div className="app-header-item app-header-tools">
    <Button
      id="app-locale-select"
      type={MENU_BUTTON}
      className="app-header-btn"
      menu={{
        position: 'bottom',
        align: 'left',
        items: props.tools.available.map(tool => ({
          type: URL_BUTTON,
          label: trans(tool.name, {}, 'tools'),
          target: ['claro_open_tool', {toolName: tool.name}]
        }))
      }}
    >
      <LocaleFlag locale={props.locale.current} />
    </Button>
  </div>

HeaderTools.propTypes = {
  icon: T.string.isRequired,
  label: T.string.isRequired,
  tools: T.arrayOf(T.shape({

  })).isRequired
}

export {
  HeaderTools
}
