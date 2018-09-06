import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'
import {Button} from '#/main/app/action/components/button'
import {URL_BUTTON} from '#/main/app/buttons'
import {MenuButton} from '#/main/app/buttons/menu/components/button'

const WorkspacesMenu = props =>
  <div className="app-workspaces dropdown-menu">
    <Button
      type={URL_BUTTON}
      className="list-group-item"
      icon="fa fa-fw fa-home"
      label={trans('home')}
      target={['claro_index']}
    />

    <Button
      type={URL_BUTTON}
      className="list-group-item"
      icon="fa fa-fw fa-atlas"
      label={trans('desktop')}
      target={['claro_desktop_open']}
    />
    {props.history &&
      props.history.map((ws) =>
        <Button
          key ={ws.id}
          type={URL_BUTTON}
          className="list-group-item"
          icon="fa fa-fw fa-book"
          label={ws.name}
          target={['claro_workspace_open', {'workspaceId': ws.id}]}
        />
      )
    }
    {props.personal &&
      <Button
        type={URL_BUTTON}
        className="list-group-item"
        icon="fa fa-fw fa-book"
        label={trans('personal_ws')}
        target={['claro_workspace_open', {'workspaceId': props.personal.id}]}
      />
    }
    {/* user workspaces */}
    <Button
      type={URL_BUTTON}
      className="list-group-item"
      icon="fa fa-fw fa-book"
      label={trans('my_workspaces')}
      target={['claro_workspace_by_user']}
    />
    {/* public workspaces */}
    <Button
      type={URL_BUTTON}
      className="list-group-item"
      icon="fa fa-fw fa-book"
      label={trans('find_workspaces')}
      target={['claro_workspace_list']}
    />
    {/* create new workspace */}
    <Button
      type={URL_BUTTON}
      className="list-group-item"
      icon="fa fa-fw fa-plus"
      label={trans('create_workspace')}
      target={url(['claro_admin_open_tool', {'toolName': 'workspace_management'}])+'#/workspaces/creation/form'}
    />
  </div>

const HeaderWorkspaces = props =>
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
    <div className="header-workspaces">
      <span className="fa fa-fw fa-atlas icon-with-text-right" />
      {'workspace' === props.currentLocation ? props.current.name : trans(props.currentLocation)}
      <span className="fa fa-fw fa-caret-down icon-with-text-left" />
    </div>
  </MenuButton>

HeaderWorkspaces.propTypes = {
  personal: T.shape({

  }),
  current: T.shape({
    name: T.string
  }),
  history: T.arrayOf(T.shape({

  })),
  currentLocation: T.string.isRequired
}

HeaderWorkspaces.defaultProps = {

}

export {
  HeaderWorkspaces
}
