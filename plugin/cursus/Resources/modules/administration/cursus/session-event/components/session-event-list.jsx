import {trans} from '#/main/app/intl/translation'

import {constants} from '#/plugin/cursus/constants'
import {SessionEventCard} from '#/plugin/cursus/administration/cursus/session-event/data/components/session-event-card'

const SessionEventList = {
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
      name: 'location',
      type: 'location',
      label: trans('location'),
      placeholder: trans('online_session', {}, 'cursus'),
      displayed: true
    }, {
      name: 'restrictions.dates[0]',
      alias: 'startDate',
      type: 'date',
      label: trans('start_date'),
      displayed: true,
      options: {
        time: true
      }
    }, {
      name: 'restrictions.dates[1]',
      alias: 'endDate',
      type: 'date',
      label: trans('end_date'),
      options: {
        time: true
      },
      displayed: true
    }, {
      name: 'restrictions.users',
      alias: 'maxUsers',
      type: 'number',
      label: trans('max_participants', {}, 'cursus'),
      displayed: true
    }, {
      name: 'registration.registrationType',
      alias: 'registrationType',
      type: 'choice',
      label: trans('session_event_registration', {}, 'cursus'),
      displayed: false,
      options: {
        choices: constants.REGISTRATION_TYPES
      }
    }
  ],
  card: SessionEventCard
}

export {
  SessionEventList
}
