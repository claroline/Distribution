import {trans} from '#/main/app/intl/translation'

// import {constants} from '#/plugin/cursus/administration/cursus/constants'
import {SessionCard} from '#/plugin/cursus/administration/cursus/session/data/components/session-card'

const SessionList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true
    }, {
      name: 'code',
      type: 'string',
      label: trans('code'),
      displayed: false
    }, {
      name: 'course',
      alias: 'courseTitle',
      type: 'string',
      label: trans('course', {}, 'cursus'),
      displayed: true,
      calculated: (session) => session.meta.course.title
    // }, {
    //   name: 'meta.sessionStatus',
    //   alias: 'sessionStatus',
    //   type: 'choice',
    //   label: trans('status'),
    //   displayed: true,
    //   options: {
    //     choices: constants.SESSION_STATUS
    //   }
    }, {
      name: 'restrictions.dates[0]',
      alias: 'startDate',
      type: 'date',
      label: trans('start_date'),
      displayed: true
    }, {
      name: 'restrictions.dates[1]',
      alias: 'endDate',
      type: 'date',
      label: trans('end_date'),
      displayed: true
    }, {
      name: 'restrictions.maxUsers',
      alias: 'maxUsers',
      type: 'number',
      label: trans('maxUsers'),
      displayed: true
    }, {
      name: 'registration.publicRegistration',
      alias: 'publicRegistration',
      type: 'boolean',
      label: trans('public_registration'),
      displayed: false
    }, {
      name: 'registration.publicUnregistration',
      alias: 'publicUnregistration',
      type: 'boolean',
      label: trans('public_unregistration'),
      displayed: false
    }, {
      name: 'registration.registrationValidation',
      alias: 'registrationValidation',
      type: 'boolean',
      label: trans('registration_validation', {}, 'cursus'),
      displayed: false
    }, {
      name: 'registration.userValidation',
      alias: 'userValidation',
      type: 'boolean',
      label: trans('user_validation', {}, 'cursus'),
      displayed: false
    }, {
      name: 'registration.organizationValidation',
      alias: 'organizationValidation',
      type: 'boolean',
      label: trans('organization_validation', {}, 'cursus'),
      displayed: false
    }
  ],
  card: SessionCard
}

export {
  SessionList
}
