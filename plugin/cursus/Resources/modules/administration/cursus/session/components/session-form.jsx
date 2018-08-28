import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {FormData} from '#/main/app/content/form/containers/data'
import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections'

import {constants} from '#/plugin/cursus/administration/cursus/constants'
import {Session as SessionType} from '#/plugin/cursus/administration/cursus/prop-types'
import {actions} from '#/plugin/cursus/administration/cursus/session/store'

const SessionFormComponent = (props) => props.session && props.session.meta && props.session.meta.course ?
  <FormData
    level={3}
    name="sessions.current"
    buttons={true}
    target={(session, isNew) => isNew ?
      ['apiv2_cursus_session_create'] :
      ['apiv2_cursus_session_update', {id: session.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: '/sessions',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'description',
            type: 'html',
            label: trans('description')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-cogs',
        title: trans('parameters'),
        fields: [
          {
            name: 'meta.defaultSession',
            type: 'boolean',
            label: trans('default_session', {}, 'cursus'),
            required: true
          }, {
            name: 'meta.order',
            type: 'number',
            label: trans('order'),
            required: true,
            options: {
              min: 0
            }
          }, {
            name: 'meta.color',
            type: 'color',
            label: trans('color')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-sign-in',
        title: trans('registration'),
        fields: [
          {
            name: 'registration.publicRegistration',
            type: 'boolean',
            label: trans('public_registration'),
            required: true
          }, {
            name: 'registration.publicUnregistration',
            type: 'boolean',
            label: trans('public_unregistration'),
            required: true
          }, {
            name: 'registration.registrationValidation',
            type: 'boolean',
            label: trans('registration_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.userValidation',
            type: 'boolean',
            label: trans('user_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.organizationValidation',
            type: 'boolean',
            label: trans('organization_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.eventRegistrationType',
            type: 'choice',
            label: trans('session_event_registration', {}, 'cursus'),
            required: true,
            options: {
              multiple: false,
              choices: constants.REGISTRATION_TYPES
            }
          }
        ]
      }, {
        icon: 'fa fa-fw fa-key',
        title: trans('restrictions'),
        fields: [
          {
            name: 'restrictions.maxUsers',
            type: 'number',
            label: trans('maxUsers'),
            options: {
              min: 0
            }
          }, {
            name: 'restrictions.dates',
            type: 'date-range',
            label: trans('access_dates'),
            options: {
              time: true
            }
          }
        ]
      }
    ]}
  >
    {/*<FormSections level={3}>*/}
      {/*<FormSection*/}
        {/*className="embedded-list-section"*/}
        {/*icon="fa fa-fw fa-building"*/}
        {/*title={trans('organizations')}*/}
        {/*disabled={props.new}*/}
        {/*actions={[*/}
          {/*{*/}
            {/*type: CALLBACK_BUTTON,*/}
            {/*icon: 'fa fa-fw fa-plus',*/}
            {/*label: trans('add_organizations'),*/}
            {/*callback: () => props.pickOrganizations(props.course.id)*/}
          {/*}*/}
        {/*]}*/}
      {/*>*/}
        {/*<ListData*/}
          {/*name="courses.current.organizations.list"*/}
          {/*fetch={{*/}
            {/*url: ['apiv2_cursus_course_list_organizations', {id: props.course.id}],*/}
            {/*autoload: props.course.id && !props.new*/}
          {/*}}*/}
          {/*primaryAction={OrganizationList.open}*/}
          {/*delete={{*/}
            {/*url: ['apiv2_cursus_course_remove_organizations', {id: props.course.id}]*/}
          {/*}}*/}
          {/*definition={OrganizationList.definition}*/}
          {/*card={OrganizationList.card}*/}
        {/*/>*/}
      {/*</FormSection>*/}
    {/*</FormSections>*/}
  </FormData> :
  <div className="alert alert-danger">
    {trans('session_creation_impossible_no_course', {}, 'cursus')}
  </div>

SessionFormComponent.propTypes = {
  new: T.bool.isRequired,
  session: T.shape(SessionType.propTypes).isRequired
}

const SessionForm = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'sessions.current')),
    session: formSelect.data(formSelect.form(state, 'sessions.current'))
  })
)(SessionFormComponent)

export {
  SessionForm
}
