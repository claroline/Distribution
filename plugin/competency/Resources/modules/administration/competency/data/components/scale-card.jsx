import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/app/config/asset'
import {DataCard} from '#/main/app/content/card/components/data'

import {Scale as ScaleType} from '#/plugin/competency/administration/competency/prop-types'

const ScaleCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    icon="fa fa-arrow-up"
    title={props.data.name}
    subtitle={props.data.levels.map(l => l.value).join(' ,')}
  />

ScaleCard.propTypes = {
  data: T.shape(ScaleType.propTypes).isRequired
}

export {
  ScaleCard
}
