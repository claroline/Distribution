import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans, number} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'

import {MenuMain} from '#/main/app/layout/menu/containers/main'
import {MenuSection} from '#/main/app/layout/menu/components/section'
import {ToolMenu} from '#/main/core/tool/containers/menu'
import {getTool} from '#/main/core/tools'
import {DesktopHistory} from '#/main/app/layout/sections/desktop/components/history'

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

    tools={props.tools}
    actions={[
      {
        name: 'walkthrough',
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-street-view',
        label: trans('show-walkthrough', {}, 'actions'),
        callback: () => true
      }, {
        name: 'parameters',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-cog',
        label: trans('configure', {}, 'actions'),
        modal: []
      }, {
        name: 'impersonation',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-mask',
        label: trans('view-as', {}, 'actions'),
        modal: []
      }
    ]}
  >
    <section className="user-progression">
      <h2 className="sr-only">
        Ma progression
      </h2>

      <LiquidGauge
        id="desktop-progression"
        type="user"
        value={25}
        displayValue={(value) => number(value) + '%'}
        width={80}
        height={80}
      />

      <div className="user-progression-info">
        Vous n'avez pas terminé toutes les activités disponibles.
      </div>
    </section>

    <ToolMenu
      path="/desktop"
      opened={'tool' === props.section}
      getApp={getTool}
      toggle={() => props.changeSection('tool')}
    />

    <DesktopHistory
      opened={'history' === props.section}
      toggle={() => {
        if ('history' !== props.section && !props.historyLoaded) {
          // we are opening the section
          props.getHistory()
        }

        props.changeSection('history')
      }}
      loaded={props.historyLoaded}
      results={props.historyResults}
    />
  </MenuMain>

// <h3 className="h4">Collaborateur</h3>

DesktopMenu.propTypes = {
  section: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  })),
  historyLoaded: T.bool.isRequired,
  historyResults: T.arrayOf(T.shape({

  })).isRequired,

  changeSection: T.func.isRequired,
  getHistory: T.func.isRequired
}

DesktopMenu.defaultProps = {
  tools: []
}

export {
  DesktopMenu
}
