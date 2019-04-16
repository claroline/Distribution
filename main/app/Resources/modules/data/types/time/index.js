import moment from 'moment'

import {trans} from '#/main/app/intl/translation'
import {chain, number, inRange} from '#/main/core/validation'

import {TimeInput} from '#/main/app/data/types/time/components/input'

const dataType = {
  name: 'time',
  meta: {
    icon: 'fa fa-fw fa-clock',
    label: trans('time', {}, 'data'),
    description: trans('time_desc', {}, 'data')
  },

  render: (value) => {
    if (value) {
      const time = moment.duration({seconds: value})

      let timeString = ''
      if ( 0 !== time.years()) {
        timeString += time.years() + trans('years_short')
      }
      if (0 !== time.months()) {
        timeString += time.months() + trans('months_short')
      }
      if (0 !== time.days()) {
        timeString += time.days() + trans('days_short')
      }
      if (0 !== time.hours()) {
        timeString += time.hours() + trans('hours_short')
      }
      if (0 !== time.minutes()) {
        timeString += time.minutes() + trans('minutes_short')
      }
      if (0 !== time.seconds()) {
        timeString += time.seconds() + trans('seconds_short')
      }

      return timeString
    }

    return '-'
  },
  validate: (value, options) => chain(value, options, [number, inRange]),
  components: {
    input: TimeInput
  }
}

export {
  dataType
}
