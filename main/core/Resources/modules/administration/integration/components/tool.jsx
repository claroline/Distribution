import React, {Component} from 'react'

import {Await} from '#/main/app/components/await'
import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {Vertical} from '#/main/app/content/tabs/components/vertical'
import {ToolPage} from '#/main/core/tool/containers/page'
import {getApps} from '#/main/app/plugins'

function getIntegrationApps() {
  const apps = getApps('integration', false)

  return Promise.all(Object.keys(apps).map(type => apps[type]()))
}

class Tool extends Component
{
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <ToolPage>
        <Await
          for={getIntegrationApps()}
          then={(apps) => {

            const tabs = []
            const routes = []

            apps.map(app => {
              tabs.push({
                icon: app.default.icon,
                title: trans(app.default.name),
                path: '/'+app.default.name,
                exact: true
              })

              routes.push({
                path: '/'+app.default.name,
                exact: true,
                component: app.default.component
              })
            })

            return (
              <div className="row">
                <div className="col-md-3">
                  <Vertical
                    style={{
                      marginTop: '20px' // FIXME
                    }}
                    tabs={tabs}
                  />
                </div>

                <div className="col-md-9">
                  <Routes
                    routes={routes}
                  />
                </div>
              </div>
            )}}
        />
      </ToolPage>
    )
  }
}

export {
  Tool as IntegrationTool
}
