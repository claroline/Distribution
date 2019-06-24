import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

const HistoryMenu = (props) =>
  <div className="app-header-dropdown dropdown-menu dropdown-menu-right">
    HISTORY
  </div>

HistoryMenu.propTypes = {

}

const HeaderHistory = props =>
  <Button
    id="app-history"
    type={MENU_BUTTON}
    className="app-header-btn app-header-item"
    icon="fa fa-fw fa-history"
    label={trans('history')}
    tooltip="bottom"
    menu={
      <HistoryMenu

      />
    }
  />

HeaderHistory.propTypes = {

}

export {
  HeaderHistory
}
