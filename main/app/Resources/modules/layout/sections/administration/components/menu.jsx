import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans, number} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'

import {MenuMain} from '#/main/app/layout/menu/containers/main'
import {ToolMenu} from '#/main/core/tool/containers/menu'

  const AdministrationMenu = props =>
  <MenuMain
    title={trans('administration')}
    backAction={{
      type: LINK_BUTTON,
      icon: 'fa fa-fw fa-angle-double-left',
      label: trans('desktop'),
      target: '/desktop',
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
        id="workspace-progression"
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
      path="/admin"
      opened={'tool' === props.section}
      toggle={() => props.changeSection('tool')}
    />
  </MenuMain>

AdministrationMenu.propTypes = {
  section: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  })),
  changeSection: T.func.isRequired
}

AdministrationMenu.defaultProps = {
  tools: []
}

export {
  AdministrationMenu
}
