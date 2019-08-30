import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans, number} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'

import {MenuMain} from '#/main/app/layout/menu/containers/main'
import {ToolMenu} from '#/main/core/tool/containers/menu'

const DesktopMenu = props =>
  <MenuMain
    title={trans('desktop')}
    backAction={{
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-angle-double-left',
      label: trans('home'),
      target: '/',
      exact: true
    }}

    tools={props.tools.map(tool => ({
      name: tool.name,
      icon: tool.icon,
      path: `/desktop/${tool.name}`
    }))}
    actions={[
      {
        name: 'walkthrough',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-street-view',
        label: trans('show-walkthrough', {}, 'actions'),
        callback: () => true
      }, {
        name: 'impersonation',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-mask',
        label: trans('view-as', {}, 'actions'),
        modal: []
      }
    ]}
  >
    {props.showProgression &&
      <section className="app-menu-progression">
        <h2 className="sr-only">
          Ma progression
        </h2>

        <LiquidGauge
          id="desktop-progression"
          type="user"
          value={25}
          displayValue={(value) => number(value) + '%'}
          width={70}
          height={70}
        />

        <div className="app-menu-progression-info">
          {trans('Vous n\'avez pas terminé toutes les activités disponibles.')}
        </div>
      </section>
    }

    <ToolMenu
      opened={'tool' === props.section}
      toggle={() => props.changeSection('tool')}
    />
  </MenuMain>

// <h3 className="h4">Collaborateur</h3>

DesktopMenu.propTypes = {
  showProgression: T.bool.isRequired,
  section: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  })),
  changeSection: T.func.isRequired
}

DesktopMenu.defaultProps = {
  showProgression: false,
  tools: []
}

export {
  DesktopMenu
}
