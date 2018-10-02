import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {ConnectionList} from '#/main/core/administration/logs/connection/components/connection-list'

const Connections = props =>
  <ListData
    name="connections.list"
    fetch={{
      url: ['apiv2_log_connect_platform_list'],
      autoload: true
    }}
    primaryAction={ConnectionList.open}
    definition={ConnectionList.definition}
    card={ConnectionList.card}
  />

export {
  Connections
}
