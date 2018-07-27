import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'

import {trans} from '#/main/core/translation'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group'
import {getType} from '#/main/app/content/data'

// todo there are big c/c from Form component but I don't know if we can do better

const DataDetailsField = props => {
  const typeDef = getType(props.type)

  return (
    <div id={props.name} className={props.className}>
      {(!props.value && false !== props.value) &&
        <span className="data-details-empty">{trans('empty_value')}</span>
      }

      {(props.value || false === props.value)  && (typeDef.components.details ?
          React.createElement(typeDef.components.details, merge({}, props.options, {
            id: props.name,
            label: props.label,
            hideLabel: props.hideLabel,
            data: props.value // todo rename into `value` in implementations later
          }))
          :
          typeDef.render ? typeDef.render(props.value, props.options || {}) : props.value
      )}
    </div>
  )
}

DataDetailsField.propTypes = {
  value: T.any,
  name: T.string.isRequired,
  type: T.string,
  label: T.string.isRequired,
  hideLabel: T.bool,
  options: T.object,
  className: T.string
}

const DetailsProp = props => {
  const typeDef = getType(props.type)

  return (
    <FormGroup
      id={props.name}
      label={typeDef.meta && typeDef.meta.noLabel ? props.label : undefined}
      hideLabel={props.hideLabel}
      help={props.help}
    >
      {props.render ?
        props.render(props.data) :
        <DataDetailsField
          {...props}
          value={props.calculated ? props.calculated(props.data) : get(props.data, props.name)}
        />
      }
    </FormGroup>
  )
}

export {
  DetailsProp
}