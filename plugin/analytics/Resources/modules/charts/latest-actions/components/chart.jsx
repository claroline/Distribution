import React from 'react'

import {MenuButton} from '#/main/app/buttons/menu'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const LatestActionsChart = () =>
  <div className="panel panel-default panel-analytics">
    <div className="panel-heading">
      <h2 className="panel-title">
        Dernières actions
      </h2>

      <nav className="panel-actions">
        <MenuButton
          id="latest-activity-actions"
          className="btn-link"
          menu={{
            align: 'right',
            items: [
              {
                type: CALLBACK_BUTTON,
                label: 'Toutes',
                callback: () => true,
                active: true
              }, {
                type: CALLBACK_BUTTON,
                label: 'Connexions',
                callback: () => true
              }, {
                type: CALLBACK_BUTTON,
                label: 'Evaluations',
                callback: () => true
              }
            ]
          }}
        >
          Toutes
          <span className="fa fa-caret-down icon-with-text-left" />
        </MenuButton>
      </nav>
    </div>
  </div>

export {
  LatestActionsChart
}
