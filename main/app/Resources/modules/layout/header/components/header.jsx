import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, URL_BUTTON} from '#/main/app/buttons'

import {HeaderBrand} from '#/main/app/layout/header/components/brand'
import {HeaderNotifications} from '#/main/app/layout/header/components/notifications'
import {HeaderAdministration} from '#/main/app/layout/header/components/administration'
import {HeaderUser} from '#/main/app/layout/header/components/user'
import {HeaderMain} from '#/main/app/layout/header/components/main'

import {HeaderFavorites} from '#/main/app/layout/header/components/favorites'
import {HeaderHistory} from '#/main/app/layout/header/components/history'

import {getWalkthrough} from '#/main/app/layout/header/walkthroughs/menus'

const Header = props =>
  <header className="app-header-container">
    <div className="app-header" role="presentation">
      <Button
        className="app-header-item app-header-btn"
        type={CALLBACK_BUTTON}
        icon="fa fa-fw fa-bars"
        label={trans('menu')}
        tooltip="bottom"
        callback={props.toggleMenu}
      />

      {((props.display.name && props.title) || props.logo) &&
        <HeaderBrand
          logo={props.logo}
          title={props.title}
          subtitle={props.subtitle}
          showTitle={props.display.name}
          redirectHome={props.redirectHome}
        />
      }

      <HeaderMain
        menu={props.mainMenu}
        authenticated={props.authenticated}
        user={props.currentUser}
      />

      {false && 0 !== props.administration.length &&
        <HeaderAdministration
          maintenance={props.maintenance}
          tools={props.administration}
        />
      }

      <HeaderHistory />

      <HeaderFavorites />

      {props.authenticated &&
        <HeaderNotifications
          count={props.count}
          tools={props.notificationTools}
        />
      }

      <HeaderUser
        currentUser={props.currentUser}
        authenticated={props.authenticated}
        impersonated={props.impersonated}
        login={props.loginUrl}
        registration={props.registrationUrl}
        tools={props.tools}
        locale={props.locale}
        actions={[
          {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-street-view',
            label: trans('walkthroughs'),
            callback: () => props.startWalkthrough(getWalkthrough(props.tools, props.administration, props.authenticated, props.display))
          }, {
            type: URL_BUTTON,
            icon: 'fa fa-fw fa-question',
            label: trans('help'),
            target: props.helpUrl,
            displayed: !!props.helpUrl
          }, {
            type: URL_BUTTON,
            icon: 'fa fa-fw fa-power-off',
            label: trans('logout'),
            target: ['claro_security_logout'],
            displayed: props.authenticated && !props.impersonated,
            dangerous: true
          }, {
            type: URL_BUTTON,
            icon: 'fa fa-fw fa-power-off',
            label: trans('logout'),
            target: ['claro_main_app', {_switch: '_exit'}],
            displayed: props.impersonated,
            dangerous: true
          }
        ]}
      />
    </div>
  </header>

Header.propTypes = {
  maintenance: T.bool.isRequired,

  mainMenu: T.string,
  locale: T.shape({
    current: T.string.isRequired,
    available: T.arrayOf(T.string).isRequired
  }).isRequired,
  logo: T.shape({
    url: T.string.isRequired,
    colorized: T.bool
  }),
  title: T.string,
  subtitle: T.string,
  display: T.shape({
    name: T.bool.isRequired
  }).isRequired,

  /**
   * The currently logged user.
   */
  currentUser: T.shape({
    id: T.string,
    name: T.string,
    username: T.string,
    publicUrl: T.string,
    picture: T.shape({
      url: T.string.isRequired
    }),
    roles: T.array
  }),
  impersonated: T.bool.isRequired,

  count: T.shape({
    notifications: T.number,
    messages: T.number
  }),
  authenticated: T.bool.isRequired,
  tools: T.array,
  notificationTools: T.array,
  administration: T.array,
  loginUrl: T.string.isRequired,
  helpUrl: T.string,
  registrationUrl: T.string,
  redirectHome: T.bool.isRequired,
  startWalkthrough: T.func.isRequired,
  toggleMenu: T.func.isRequired
}

Header.defaultProps = {
  impersonated: true,
  currentUser: null,
  tools: [],
  notificationTools: [],
  administration: [],
  registration: false
}

export {
  Header
}
