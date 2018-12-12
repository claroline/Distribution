import React from 'react'
import {DataCard} from '#/main/app/content/card/components/data'
import {asset} from '#/main/app/config/asset'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'

const BadgeCard = props =>
  <DataCard
    {...props}
    id={props.data.id}
    poster={props.data.image ? asset(props.data.image.url) : null}
    icon="fa fa-trophy"
    title={props.data.name}
    subtitle={props.data.description}
    contentText={props.data.criteria}
    footer={
      <span>
        {props.data.issuer &&
          <span>Issued by <b>{props.data.issuer.name}</b></span>
        }
      </span>
    }
  />

BadgeCard.propTypes = {
  data: T.shape(
  ).isRequired
}

export {
  BadgeCard
}
