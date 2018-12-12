import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

const EvidenceList = {
  open: (row) => ({
    type: LINK_BUTTON,
    target: `/badges/evidence/${row.id}`,
    label: trans('', {}, 'actions')
  }),
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true
    }
  ]
}

export {
  EvidenceList
}
