
import {trans} from '#/main/core/translation'

const HistoryList = {
  open: {
    action: () => '#'
  },
  definition: [
    {
      name: 'id',
      type: 'string',
      label: trans('id'),
      displayed: true,
      primary: true
    },
    {
      name: 'log',
      type: 'string',
      label: trans('log')
    },
    {
      name: 'status',
      type: 'string',
      label: trans('status'),
      displayed: true
    },
    {
      name: 'executionDate',
      type: 'date',
      label: trans('executionDate'),
      displayed: true
    },
    {
      name: 'uploadDate',
      type: 'date',
      label: trans('uploadDate'),
      displayed: true
    }
  ]
}

export {
  HistoryList
}
