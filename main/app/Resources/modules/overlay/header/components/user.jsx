import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'
import {CALLBACK_BUTTON, URL_BUTTON} from '#/main/app/buttons'

import {UserAvatar} from '#/main/core/user/components/avatar'
import {UserMicro} from '#/main/core/user/components/micro'

// TODO : add user poster when available

const UserMenu = props =>
  <div className="user-menu dropdown-menu dropdown-menu-right">
    <div className="user-menu-header">
      <div className="user-menu-icon">
        <UserAvatar picture={props.currentUser.picture} alt={true} />
      </div>

      <h2 className="h4">
        {props.currentUser.name}
      </h2>

      <em>{props.currentUser.roles.map(role => trans(role.translationKey)).join(', ')}</em>
    </div>

    {!props.authenticated &&
      <div className="user-menu-body">
        <Button
          type={URL_BUTTON}
          className="btn btn-block btn-emphasis"
          label={trans('login', {}, 'actions')}
          primary={true}
          target=""
        />

        <Button
          type={URL_BUTTON}
          className="btn btn-block"
          label={trans('self-register', {}, 'actions')}
          target=""
        />
      </div>
    }

    <div className="list-group">
      {props.authenticated &&
        <Button
          type={URL_BUTTON}
          className="list-group-item"
          icon="fa fa-fw fa-user"
          label={trans('profile')}
          target={['claro_user_profile', {publicUrl: props.currentUser.publicUrl}]}
        />
      }

      <Button
        type={URL_BUTTON}
        className="list-group-item"
        icon="fa fa-fw fa-cog"
        label="Paramètres"
        target=""
      />

      <Button
        type={URL_BUTTON}
        className="list-group-item"
        icon="fa fa-fw fa-calendar"
        label="Agenda"
        target=""
      />

      <Button
        type={URL_BUTTON}
        className="list-group-item"
        icon="fa fa-fw fa-folder"
        label="Resources"
        target=""
      />
    </div>

    <div className="user-menu-footer">
      <Button
        type={URL_BUTTON}
        className="user-menu-btn"
        icon="fa fa-fw fa-question"
        label={trans('help')}
        tooltip="bottom"
        target=""
      />

      <Button
        type={URL_BUTTON}
        className="user-menu-btn"
        icon="fa fa-fw fa-info"
        label={trans('about')}
        tooltip="bottom"
        target=""
      />

      {props.authenticated &&
        <Button
          type={URL_BUTTON}
          className="user-menu-btn"
          icon="fa fa-fw fa-power-off"
          label={trans('logout')}
          tooltip="bottom"
          target=""
        />
      }
    </div>

  </div>

UserMenu.propTypes = {
  authenticated: T.bool.isRequired,
  currentUser: T.shape({

  }).isRequired
}

class HeaderUser extends Component {
  constructor(props) {
    super(props)

    this.state = {opened: false}
  }

  render() {
    return (
      <div className={classes('app-header-item app-header-user dropdown', {
        open: this.state.opened
      })}>
        <CallbackButton
          className="dropdown-toggle app-header-btn"
          callback={() => this.setState({opened: !this.state.opened})}
        >
          <UserMicro {...this.props.currentUser} />
        </CallbackButton>

        {this.state.opened &&
          <UserMenu
            authenticated={this.props.authenticated}
            currentUser={this.props.currentUser}
          />
        }
      </div>
    )
  }
}

HeaderUser.propTypes = {
  registration: T.bool,
  help: T.string,
  authenticated: T.bool.isRequired,
  currentUser: T.shape({

  }).isRequired
}

export {
  HeaderUser
}
