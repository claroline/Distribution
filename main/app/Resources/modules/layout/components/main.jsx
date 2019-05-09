import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router/components/routes'

import {LayoutSidebar} from '#/main/app/layout/components/sidebar'
import {LayoutToolbar} from '#/main/app/layout/components/toolbar'
import {Header} from '#/main/app/layout/header/containers/header'
import {FooterMain} from '#/main/app/layout/footer/containers/main'

import {DesktopMenu} from '#/main/app/layout/sections/desktop/containers/menu'
import {DesktopMain} from '#/main/app/layout/sections/desktop/containers/main'

const LayoutMain = props =>
  <Fragment>
    <div className="app" role="presentation">
      <Header
        maintenance={props.maintenance}
        impersonated={props.impersonated}

        toggleMenu={props.toggleMenu}
      />

      {props.menuOpened &&
        <Routes
          routes={[
            {
              path: '/',
              exact: true
            }, {
              path: '/desktop',
              component: DesktopMenu
            }, {
              path: '/administration'
            }
          ]}
        />
      }

      <div className="app-content" role="presentation">
        <div className="page-container" role="presentation">
          <Routes
            routes={[
              {
                path: '/',
                exact: true
              }, {
                path: '/desktop',
                component: DesktopMain
              }, {
                path: '/administration'
              }
            ]}
          />
        </div>

        <FooterMain />
      </div>

      <LayoutToolbar
        open={props.openSidebar}
      />
    </div>

    <LayoutSidebar
      close={props.closeSidebar}
    />
  </Fragment>

LayoutMain.propTypes = {
  maintenance: T.bool.isRequired,
  impersonated: T.bool.isRequired,

  menuOpened: T.bool.isRequired,
  toggleMenu: T.func.isRequired,

  openSidebar: T.func.isRequired,
  closeSidebar: T.func.isRequired
}

export {
  LayoutMain
}
