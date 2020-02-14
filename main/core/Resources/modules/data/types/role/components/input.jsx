import React, {Fragment} from 'react'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'
import {RoleCard} from '#/main/core/user/data/components/role-card'
import {Role as RoleType} from '#/main/core/user/prop-types'
import {MODAL_ROLES} from '#/main/core/modals/roles'

const RoleButton = props =>
  <Button
    className="btn btn-block"
    style={{marginTop: 10}}
    type={MODAL_BUTTON}
    icon="fa fa-fw fa-plus"
    label={trans('add_role')}
    modal={[MODAL_ROLES, {
      url: props.url,
      title: props.title,
      filters: props.filters,
      selectAction: (selected) => ({
        type: CALLBACK_BUTTON,
        label: trans('select', {}, 'actions'),
        callback: () => props.onChange(selected[0])
      })
    }]}
    size={props.size}
    disabled={props.disabled}
  />

RoleButton.propTypes = {
  url: T.oneOfType([T.string, T.array]),
  title: T.string,
  filters: T.arrayOf(T.shape({
    // TODO : list filter types
  })),
  onChange: T.func.isRequired,
  size: T.string,
  disabled: T.bool
}

const RoleInput = props => {
  const actions = props.disabled ? [] : [
    {
      name: 'delete',
      type: CALLBACK_BUTTON,
      icon: 'fa fa-fw fa-trash-o',
      label: trans('delete', {}, 'actions'),
      dangerous: true,
      callback: () => props.onChange(null)
    }
  ]

  if (props.value) {
    return(
      <Fragment>
        <RoleCard
          data={props.value}
          size="xs"
          actions={actions}
        />

        {!props.disabled &&
          <RoleButton
            {...props.picker}
            size={props.size}
            onChange={props.onChange}
          />
        }
      </Fragment>
    )
  }

  return (
    <EmptyPlaceholder
      id={props.id}
      icon="fa fa-id-card"
      title={trans('no_role')}
      size={props.size}
    >
      <RoleButton
        {...props.picker}
        size={props.size}
        disabled={props.disabled}
        onChange={props.onChange}
      />
    </EmptyPlaceholder>
  )
}

implementPropTypes(RoleInput, FormFieldTypes, {
  value: T.arrayOf(T.shape(RoleType.propTypes)),
  picker: T.shape({
    url: T.oneOfType([T.string, T.array]),
    title: T.string,
    filters: T.arrayOf(T.shape({
      // TODO : list filter types
    }))
  })
}, {
  value: null
})

export {
  RoleInput
}
