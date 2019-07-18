import React from 'react'
import {PropTypes as T} from 'prop-types'

import {getApps} from '#/main/app/plugins'
import {Routes} from '#/main/app/router'
import {Await} from '#/main/app/components/await'

import {ToolPage} from '#/main/core/tool/containers/page'

function getIntegrationApps() {
  const apps = getApps('integration', false)

  return Promise.all(Object.keys(apps).map(type => apps[type]()))
}

const IntegrationTool = props =>
  <ToolPage>
    <Await
      for={getIntegrationApps()}
      then={(apps) => {
        const routes = []

        apps.map(app => {
          routes.push({
            path: `/${app.default.name}`,
            component: app.default.component
          })
        })

        return (
          <Routes
            path={props.path}
            routes={routes}
          />
        )
      }}
    />
  </ToolPage>

IntegrationTool.propTypes = {
  path: T.string.isRequired
}

export {
  IntegrationTool
}