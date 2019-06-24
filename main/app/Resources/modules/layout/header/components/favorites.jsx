import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {MENU_BUTTON, LINK_BUTTON} from '#/main/app/buttons'

const FavoritesMenu = (props) =>
  <div className="app-header-dropdown dropdown-menu dropdown-menu-right">
    FAVORITES
  </div>

FavoritesMenu.propTypes = {

}

const HeaderFavorites = props =>
  <Button
    id="app-favorites"
    type={MENU_BUTTON}
    className="app-header-btn app-header-item"
    icon="fa fa-fw fa-star"
    label={trans('favorites')}
    tooltip="bottom"
    menu={
      <FavoritesMenu

      />
    }
  />

HeaderFavorites.propTypes = {

}

export {
  HeaderFavorites
}
