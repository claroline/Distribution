import {LINK_BUTTON} from '#/main/app/buttons'

import {trans} from '#/main/core/translation'

import {LogConnectPlatformCard} from '#/main/core/administration/logs/connection/data/components/log-connect-platform-card'

const ConnectionList = {
  open: (row) => ({
    type: LINK_BUTTON,
    target: `/connections/${row.id}`,
    label: trans('open', {}, 'actions')
  }),
  definition: [
    {
      name: 'date',
      alias: 'connectionDate',
      type: 'date',
      label: trans('date'),
      displayed: true,
      filterable: false,
      primary: true,
      options: {
        time: true
      }
    }, {
      name: 'user.name',
      alias: 'name',
      type: 'string',
      label: trans('user'),
      displayed: true
    }, {
      name: 'duration',
      type: 'string',
      label: trans('duration'),
      displayed: true,
      filterable: false,
      calculated: (rowData) => {
        let result = null
        let duration = rowData.duration

        if (duration !== null) {
          const hours = Math.floor(duration / 3600)
          duration %= 3600
          const minutes = Math.floor(duration / 60)
          const seconds = duration % 60

          result = `${hours}:`
          result += 10 > minutes ? `0${minutes}:` : `${minutes}:`
          result += 10 > seconds ? `0${seconds}` : `${seconds}`
        }

        return result
      },
    }
  ],
  card: LogConnectPlatformCard
}

export {
  ConnectionList
}
