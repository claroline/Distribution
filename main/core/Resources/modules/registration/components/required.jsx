import React from 'react'

import {t} from '#/main/core/translation'
import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'
import {actions} from '#/main/core/registration/actions'
import {select} from '#/main/core/registration/selectors'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

const Required = (props) =>
  <div>
    <TextGroup
      id={`register-firstname`}
      label={t('first_name')}
      value={props.user.firstName}
      onChange={text => props.onChange('firstName', text)}
    />
    <TextGroup
      id={`register-lastname`}
      label={t('last_name')}
      value={props.user.lastName}
      onChange={text => props.onChange('lastName', text)}
    />
    <TextGroup
      id={`register-username`}
      label={t('username')}
      value={props.user.username}
      onChange={text => props.onChange('username', text)}
    />
    <TextGroup
      id={`register-password`}
      label={t('password')}
      value={props.user.plainPassword}
      onChange={text => props.onChange('plainPassword', text)}
    />
    <TextGroup
      id={`register-email`}
      label={t('email')}
      value={props.user.email}
      onChange={text => props.onChange('email', text)}
    />
  </div>

Required.propTypes = {
  /*user: T.shape({
  }).isRequired*/
}

Required.defaultProps = {
    user: {

    }
}

function mapDispatchToProps(dispatch) {
  return {
    onChange(property, value) {
      dispatch(actions.updateUser(property, value))
    }
  }
}

const ConnectedRequired = connect(null, mapDispatchToProps)(Required)

export {
  ConnectedRequired as Required
}
