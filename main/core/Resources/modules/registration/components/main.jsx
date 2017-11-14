import React, {Component} from 'react'

import {t} from '#/main/core/translation'

import {Facet} from '#/main/core/registration/components/facet.jsx'
import {Required} from '#/main/core/registration/components/required.jsx'
import {Optional} from '#/main/core/registration/components/optional.jsx'

import {select} from '#/main/core/registration/selectors'
import {connect} from 'react-redux'
import {actions} from '#/main/core/registration/actions'
import {validate} from '#/main/core/registration/validator'

class UserRegistration extends Component
{
  constructor(props) {
    super(props)

    this.state = {
      errors: {}
    }

    this.save = this.tryValidate.bind(this)
    //this.props.onCreate = this.props.onCreate.bind(this)
  }

  render() {
    return(<div>
      <Required user={this.props.user} errors={this.state.errors} />
      {/*
        <Optional user={props.user}/>
        <Facet user={props.user}/>
      */}
      <div className="user-submit-section">
        <button
          className="btn btn-primary"
          onClick={() => {
            this.tryValidate()
            props.onCreate(this.props.user)
          }}
        >
          {t('validate')}
        </button>
        <button className="btn btn-secondary">{t('cancel')}</button>
      </div>
    </div>
  )}

  tryValidate() {
    const errors = validate(this.props.user)

    this.setState({
      errors: validate(this.props.user)
    })
  }
}


Required.propTypes = {
  /*user: T.shape({
  }).isRequired*/
}


Required.defaultProps = {user: {}}

function mapStateToProps(state)
{
  return {
    user: select.user(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onCreate(user) {
      dispatch(actions.createUser(user))
    }
  }
}

const ConnectedUserRegistration = connect(mapStateToProps, mapDispatchToProps)(UserRegistration)

export {
  ConnectedUserRegistration as UserRegistration
}
