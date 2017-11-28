import React, {Component} from 'react'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {generateUrl} from '#/main/core/fos-js-router'

import {PageContainer, PageHeader, PageContent} from '#/main/core/layout/page/index'
import {FormStepper} from '#/main/core/layout/form/components/form-stepper.jsx'

import {Facet} from '#/main/core/registration/components/facet.jsx'
import {Required} from '#/main/core/registration/components/required.jsx'
import {Optional} from '#/main/core/registration/components/optional.jsx'

import {select} from '#/main/core/registration/selectors'
import {actions} from '#/main/core/registration/actions'
import {validate, isValid} from '#/main/core/registration/validator'

class RegistrationForm extends Component {
  constructor(props) {
    super(props)

    this.onCreated = this.onCreated.bind(this)
  }

  onCreate() {
    this.props.onCreate(this.props.user, this.onCreated)
  }

  onCreated() {
    if (this.props.options.redirectAfterLoginUrl) {
      window.location = this.props.options.redirectAfterLoginUrl
    }

    switch (this.props.options.redirectAfterLoginOption) {
      case 'DESKTOP': window.location = generateUrl('claro_desktop_open')
    }
  }

  render() {
    return (
      <PageContainer id="user-registration">
        <PageHeader
          title={t('user_registration')}
        />

        <PageContent>
          <FormStepper
            submit={{
              action: this.onCreate
            }}
            steps={[
              {
                path: '/account',
                title: 'Compte utilisateur',
                component: Required
              }, {
                path: '/options',
                title: 'Configuration',
                component: Optional
              }, {
                path: '/facet',
                title: 'Facet title',
                component: Facet
              }
            ]}
            redirect={[
              {from: '/', exact: true, to: '/account'}
            ]}
          />
        </PageContent>
      </PageContainer>
    )
  }
}

const UserRegistration = connect(
  (state) => ({
    user: select.user(state),
    options: select.options(state)
  }),
  (dispatch) => ({
    onCreate(user, onCreated) {
      dispatch(actions.createUser(user, onCreated))
    }
  })
)(RegistrationForm)

export {
  UserRegistration
}
