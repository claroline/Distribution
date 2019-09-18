import React from 'react'

import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON} from '#/main/app/buttons'
import {DataCell as DataCellTypes} from '#/main/app/data/types/prop-types'

import {route as resourceRoute} from '#/main/core/resource/routing'

const ResourceCell = props => {
  if (props.data) {
    return (
      <Button
        type={LINK_BUTTON}
        label={props.data.name}
        target={resourceRoute(props.data)}
      />
    )
  }

  return (
    <span className="text-muted">-</span>
  )
}

ResourceCell.propTypes = DataCellTypes.propTypes

export {
  ResourceCell
}
