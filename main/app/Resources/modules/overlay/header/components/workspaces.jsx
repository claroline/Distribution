import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {URL_BUTTON} from '#/main/app/buttons'
import {MenuButton} from '#/main/app/buttons/menu/components/button'

const WorkspacesMenu = props => 
  <div className="app-workspaces dropdown-menu">
    <Button
      type={URL_BUTTON}
      className="btn btn-block"
      icon="fa fa-fw fa-home"
      label={trans('home')}
      target={['claro_index']}
    />

    <Button
      type={URL_BUTTON}
      className="btn btn-block"
      icon="fa fa-fw fa-atlas"
      label={trans('desktop')}
      target={['claro_desktop_open']}
    />

    {props.personal &&
      <Button
        type={URL_BUTTON}
        className="btn btn-block"
        icon="fa fa-fw fa-book"
        label={trans('personal_ws')}
        target={['claro_desktop_open']}
      />
    }
    {props.history &&
      props.history.map((ws) => 
        <Button
          key ={ws.id}
          type={URL_BUTTON}
          className="btn btn-block"
          icon="fa fa-fw fa-book"
          label={ws.name}
          target={['claro_desktop_open']}
        />
      )
    }
  </div>

const HeaderWorkspaces = props => {
  
  let menuButtonTitle = trans('desktop')
      if ('claro_index' === props.currentLocation) {
        menuButtonTitle = trans('home')
      } else if ('claro_workspace_open_tool' === props.currentLocation) {
        menuButtonTitle = props.current.name
      } 

  
  return (  
    <MenuButton
      id="app-workspaces-menu"
      className="app-header-item app-header-btn"
      containerClassName="app-header-workspaces"
      menu={
        <WorkspacesMenu
          personal={props.personal}
          current={props.current}
          history={props.history}
        />
      }
    >
      <span className="fa fa-fw fa-atlas icon-with-text-right" />
        {menuButtonTitle}
      <span className="fa fa-fw fa-caret-down icon-with-text-left" />
    </MenuButton>)

}

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
