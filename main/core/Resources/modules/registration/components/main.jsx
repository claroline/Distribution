import React, {Component} from 'react'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {Facet} from '#/main/core/registration/components/facet.jsx'
import {Required} from '#/main/core/registration/components/required.jsx'
import {Optional} from '#/main/core/registration/components/optional.jsx'

import {select} from '#/main/core/registration/selectors'
import {connect} from 'react-redux'
import {actions} from '#/main/core/registration/actions'
import {validate, isValid} from '#/main/core/registration/validator'

class UserRegistration extends Component
{
  constructor(props) {
    super(props)
    this.onCreated = this.onCreated.bind(this)
  }

  onCreate() {
    this.props.onCreate(
      this.props.user,
      this.onCreated
    )
  }

  onCreated() {
    if (this.props.options.redirectAfterLoginUrl) {
      window.location = this.props.options.redirectAfterLoginUrl
    }

    switch(this.props.options.redirectAfterLoginOption) {
      case 'DESKTOP': window.location = generateUrl('claro_desktop_open')
    }
  }

  render() {
    return(<div>
      <Required
        user={this.props.user}
        errors={this.props.user.errors}
      />
      {/*
        <Optional user={props.user}/>
        <Facet user={props.user}/>
      */}
      <div className="user-submit-section">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (isValid(this.props.user)) {
              this.onCreate()
            }
          }}
        >
          {t('validate')}
        </button>
        <button className="btn btn-secondary">{t('cancel')}</button>
      </div>
    </div>
  )}
}


Required.propTypes = {
  /*user: T.shape({
  }).isRequired*/
}


Required.defaultProps = {user: {}}

function mapStateToProps(state)
{
  return {
    user: select.user(state),
    options: select.options(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onCreate(user, onCreated) {
      dispatch(actions.createUser(user, onCreated))
    }
  }
}

const ConnectedUserRegistration = connect(mapStateToProps, mapDispatchToProps)(UserRegistration)

export {
  ConnectedUserRegistration as UserRegistration
}
