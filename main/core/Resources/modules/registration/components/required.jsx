import React, {Component} from 'react'

import {t} from '#/main/core/translation'
import {TextGroup} from '#/main/core/layout/form/components/group/text-group.jsx'
import {actions} from '#/main/core/registration/actions'
import {select} from '#/main/core/registration/selectors'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {validate, validateProperty} from '#/main/core/registration/validator'

class Required extends Component
{
  constructor(props) {
    super(props)
  }

  onChange(property, value) {
    //test the property here
    validateProperty(this.props.errors, property, value)
    console.log(this.props.errors)
    this.props.onChange(property, value)
  }

  render() {
    return(<div>
      <TextGroup
        id={`register-firstname`}
        label={t('first_name')}
        value={this.props.user.firstName}
        onChange={text => this.onChange('firstName', text)}
        error={this.props.errors.firstName}
      />
      <TextGroup
        id={`register-lastname`}
        label={t('last_name')}
        value={this.props.user.lastName}
        onChange={text => this.onChange('lastName', text)}
        error={this.props.errors.lastName}
      />
      <TextGroup
        id={`register-username`}
        label={t('username')}
        value={this.props.user.username}
        onChange={text => this.onChange('username', text)}
        error={this.props.errors.username}
      />
      <TextGroup
        id={`register-password`}
        label={t('password')}
        value={this.props.user.plainPassword}
        onChange={text => this.onChange('plainPassword', text)}
        error={this.props.errors.plainPassword}
      />
      <TextGroup
        id={`register-email`}
        label={t('email')}
        value={this.props.user.email}
        onChange={text => this.onChange('email', text)}
        error={this.props.errors.email}
      />
    </div>)
  }
}

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
