import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {actions as securityActions} from '#/main/app/security/store/actions'

import {FormStepper} from '#/main/core/layout/form/components/form-stepper'


import {Facet} from '#/main/app/security/registration/components/facet'
import {Required} from '#/main/app/security/registration/components/required'
import {Optional} from '#/main/app/security/registration/components/optional'
import {Organization} from '#/main/app/security/registration/components/organization'
import {Workspace} from '#/main/app/security/registration/components/workspace'
import {Registration} from '#/main/app/security/registration/components/registration'

class RegistrationMain extends Component {
  componentDidMount() {
    this.props.fetchRegistrationData()
  }

  render() {
    let steps = []

    if (!this.props.options.allowWorkspace && this.props.defaultWorkspaces) {
      steps.push({
        path: '/registration',
        title: 'Registration',
        component: Registration
      })
    }

    steps = steps.concat([
      {
        path: '/account',
        title: 'Compte utilisateur',
        component: Required
      }, {
        path: '/options',
        title: 'Configuration',
        component: Optional
      }
    ], this.props.facets.map(facet => ({
      path: `/${facet.id}`,
      title: facet.title,
      component: () => {
        const currentFacet = <Facet facet={facet}/>

        return currentFacet
      }
    })))

    if (this.props.options.forceOrganizationCreation) {
      steps.push({
        path: '/organization',
        title: 'Organization',
        component: Organization
      })
    }

    if (this.props.options.allowWorkspace) {
      steps.push({
        path: '/workspace',
        title: 'Workspace',
        component: Workspace
      })
    }

    return (
      <FormStepper
        path={this.props.path}
        location={this.props.location}
        submit={{
          icon: 'fa fa-user-plus',
          label: trans('registration_confirm'),
          action: () => this.props.register(this.props.user, this.props.termOfService, () => {
            this.props.history.push('/login')
          })
        }}
        steps={steps}
        redirect={[
          {from: '/', exact: true, to: !this.props.options.allowWorkspace && this.props.defaultWorkspaces ? '/registration' : '/account'}
        ]}
      />
    )
  }
}

RegistrationMain.propTypes = {
  path: T.string,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  location: T.shape({
    path: T.string
  }),
  user: T.shape({
    // user type
  }).isRequired,
  organization: T.shape({
    // organization type
  }).isRequired,
  facets: T.arrayOf(T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  })),
  termOfService: T.string,
  register: T.func.isRequired,
  fetchRegistrationData: T.func.isRequired,
  options: T.shape({
    forceOrganizationCreation: T.bool,
    allowWorkspace: T.bool
  }).isRequired,
  defaultWorkspaces: T.array,
  onRegister: T.func
}

export {
  RegistrationMain
}
