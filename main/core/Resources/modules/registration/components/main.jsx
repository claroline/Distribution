import React from 'react'

import {t} from '#/main/core/translation'

import {Facet} from '#/main/core/registration/components/facet.jsx'
import {Required} from '#/main/core/registration/components/required.jsx'
import {Optional} from '#/main/core/registration/components/optional.jsx'

import {select} from '#/main/core/registration/selectors'
import {connect} from 'react-redux'
import {actions} from '#/main/core/registration/actions'

const UserRegistration = props =>
  <div>
    <Required user={props.user}/>
    {/*
      <Optional user={props.user}/>
      <Facet user={props.user}/>
    */}
    <div className="user-submit-section">
      <button
        className="btn btn-primary"
        onClick={() => {
          props.onCreate(props.user)
        }}
      >
        {t('validate')}
      </button>
      <button className="btn btn-secondary">{t('cancel')}</button>
    </div>
  </div>

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
