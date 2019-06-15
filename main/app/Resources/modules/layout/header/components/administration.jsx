import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

/*<div className="app-header-dropdown-header">
  <h2 className="h4">
  {trans('administration')}
</h2>
</div>*/

const AdministrationMenu = (props) =>
  <div className="app-header-dropdown dropdown-menu dropdown-menu-right">
    {props.maintenance &&
      <div className="alert alert-warning">
        <span className="fa fa-fw fa-exclamation-triangle" />
        {trans('maintenance_mode_alert')}
      </div>
    }

    <div className="list-group">
      {props.tools.map((tool) =>
        <Button
          key={tool.name}
          id={`app-administration-${tool.name}`}
          type={LINK_BUTTON}
          className="list-group-item"
          icon={`fa fa-fw fa-${tool.icon}`}
          label={trans(tool.name, {}, 'tools')}
          target={`/admin/${tool.name}`}
        />
      )}
    </div>
  </div>

AdministrationMenu.propTypes = {
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  })).isRequired,
  maintenance: T.bool.isRequired
}

const HeaderAdministration = props =>
  <Button
    id="app-administration"
    type={MENU_BUTTON}
    className="app-header-btn app-header-item"
    icon="fa fa-fw fa-cogs"
    label={trans('administration')}
    tooltip="bottom"
    subscript={props.maintenance ? {
      type: 'text',
      status: 'danger',
      value: (<span className="fa fa-exclamation-triangle" />)
    } : undefined}
    menu={
      <AdministrationMenu
        tools={props.tools}
        maintenance={props.maintenance}
      />
    }
  />

HeaderAdministration.propTypes = {
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  })).isRequired,
  maintenance: T.bool.isRequired
}

export {
  HeaderAdministration
}
