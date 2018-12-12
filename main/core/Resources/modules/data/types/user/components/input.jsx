import React from 'react'

import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {Button} from '#/main/app/action/components/button'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'
import {User as UserType} from '#/main/core/user/prop-types'
import {UserCard} from '#/main/core/user/data/components/user-card'

//todo: implement badge picker
const UserButton = () =>
  <Button
    className="btn"
    style={{marginTop: 10}}
    type={MODAL_BUTTON}
    icon="fa fa-fw fa-trophy"
    label={trans('select_a_badge')}
    primary={true}
  />

UserButton.propTypes = {
  title: T.string,
  onChange: T.func.isRequired
}

const UserInput = props => {
  const actions = props.disabled ? []: [
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
      <div>
        <UserCard
          data={props.value}
          size="sm"
          orientation="col"
          actions={actions}
        />

        {!props.disabled &&
          <UserButton
            {...props.picker}
            onChange={props.onChange}
          />
        }
      </div>
    )
  } else {
    return (
      <EmptyPlaceholder
        size="lg"
        icon="fa fa-book"
        title={trans('no_badge')}
      >
        {!props.disabled &&
          <UserButton
            {...props.picker}
            onChange={props.onChange}
          />
        }
      </EmptyPlaceholder>
    )
  }
}

implementPropTypes(UserInput, FormFieldTypes, {
  value: T.shape(UserType.propTypes),
  picker: T.shape({
    title: T.string
  })
}, {
  value: null,
  picker: {
    title: trans('badge_selector')
  }
})

export {
  UserInput
}
