import {trans} from '#/main/core/translation'

const LogList = {
  open: {
    action: (row) => `#/overview/details/${row.id}`
  },
  definition: [
    {
      name: 'date',
      type: 'date',
      label: trans('date'),
      displayed: true,
      primary: true
    }, {
      name: 'action',
      type: 'string',
      label: trans('action'),
      displayed: true
    }, {
      name: 'user',
      type: 'string',
      label: trans('user'),
      displayed: true
    }, {
      name: 'description',
      type: 'string',
      label: trans('description'),
      displayed: true
    }
  ]
}

export {
  LogList
}
