import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/core/scaffolding/asset'
import {DataCard} from '#/main/core/data/components/data-card'

// import {LogConnectPlatform as LogConnectPlatformType} from '#/main/core/administration/logs/connection/prop-types'

const LogConnectPlatformCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.user.thumbnail ? asset(props.data.user.thumbnail) : null}
    icon={<UserAvatar picture={props.data.user.picture} alt={true} />}
    title={props.data.user.username}
    subtitle={props.data.user.firstName + ' ' + props.data.user.lastName}
    contentText={props.data.user.meta.description}
    footer={
      <span>
        {props.data.duration}
      </span>
    }
  />

LogConnectPlatformCard.propTypes = {
  // data: T.shape(LogConnectPlatformType.propTypes).isRequired
}

export {
  LogConnectPlatformCard
}
