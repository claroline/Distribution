import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import cloneDeep from 'lodash/cloneDeep'

import {PageContainer, PageHeader} from '#/main/core/layout/page/index'
import {FormStepper} from '#/main/core/layout/form/components/form-stepper.jsx'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'

import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {formatFormSections} from '#/main/core/user/profile/utils'

import {Facet} from '#/main/core/user/registration/components/facet.jsx'
import {Required} from '#/main/core/user/registration/components/required.jsx'
import {Optional} from '#/main/core/user/registration/components/optional.jsx'
import {Organization} from '#/main/core/user/registration/components/organization.jsx'
import {Workspace} from '#/main/core/user/registration/components/workspace.jsx'
import {Registration} from '#/main/core/user/registration/components/registration.jsx'

import {select} from '#/main/core/user/registration/selectors'

const RegistrationForm = props => {
  let steps = []

  if (!props.options.allowWorkspace && props.defaultWorkspaces) {
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
  ], props.facets.map(facet => ({
    path: `/${facet.id}`,
    title: facet.title,
    component: () => {
      const currentFacet = <Facet facet={facet}/>

      return currentFacet
    }
  })))

  if (props.options.forceOrganizationCreation) {
    steps.push({
      path: '/organization',
      title: 'Organization',
      component: Organization
    })
  }

  if (props.options.allowWorkspace) {
    steps.push({
      path: '/workspace',
      title: 'Workspace',
      component: Workspace
    })
  }

  return (
    <PageContainer id="user-registration">
      <PageHeader
        key="header"
        title={t('user_registration')}
      />
      <FormStepper
        key="form"
        className="page-content"
        submit={{
          icon: 'fa fa-user-plus',
          label: t('registration_confirm'),
          action: () => props.register(props.user, props.termOfService)
        }}
        steps={steps}
        redirect={[
          {from: '/', exact: true, to: '/account'}
        ]}
      />
    </PageContainer>
  )
}

RegistrationForm.propTypes = {
  user: T.shape({
    // user type
  }).isRequired,
  profile: T.shape({
    // list of facets
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
  options: T.shape({
    forceOrganizationCreation: T.bool,
    allowWorkspace: T.bool
  }).isRequired,
  defaultWorkspaces: T.array
}

const UserRegistration = connect(
  (state) => ({
    user: formSelect.data(formSelect.form(state, 'user')),
    facets: select.facets(state),
    termOfService: select.termOfService(state),
    options: select.options(state),
    workspaces: select.workspaces(state),
    defaultWorkspaces: select.defaultWorkspaces(state)
  }),
  (dispatch) => ({
    register(user, profile, termOfService) {
      if (termOfService) {
        dispatch(modalActions.showModal(MODAL_CONFIRM, {
          icon: 'fa fa-fw fa-copyright',
          title: t('term_of_service'),
          question: termOfService,
          isHtml: true,
          confirmButtonText: t('accept_term_of_service'),
          handleConfirm: () => {
            // todo : set acceptedTerms flag
            dispatch(formActions.saveForm('user', ['apiv2_user_create_and_login']))
          }
        }))
      } else {
        // create new account
        dispatch(formActions.saveForm('user', ['apiv2_user_create_and_login']))
      }
    }
  })
)(RegistrationForm)

export {
  UserRegistration
}
