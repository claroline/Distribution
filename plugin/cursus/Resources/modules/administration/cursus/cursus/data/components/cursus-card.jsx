import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/core/scaffolding/asset'
import {DataCard} from '#/main/core/data/components/data-card'

import {Cursus as CursusType} from '#/plugin/cursus/administration/cursus/prop-types'

const CursusCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    icon="fa fa-database"
    title={props.data.title}
    subtitle={props.data.code}
    poster={props.data.meta.icon ? asset(props.data.meta.icon) : null}
    contentText={props.data.description}
  />

CursusCard.propTypes = {
  data: T.shape(CursusType.propTypes).isRequired
}

export {
  CursusCard
}
