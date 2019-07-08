import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

const HistoryDropdown = (props) =>
  <div className="app-header-dropdown dropdown-menu dropdown-menu-right">
    <ul className="nav nav-tabs">
      <li className="active">
        <a
          role="button"
          href=""
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          Espaces d'activités
        </a>
      </li>
      <li>
        <a
          role="button"
          href=""
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          Ressources
        </a>
      </li>
    </ul>
  </div>

HistoryDropdown.propTypes = {

}

const HistoryMenu = props =>
  <Button
    id="app-favorites"
    type={MENU_BUTTON}
    className="app-header-btn app-header-item"
    icon="fa fa-fw fa-history"
    label={trans('history')}
    tooltip="bottom"
    menu={
      <HistoryDropdown

      />
    }
  />

HistoryMenu.propTypes = {

}

export {
  HistoryMenu
}
