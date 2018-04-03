
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
      name: 'status',
      type: 'string',
      label: trans('status'),
      displayed: true
    }
  ]
}

export {
  HistoryList
}
